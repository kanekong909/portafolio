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


// ─── Carousel ───
const track = document.getElementById('carouselTrack');
if (track) {
  const slides = track.querySelectorAll('.carousel-slide');
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

  // Swipe en móvil
  let startX = 0;
  track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
  });

  // Auto-play
  setInterval(() => goTo(current + 1), 5000);
}