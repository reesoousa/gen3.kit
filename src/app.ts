// Inicializa a navegação por abas no shell da aplicação.
const navItems = Array.from(document.querySelectorAll<HTMLButtonElement>('.nav-item'));
const views = Array.from(document.querySelectorAll<HTMLElement>('.view'));
const gameSelect = document.querySelector<HTMLSelectElement>('#game-select');

const themeMap: Record<string, string> = {
  emerald: '#50C878',
  firered: '#FF4422',
  leafgreen: '#90EE90',
  ruby: '#E0115F',
  sapphire: '#0F52BA',
};

function activateView(target: string): void {
  // Atualiza o estado visual da barra inferior.
  navItems.forEach((item) => {
    const isActive = item.dataset.target === target;
    item.classList.toggle('is-active', isActive);

    if (isActive) {
      item.setAttribute('aria-current', 'page');
      return;
    }

    item.removeAttribute('aria-current');
  });

  // Mostra somente a view relacionada ao botão selecionado.
  views.forEach((view) => {
    const isActive = view.dataset.view === target;
    view.classList.toggle('is-active', isActive);
    view.hidden = !isActive;
  });
}

function applyThemeByGame(game: string): void {
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

function bindEvents(): void {
  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      const target = item.dataset.target;
      if (!target) return;
      activateView(target);
    });
  });

  gameSelect?.addEventListener('change', (event) => {
    const select = event.currentTarget as HTMLSelectElement;
    applyThemeByGame(select.value);
  });
}

function initApp(): void {
  bindEvents();
  activateView('tipos');
  applyThemeByGame(gameSelect?.value ?? 'emerald');
}

initApp();
