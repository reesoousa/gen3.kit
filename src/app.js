"use strict";
const navItems = Array.from(document.querySelectorAll('.nav-item'));
const views = Array.from(document.querySelectorAll('.view'));
const gameSelect = document.querySelector('#game-select');
const dexSearchInput = document.querySelector('#dex-search');
const dexTypeSelect = document.querySelector('#dex-type-filter');
const dexGrid = document.querySelector('#dex-grid');
const dexStatus = document.querySelector('#dex-status');
const evolutionForm = document.querySelector('#evolution-form');
const evolutionSearchInput = document.querySelector('#evolution-search');
const evolutionSuggestions = document.querySelector('#evolution-suggestions');
const evolutionStatus = document.querySelector('#evolution-status');
const evolutionChainContainer = document.querySelector('#evolution-chain');
const appShell = document.querySelector('.app-shell');
const topHeader = document.querySelector('.top-header');
const bottomNavWrap = document.querySelector('.bottom-nav-wrap');
const detailsView = document.querySelector('#view-details');
const detailsBackButton = document.querySelector('#details-back-button');
const detailsHero = document.querySelector('#details-hero');
const detailsFlavorText = document.querySelector('#details-flavor-text');
const detailsStats = document.querySelector('#details-stats');
const detailsStrategy = document.querySelector('#details-strategy');
const detailsEncounters = document.querySelector('#details-encounters');
const detailsMoves = document.querySelector('#details-moves');
const themeMap = {
    emerald: '#50C878',
    firered: '#FF4422',
    leafgreen: '#90EE90',
    ruby: '#E0115F',
    sapphire: '#0F52BA',
};
const dexConfigByGame = {
    emerald: { pokedexId: 4, spriteFolder: 'emerald' },
    ruby: { pokedexId: 4, spriteFolder: 'emerald' },
    sapphire: { pokedexId: 4, spriteFolder: 'emerald' },
    firered: { pokedexId: 2, spriteFolder: 'firered-leafgreen' },
    leafgreen: { pokedexId: 2, spriteFolder: 'firered-leafgreen' },
};
const gen3FlavorVersions = new Set(['emerald', 'ruby', 'sapphire', 'firered', 'leafgreen']);
const statLabelMap = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Speed',
};
const typeLabelMap = {
    normal: 'Normal',
    fire: 'Fire',
    water: 'Water',
    grass: 'Grass',
    electric: 'Electric',
    ice: 'Ice',
    fighting: 'Fighting',
    poison: 'Poison',
    ground: 'Ground',
    flying: 'Flying',
    psychic: 'Psychic',
    bug: 'Bug',
    rock: 'Rock',
    ghost: 'Ghost',
    dragon: 'Dragon',
    dark: 'Dark',
    steel: 'Steel',
};
let dexEntries = [];
let dexLoadedGame = null;
const dexCache = new Map();
let activeDexRequestId = 0;
let previousViewTarget = 'tipos';
let currentDetailNationalId = null;
let currentDetailPokemonName = '';
function triggerHapticFeedback(duration = 50) {
    try {
        if ('vibrate' in window.navigator) {
            window.navigator.vibrate(duration);
        }
    }
    catch (error) {
        console.debug('Feedback tátil indisponível neste dispositivo.', error);
    }
}
function renderDexSkeleton(cardCount = 12) {
    if (!dexGrid)
        return;
    dexGrid.innerHTML = Array.from({ length: cardCount }, () => `
    <article class="pokemon-card glass-panel" aria-hidden="true">
      <p class="dex-number skeleton skeleton-text"></p>
      <div class="sprite-slot skeleton skeleton-img"></div>
      <p class="dex-name skeleton skeleton-text"></p>
      <div class="type-chip-list">
        <span class="type-chip skeleton skeleton-text"></span>
        <span class="type-chip skeleton skeleton-text"></span>
      </div>
    </article>
  `).join('');
}
function renderEvolutionSkeleton(cardCount = 3) {
    if (!evolutionChainContainer)
        return;
    evolutionChainContainer.innerHTML = Array.from({ length: cardCount }, () => `
    <article class="evolution-path" aria-hidden="true">
      <div class="evolution-card">
        <div class="sprite-slot skeleton skeleton-img"></div>
        <p class="skeleton skeleton-text"></p>
      </div>
      <p class="evolution-method skeleton skeleton-text"></p>
      <div class="evolution-card">
        <div class="sprite-slot skeleton skeleton-img"></div>
        <p class="skeleton skeleton-text"></p>
      </div>
    </article>
  `).join('');
}
function renderErrorState(container, message, action) {
    if (!container)
        return;
    container.innerHTML = `
    <article class="error-state glass-panel">
      <p>${message}</p>
      <button class="retry-action" type="button" data-retry-action="${action}">Tentar novamente</button>
    </article>
  `;
}
function activateView(target) {
    navItems.forEach((item) => {
        const isActive = item.dataset.target === target;
        item.classList.toggle('active', isActive);
        if (isActive) {
            item.setAttribute('aria-current', 'page');
            return;
        }
        item.removeAttribute('aria-current');
    });
    views.forEach((view) => {
        const isActive = view.dataset.view === target;
        view.classList.toggle('active', isActive);
        view.hidden = !isActive;
    });
}
function applyThemeByGame(game) {
    const selectedTheme = themeMap[game] ?? themeMap.emerald;
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--theme-color', selectedTheme);
    rootStyle.setProperty('--color-accent', selectedTheme);
    rootStyle.setProperty('--theme-border', `color-mix(in srgb, ${selectedTheme} 36%, rgba(255, 255, 255, 0.2))`);
    rootStyle.setProperty('--color-accent-soft', `color-mix(in srgb, ${selectedTheme} 24%, transparent)`);
    rootStyle.setProperty('--bg-blob-color-1', `color-mix(in srgb, ${selectedTheme} 38%, transparent)`);
    rootStyle.setProperty('--bg-blob-color-2', `color-mix(in srgb, ${selectedTheme} 26%, transparent)`);
    rootStyle.setProperty('--bg-blob-color-3', `color-mix(in srgb, ${selectedTheme} 18%, transparent)`);
}
function formatPokemonName(name) {
    return name
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}
function formatResourceName(name) {
    return name
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}
function formatEvolutionItemName(itemName) {
    return formatResourceName(itemName);
}
function getCurrentGame() {
    const selected = gameSelect?.value;
    if (selected && dexConfigByGame[selected])
        return selected;
    return 'emerald';
}
function getSpriteUrl(game, nationalId) {
    const folder = dexConfigByGame[game].spriteFolder;
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/${folder}/${nationalId}.png`;
}
function getNationalIdFromUrl(url) {
    const urlParts = url.split('/').filter(Boolean);
    return Number(urlParts[urlParts.length - 1]);
}
function setDexStatus(message) {
    if (dexStatus) {
        dexStatus.textContent = message;
    }
}
function setEvolutionStatus(message) {
    if (evolutionStatus) {
        evolutionStatus.textContent = message;
    }
}
async function fetchPokemonDetail(nationalId) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nationalId}`);
    if (!response.ok) {
        throw new Error(`Falha ao carregar dados do Pokémon #${nationalId}.`);
    }
    const data = await response.json();
    return {
        regionalNumber: 0,
        nationalId,
        name: data.name,
        types: data.types
            .sort((a, b) => a.slot - b.slot)
            .map((item) => ({ name: item.type.name })),
    };
}
async function loadDexForGame(game) {
    const requestId = ++activeDexRequestId;
    const { pokedexId } = dexConfigByGame[game];
    setDexStatus('Sincronizando dados da Pokédex...');
    renderDexSkeleton();
    const cachedEntries = dexCache.get(pokedexId);
    if (cachedEntries) {
        dexEntries = cachedEntries;
        dexLoadedGame = game;
        renderDexGrid();
        hydrateEvolutionSuggestions();
        setDexStatus(`Dados carregados em cache: ${cachedEntries.length} Pokémon disponíveis.`);
        return;
    }
    const pokedexResponse = await fetch(`https://pokeapi.co/api/v2/pokedex/${pokedexId}/`);
    if (!pokedexResponse.ok) {
        throw new Error('Não foi possível carregar a Pokédex selecionada.');
    }
    const pokedexData = await pokedexResponse.json();
    const entries = pokedexData.pokemon_entries
        .map((entry) => {
        const nationalId = getNationalIdFromUrl(entry.pokemon_species.url);
        return {
            regionalNumber: entry.entry_number,
            nationalId,
        };
    })
        .sort((a, b) => a.regionalNumber - b.regionalNumber);
    const detailedEntries = await Promise.all(entries.map((entry) => fetchPokemonDetail(entry.nationalId)));
    if (requestId !== activeDexRequestId) {
        return;
    }
    const regionalByNationalId = new Map(entries.map((entry) => [entry.nationalId, entry.regionalNumber]));
    dexEntries = detailedEntries
        .map((pokemon) => {
        return {
            ...pokemon,
            regionalNumber: regionalByNationalId.get(pokemon.nationalId) ?? pokemon.nationalId,
        };
    })
        .sort((a, b) => a.regionalNumber - b.regionalNumber);
    dexCache.set(pokedexId, dexEntries);
    dexLoadedGame = game;
    renderDexGrid();
    hydrateEvolutionSuggestions();
    setDexStatus(`Pokédex carregada com sucesso: ${dexEntries.length} Pokémon disponíveis.`);
}
function createPokemonCard(entry, game) {
    const typeTags = entry.types
        .map((type) => {
        const label = typeLabelMap[type.name] ?? formatPokemonName(type.name);
        return `<span class="type-chip" data-type="${type.name}">${label}</span>`;
    })
        .join('');
    return `
    <article class="pokemon-card glass-panel js-open-details" data-national-id="${entry.nationalId}" data-pokemon-name="${entry.name}">
      <p class="dex-number">#${String(entry.regionalNumber).padStart(3, '0')}</p>
      <div class="sprite-slot" aria-hidden="true">
        <img class="pokemon-sprite" src="${getSpriteUrl(game, entry.nationalId)}" alt="Sprite de ${formatPokemonName(entry.name)}" loading="lazy" />
      </div>
      <h3 class="dex-name">${formatPokemonName(entry.name)}</h3>
      <div class="type-chip-list">${typeTags}</div>
    </article>
  `;
}
function renderDexGrid() {
    if (!dexGrid)
        return;
    const game = getCurrentGame();
    const query = (dexSearchInput?.value ?? '').trim().toLowerCase();
    const selectedType = dexTypeSelect?.value ?? 'all';
    const filtered = dexEntries.filter((entry) => {
        const matchesName = entry.name.toLowerCase().includes(query);
        const matchesType = selectedType === 'all' || entry.types.some((type) => type.name === selectedType);
        return matchesName && matchesType;
    });
    if (!filtered.length) {
        dexGrid.innerHTML = '';
        setDexStatus('Nenhum Pokémon encontrado com os filtros atuais.');
        return;
    }
    dexGrid.innerHTML = filtered.map((entry) => createPokemonCard(entry, game)).join('');
    setDexStatus(`${filtered.length} Pokémon exibidos.`);
}
function hydrateEvolutionSuggestions() {
    if (!evolutionSuggestions)
        return;
    evolutionSuggestions.innerHTML = dexEntries
        .map((entry) => `<option value="${entry.name}">${formatPokemonName(entry.name)}</option>`)
        .join('');
}
async function ensureDexForCurrentGame() {
    const game = getCurrentGame();
    if (dexLoadedGame === game && dexEntries.length > 0) {
        renderDexGrid();
        hydrateEvolutionSuggestions();
        return;
    }
    await loadDexForGame(game);
}
function formatEvolutionMethod(detail) {
    const trigger = detail.trigger?.name;
    if (trigger === 'use-item' && detail.item) {
        return `Usar Item: ${formatEvolutionItemName(detail.item.name)}`;
    }
    if (trigger === 'trade') {
        if (detail.held_item) {
            return `Troca segurando ${formatEvolutionItemName(detail.held_item.name)}`;
        }
        return 'Troca';
    }
    if (trigger === 'level-up') {
        if (detail.min_happiness) {
            return 'Felicidade Alta';
        }
        if (detail.min_level) {
            return `Nível ${detail.min_level}`;
        }
        return 'Subir de nível';
    }
    return formatResourceName(trigger ?? 'Método desconhecido');
}
function collectEvolutionPaths(node, currentPath) {
    const currentStep = {
        name: node.species.name,
        nationalId: getNationalIdFromUrl(node.species.url),
    };
    const nextPath = {
        steps: [...currentPath.steps, currentStep],
        methods: [...currentPath.methods],
    };
    if (!node.evolves_to.length) {
        return [nextPath];
    }
    return node.evolves_to.flatMap((branch) => {
        const branchDetails = branch.evolution_details ?? [];
        const methodLabel = branchDetails.length
            ? Array.from(new Set(branchDetails.map((detail) => formatEvolutionMethod(detail)))).join(' • ')
            : 'Método não especificado';
        return collectEvolutionPaths(branch, {
            steps: [...nextPath.steps],
            methods: [...nextPath.methods, methodLabel],
        });
    });
}
function renderEvolutionChain(paths, selectedPokemonName) {
    if (!evolutionChainContainer)
        return;
    const game = getCurrentGame();
    const hasOnlyOneStage = paths.length === 1 && paths[0].steps.length === 1;
    if (hasOnlyOneStage) {
        const singlePokemon = paths[0].steps[0];
        evolutionChainContainer.innerHTML = `
      <article class="evolution-empty-state js-open-details" data-national-id="${singlePokemon.nationalId}" data-pokemon-name="${singlePokemon.name}">
        <div class="sprite-slot" aria-hidden="true">
          <img class="pokemon-sprite" src="${getSpriteUrl(game, singlePokemon.nationalId)}" alt="Sprite de ${formatPokemonName(singlePokemon.name)}" />
        </div>
        <h3>${formatPokemonName(singlePokemon.name)}</h3>
        <p>Este Pokémon não possui evolução.</p>
      </article>
    `;
        setEvolutionStatus('Cadeia analisada com sucesso.');
        return;
    }
    evolutionChainContainer.innerHTML = paths
        .map((path) => {
        const stageMarkup = path.steps
            .map((step, index) => {
            const isSelected = step.name === selectedPokemonName;
            const method = path.methods[index];
            return `
            <div class="evolution-stage-wrap">
              <article class="evolution-card js-open-details ${isSelected ? 'is-selected' : ''}" data-national-id="${step.nationalId}" data-pokemon-name="${step.name}">
                <div class="sprite-slot" aria-hidden="true">
                  <img class="pokemon-sprite" src="${getSpriteUrl(game, step.nationalId)}" alt="Sprite de ${formatPokemonName(step.name)}" loading="lazy" />
                </div>
                <h3>${formatPokemonName(step.name)}</h3>
              </article>
              ${method
                ? `<div class="evolution-method" role="note"><span class="method-arrow" aria-hidden="true">➜</span><span>${method}</span></div>`
                : ''}
            </div>
          `;
        })
            .join('');
        return `<article class="evolution-path">${stageMarkup}</article>`;
    })
        .join('');
    setEvolutionStatus(`Cadeia de evolução encontrada: ${paths.length} rota(s) possíveis.`);
}
async function fetchEvolutionPathsByPokemonName(pokemonName) {
    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}/`);
    if (!speciesResponse.ok) {
        throw new Error('Não foi possível carregar os dados de espécie desse Pokémon.');
    }
    const speciesData = await speciesResponse.json();
    const chainUrl = speciesData.evolution_chain?.url;
    if (!chainUrl) {
        throw new Error('A espécie não possui dados de evolução disponíveis.');
    }
    const chainResponse = await fetch(chainUrl);
    if (!chainResponse.ok) {
        throw new Error('Não foi possível carregar a cadeia de evolução da PokéAPI.');
    }
    const chainData = await chainResponse.json();
    return collectEvolutionPaths(chainData.chain, { steps: [], methods: [] });
}
async function handleEvolutionSearchSubmit(event) {
    event.preventDefault();
    if (!evolutionSearchInput)
        return;
    const normalizedSearch = evolutionSearchInput.value.trim().toLowerCase();
    if (!normalizedSearch) {
        setEvolutionStatus('Digite o nome de um Pokémon para pesquisar evoluções.');
        return;
    }
    const allowedEntry = dexEntries.find((entry) => entry.name.toLowerCase() === normalizedSearch);
    if (!allowedEntry) {
        setEvolutionStatus('Pokémon fora da Pokédex regional atual. Troque de jogo ou pesquise outro nome.');
        if (evolutionChainContainer)
            evolutionChainContainer.innerHTML = '';
        return;
    }
    try {
        setEvolutionStatus(`Buscando cadeia evolutiva de ${formatPokemonName(allowedEntry.name)}.`);
        renderEvolutionSkeleton();
        const evolutionPaths = await fetchEvolutionPathsByPokemonName(allowedEntry.name);
        renderEvolutionChain(evolutionPaths, allowedEntry.name);
    }
    catch (error) {
        console.error(error);
        setEvolutionStatus('Falha na conexão com a Box. Tente novamente.');
        renderErrorState(evolutionChainContainer, 'Falha na conexão com a Box. Tente novamente.', 'retry-evolution');
    }
}
function getVersionGroupByGame(game) {
    if (game === 'firered' || game === 'leafgreen')
        return 'firered-leafgreen';
    if (game === 'ruby' || game === 'sapphire')
        return 'ruby-sapphire';
    return 'emerald';
}
function formatFlavorText(text) {
    return text.replace(/[\f\n\r]/g, ' ').replace(/\s+/g, ' ').trim();
}
function formatDexNumber(id) {
    return `#${String(id).padStart(3, '0')}`;
}
function setDetailsLoadingState(pokemonName) {
    if (detailsHero) {
        detailsHero.innerHTML = `
      <p class="dex-number skeleton skeleton-text"></p>
      <div class="details-sprite-slot skeleton skeleton-img"></div>
      <h2 class="details-name skeleton skeleton-text"></h2>
      <div class="type-chip-list">
        <span class="type-chip skeleton skeleton-text"></span>
        <span class="type-chip skeleton skeleton-text"></span>
      </div>
    `;
    }
    if (detailsFlavorText)
        detailsFlavorText.innerHTML = '<span class="skeleton skeleton-text"></span>';
    if (detailsStats) {
        detailsStats.innerHTML = Array.from({ length: 6 }, () => '<article class="stat-row"><p class="skeleton skeleton-text"></p><div class="stat-track skeleton"></div></article>').join('');
    }
    if (detailsStrategy)
        detailsStrategy.innerHTML = '<span class="skeleton skeleton-text"></span>';
    if (detailsEncounters)
        detailsEncounters.innerHTML = Array.from({ length: 3 }, () => '<li class="skeleton skeleton-text"></li>').join('');
    if (detailsMoves) {
        detailsMoves.innerHTML = `
      <div class="details-moves-table-skeleton">
        <p class="skeleton skeleton-text"></p>
        <p class="skeleton skeleton-text"></p>
        <p class="skeleton skeleton-text"></p>
      </div>
    `;
    }
}
function renderDetailsHero(entry) {
    if (!detailsHero)
        return;
    const typeTags = entry.types
        .map((type) => {
        const label = typeLabelMap[type.name] ?? formatPokemonName(type.name);
        return `<span class="type-chip" data-type="${type.name}">${label}</span>`;
    })
        .join('');
    detailsHero.innerHTML = `
    <p class="dex-number">${formatDexNumber(entry.regionalNumber || entry.nationalId)}</p>
    <div class="details-sprite-slot" aria-hidden="true">
      <img class="details-sprite" src="${getSpriteUrl(getCurrentGame(), entry.nationalId)}" alt="Sprite de ${formatPokemonName(entry.name)}" />
    </div>
    <h2 class="details-name">${formatPokemonName(entry.name)}</h2>
    <div class="type-chip-list">${typeTags}</div>
  `;
}
function renderStats(stats) {
    if (!detailsStats)
        return;
    const maxStat = 255;
    detailsStats.innerHTML = stats
        .map((statData) => {
        const label = statLabelMap[statData.stat.name] ?? formatResourceName(statData.stat.name);
        const width = Math.min(100, Math.round((statData.base_stat / maxStat) * 100));
        return `
        <article class="stat-row">
          <header>
            <span>${label}</span>
            <strong>${statData.base_stat}</strong>
          </header>
          <div class="stat-track" role="progressbar" aria-valuemin="0" aria-valuemax="255" aria-valuenow="${statData.base_stat}" aria-label="${label}">
            <span class="stat-fill" style="width: ${width}%"></span>
          </div>
        </article>
      `;
    })
        .join('');
}
function renderStrategy(stats) {
    if (!detailsStrategy)
        return;
    const attack = stats.find((item) => item.stat.name === 'attack')?.base_stat ?? 0;
    const specialAttack = stats.find((item) => item.stat.name === 'special-attack')?.base_stat ?? 0;
    if (attack > specialAttack) {
        detailsStrategy.textContent = 'Este Pokémon tem vantagem com ataques FÍSICOS.';
        return;
    }
    if (specialAttack > attack) {
        detailsStrategy.textContent = 'Este Pokémon tem vantagem com ataques ESPECIAIS.';
        return;
    }
    detailsStrategy.textContent = 'Este Pokémon é HÍBRIDO (bons status Físicos e Especiais).';
}
function renderEncounters(encounters) {
    if (!detailsEncounters)
        return;
    if (!encounters.length) {
        detailsEncounters.innerHTML = '<li>Não encontrado na natureza neste jogo.</li>';
        return;
    }
    const uniqueNames = Array.from(new Set(encounters.map((entry) => formatResourceName(entry.location_area.name))));
    detailsEncounters.innerHTML = uniqueNames.map((name) => `<li>${name}</li>`).join('');
}
function renderLearnset(moves) {
    if (!detailsMoves)
        return;
    if (!moves.length) {
        detailsMoves.innerHTML = '<p>Nenhum golpe por nível encontrado para o jogo selecionado.</p>';
        return;
    }
    const rows = moves
        .map((move) => `<tr><td>${move.version_group_details[0].level_learned_at}</td><td>${formatResourceName(move.move.name)}</td></tr>`)
        .join('');
    detailsMoves.innerHTML = `
    <table class="details-moves-table">
      <thead>
        <tr>
          <th>Nível</th>
          <th>Movimento</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}
async function openPokemonDetails(nationalId, pokemonName) {
    if (!detailsView)
        return;
    const game = getCurrentGame();
    const currentActiveView = views.find((view) => view.classList.contains('active'))?.dataset.view;
    if (currentActiveView === 'dex' || currentActiveView === 'evolucoes' || currentActiveView === 'tipos') {
        previousViewTarget = currentActiveView;
    }
    activateView('details');
    triggerHapticFeedback();
    detailsView.hidden = false;
    document.body.classList.add('details-open');
    appShell?.classList.add('details-open');
    topHeader?.setAttribute('hidden', 'true');
    bottomNavWrap?.setAttribute('hidden', 'true');
    setDetailsLoadingState(pokemonName);
    currentDetailNationalId = nationalId;
    currentDetailPokemonName = pokemonName;
    try {
        const [pokemonResponse, speciesResponse, encounterResponse] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${nationalId}`),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${nationalId}`),
            fetch(`https://pokeapi.co/api/v2/pokemon/${nationalId}/encounters`),
        ]);
        if (!pokemonResponse.ok || !speciesResponse.ok || !encounterResponse.ok) {
            throw new Error('Falha ao carregar detalhes do Pokémon.');
        }
        const pokemonData = await pokemonResponse.json();
        const speciesData = await speciesResponse.json();
        const encounterData = await encounterResponse.json();
        const fallbackEntry = dexEntries.find((entry) => entry.nationalId === nationalId);
        const detailEntry = {
            regionalNumber: fallbackEntry?.regionalNumber ?? nationalId,
            nationalId,
            name: pokemonData.name,
            types: pokemonData.types
                .sort((a, b) => a.slot - b.slot)
                .map((item) => ({ name: item.type.name })),
        };
        const flavorEntry = speciesData.flavor_text_entries.find((entry) => entry.language.name === 'en' && gen3FlavorVersions.has(entry.version.name));
        const allowedVersionNames = new Set(['emerald', 'ruby', 'sapphire', 'firered', 'leafgreen']);
        const filteredEncounters = encounterData.filter((entry) => entry.version_details.some((detail) => allowedVersionNames.has(detail.version.name)));
        const currentVersionGroup = getVersionGroupByGame(game);
        const filteredMoves = pokemonData.moves
            .flatMap((move) => {
            const validDetails = move.version_group_details
                .filter((detail) => detail.version_group.name === currentVersionGroup &&
                detail.move_learn_method.name === 'level-up' &&
                detail.level_learned_at > 0)
                .sort((a, b) => a.level_learned_at - b.level_learned_at);
            if (!validDetails.length)
                return [];
            return [
                {
                    move: move.move,
                    version_group_details: [validDetails[0]],
                },
            ];
        })
            .sort((a, b) => a.version_group_details[0].level_learned_at - b.version_group_details[0].level_learned_at);
        renderDetailsHero(detailEntry);
        if (detailsFlavorText) {
            detailsFlavorText.textContent = flavorEntry ? formatFlavorText(flavorEntry.flavor_text) : 'Entrada da Pokédex indisponível para a Gen 3.';
        }
        renderStats(pokemonData.stats);
        renderStrategy(pokemonData.stats);
        renderEncounters(filteredEncounters);
        renderLearnset(filteredMoves);
    }
    catch (error) {
        console.error(error);
        renderErrorState(detailsHero, 'Falha na conexão com a Box. Tente novamente.', 'retry-details');
        if (detailsFlavorText)
            detailsFlavorText.textContent = 'Falha na conexão com a Box. Tente novamente.';
        if (detailsStats)
            detailsStats.innerHTML = '';
        if (detailsStrategy)
            detailsStrategy.textContent = 'Falha na conexão com a Box. Tente novamente.';
        if (detailsEncounters)
            detailsEncounters.innerHTML = '';
        if (detailsMoves)
            detailsMoves.innerHTML = '';
    }
}
function closePokemonDetails() {
    document.body.classList.remove('details-open');
    appShell?.classList.remove('details-open');
    topHeader?.removeAttribute('hidden');
    bottomNavWrap?.removeAttribute('hidden');
    activateView(previousViewTarget);
}
function bindEvents() {
    navItems.forEach((item) => {
        item.addEventListener('click', async () => {
            triggerHapticFeedback();
            const target = item.dataset.target;
            if (!target)
                return;
            if (target === 'tipos' || target === 'dex' || target === 'evolucoes') {
                previousViewTarget = target;
            }
            activateView(target);
            try {
                if (target === 'dex' || target === 'evolucoes') {
                    await ensureDexForCurrentGame();
                }
            }
            catch (error) {
                console.error(error);
                if (target === 'dex') {
                    setDexStatus('Falha na conexão com a Box. Tente novamente.');
                    renderErrorState(dexGrid, 'Falha na conexão com a Box. Tente novamente.', 'retry-dex');
                }
                if (target === 'evolucoes') {
                    setEvolutionStatus('Falha na conexão com a Box. Tente novamente.');
                    renderErrorState(evolutionChainContainer, 'Falha na conexão com a Box. Tente novamente.', 'retry-evolution');
                }
            }
        });
    });
    dexSearchInput?.addEventListener('input', () => {
        renderDexGrid();
    });
    dexTypeSelect?.addEventListener('change', () => {
        renderDexGrid();
    });
    evolutionForm?.addEventListener('submit', (event) => {
        void handleEvolutionSearchSubmit(event);
    });
    detailsBackButton?.addEventListener('click', () => {
        triggerHapticFeedback();
        closePokemonDetails();
    });
    document.addEventListener('click', (event) => {
        const target = event.target;
        const retryButton = target.closest('[data-retry-action]');
        if (retryButton) {
            triggerHapticFeedback();
            const action = retryButton.dataset.retryAction;
            if (action === 'retry-dex') {
                void ensureDexForCurrentGame().catch((error) => {
                    console.error(error);
                    setDexStatus('Falha na conexão com a Box. Tente novamente.');
                    renderErrorState(dexGrid, 'Falha na conexão com a Box. Tente novamente.', 'retry-dex');
                });
            }
            if (action === 'retry-evolution' && evolutionForm) {
                void handleEvolutionSearchSubmit(new SubmitEvent('submit'));
            }
            if (action === 'retry-details' && currentDetailNationalId && currentDetailPokemonName) {
                void openPokemonDetails(currentDetailNationalId, currentDetailPokemonName);
            }
            return;
        }
        const trigger = target.closest('.js-open-details');
        if (!trigger)
            return;
        const nationalId = Number(trigger.dataset.nationalId);
        const pokemonName = trigger.dataset.pokemonName ?? '';
        if (!nationalId || !pokemonName)
            return;
        void openPokemonDetails(nationalId, pokemonName);
    });
    gameSelect?.addEventListener('change', async (event) => {
        const select = event.currentTarget;
        const game = select.value || 'emerald';
        applyThemeByGame(game);
        try {
            if (document.querySelector('#view-dex.active') || document.querySelector('#view-evolucoes.active')) {
                await ensureDexForCurrentGame();
            }
            if (document.querySelector('#view-evolucoes.active')) {
                setEvolutionStatus('Região atualizada. Pesquise um Pokémon para ver a cadeia de evolução.');
                if (evolutionChainContainer)
                    evolutionChainContainer.innerHTML = '';
                if (evolutionSearchInput)
                    evolutionSearchInput.value = '';
            }
        }
        catch (error) {
            console.error(error);
            setDexStatus('Erro ao carregar dados da Pokédex. Tente novamente.');
            setEvolutionStatus('Erro ao atualizar lista de busca de evoluções para o jogo selecionado.');
        }
    });
}
function initApp() {
    bindEvents();
    activateView('tipos');
    applyThemeByGame(getCurrentGame());
}
initApp();
