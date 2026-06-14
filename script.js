/* ============================================================
   NASIR KHAN — PORTFOLIO JS
   Modules: Canvas Mesh · Typed Text · Scroll Reveal ·
            Navbar Shrink · Smooth Scroll · Magnetic Btns
   ============================================================ */

/* ─── 1. HERO CANVAS — Animated Particle Mesh ─────────────── */
(function initCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles, animId;
    const COUNT = 70;
    const MAX_DIST = 140;
    const COLOR = '77, 163, 255';

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    function Particle() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.r  = Math.random() * 2 + 1;
    }

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
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${COLOR}, ${(1 - dist / MAX_DIST) * 0.25})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        animId = requestAnimationFrame(draw);
    }

    init();
    draw();

    const ro = new ResizeObserver(() => { resize(); });
    ro.observe(canvas.parentElement);
})();

/* ─── 2. TYPED TEXT EFFECT ────────────────────────────────── */
(function initTyped() {
    const el = document.getElementById('typed-word');
    if (!el) return;

    const words = ['convert.', 'impress.', 'grow.', 'stand out.'];
    let wordIdx = 0, charIdx = 0, deleting = false;
    const PAUSE = 2000, TYPE_SPEED = 90, DEL_SPEED = 50;

    function tick() {
        const word = words[wordIdx];

        if (!deleting) {
            el.textContent = word.slice(0, ++charIdx);
            if (charIdx === word.length) {
                deleting = true;
                setTimeout(tick, PAUSE);
                return;
            }
        } else {
            el.textContent = word.slice(0, --charIdx);
            if (charIdx === 0) {
                deleting = false;
                wordIdx = (wordIdx + 1) % words.length;
            }
        }

        setTimeout(tick, deleting ? DEL_SPEED : TYPE_SPEED);
    }

    // Add blinking cursor via a pseudo approach using JS
    el.style.borderRight = '3px solid #4da3ff';
    el.style.paddingRight = '4px';
    setInterval(() => {
        el.style.borderRightColor = el.style.borderRightColor === 'transparent'
            ? '#4da3ff' : 'transparent';
    }, 530);

    setTimeout(tick, 800);
})();

/* ─── 3. SCROLL REVEAL (Intersection Observer) ────────────── */
(function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    els.forEach(el => observer.observe(el));
})();

/* ─── 4. NAVBAR SHRINK ON SCROLL ──────────────────────────── */
(function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;

    const onScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ─── 5. SMOOTH SCROLL (anchor links) ────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 72; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ─── 6. MAGNETIC BUTTON EFFECT ───────────────────────────── */
(function initMagnetic() {
    const btns = document.querySelectorAll('.magnetic');

    btns.forEach(btn => {
        btn.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) * 0.25;
            const dy = (e.clientY - cy) * 0.25;
            this.style.transform = `translate(${dx}px, ${dy}px)`;
        });

        btn.addEventListener('mouseleave', function () {
            this.style.transform = '';
            this.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
        });

        btn.addEventListener('mouseenter', function () {
            this.style.transition = 'transform 0.1s linear';
        });
    });
})();
