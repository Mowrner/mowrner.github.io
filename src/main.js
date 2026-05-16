const cursor = document.querySelector('.cursor');
const previewLabel = document.querySelector('.preview-label');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const reveals = document.querySelectorAll('.reveal');
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.work-card');
const tiltCards = document.querySelectorAll('[data-tilt]');

document.documentElement.classList.add('js');

document.addEventListener('pointermove', (event) => {
  cursor.style.opacity = '1';
  cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
  previewLabel.style.transform = `translate3d(${event.clientX + 18}px, ${event.clientY + 18}px, 0)`;
});

cards.forEach((card) => {
  card.addEventListener('pointerenter', () => {
    cursor.classList.add('active');
    previewLabel.textContent = card.dataset.preview || 'View';
    previewLabel.style.opacity = '1';
  });

  card.addEventListener('pointerleave', () => {
    cursor.classList.remove('active');
    previewLabel.style.opacity = '0';
  });
});

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

reveals.forEach((element) => revealObserver.observe(element));

filters.forEach((filter) => {
  filter.addEventListener('click', () => {
    const category = filter.dataset.filter;
    filters.forEach((item) => item.classList.remove('active'));
    filter.classList.add('active');

    cards.forEach((card) => {
      const shouldShow = category === 'all' || card.dataset.category === category;
      card.classList.toggle('hidden', !shouldShow);
    });
  });
});

tiltCards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${y * -7}deg) rotateY(${x * 7}deg)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
});
