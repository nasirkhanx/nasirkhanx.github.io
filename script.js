/* ============================================================
   NASIR KHAN — PORTFOLIO JS  (fixed build)
   ============================================================ */

/* ─── 1. HERO CANVAS — Particle Mesh ─────────────────────── */
(function initCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const COLOR = '77, 163, 255';
    const COUNT = 65;
    const MAX_DIST = 140;
    let W, H, particles;

    function resize() {
        const section = canvas.parentElement;
        W = canvas.width  = section.offsetWidth;
        H = canvas.height = section.offsetHeight;
    }

    function Particle() {
        this.reset();
    }
    Particle.prototype.reset = function () {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.r  = Math.random() * 1.8 + 0.8;
    };
    Particle.prototype.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
    };

    function init() {
        resize();
        particles = Array.from({ length: COUNT }, () => new Particle());
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.update();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${COLOR}, 0.7)`;
            ctx.fill();
        });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d  = Math.sqrt(dx * dx + dy * dy);
                if (d < MAX_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${COLOR}, ${(1 - d / MAX_DIST) * 0.22})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener('resize', resize, { passive: true });
})();

/* ─── 2. TYPED TEXT EFFECT ────────────────────────────────── */
(function initTyped() {
    const el = document.getElementById('typed-word');
    if (!el) return;

    const words = ['convert.', 'impress.', 'grow.', 'stand out.'];
    let wordIdx = 0, charIdx = 0, deleting = false;
    const PAUSE = 2000, TYPE_MS = 90, DEL_MS = 50;

    // cursor blink
    setInterval(() => {
        el.style.borderRightColor =
            el.style.borderRightColor === 'transparent' ? '#4da3ff' : 'transparent';
    }, 530);

    function tick() {
        const word = words[wordIdx];
        if (!deleting) {
            charIdx++;
            el.textContent = word.slice(0, charIdx);
            if (charIdx === word.length) {
                deleting = true;
                return setTimeout(tick, PAUSE);
            }
        } else {
            charIdx--;
            el.textContent = word.slice(0, charIdx);
            if (charIdx === 0) {
                deleting = false;
                wordIdx = (wordIdx + 1) % words.length;
            }
        }
        setTimeout(tick, deleting ? DEL_MS : TYPE_MS);
    }

    el.style.cssText += 'border-right:3px solid #4da3ff;padding-right:4px;';
    setTimeout(tick, 900);
})();

/* ─── 3. SCROLL REVEAL — robust two-class approach ───────── */
(function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    // Hide elements BEFORE observing — only via JS, so CSS fallback stays visible
    els.forEach(el => el.classList.add('reveal-hidden'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('reveal-hidden');
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => observer.observe(el));
})();

/* ─── 4. NAVBAR SHRINK ON SCROLL ──────────────────────────── */
(function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
})();

/* ─── 5. SMOOTH SCROLL ────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ─── 6. MAGNETIC BUTTONS ─────────────────────────────────── */
(function initMagnetic() {
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', function (e) {
            const r  = this.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width  / 2) * 0.22;
            const dy = (e.clientY - r.top  - r.height / 2) * 0.22;
            this.style.transition = 'transform 0.08s linear';
            this.style.transform  = `translate(${dx}px,${dy}px)`;
        });
        btn.addEventListener('mouseleave', function () {
            this.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
            this.style.transform  = '';
        });
    });
})();
