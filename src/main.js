// ============================================
//  BHANU PORTFOLIO — main.js
//  Neobrutalist Anime Fusion
// ============================================

document.documentElement.classList.add('js');

// ---- Shared references ----
const cursor       = document.getElementById('cursor');
const ring         = document.getElementById('cursorRing');
const menuToggle   = document.querySelector('.menu-toggle');
const nav          = document.querySelector('.nav');
const reveals      = document.querySelectorAll('.reveal');
const filters      = document.querySelectorAll('.filter');
const cards        = document.querySelectorAll('.work-card');
const tiltCards    = document.querySelectorAll('[data-tilt]');
const modal        = document.querySelector('.project-modal');
const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
const modalTitle   = document.querySelector('#project-title');
const modalType    = document.querySelector('.project-type');
const modalDescription  = document.querySelector('.project-description');
const modalVideo   = document.querySelector('.project-video');
const modalFallback = document.querySelector('.project-fallback');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const motionAllowed = () => !reduceMotion.matches;

// ============================================
//  SAKURA PETAL SYSTEM
// ============================================
let petalTimer = null;

function spawnPetal() {
  const petal = document.createElement('div');
  petal.className = 'sakura-petal';
  const size = Math.random() * 7 + 6;
  const duration = Math.random() * 9 + 8;
  const delay = Math.random() * 2;
  petal.style.left = `${Math.random() * 112 - 6}vw`;
  petal.style.width = `${size}px`;
  petal.style.height = `${size}px`;
  petal.style.animationDuration = `${duration}s`;
  petal.style.animationDelay = `${delay}s`;
  petal.style.opacity = String(Math.random() * 0.5 + 0.3);
  petal.style.transform = `rotate(${Math.random() * 360}deg)`;
  document.body.appendChild(petal);
  setTimeout(() => petal.remove(), (duration + delay) * 1000 + 600);
}

function startPetals() {
  for (let i = 0; i < 14; i++) spawnPetal();
  petalTimer = setInterval(spawnPetal, 850);
}

function stopPetals() {
  clearInterval(petalTimer);
  petalTimer = null;
  document.querySelectorAll('.sakura-petal').forEach((p) => p.remove());
}

if (motionAllowed()) startPetals();

// ============================================
//  DUAL CURSOR — square dot + lagging ring
// ============================================
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX  = mouseX;
let ringY  = mouseY;

if (cursor && ring && window.matchMedia('(pointer: fine)').matches) {
  // Show both elements once mouse moves
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Square dot: 8px wide, offset by half (4px) to center
    cursor.style.left = (mouseX - 4) + 'px';
    cursor.style.top  = (mouseY - 4) + 'px';
    cursor.style.opacity = '1';
    ring.style.opacity   = '1';
  });

  // Lagging ring animation loop
  function animateRing() {
    ringX += (mouseX - ringX - 18) * 0.12;
    ringY += (mouseY - ringY - 18) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Expand ring on interactive elements
  document.querySelectorAll('a, button').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.style.width       = '52px';
      ring.style.height      = '52px';
      ring.style.background  = 'rgba(237,234,228,0.06)';
      ring.style.borderColor = 'rgba(237,234,228,0.55)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width       = '34px';
      ring.style.height      = '34px';
      ring.style.background  = 'transparent';
      ring.style.borderColor = 'rgba(237,234,228,0.35)';
    });
  });
}

// ============================================
//  NAV ACTIVE SECTION TRACKING
// ============================================
const navLinks = [...document.querySelectorAll('.nav a')];
const sections = navLinks
  .map((l) => document.querySelector(l.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle(
            'is-active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      });
    },
    { rootMargin: '-40% 0px -52% 0px' }
  );
  sections.forEach((s) => navObserver.observe(s));
}

// ============================================
//  MOBILE NAV TOGGLE
// ============================================
if (menuToggle && nav) {
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
}

// ============================================
//  SCROLL REVEALS
// ============================================
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  reveals.forEach((el) => revealObserver.observe(el));
} else {
  // Fallback: show everything immediately
  reveals.forEach((el) => el.classList.add('visible'));
}

// ============================================
//  WORK FILTERS
// ============================================
filters.forEach((filter) => {
  filter.addEventListener('click', () => {
    const category = filter.dataset.filter;

    filters.forEach((item) => {
      const isActive = item === filter;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });

    cards.forEach((card) => {
      const shouldShow = category === 'all' || card.dataset.category === category;
      card.classList.toggle('hidden', !shouldShow);
    });
  });
});

// ============================================
//  PROJECT MODAL
// ============================================
function closeProject() {
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove('modal-open');

  if (modalVideo) {
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
    modalVideo.hidden = true;
  }

  if (modalFallback) modalFallback.hidden = false;
}

function openProject(card) {
  if (!modal || !modalTitle || !modalType || !modalDescription) return;

  modalTitle.textContent       = card.dataset.title       || 'Project preview';
  modalType.textContent        = card.dataset.type        || 'Project';
  modalDescription.textContent = card.dataset.description || card.dataset.preview || '';

  if (modalVideo && modalFallback) {
    const videoSource = card.dataset.video;
    modalVideo.hidden   = !videoSource;
    modalFallback.hidden = Boolean(videoSource);

    if (videoSource) {
      modalVideo.src = videoSource;
      modalVideo.load();
    }
  }

  modal.hidden = false;
  document.body.classList.add('modal-open');
  modal.querySelector('.modal-close')?.focus();
}

cards.forEach((card) => {
  card.addEventListener('click', () => openProject(card));
});

modalCloseButtons.forEach((button) => {
  button.addEventListener('click', closeProject);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeProject();
});

// ============================================
//  3D TILT ON [data-tilt] ELEMENTS
// ============================================
if (window.matchMedia('(pointer: fine)').matches) {
  tiltCards.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      if (!motionAllowed()) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `rotateX(${y * -7}deg) rotateY(${x * 7}deg)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  });
}

// ============================================
//  REDUCED MOTION HANDLER
// ============================================
reduceMotion.addEventListener('change', () => {
  if (!motionAllowed()) {
    tiltCards.forEach((card) => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
    stopPetals();
  } else {
    startPetals();
  }
});
