// Inicializa a navegação por abas no shell da aplicação.
const navItems = Array.from(document.querySelectorAll<HTMLButtonElement>('.nav-item'));
const views = Array.from(document.querySelectorAll<HTMLElement>('.view'));

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

function bindEvents(): void {
  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      const target = item.dataset.target;
      if (!target) return;
      activateView(target);
    });
  });
}

function initApp(): void {
  bindEvents();
  activateView('tipos');
}

initApp();
