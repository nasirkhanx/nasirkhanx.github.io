/* ============================================================
   NASIR KHAN — PORTFOLIO JS
   Premium redesign — clean, modular, performant
   ============================================================ */

/* ─── 1. CURSOR GLOW ─────────────────────────────────────── */
(function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow || window.matchMedia('(pointer: coarse)').matches) {
        if (glow) glow.style.display = 'none';
        return;
    }
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    document.addEventListener('mousemove', (e) => {
        cx = e.clientX; cy = e.clientY;
        glow.style.left = cx + 'px';
        glow.style.top  = cy + 'px';
    }, { passive: true });
})();

/* ─── 2. HERO CANVAS — Particle Mesh ─────────────────────── */
(function initCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const COLOR = '99,102,241';
    const COUNT = 55;
    const MAX_DIST = 130;
    let W, H, particles, raf;

    function resize() {
        const parent = canvas.parentElement;
        W = canvas.width  = parent.offsetWidth;
        H = canvas.height = parent.offsetHeight;
    }

    function Particle() { this.reset(); }
    Particle.prototype.reset = function() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.r  = Math.random() * 1.6 + 0.6;
    };
    Particle.prototype.update = function() {
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

        // Draw particles
        particles.forEach(p => {
            p.update();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${COLOR},0.65)`;
            ctx.fill();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d  = Math.sqrt(dx * dx + dy * dy);
                if (d < MAX_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${COLOR},${(1 - d / MAX_DIST) * 0.18})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        raf = requestAnimationFrame(draw);
    }

    // Pause when hidden (performance)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(raf);
        else draw();
    });

    init();
    draw();
    window.addEventListener('resize', resize, { passive: true });
})();

/* ─── 3. TYPED TEXT ─────────────────────────────────────── */
(function initTyped() {
    const el = document.getElementById('typed-word');
    if (!el) return;

    const words = ['convert.', 'impress.', 'grow.', 'stand out.', 'perform.'];
    let wordIdx = 0, charIdx = 0, deleting = false;
    const PAUSE = 2200, TYPE_MS = 85, DEL_MS = 45;

    // Cursor blink via CSS animation added inline
    el.style.animation = 'cursor-blink 1.1s step-end infinite';
    const style = document.createElement('style');
    style.textContent = `@keyframes cursor-blink { 0%,100%{border-right-color:#6366f1} 50%{border-right-color:transparent} }`;
    document.head.appendChild(style);

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
    setTimeout(tick, 1000);
})();

/* ─── 4. HERO ENTRANCE ANIMATIONS ───────────────────────── */
(function initHeroReveal() {
    const heroEls = document.querySelectorAll('.reveal-hero, .reveal-hero-right');
    if (!heroEls.length) return;

    // Trigger shortly after page loads
    requestAnimationFrame(() => {
        setTimeout(() => {
            heroEls.forEach(el => el.classList.add('visible'));
        }, 50);
    });
})();

/* ─── 5. SCROLL REVEAL ───────────────────────────────────── */
(function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    // Mark as hidden before observing
    els.forEach(el => el.classList.add('hidden'));

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('hidden');
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    els.forEach(el => io.observe(el));
})();

/* ─── 6. SKILL BAR ANIMATION ─────────────────────────────── */
(function initSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');
    if (!fills.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const pct = entry.target.dataset.pct;
                entry.target.style.width = pct + '%';
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    fills.forEach(fill => io.observe(fill));
})();

/* ─── 7. COUNTER ANIMATION ───────────────────────────────── */
(function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el     = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const dur    = 1400;
            const start  = performance.now();
            function step(now) {
                const prog = Math.min((now - start) / dur, 1);
                // ease-out
                const val  = Math.round(prog * target);
                el.textContent = val + '+';
                if (prog < 1) requestAnimationFrame(step);
                else el.textContent = target + '+';
            }
            requestAnimationFrame(step);
            io.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => io.observe(c));
})();

/* ─── 8. NAVBAR — Scroll shrink + Active link ───────────── */
(function initNavbar() {
    const nav    = document.getElementById('navbar');
    const links  = document.querySelectorAll('.nav-link');
    if (!nav) return;

    // Shrink on scroll
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // Active section highlight using IntersectionObserver
    const sections = document.querySelectorAll('section[id]');
    const secIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { threshold: 0.35 });
    sections.forEach(sec => secIO.observe(sec));
})();

/* ─── 9. HAMBURGER MENU ─────────────────────────────────── */
(function initHamburger() {
    const btn     = document.getElementById('hamburger');
    const overlay = document.getElementById('nav-overlay');
    if (!btn || !overlay) return;

    // Clone nav links into overlay
    const navLinks = document.querySelectorAll('.nav-links .nav-link');
    navLinks.forEach(link => {
        const clone = link.cloneNode(true);
        clone.addEventListener('click', close);
        overlay.appendChild(clone);
    });

    function open() {
        btn.classList.add('open');
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        btn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        btn.classList.remove('open');
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    btn.addEventListener('click', () => {
        btn.classList.contains('open') ? close() : open();
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });
})();

/* ─── 10. SMOOTH SCROLL ─────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ─── 11. MAGNETIC BUTTONS ───────────────────────────────── */
(function initMagnetic() {
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const r  = this.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width  / 2) * 0.2;
            const dy = (e.clientY - r.top  - r.height / 2) * 0.2;
            this.style.transition = 'transform 0.08s linear';
            this.style.transform  = `translate(${dx}px,${dy}px)`;
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
            this.style.transform  = '';
        });
    });
})();

/* ─── 12. BACK TO TOP ────────────────────────────────────── */
(function initBackTop() {
    const btn = document.getElementById('back-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

/* ─── 13. CONTACT FORM VALIDATION ────────────────────────── */
(function initForm() {
    const sendBtn = document.getElementById('send-btn');
    if (!sendBtn) return;

    const nameEl  = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const msgEl   = document.getElementById('message');
    const nameErr = document.getElementById('name-err');
    const emailErr= document.getElementById('email-err');
    const msgErr  = document.getElementById('msg-err');
    const success = document.getElementById('form-success');

    function isEmail(str) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());
    }

    function showErr(el, msg) { el.textContent = msg; }
    function clearErr(el)     { el.textContent = ''; }

    // Live clearing
    [nameEl, emailEl, msgEl].forEach((inp, i) => {
        const errs = [nameErr, emailErr, msgErr];
        inp.addEventListener('input', () => clearErr(errs[i]));
    });

    sendBtn.addEventListener('click', () => {
        let valid = true;

        if (!nameEl.value.trim()) {
            showErr(nameErr, 'Please enter your name.'); valid = false;
        } else clearErr(nameErr);

        if (!isEmail(emailEl.value)) {
            showErr(emailErr, 'Please enter a valid email.'); valid = false;
        } else clearErr(emailErr);

        if (!msgEl.value.trim() || msgEl.value.trim().length < 10) {
            showErr(msgErr, 'Message must be at least 10 characters.'); valid = false;
        } else clearErr(msgErr);

        if (!valid) return;

        // Simulate success (replace with actual fetch to backend/formspree)
        sendBtn.disabled = true;
        sendBtn.querySelector('span').textContent = 'Sending…';

        setTimeout(() => {
            success.style.display = 'flex';
            sendBtn.querySelector('span').textContent = 'Sent!';
            nameEl.value = emailEl.value = msgEl.value = '';
            setTimeout(() => {
                success.style.display = 'none';
                sendBtn.disabled = false;
                sendBtn.querySelector('span').textContent = 'Send Message';
            }, 4000);
        }, 900);
    });
})();

/* ─── 14. PROJECT CARD STAGGER ───────────────────────────── */
(function initProjectStagger() {
    const cards = document.querySelectorAll('.project-card.reveal');
    cards.forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.1}s`;
    });
})();
