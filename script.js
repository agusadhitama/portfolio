/* =========================================
   AGUS SATRIA ADHITAMA — PORTFOLIO JS
   ========================================= */

/* ── Particle Canvas Background ── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], nodes = [], connectionDist = 120;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r  = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  const COUNT = Math.min(80, Math.floor(W * H / 18000));
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < connectionDist) {
          const alpha = (1 - dist / connectionDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    // subtle grid lines
    ctx.strokeStyle = 'rgba(30, 45, 61, 0.3)';
    ctx.lineWidth = 0.5;
    const gridSize = 80;
    for (let x = 0; x < W; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ── Typing Effect ── */
(function initTyping() {
  const lines = [
    'whoami',
    'IT Support Specialist',
    'cat skills.txt | grep CCNA',
    'ping -c4 new-star-cineplex.id',
    'git push origin main'
  ];
  const el = document.getElementById('typed-text');
  if (!el) return;

  let lineIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = lines[lineIdx];
    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        setTimeout(() => { deleting = true; tick(); }, 2000);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        lineIdx = (lineIdx + 1) % lines.length;
      }
    }
    tick();
  }

  function tick() {
    const speed = deleting ? 40 : 80;
    setTimeout(type, speed);
  }
  setTimeout(tick, 1200);
})();

/* ── JSON About Animation ── */
(function initJsonAbout() {
  const el = document.getElementById('json-about');
  if (!el) return;
  const data = {
    name:     '"Agus Satria Adhitama"',
    role:     '"IT Support Specialist"',
    location: '"Bojonegoro, Jawa Timur"',
    degree:   '"S.Kom – Informatika"',
    gpa:      '3.59',
    ccna:     'true',
    branches: '36',
    email:    '"agusadhitama95@gmail.com"',
    github:   '"github.com/agusadhitama"',
  };

  const colors = {
    key:    '#79c0ff',
    str:    '#a5d6ff',
    num:    '#ffa657',
    bool:   '#ff7b72',
    brace:  '#c9d8e8',
  };

  function buildJson() {
    let html = `<span style="color:${colors.brace}">{</span>\n`;
    const entries = Object.entries(data);
    entries.forEach(([k, v], i) => {
      const isStr  = v.startsWith('"');
      const isNum  = !isStr && !isNaN(parseFloat(v));
      const isBool = v === 'true' || v === 'false';
      let valColor = isStr ? colors.str : isNum ? colors.num : colors.bool;
      const comma = i < entries.length - 1 ? ',' : '';
      html += `  <span style="color:${colors.key}">"${k}"</span>: <span style="color:${valColor}">${v}</span>${comma}\n`;
    });
    html += `<span style="color:${colors.brace}">}</span>`;
    return html;
  }

  // Reveal character by character
  const full = buildJson();
  const stripped = el.textContent; // empty
  el.innerHTML = '';
  let idx = 0;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      observer.disconnect();
      function revealChar() {
        if (idx < full.length) {
          el.innerHTML = full.slice(0, idx + 1) + '▌';
          idx++;
          setTimeout(revealChar, 8);
        } else {
          el.innerHTML = full;
        }
      }
      revealChar();
    }
  }, { threshold: 0.3 });
  observer.observe(el);
})();

/* ── Counter Animations ── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      let current = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + (el.dataset.suffix || '+');
        if (current >= target) clearInterval(timer);
      }, 30);
      observer.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => observer.observe(c));
})();

/* ── Skill Bar Animations ── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.bar-fill');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      bar.style.width = bar.dataset.w + '%';
      observer.unobserve(bar);
    });
  }, { threshold: 0.3 });
  bars.forEach(b => observer.observe(b));
})();

/* ── Timeline Reveal ── */
(function initTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(item => observer.observe(item));
})();

/* ── General Fade-In for sections ── */
(function initFadeIn() {
  // Wrap children of sections in fade-in
  const targets = document.querySelectorAll(
    '.about-grid, .cert-edu-grid, .contact-wrapper, .skills-grid'
  );
  targets.forEach(el => {
    el.classList.add('fade-in');
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
})();

/* ── Navbar scroll style ── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.style.background = 'rgba(8,12,16,0.97)';
    } else {
      nav.style.background = 'rgba(8,12,16,0.85)';
    }
  });

  // Hamburger toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }
})();

/* ── Active nav link on scroll ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.style.color = '');
        const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (active) active.style.color = 'var(--accent)';
      }
    });
  }, { threshold: 0.4, rootMargin: '-60px 0px -40% 0px' });
  sections.forEach(s => observer.observe(s));
})();

/* ── Glitch on hover (hero names) ── */
(function initGlitchHover() {
  document.querySelectorAll('.glitch').forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.animation = 'none';
      el.style.textShadow = '2px 0 var(--accent), -2px 0 var(--accent3)';
      setTimeout(() => {
        el.style.textShadow = '';
      }, 300);
    });
  });
})();

/* ── Custom cursor dot ── */
(function initCursor() {
  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed; width: 8px; height: 8px;
    background: var(--accent); border-radius: 50%;
    pointer-events: none; z-index: 9999;
    transform: translate(-50%, -50%);
    transition: transform 0.1s, opacity 0.2s;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(dot);

  const ring = document.createElement('div');
  ring.style.cssText = `
    position: fixed; width: 28px; height: 28px;
    border: 1px solid rgba(0,229,255,0.4); border-radius: 50%;
    pointer-events: none; z-index: 9998;
    transform: translate(-50%, -50%);
    transition: transform 0.18s ease, left 0.12s ease, top 0.12s ease;
  `;
  document.body.appendChild(ring);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    ring.style.left = mx + 'px';
    ring.style.top  = my + 'px';
  });

  document.querySelectorAll('a, button, .hex-item, .tools-bubbles span').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform  = 'translate(-50%, -50%) scale(2)';
      ring.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform  = 'translate(-50%, -50%) scale(1)';
      ring.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
})();