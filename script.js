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


// ----- Firecracker spark burst on download click -----
const SPARK_COLORS = ['#c8ff00', '#ffffff', '#a3e635', '#d9ff66', '#f0ffa0'];

class Spark {
  constructor(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2.5 + Math.random() * 5;
    this.x  = x;
    this.y  = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - (1 + Math.random() * 2); // slight upward bias
    this.life = 1;
    this.decay = 0.022 + Math.random() * 0.022;
    this.len = 4 + Math.random() * 10;
    this.color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
    this.gravity = 0.12;
  }
  update() {
    this.x  += this.vx;
    this.y  += this.vy;
    this.vy += this.gravity;
    this.vx *= 0.97;
    this.life -= this.decay;
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.vx * this.len * 0.4, this.y - this.vy * this.len * 0.4);
    ctx.stroke();
    ctx.restore();
  }
}

// Dedicated overlay canvas for sparks (on top of everything)
const sparkCanvas = document.createElement('canvas');
sparkCanvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:8000;';
document.body.appendChild(sparkCanvas);
const sCtx = sparkCanvas.getContext('2d');

function resizeSpark() {
  sparkCanvas.width  = window.innerWidth;
  sparkCanvas.height = window.innerHeight;
}
resizeSpark();
window.addEventListener('resize', resizeSpark);

let sparks = [];
let sparkRaf = null;

function runSparks() {
  sCtx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);
  sparks = sparks.filter(s => s.life > 0);
  sparks.forEach(s => { s.update(); s.draw(sCtx); });
  if (sparks.length > 0) {
    sparkRaf = requestAnimationFrame(runSparks);
  } else {
    sparkRaf = null;
    sCtx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);
  }
}

function burst(x, y, count = 38) {
  for (let i = 0; i < count; i++) sparks.push(new Spark(x, y));
  if (!sparkRaf) runSparks();
}

document.querySelectorAll('.download-btn, .cta-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    // Burst from click point
    burst(e.clientX, e.clientY, 42);
    // Also burst from center of button after tiny delay for double-pop feel
    const r = btn.getBoundingClientRect();
    setTimeout(() => burst(r.left + r.width / 2, r.top + r.height / 2, 28), 80);
    // Subtle background flash
    document.body.style.transition = 'background 0.08s ease';
    document.body.style.background = '#0d1a00';
    setTimeout(() => { document.body.style.background = '#080808'; }, 160);
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
