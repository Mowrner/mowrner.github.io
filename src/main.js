const cursor = document.querySelector('.cursor');
const previewLabel = document.querySelector('.preview-label');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const reveals = document.querySelectorAll('.reveal');
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.work-card');
const tiltCards = document.querySelectorAll('[data-tilt]');
const modal = document.querySelector('.project-modal');
const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
const modalTitle = document.querySelector('#project-title');
const modalType = document.querySelector('.project-type');
const modalDescription = document.querySelector('.project-description');
const modalVideo = document.querySelector('.project-video');
const modalFallback = document.querySelector('.project-fallback');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.documentElement.classList.add('js');

const motionAllowed = () => !reduceMotion.matches;

if (cursor && previewLabel) {
  document.addEventListener('pointermove', (event) => {
    if (!motionAllowed()) return;

    cursor.style.opacity = '1';
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    previewLabel.style.transform = `translate3d(${event.clientX + 18}px, ${event.clientY + 18}px, 0)`;
  });
}

cards.forEach((card) => {
  card.addEventListener('pointerenter', () => {
    if (!cursor || !previewLabel || !motionAllowed()) return;

    cursor.classList.add('active');
    previewLabel.textContent = card.dataset.preview || 'View';
    previewLabel.style.opacity = '1';
  });

  card.addEventListener('pointerleave', () => {
    if (!cursor || !previewLabel) return;

    cursor.classList.remove('active');
    previewLabel.style.opacity = '0';
  });
});

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
    { threshold: 0.16 }
  );

  reveals.forEach((element) => revealObserver.observe(element));
} else {
  reveals.forEach((element) => element.classList.add('visible'));
}

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

  if (modalFallback) {
    modalFallback.hidden = false;
  }
}

function openProject(card) {
  if (!modal || !modalTitle || !modalType || !modalDescription) return;

  modalTitle.textContent = card.dataset.title || 'Project preview';
  modalType.textContent = card.dataset.type || 'Project';
  modalDescription.textContent = card.dataset.description || card.dataset.preview || '';

  if (modalVideo && modalFallback) {
    const videoSource = card.dataset.video;
    modalVideo.hidden = !videoSource;
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

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeProject();
  }
});

tiltCards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (!motionAllowed()) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${y * -7}deg) rotateY(${x * 7}deg)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
});

reduceMotion.addEventListener('change', () => {
  if (!motionAllowed()) {
    tiltCards.forEach((card) => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }
});
