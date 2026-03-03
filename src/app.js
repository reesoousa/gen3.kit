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

function getCurrentGame() {
  const selected = gameSelect?.value;
  if (selected && dexConfigByGame[selected]) return selected;
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

  setDexStatus('Carregando Pokédex...');
  if (dexGrid) dexGrid.innerHTML = '';

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
    <article class="pokemon-card glass-panel">
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
  if (!dexGrid) return;

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
  if (!evolutionSuggestions) return;

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

  if (trigger === 'item' && detail.item) {
    return `Usar Item: ${formatResourceName(detail.item.name)}`;
  }

  if (trigger === 'trade') {
    if (detail.held_item) {
      return `Troca segurando ${formatResourceName(detail.held_item.name)}`;
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
  if (!evolutionChainContainer) return;

  const game = getCurrentGame();
  const hasOnlyOneStage = paths.length === 1 && paths[0].steps.length === 1;

  if (hasOnlyOneStage) {
    const singlePokemon = paths[0].steps[0];
    evolutionChainContainer.innerHTML = `
      <article class="evolution-empty-state">
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
              <article class="evolution-card ${isSelected ? 'is-selected' : ''}">
                <div class="sprite-slot" aria-hidden="true">
                  <img class="pokemon-sprite" src="${getSpriteUrl(game, step.nationalId)}" alt="Sprite de ${formatPokemonName(step.name)}" loading="lazy" />
                </div>
                <h3>${formatPokemonName(step.name)}</h3>
              </article>
              ${
                method
                  ? `<div class="evolution-method" role="note"><span class="method-arrow" aria-hidden="true">➜</span><span>${method}</span></div>`
                  : ''
              }
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

  if (!evolutionSearchInput) return;

  const normalizedSearch = evolutionSearchInput.value.trim().toLowerCase();
  if (!normalizedSearch) {
    setEvolutionStatus('Digite o nome de um Pokémon para pesquisar evoluções.');
    return;
  }

  const allowedEntry = dexEntries.find((entry) => entry.name.toLowerCase() === normalizedSearch);
  if (!allowedEntry) {
    setEvolutionStatus('Pokémon fora da Pokédex regional atual. Troque de jogo ou pesquise outro nome.');
    if (evolutionChainContainer) evolutionChainContainer.innerHTML = '';
    return;
  }

  try {
    setEvolutionStatus(`Buscando cadeia evolutiva de ${formatPokemonName(allowedEntry.name)}...`);
    if (evolutionChainContainer) evolutionChainContainer.innerHTML = '';

    const evolutionPaths = await fetchEvolutionPathsByPokemonName(allowedEntry.name);
    renderEvolutionChain(evolutionPaths, allowedEntry.name);
  } catch (error) {
    console.error(error);
    setEvolutionStatus('Erro ao buscar evolução na PokéAPI. Tente novamente em instantes.');
    if (evolutionChainContainer) evolutionChainContainer.innerHTML = '';
  }
}

function bindEvents() {
  navItems.forEach((item) => {
    item.addEventListener('click', async () => {
      const target = item.dataset.target;
      if (!target) return;

      activateView(target);

      try {
        if (target === 'dex' || target === 'evolucoes') {
          await ensureDexForCurrentGame();
        }
      } catch (error) {
        console.error(error);
        if (target === 'dex') {
          setDexStatus('Erro ao carregar dados da Pokédex. Tente novamente.');
        }
        if (target === 'evolucoes') {
          setEvolutionStatus('Erro ao carregar Pokédex da região para a busca de evoluções.');
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
        if (evolutionChainContainer) evolutionChainContainer.innerHTML = '';
        if (evolutionSearchInput) evolutionSearchInput.value = '';
      }
    } catch (error) {
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
