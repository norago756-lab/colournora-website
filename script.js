
const header = document.querySelector('.site-header');
const progress = document.querySelector('.progress');
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.main-nav');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
});

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.work-card');
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const value = btn.dataset.filter;
    cards.forEach(card => {
      card.classList.toggle('is-hidden', value !== 'all' && card.dataset.category !== value);
    });
  });
});

const dialog = document.querySelector('.lightbox');
const dialogImg = dialog.querySelector('img');
const dialogTitle = dialog.querySelector('h3');
const dialogLink = dialog.querySelector('.lightbox-caption a');

document.querySelectorAll('.work-image').forEach(button => {
  button.addEventListener('click', () => {
    const title = button.dataset.title;
    dialogImg.src = button.dataset.src;
    dialogImg.alt = title;
    dialogTitle.textContent = title;
    dialogLink.href = `mailto:colournora.art@gmail.com?subject=${encodeURIComponent('Anfrage zu ' + title)}`;
    dialog.showModal();
  });
});
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
    dialog.close();
  }
});
document.getElementById('year').textContent = new Date().getFullYear();
