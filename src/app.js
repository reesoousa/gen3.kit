const navItems = Array.from(document.querySelectorAll('.nav-item'));
const views = Array.from(document.querySelectorAll('.view'));
const gameSelect = document.querySelector('#game-select');
const dexSearchInput = document.querySelector('#dex-search');
const dexTypeSelect = document.querySelector('#dex-type-filter');
const dexGrid = document.querySelector('#dex-grid');
const dexStatus = document.querySelector('#dex-status');
const evolutionForm = document.querySelector('#evolution-form');
const evolutionSearchInput = document.querySelector('#evolution-search');
const dexAutocompleteList = document.querySelector('#dex-autocomplete-list');
const evolutionAutocompleteList = document.querySelector('#evolution-autocomplete-list');
const evolutionStatus = document.querySelector('#evolution-status');
const evolutionChainContainer = document.querySelector('#evolution-chain');
const hmsToggleList = document.querySelector('#hms-toggle-list');
const hmsGrid = document.querySelector('#hms-grid');
const hmsStatus = document.querySelector('#hms-status');
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
const teamBuilderView = document.querySelector('#view-teambuilder');
const openTeamBuilderButton = document.querySelector('#open-teambuilder-button');
const teamBuilderBackButton = document.querySelector('#teambuilder-back-button');
const teamSearchInput = document.querySelector('#team-search');
const teamAutocompleteList = document.querySelector('#team-autocomplete-list');
const teamSlotsGrid = document.querySelector('#team-slots-grid');
const teamCoveragePanel = document.querySelector('#team-coverage-panel');
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
const hmSetByGame = {
    firered: ['cut', 'fly', 'surf', 'strength', 'flash', 'rock-smash', 'waterfall'],
    leafgreen: ['cut', 'fly', 'surf', 'strength', 'flash', 'rock-smash', 'waterfall'],
    emerald: ['cut', 'fly', 'surf', 'strength', 'flash', 'rock-smash', 'waterfall', 'dive'],
    ruby: ['cut', 'fly', 'surf', 'strength', 'flash', 'rock-smash', 'waterfall', 'dive'],
    sapphire: ['cut', 'fly', 'surf', 'strength', 'flash', 'rock-smash', 'waterfall', 'dive'],
};
const hmLabelMap = {
    cut: 'Cut',
    fly: 'Fly',
    surf: 'Surf',
    strength: 'Strength',
    flash: 'Flash',
    'rock-smash': 'Rock Smash',
    waterfall: 'Waterfall',
    dive: 'Dive',
};
const GEN3_TYPES = [
    'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison', 'ground',
    'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel',
];
const GEN3_TYPE_CHART = {
    normal: { weakTo: ['fighting'], resists: [], immuneTo: ['ghost'] },
    fire: { weakTo: ['water', 'ground', 'rock'], resists: ['fire', 'grass', 'ice', 'bug', 'steel'], immuneTo: [] },
    water: { weakTo: ['electric', 'grass'], resists: ['fire', 'water', 'ice', 'steel'], immuneTo: [] },
    grass: { weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'], resists: ['water', 'grass', 'electric', 'ground'], immuneTo: [] },
    electric: { weakTo: ['ground'], resists: ['electric', 'flying', 'steel'], immuneTo: [] },
    ice: { weakTo: ['fire', 'fighting', 'rock', 'steel'], resists: ['ice'], immuneTo: [] },
    fighting: { weakTo: ['flying', 'psychic'], resists: ['bug', 'rock', 'dark'], immuneTo: [] },
    poison: { weakTo: ['ground', 'psychic'], resists: ['grass', 'fighting', 'poison', 'bug'], immuneTo: [] },
    ground: { weakTo: ['water', 'grass', 'ice'], resists: ['poison', 'rock'], immuneTo: ['electric'] },
    flying: { weakTo: ['electric', 'ice', 'rock'], resists: ['grass', 'fighting', 'bug'], immuneTo: ['ground'] },
    psychic: { weakTo: ['bug', 'ghost', 'dark'], resists: ['fighting', 'psychic'], immuneTo: [] },
    bug: { weakTo: ['fire', 'flying', 'rock'], resists: ['grass', 'fighting', 'ground'], immuneTo: [] },
    rock: { weakTo: ['water', 'grass', 'fighting', 'ground', 'steel'], resists: ['normal', 'fire', 'poison', 'flying'], immuneTo: [] },
    ghost: { weakTo: ['ghost', 'dark'], resists: ['poison', 'bug'], immuneTo: ['normal', 'fighting'] },
    dragon: { weakTo: ['ice', 'dragon'], resists: ['fire', 'water', 'grass', 'electric'], immuneTo: [] },
    dark: { weakTo: ['fighting', 'bug'], resists: ['ghost', 'dark'], immuneTo: ['psychic'] },
    steel: { weakTo: ['fire', 'fighting', 'ground'], resists: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel'], immuneTo: ['poison'] },
};
let dexEntries = [];
let dexLoadedGame = null;
const dexCache = new Map();
let activeDexRequestId = 0;
let previousViewTarget = 'tipos';
let currentDetailNationalId = null;
let currentDetailPokemonName = '';
let selectedHMs = new Set();
const hmLearnsetCache = new Map();
let currentTeam = Array.from({ length: 6 }, () => null);
let activeTeamSlotIndex = 0;
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
    evolutionChainContainer.classList.add('visible');
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
function setEvolutionChainVisible(isVisible) {
    if (!evolutionChainContainer)
        return;
    evolutionChainContainer.classList.toggle('visible', isVisible);
}
function setHMStatus(message) {
    if (hmsStatus) {
        hmsStatus.textContent = message;
    }
}
function createHMKeyByPokemon(nationalId, versionGroup) {
    return `${nationalId}:${versionGroup}`;
}
function renderHMToggles() {
    if (!hmsToggleList)
        return;
    const game = getCurrentGame();
    const availableHMs = hmSetByGame[game];
    selectedHMs = new Set(Array.from(selectedHMs).filter((hm) => availableHMs.includes(hm)));
    hmsToggleList.innerHTML = availableHMs
        .map((hm) => {
        const isActive = selectedHMs.has(hm);
        return `<button class="hm-pill${isActive ? ' is-active' : ''}" type="button" data-hm="${hm}" aria-pressed="${isActive}">${hmLabelMap[hm]}</button>`;
    })
        .join('');
}
async function pokemonCanLearnSelectedHMs(entry, selectedMoves, game) {
    const versionGroup = getVersionGroupByGame(game);
    const cacheKey = createHMKeyByPokemon(entry.nationalId, versionGroup);
    const cachedLearnset = hmLearnsetCache.get(cacheKey);
    if (cachedLearnset) {
        return selectedMoves.every((move) => cachedLearnset.has(move));
    }
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${entry.nationalId}`);
    if (!response.ok) {
        throw new Error(`Falha ao carregar learnset de ${entry.name}.`);
    }
    const pokemonData = await response.json();
    const hmLearnset = new Set();
    pokemonData.moves.forEach((moveData) => {
        const moveName = moveData.move.name;
        if (!(moveName in hmLabelMap))
            return;
        const hasMachineInCurrentGame = moveData.version_group_details.some((detail) => detail.version_group.name === versionGroup && detail.move_learn_method.name === 'machine');
        if (hasMachineInCurrentGame) {
            hmLearnset.add(moveName);
        }
    });
    hmLearnsetCache.set(cacheKey, hmLearnset);
    return selectedMoves.every((move) => hmLearnset.has(move));
}
async function renderHMCompatibility() {
    if (!hmsGrid)
        return;
    const game = getCurrentGame();
    const selectedMoves = Array.from(selectedHMs);
    if (!selectedMoves.length) {
        hmsGrid.innerHTML = '';
        setHMStatus('Selecione as máquinas acima para encontrar o Pokémon compatível.');
        return;
    }
    if (!dexEntries.length || dexLoadedGame !== game) {
        await ensureDexForCurrentGame();
    }
    setHMStatus('Analisando combinações de HMs na região atual...');
    const compatibility = await Promise.all(dexEntries.map(async (entry) => ({
        entry,
        compatible: await pokemonCanLearnSelectedHMs(entry, selectedMoves, game),
    })));
    const compatibleEntries = compatibility.filter((item) => item.compatible).map((item) => item.entry);
    if (!compatibleEntries.length) {
        hmsGrid.innerHTML = '';
        setHMStatus('Nenhum Pokémon nesta região aprende essa combinação exata.');
        return;
    }
    hmsGrid.innerHTML = compatibleEntries.map((entry) => createPokemonCard(entry, game)).join('');
    setHMStatus(`${compatibleEntries.length} Pokémon compatíveis com ${selectedMoves.map((hm) => hmLabelMap[hm]).join(' + ')}.`);
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
function getAutocompleteMatches(query) {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery.length < 2)
        return [];
    return dexEntries
        .filter((entry) => entry.name.includes(normalizedQuery))
        .slice(0, 8);
}
function hideAutocompleteList(list) {
    if (!list)
        return;
    list.innerHTML = '';
    list.hidden = true;
}
function renderAutocompleteList(list, matches, onSelect) {
    if (!list)
        return;
    if (!matches.length) {
        hideAutocompleteList(list);
        return;
    }
    list.innerHTML = matches
        .map((entry) => `<li class="autocomplete-item" data-pokemon-name="${entry.name}" role="option">${formatPokemonName(entry.name)}</li>`)
        .join('');
    list.hidden = false;
    list.querySelectorAll('li[data-pokemon-name]').forEach((item) => {
        item.addEventListener('click', () => {
            const pokemonName = item.dataset.pokemonName;
            if (!pokemonName)
                return;
            onSelect(pokemonName);
            hideAutocompleteList(list);
        });
    });
}
function openTeamBuilder() {
    document.body.classList.add('teambuilder-open');
    appShell?.classList.add('teambuilder-open');
    topHeader?.setAttribute('hidden', 'hidden');
    bottomNavWrap?.setAttribute('hidden', 'hidden');
    activateView('teambuilder');
    teamBuilderView?.removeAttribute('hidden');
    teamSearchInput?.focus();
}
function closeTeamBuilder() {
    document.body.classList.remove('teambuilder-open');
    appShell?.classList.remove('teambuilder-open');
    topHeader?.removeAttribute('hidden');
    bottomNavWrap?.removeAttribute('hidden');
    hideAutocompleteList(teamAutocompleteList);
    if (teamSearchInput)
        teamSearchInput.value = '';
    activateView(previousViewTarget);
}
function analyzeCoverage(teamArray) {
    const teamMembers = teamArray.filter((member) => Boolean(member));
    if (!teamMembers.length) {
        return { criticalWeaknesses: [], strengths: [], suggestedDefenseType: null, biggestThreat: null };
    }
    const criticalWeaknesses = [];
    const strengths = [];
    const attackPressureByType = new Map();
    GEN3_TYPES.forEach((attackingType) => {
        let weakCount = 0;
        let resistCount = 0;
        let immuneCount = 0;
        teamMembers.forEach((member) => {
            let effectiveness = 1;
            member.types.forEach((memberType) => {
                const typeName = memberType.name;
                const chart = GEN3_TYPE_CHART[typeName];
                if (!chart)
                    return;
                if (chart.immuneTo.includes(attackingType))
                    effectiveness *= 0;
                else if (chart.weakTo.includes(attackingType))
                    effectiveness *= 2;
                else if (chart.resists.includes(attackingType))
                    effectiveness *= 0.5;
            });
            if (effectiveness === 0) {
                immuneCount += 1;
            }
            else if (effectiveness > 1) {
                weakCount += 1;
            }
            else if (effectiveness < 1) {
                resistCount += 1;
            }
        });
        attackPressureByType.set(attackingType, weakCount * 2 - resistCount - immuneCount * 2);
        if (weakCount >= 2 && resistCount === 0 && immuneCount === 0) {
            criticalWeaknesses.push(attackingType);
        }
        if (resistCount >= 2 || immuneCount >= 1) {
            strengths.push(attackingType);
        }
    });
    const biggestThreat = [...attackPressureByType.entries()]
        .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    let suggestedDefenseType = null;
    if (biggestThreat) {
        suggestedDefenseType = GEN3_TYPES.find((candidateType) => {
            const chart = GEN3_TYPE_CHART[candidateType];
            return chart.resists.includes(biggestThreat) || chart.immuneTo.includes(biggestThreat);
        }) ?? null;
    }
    return { criticalWeaknesses, strengths, suggestedDefenseType, biggestThreat };
}
function renderCoverageBadges(types, tone) {
    if (!types.length)
        return `<span class="coverage-empty">Sem tipos para destacar.</span>`;
    return types
        .map((type) => `
      <span class="coverage-badge coverage-badge--${tone}" data-type="${type}">${typeLabelMap[type]}</span>
    `)
        .join('');
}
function renderTeamCoveragePanel() {
    if (!teamCoveragePanel)
        return;
    const analysis = analyzeCoverage(currentTeam);
    const suggestionMarkup = analysis.biggestThreat && analysis.suggestedDefenseType
        ? `Falta cobertura contra ${typeLabelMap[analysis.biggestThreat]}. Sugestão: adicione um Pokémon tipo ${typeLabelMap[analysis.suggestedDefenseType]} (${analysis.suggestedDefenseType}).`
        : 'Cobertura equilibrada no momento. Continue variando os tipos para manter o time sólido.';
    teamCoveragePanel.innerHTML = `
    <article class="coverage-group">
      <h4>Avisos (Fraquezas Críticas)</h4>
      <div class="coverage-badge-list">
        ${analysis.criticalWeaknesses.length ? renderCoverageBadges(analysis.criticalWeaknesses, 'warning') : '<span class="coverage-empty">Sem fraquezas críticas no momento.</span>'}
      </div>
    </article>
    <article class="coverage-group">
      <h4>Forças (Resistências/Imunidades)</h4>
      <div class="coverage-badge-list">
        ${analysis.strengths.length ? renderCoverageBadges(analysis.strengths, 'strong') : '<span class="coverage-empty">Cobertura defensiva ainda limitada.</span>'}
      </div>
    </article>
    <article class="coverage-group coverage-group--suggestion">
      <h4>Sugestões de Cobertura</h4>
      <p>${suggestionMarkup}</p>
    </article>
  `;
    teamCoveragePanel.classList.remove('is-updating');
    window.requestAnimationFrame(() => {
        teamCoveragePanel.classList.add('is-updating');
    });
}
function renderTeamSlots() {
    if (!teamSlotsGrid)
        return;
    const game = getCurrentGame();
    const filledMembers = currentTeam
        .map((member, index) => ({ member, index }))
        .filter((item) => Boolean(item.member));
    const memberCards = filledMembers.map(({ member, index }) => {
        const primaryType = member.types[0]?.name ?? 'normal';
        return `
      <article class="team-member-card ${activeTeamSlotIndex === index ? 'is-selected' : ''}" data-team-slot-index="${index}" data-primary-type="${primaryType}">
        <div class="team-member-identity">
          <div class="team-member-sprite-slot" aria-hidden="true">
            <img class="team-member-sprite" src="${getSpriteUrl(game, member.nationalId)}" alt="Sprite de ${formatPokemonName(member.name)}" loading="lazy" />
          </div>
          <div class="team-member-meta">
            <span class="team-slot-title">Membro ${index + 1}</span>
            <span class="team-slot-name">${formatPokemonName(member.name)}</span>
            <span class="type-chip-list">${member.types.map((type) => `<span class="type-chip" data-type="${type.name}">${typeLabelMap[type.name] ?? formatResourceName(type.name)}</span>`).join('')}</span>
          </div>
        </div>
        <button class="team-member-remove" type="button" data-team-remove-index="${index}">Remover</button>
      </article>
    `;
    }).join('');
    const hasRoom = filledMembers.length < 6;
    const addButtonMarkup = hasRoom
        ? `<button class="team-add-member" type="button" data-team-slot-index="${activeTeamSlotIndex}">+ Adicionar Membro ao Time</button>`
        : '';
    teamSlotsGrid.innerHTML = `
    <div class="team-member-list">${memberCards || '<p class="team-empty-state">Seu time está vazio. Comece adicionando o primeiro membro.</p>'}</div>
    ${addButtonMarkup}
  `;
    renderTeamCoveragePanel();
}
function addPokemonToTeam(pokemonName) {
    const targetPokemon = dexEntries.find((entry) => entry.name === pokemonName);
    if (!targetPokemon)
        return;
    const firstEmptyIndex = currentTeam.findIndex((member) => member === null);
    const targetIndex = currentTeam[activeTeamSlotIndex] === null
        ? activeTeamSlotIndex
        : firstEmptyIndex >= 0
            ? firstEmptyIndex
            : activeTeamSlotIndex;
    currentTeam[targetIndex] = targetPokemon;
    if (targetIndex < 5) {
        const nextEmptyIndex = currentTeam.findIndex((member, index) => member === null && index > targetIndex);
        if (nextEmptyIndex >= 0) {
            activeTeamSlotIndex = nextEmptyIndex;
        }
    }
    renderTeamSlots();
}

async function ensureDexForCurrentGame() {
    const game = getCurrentGame();
    if (dexLoadedGame === game && dexEntries.length > 0) {
        renderDexGrid();
        return;
    }
    await loadDexForGame(game);
    hideAutocompleteList(dexAutocompleteList);
    hideAutocompleteList(evolutionAutocompleteList);
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
async function searchEvolutionByName(pokemonName) {
    const normalizedSearch = pokemonName.trim().toLowerCase();
    if (!normalizedSearch) {
        setEvolutionStatus('Digite o nome de um Pokémon para pesquisar evoluções.');
        setEvolutionChainVisible(false);
        return;
    }
    const allowedEntry = dexEntries.find((entry) => entry.name.toLowerCase() === normalizedSearch);
    if (!allowedEntry) {
        setEvolutionStatus('Pokémon fora da Pokédex regional atual. Troque de jogo ou pesquise outro nome.');
        if (evolutionChainContainer)
            evolutionChainContainer.innerHTML = '';
        setEvolutionChainVisible(false);
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
        setEvolutionChainVisible(true);
    }
}
async function handleEvolutionSearchSubmit(event) {
    event.preventDefault();
    if (!evolutionSearchInput)
        return;
    await searchEvolutionByName(evolutionSearchInput.value);
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
            if (target === 'tipos' || target === 'dex' || target === 'evolucoes' || target === 'hms') {
                previousViewTarget = target;
            }
            activateView(target);
            try {
                if (target === 'dex' || target === 'evolucoes' || target === 'hms') {
                    await ensureDexForCurrentGame();
                }
                if (target === 'hms') {
                    renderHMToggles();
                    await renderHMCompatibility();
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
                if (target === 'hms') {
                    setHMStatus('Falha na conexão com a Box. Tente novamente.');
                    renderErrorState(hmsGrid, 'Falha na conexão com a Box. Tente novamente.', 'retry-hms');
                }
            }
        });
    });
    dexSearchInput?.addEventListener('input', () => {
        renderDexGrid();
        const matches = getAutocompleteMatches(dexSearchInput.value);
        renderAutocompleteList(dexAutocompleteList, matches, (pokemonName) => {
            if (!dexSearchInput)
                return;
            dexSearchInput.value = pokemonName;
            renderDexGrid();
        });
    });
    dexTypeSelect?.addEventListener('change', () => {
        renderDexGrid();
    });
    evolutionSearchInput?.addEventListener('input', () => {
        const matches = getAutocompleteMatches(evolutionSearchInput.value);
        renderAutocompleteList(evolutionAutocompleteList, matches, (pokemonName) => {
            if (!evolutionSearchInput)
                return;
            evolutionSearchInput.value = pokemonName;
            void searchEvolutionByName(pokemonName);
        });
    });
    evolutionForm?.addEventListener('submit', (event) => {
        void handleEvolutionSearchSubmit(event);
    });
    openTeamBuilderButton?.addEventListener('click', async () => {
        triggerHapticFeedback();
        try {
            await ensureDexForCurrentGame();
            renderTeamSlots();
            openTeamBuilder();
        }
        catch (error) {
            console.error(error);
            setDexStatus('Falha na conexão com a Box. Tente novamente.');
        }
    });
    teamBuilderBackButton?.addEventListener('click', () => {
        triggerHapticFeedback();
        closeTeamBuilder();
    });
    teamSearchInput?.addEventListener('input', () => {
        const matches = getAutocompleteMatches(teamSearchInput.value);
        renderAutocompleteList(teamAutocompleteList, matches, (pokemonName) => {
            if (!teamSearchInput)
                return;
            teamSearchInput.value = '';
            addPokemonToTeam(pokemonName);
            hideAutocompleteList(teamAutocompleteList);
        });
    });
    detailsBackButton?.addEventListener('click', () => {
        triggerHapticFeedback();
        closePokemonDetails();
    });
    document.addEventListener('click', (event) => {
        const target = event.target;
        const clickedDexAutocomplete = target.closest('#dex-autocomplete-list, #dex-search');
        if (!clickedDexAutocomplete) {
            hideAutocompleteList(dexAutocompleteList);
        }
        const clickedEvolutionAutocomplete = target.closest('#evolution-autocomplete-list, #evolution-search');
        if (!clickedEvolutionAutocomplete) {
            hideAutocompleteList(evolutionAutocompleteList);
        }
        const clickedTeamAutocomplete = target.closest('#team-autocomplete-list, #team-search');
        if (!clickedTeamAutocomplete) {
            hideAutocompleteList(teamAutocompleteList);
        }
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
            if (action === 'retry-hms') {
                void renderHMCompatibility().catch((error) => {
                    console.error(error);
                    setHMStatus('Falha na conexão com a Box. Tente novamente.');
                    renderErrorState(hmsGrid, 'Falha na conexão com a Box. Tente novamente.', 'retry-hms');
                });
            }
            if (action === 'retry-details' && currentDetailNationalId && currentDetailPokemonName) {
                void openPokemonDetails(currentDetailNationalId, currentDetailPokemonName);
            }
            return;
        }
        const hmButton = target.closest('.hm-pill');
        if (hmButton) {
            triggerHapticFeedback();
            const hm = hmButton.dataset.hm;
            if (!hm)
                return;
            if (selectedHMs.has(hm)) {
                selectedHMs.delete(hm);
            }
            else {
                selectedHMs.add(hm);
            }
            renderHMToggles();
            void renderHMCompatibility().catch((error) => {
                console.error(error);
                setHMStatus('Falha na conexão com a Box. Tente novamente.');
                renderErrorState(hmsGrid, 'Falha na conexão com a Box. Tente novamente.', 'retry-hms');
            });
            return;
        }
        const removeButton = target.closest('[data-team-remove-index]');
        if (removeButton) {
            triggerHapticFeedback();
            const removeIndex = Number(removeButton.dataset.teamRemoveIndex);
            if (Number.isFinite(removeIndex) && removeIndex >= 0 && removeIndex < currentTeam.length) {
                currentTeam[removeIndex] = null;
                activeTeamSlotIndex = removeIndex;
                renderTeamSlots();
            }
            return;
        }
        const teamSlot = target.closest('[data-team-slot-index]');
        if (teamSlot) {
            triggerHapticFeedback();
            const teamSlotIndex = Number(teamSlot.dataset.teamSlotIndex);
            if (Number.isFinite(teamSlotIndex) && teamSlotIndex >= 0 && teamSlotIndex < currentTeam.length) {
                activeTeamSlotIndex = teamSlotIndex;
                renderTeamSlots();
                teamSearchInput?.focus();
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
            if (document.querySelector('#view-dex.active') || document.querySelector('#view-evolucoes.active') || document.querySelector('#view-hms.active')) {
                await ensureDexForCurrentGame();
            }
            renderHMToggles();
            if (document.querySelector('#view-hms.active')) {
                await renderHMCompatibility();
            }
            if (document.querySelector('#view-evolucoes.active')) {
                setEvolutionStatus('Região atualizada. Pesquise um Pokémon para ver a cadeia de evolução.');
                if (evolutionChainContainer)
                    evolutionChainContainer.innerHTML = '';
                setEvolutionChainVisible(false);
                if (evolutionSearchInput)
                    evolutionSearchInput.value = '';
                hideAutocompleteList(evolutionAutocompleteList);
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
    renderHMToggles();
    setEvolutionChainVisible(false);
}
initApp();
