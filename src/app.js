const navItems = Array.from(document.querySelectorAll('.nav-item'));
const views = Array.from(document.querySelectorAll('.view'));

function activateView(target) {
  navItems.forEach((item) => {
    const isActive = item.dataset.target === target;
    item.classList.toggle('is-active', isActive);

    if (isActive) {
      item.setAttribute('aria-current', 'page');
      return;
    }

    item.removeAttribute('aria-current');
  });

  views.forEach((view) => {
    const isActive = view.dataset.view === target;
    view.classList.toggle('is-active', isActive);
    view.hidden = !isActive;
  });
}

function bindEvents() {
  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      const target = item.dataset.target;
      if (!target) return;
      activateView(target);
    });
  });
}

function initApp() {
  bindEvents();
  activateView('tipos');
}

initApp();
