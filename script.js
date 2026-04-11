const openDrawer = document.getElementById('openDrawer');
const drawer = document.getElementById('drawer');
const toast = document.getElementById('toast');
const navItems = document.querySelectorAll('.nav-item');
const drawerItems = document.querySelectorAll('.drawer-item[data-tab-target]');
const utilityItems = document.querySelectorAll('.drawer-item[data-utility-target]');
const quickButtons = document.querySelectorAll('[data-tab-jump]');
const screens = document.querySelectorAll('.tab-screen');

let toastTimer;

function showToast(message = 'Bu modül EbruTech Studios tarafından geçici olarak durdurulmuştur.') {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// Drawer utility (yapım aşaması olanlar)
utilityItems.forEach(item => {
  item.addEventListener('click', () => {
    showToast();
    drawer.classList.remove('show');
  });
});

// Alt menü vs aynı kalsın
navItems.forEach(item => {
  item.addEventListener('click', () => {
    const tab = item.dataset.tab;
    screens.forEach(s => s.classList.toggle('active', s.id === `tab-${tab}`));
    navItems.forEach(n => n.classList.toggle('active', n.dataset.tab === tab));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

if (openDrawer) {
  openDrawer.addEventListener('click', () => drawer.classList.toggle('show'));
}

if (drawer) {
  drawer.addEventListener('click', e => {
    if (e.target === drawer) drawer.classList.remove('show');
  });
}
