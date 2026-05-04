// ─── Custom Cursor ───
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
if (cursor) {
  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });
  function animateCursor() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.left = curX + 'px';
    cursor.style.top = curY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

// ─── Filters ───
const filtersContainer = document.getElementById('filters');
const projectsGrid = document.getElementById('projectsGrid');
if (filtersContainer && projectsGrid) {
  const cards = Array.from(projectsGrid.querySelectorAll('.project-card'));
  const allTags = new Set();
  cards.forEach(card => {
    const tags = card.dataset.tags || '';
    tags.split(',').forEach(t => { if (t.trim()) allTags.add(t.trim()); });
  });
  allTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.filter = tag;
    btn.textContent = tag;
    filtersContainer.appendChild(btn);
  });
  filtersContainer.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filtersContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    cards.forEach(card => {
      if (filter === 'all') {
        card.style.display = '';
        card.style.opacity = '1';
      } else {
        const tags = card.dataset.tags || '';
        const match = tags.split(',').map(t => t.trim()).includes(filter);
        card.style.display = match ? '' : 'none';
        card.style.opacity = match ? '1' : '0';
      }
    });
  });
}

// ─── Reveal on scroll ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card, .featured-card, .about-card, .contact-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ─── Header shadow on scroll ───
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (header) {
    header.style.boxShadow = window.scrollY > 20
      ? '0 4px 40px rgba(0,0,0,0.5)'
      : 'none';
  }
});


// ─── Carousel + Lightbox ───
const track = document.getElementById('carouselTrack');
if (track) {
  const slides = Array.from(track.querySelectorAll('.carousel-slide'));
  const dots = document.querySelectorAll('.carousel-dot');
  const prev = document.getElementById('carouselPrev');
  const next = document.getElementById('carouselNext');
  let current = 0;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (prev) prev.addEventListener('click', () => goTo(current - 1));
  if (next) next.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Swipe móvil
  let startX = 0;
  track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
  });

  // Auto-play
  let autoPlay = setInterval(() => goTo(current + 1), 5000);
  track.addEventListener('mouseenter', () => clearInterval(autoPlay));
  track.addEventListener('mouseleave', () => { autoPlay = setInterval(() => goTo(current + 1), 5000); });

  // ─── Lightbox ───
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  const images = slides.map(slide => slide.querySelector('img')?.src).filter(Boolean);
  let lightboxIndex = 0;

  function openLightbox(index) {
    lightboxIndex = index;
    lightboxImg.src = images[lightboxIndex];
    lightboxCounter.textContent = `${lightboxIndex + 1} / ${images.length}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function lightboxGoTo(index) {
    lightboxIndex = (index + images.length) % images.length;
    lightboxImg.src = images[lightboxIndex];
    lightboxCounter.textContent = `${lightboxIndex + 1} / ${images.length}`;
  }

  // Click en slide abre lightbox en esa imagen
  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => openLightbox(i));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => lightboxGoTo(lightboxIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => lightboxGoTo(lightboxIndex + 1));

  // Cerrar con click fuera o ESC
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxGoTo(lightboxIndex - 1);
    if (e.key === 'ArrowRight') lightboxGoTo(lightboxIndex + 1);
  });

  // Swipe en lightbox
  let lbStartX = 0;
  lightbox.addEventListener('touchstart', e => lbStartX = e.touches[0].clientX);
  lightbox.addEventListener('touchend', e => {
    const diff = lbStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) lightboxGoTo(lightboxIndex + (diff > 0 ? 1 : -1));
  });
}