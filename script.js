// ============================================
//   SUMITA ARORA — SHARP MINIMAL INTERACTIONS
// ============================================

// ----- Custom cursor -----
const cursor = document.getElementById('cursor');
let mx = 0, my = 0;
let cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

function animateCursor() {
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  if (cursor) {
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Expand cursor on interactive elements
document.querySelectorAll('a, button, .chapter-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor?.classList.add('expanded'));
  el.addEventListener('mouseleave', () => cursor?.classList.remove('expanded'));
});


// ----- Particle grid canvas background -----
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Dot grid
const COLS = 28;
const ROWS = 18;

class Dot {
  constructor(x, y) {
    this.ox = x;
    this.oy = y;
    this.x  = x;
    this.y  = y;
    this.r  = 1;
    this.alpha = 0.15 + Math.random() * 0.2;
    this.speed = 0.3 + Math.random() * 0.5;
    this.offset = Math.random() * Math.PI * 2;
    this.pulseAmt = 0;
  }
  update(t, mouseX, mouseY) {
    // Gentle breathing
    this.alpha = 0.1 + 0.12 * Math.sin(t * this.speed + this.offset);
    // Mouse repulsion
    const dx = mouseX - this.ox;
    const dy = mouseY - this.oy;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const maxDist = 140;
    if (dist < maxDist) {
      const force = (maxDist - dist) / maxDist;
      this.x = this.ox - dx / dist * force * 30;
      this.y = this.oy - dy / dist * force * 30;
      this.alpha = 0.5 + 0.5 * force;
      this.r = 1 + force * 2.5;
    } else {
      this.x += (this.ox - this.x) * 0.08;
      this.y += (this.oy - this.y) * 0.08;
      this.r += (1 - this.r) * 0.1;
    }
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 255, 0, ${this.alpha})`;
    ctx.fill();
  }
}

let dots = [];

function buildDots() {
  dots = [];
  const W = canvas.width;
  const H = canvas.height;
  const gapX = W / (COLS - 1);
  const gapY = H / (ROWS - 1);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      dots.push(new Dot(c * gapX, r * gapY));
    }
  }
}

buildDots();
window.addEventListener('resize', buildDots);

let mouseX = -999, mouseY = -999;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

let t = 0;
function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  t += 0.015;
  dots.forEach(d => {
    d.update(t, mouseX, mouseY);
    d.draw(ctx);
  });
  requestAnimationFrame(drawCanvas);
}
drawCanvas();


// ----- Scroll-triggered reveal for chapters -----
const cards = document.querySelectorAll('.chapter-card');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateX(0)';
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

cards.forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateX(-20px)';
  card.style.transition = `opacity 0.5s ${i * 0.07}s ease, transform 0.5s ${i * 0.07}s ease`;
  revealObs.observe(card);
});

// Reveal CTA too
const cta = document.querySelector('.cta-inner');
if (cta) {
  cta.style.opacity = '0';
  cta.style.transform = 'translateY(20px)';
  cta.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        cta.style.opacity = '1';
        cta.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.2 }).observe(cta);
}


// ----- Download flash effect -----
document.querySelectorAll('.download-btn, .cta-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // quick flash on the page
    document.body.style.transition = 'background 0.1s ease';
    document.body.style.background = '#0d1a00';
    setTimeout(() => { document.body.style.background = '#080808'; }, 200);
  });
});


// ----- Header border on scroll -----
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header.style.borderBottomColor = 'rgba(255,255,255,0.12)';
  } else {
    header.style.borderBottomColor = 'rgba(255,255,255,0.07)';
  }
});
