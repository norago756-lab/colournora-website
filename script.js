
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

const dialog = document.querySelector('.lightbox');
const dialogImg = dialog.querySelector('img');
const dialogTitle = dialog.querySelector('p');

document.querySelectorAll('.art-card').forEach(card => {
  card.addEventListener('click', () => {
    dialogImg.src = card.dataset.image;
    dialogImg.alt = card.dataset.title;
    dialogTitle.textContent = card.dataset.title;
    dialog.showModal();
  });
});
dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (e) => {
  const rect = dialog.getBoundingClientRect();
  const inside = e.clientX >= rect.left && e.clientX <= rect.right &&
                 e.clientY >= rect.top && e.clientY <= rect.bottom;
  if (!inside) dialog.close();
});
document.getElementById('year').textContent = new Date().getFullYear();
