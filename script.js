const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
const checkForm = document.getElementById('checkForm');
const toast = document.getElementById('toast');

if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    menu.classList.toggle('show');
  });

  document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('show');
    });
  });
}

if (checkForm) {
  checkForm.addEventListener('submit', function (e) {
    e.preventDefault();
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  });
}
