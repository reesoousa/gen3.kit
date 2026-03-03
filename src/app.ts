type GameKey = 'emerald' | 'ruby' | 'sapphire' | 'firered' | 'leafgreen';

type DexConfig = {
  pokedexId: number;
  spriteFolder: 'emerald' | 'firered-leafgreen';
};

type PokemonType = {
  name: string;
};

type PokemonEntry = {
  regionalNumber: number;
  nationalId: number;
  name: string;
  types: PokemonType[];
};

const navItems = Array.from(document.querySelectorAll<HTMLButtonElement>('.nav-item'));
const views = Array.from(document.querySelectorAll<HTMLElement>('.view'));
const gameSelect = document.querySelector<HTMLSelectElement>('#game-select');

const dexSearchInput = document.querySelector<HTMLInputElement>('#dex-search');
const dexTypeSelect = document.querySelector<HTMLSelectElement>('#dex-type-filter');
const dexGrid = document.querySelector<HTMLDivElement>('#dex-grid');
const dexStatus = document.querySelector<HTMLParagraphElement>('#dex-status');

const themeMap: Record<GameKey, string> = {
  emerald: '#50C878',
  firered: '#FF4422',
  leafgreen: '#90EE90',
  ruby: '#E0115F',
  sapphire: '#0F52BA',
};

const dexConfigByGame: Record<GameKey, DexConfig> = {
  emerald: { pokedexId: 4, spriteFolder: 'emerald' },
  ruby: { pokedexId: 4, spriteFolder: 'emerald' },
  sapphire: { pokedexId: 4, spriteFolder: 'emerald' },
  firered: { pokedexId: 2, spriteFolder: 'firered-leafgreen' },
  leafgreen: { pokedexId: 2, spriteFolder: 'firered-leafgreen' },
};

const typeLabelMap: Record<string, string> = {
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

let dexEntries: PokemonEntry[] = [];
let dexLoadedGame: GameKey | null = null;
const dexCache = new Map<number, PokemonEntry[]>();
let activeDexRequestId = 0;

function activateView(target: string): void {
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

function applyThemeByGame(game: GameKey): void {
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

function formatPokemonName(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getCurrentGame(): GameKey {
  const selected = gameSelect?.value as GameKey | undefined;
  if (selected && dexConfigByGame[selected]) return selected;
  return 'emerald';
}

function getSpriteUrl(game: GameKey, nationalId: number): string {
  const folder = dexConfigByGame[game].spriteFolder;
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/${folder}/${nationalId}.png`;
}

function setDexStatus(message: string): void {
  if (dexStatus) {
    dexStatus.textContent = message;
  }
}

async function fetchPokemonDetail(nationalId: number): Promise<PokemonEntry> {
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
      .sort((a: { slot: number }, b: { slot: number }) => a.slot - b.slot)
      .map((item: { type: { name: string } }) => ({ name: item.type.name })),
  };
}

async function loadDexForGame(game: GameKey): Promise<void> {
  const requestId = ++activeDexRequestId;
  const { pokedexId } = dexConfigByGame[game];

  setDexStatus('Carregando Pokédex...');
  if (dexGrid) dexGrid.innerHTML = '';

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
  const entries = (pokedexData.pokemon_entries as Array<{ entry_number: number; pokemon_species: { name: string; url: string } }>)
    .map((entry) => {
      const urlParts = entry.pokemon_species.url.split('/').filter(Boolean);
      const nationalId = Number(urlParts[urlParts.length - 1]);

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

function createPokemonCard(entry: PokemonEntry, game: GameKey): string {
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

function renderDexGrid(): void {
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

async function refreshDexIfNeeded(): Promise<void> {
  const game = getCurrentGame();

  if (dexLoadedGame === game && dexEntries.length > 0) {
    renderDexGrid();
    return;
  }

  try {
    await loadDexForGame(game);
  } catch (error) {
    console.error(error);
    setDexStatus('Erro ao carregar dados da Pokédex. Tente novamente.');
  }
}

function bindEvents(): void {
  navItems.forEach((item) => {
    item.addEventListener('click', async () => {
      const target = item.dataset.target;
      if (!target) return;

      activateView(target);

      if (target === 'dex') {
        await refreshDexIfNeeded();
      }
    });
  });

  dexSearchInput?.addEventListener('input', () => {
    renderDexGrid();
  });

  dexTypeSelect?.addEventListener('change', () => {
    renderDexGrid();
  });

  gameSelect?.addEventListener('change', async (event) => {
    const select = event.currentTarget as HTMLSelectElement;
    const game = (select.value as GameKey) || 'emerald';

    applyThemeByGame(game);

    if (document.querySelector('#view-dex.active')) {
      await refreshDexIfNeeded();
    }
  });
}

function initApp(): void {
  bindEvents();
  activateView('tipos');
  applyThemeByGame(getCurrentGame());
}

initApp();
