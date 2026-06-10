// =============================================
//   SUMITA ARORA PDF PAGE — INTERACTIONS
// =============================================

// ----- Floating emoji particles -----
const EMOJIS = ['📚', '😭', '💀', '🔥', '✍️', '🧠', '💯', '🫡', '😤', '📖', '⚡', '🎯'];

function spawnParticle() {
  const container = document.getElementById('particles');
  if (!container) return;

  const p = document.createElement('div');
  p.className = 'particle';
  p.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  p.style.left = `${Math.random() * 100}vw`;
  p.style.fontSize = `${0.8 + Math.random() * 1.5}rem`;
  p.style.animationDuration = `${6 + Math.random() * 10}s`;
  p.style.animationDelay = `${Math.random() * 3}s`;
  p.style.opacity = (0.3 + Math.random() * 0.5).toString();
  container.appendChild(p);

  // Remove after animation
  setTimeout(() => p.remove(), 18000);
}

// Spawn particles periodically
for (let i = 0; i < 12; i++) {
  setTimeout(spawnParticle, i * 400);
}
setInterval(spawnParticle, 1500);


// ----- Confetti on download -----
const CONFETTI_COLORS = [
  '#7c3aed', '#ec4899', '#f97316', '#fbbf24',
  '#06b6d4', '#10b981', '#a78bfa', '#f472b6'
];

function launchConfetti() {
  const container = document.getElementById('confettiContainer');
  if (!container) return;

  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      piece.style.width = `${6 + Math.random() * 10}px`;
      piece.style.height = `${6 + Math.random() * 10}px`;
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.animationDuration = `${2 + Math.random() * 3}s`;
      container.appendChild(piece);
      setTimeout(() => piece.remove(), 5000);
    }, i * 25);
  }
}

// Attach to all download buttons
document.querySelectorAll('.download-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    launchConfetti();
    // Change button text briefly
    const mainText = btn.querySelector('.btn-main');
    if (mainText) {
      const original = mainText.textContent;
      mainText.textContent = 'DOWNLOADING... 🎉';
      setTimeout(() => { mainText.textContent = original; }, 3000);
    }
  });
});


// ----- Scroll reveal animation -----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fact-card, .cta-box, .stats-row, .meme-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});


// ----- Easter egg: Konami code -----
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === KONAMI[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === KONAMI.length) {
      konamiIdx = 0;
      // MEGA confetti
      for (let i = 0; i < 5; i++) setTimeout(launchConfetti, i * 300);
      alert('🔥 KONAMI CODE ACTIVATED! You\'re ready for boards! 💀');
    }
  } else {
    konamiIdx = 0;
  }
});


// ----- Random title wobble on hover -----
const titleMain = document.querySelector('.title-main');
if (titleMain) {
  titleMain.addEventListener('mouseenter', () => {
    titleMain.style.transform = `rotate(${(Math.random() - 0.5) * 4}deg) scale(1.02)`;
    titleMain.style.transition = 'transform 0.2s ease';
  });
  titleMain.addEventListener('mouseleave', () => {
    titleMain.style.transform = 'rotate(0deg) scale(1)';
  });
}

// ----- Console message for devs -----
console.log(`
%c📚 SUMITA ARORA IP XII PDF 📚
%cyou opened devtools?? go study lmao 💀
%cgoodluck on boards tho fr 🫶
`, 
'color: #7c3aed; font-size: 1.2rem; font-weight: bold;',
'color: #ec4899; font-size: 1rem;',
'color: #06b6d4; font-size: 0.9rem;'
);
