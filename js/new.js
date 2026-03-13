/**
 * --------------------------------------------------------------------------
 * Portfolio Page Script
 * --------------------------------------------------------------------------
 */
gsap.registerPlugin(ScrollTrigger);

/* ── 커서 ─────────────────────────────────────────────────────────── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let rx = 0, ry = 0, mx = window.innerWidth / 2, my = window.innerHeight / 2;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function tick() {
    rx += (mx - rx) * .13;
    ry += (my - ry) * .13;
    dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(tick);
})();

document.querySelectorAll('a, button, .tag').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('expand'));
    el.addEventListener('mouseleave', () => ring.classList.remove('expand'));
});

/* ── NAV 높이 ── */
function setNavH() {
    const h = document.getElementById('main-nav').getBoundingClientRect().height;
    document.documentElement.style.setProperty('--nav-h', h + 'px');
}
setNavH();
window.addEventListener('resize', setNavH);

/* ── NAV 스크롤 ── */
window.addEventListener('scroll', () => {
    document.getElementById('main-nav').classList.toggle('scrolled', scrollY > 40);
}, { passive: true });

/* ── 햄버거 메뉴 ── */
const toggle = document.getElementById('nav-toggle');
const drawer = document.getElementById('nav-drawer');

toggle.addEventListener('click', () => {
    const o = drawer.classList.toggle('open');
    toggle.classList.toggle('open', o);
    toggle.setAttribute('aria-expanded', o);
    document.body.style.overflow = o ? 'hidden' : '';
});

function closeNav() {
    drawer.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

/* ── GSAP 타임라인 ── */
document.fonts.ready.then(() => {

    const heroName = document.querySelector('.hero-name');
    if (heroName) heroName.style.visibility = 'visible';

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl
        /* nav */
        .to('.nav-logo',     { visibility: 'visible', opacity: 1, duration: .4 }, .1)
        .to('.nav-links a, .nav-toggle', { visibility: 'visible', opacity: 1, stagger: .07, duration: .4 }, .25)

        /* Web Publisher 라벨 */
        .to('.name-role-line', { width: 22, duration: .5, ease: 'power2.inOut' }, .15)
        .to('.name-role',      { opacity: 1, duration: .45 }, .2)

        /* 이름 글자 슬라이드업 */
        .set('.char', { yPercent: 120 })
        .to('.name-row:nth-child(1) .char', {
            yPercent: 0, stagger: { each: .06, from: 'start' }, duration: .8, ease: 'power4.out'
        }, .35)
        .to('.name-row:nth-child(2) .char', {
            yPercent: 0, stagger: { each: .08, from: 'start' }, duration: .8, ease: 'power4.out'
        }, .56)

        /* 오른쪽 패널 */
        .to('#hero-right', { x: 0, opacity: 1, duration: .75, ease: 'power2.out' }, .55)
        .from('.info-block',    { y: 16, opacity: 0, stagger: .13, duration: .5 }, .7)
        .from('.info-cta .btn', { y: 10, opacity: 0, stagger: .09, duration: .4 }, 1.0)
        .from('.tag',           { scale: .9, opacity: 0, stagger: .05, duration: .35, ease: 'back.out(1.5)' }, .85)

        /* 하단 바 */
        .to('.hero-bottombar',   { opacity: 1, duration: .4 }, 1.1)
        .from('.hero-bottombar', { y: 10 }, 1.1);
});

/* ── 숫자 카운트업 ── */
setTimeout(() => {
    document.querySelectorAll('.count-num').forEach(el => {
        const t = +el.dataset.target;
        gsap.to({ v: 0 }, {
            v: t, duration: 1.6, ease: 'power2.out',
            onUpdate() { el.textContent = Math.round(this.targets()[0].v); }
        });
    });
}, 1100);

/* ── 워터마크 패럴랙스 ── */
const wm1    = document.getElementById('wm-line1');
const wm2    = document.getElementById('wm-line2');
const heroEl = document.getElementById('hero-section');

if (wm1 && wm2 && heroEl) {
    gsap.to(wm1, {
        y: -120, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: 1.2 }
    });
    gsap.to(wm2, {
        y: -80, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: 1.8 }
    });

    /* 마우스 패럴랙스 */
    heroEl.addEventListener('mousemove', e => {
        const r  = heroEl.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width  - .5;
        const cy = (e.clientY - r.top)  / r.height - .5;
        gsap.to('#hero-name-wrap', { x: cx * -12, y: cy * -8, duration: .9, ease: 'power2.out', overwrite: 'auto' });
        gsap.to(wm1, { x: cx * 22,  y: cy * 12, duration: 1.4, ease: 'power2.out', overwrite: 'auto' });
        gsap.to(wm2, { x: cx * -18, y: cy * 10, duration: 1.8, ease: 'power2.out', overwrite: 'auto' });
    });
    heroEl.addEventListener('mouseleave', () => {
        gsap.to('#hero-name-wrap',  { x: 0, y: 0, duration: 1.2, ease: 'power2.out', overwrite: 'auto' });
        gsap.to([wm1, wm2], { x: 0, y: 0, duration: 1.8, ease: 'power2.out', overwrite: 'auto' });
    });
}

/* ── 스크롤 패럴랙스 ── */
gsap.to('#hero-name-wrap', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
    y: -50, ease: 'none'
});

/* ── About 스크롤 인 ── */
gsap.from('.about-header', {
    scrollTrigger: { trigger: '.about-header', start: 'top 82%', once: true },
    opacity: 0, y: 28, duration: .7
});
gsap.from('.about-text', {
    scrollTrigger: { trigger: '.about-text', start: 'top 82%', once: true },
    opacity: 0, y: 20, duration: .6
});
gsap.utils.toArray('.skill-row').forEach((row, i) => {
    gsap.from(row, {
        scrollTrigger: { trigger: row, start: 'top 88%', once: true },
        opacity: 0, x: -14, duration: .5, delay: i * .05
    });
});

/* ── 타이핑 ── */
const phrases = [
    'HTML · SCSS · JavaScript',
    'Responsive & Adaptive Web',
    'Web Accessibility (KWCAG)',
    'React · Vue Environment',
    'Component-driven Markup',
];
let pi = 0, ci = 0, del = false;
const typedEl = document.getElementById('typed-text');

function type() {
    const cur = phrases[pi];
    if (!del) {
        typedEl.textContent = cur.slice(0, ++ci);
        if (ci === cur.length) { del = true; setTimeout(type, 2200); return; }
    } else {
        typedEl.textContent = cur.slice(0, --ci);
        if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(type, del ? 32 : 62);
}
setTimeout(type, 1800);

/* ── Career 기여도 바 ── */
gsap.utils.toArray('.pj-bar-fill').forEach(bar => {
    ScrollTrigger.create({
        trigger: bar,
        start: 'top 90%',
        once: true,
        onEnter: () => { bar.style.width = bar.dataset.pct + '%'; }
    });
});

/* ── 더 보기 토글 ── */
document.querySelectorAll('.pj-desc-wrap').forEach(wrap => {
    const p = wrap.querySelector('.pj-desc-short');
    if (!p) return;

    let btn = wrap.querySelector('.pj-more-btn');
    if (!btn) {
        btn = document.createElement('button');
        btn.className = 'pj-more-btn';
        btn.innerHTML = '<span class="arrow">▾</span> 더 보기';
        wrap.appendChild(btn);
    }

    function checkOverflow() {
        const isExpanded = p.classList.contains('expanded');
        p.style.maxHeight = 'none';
        const full = p.scrollHeight;
        p.style.maxHeight = '';
        const overflows = full > p.clientHeight + 2;
        btn.style.display = (overflows || isExpanded) ? '' : 'none';
    }

    document.fonts.ready.then(checkOverflow);
    window.addEventListener('resize', checkOverflow);

    btn.addEventListener('click', () => {
        const isOpen = p.classList.toggle('expanded');
        btn.classList.toggle('open', isOpen);
        btn.innerHTML = isOpen
            ? '<span class="arrow">▾</span> 접기'
            : '<span class="arrow">▾</span> 더 보기';
        if (!isOpen) checkOverflow();
    });
});

/* ── Career 카드 스크롤 인 ── */
gsap.utils.toArray('.career-section').forEach(sec => {
    const yearNum = sec.querySelector('.career-year-num');
    if (yearNum) {
        gsap.from(yearNum, {
            scrollTrigger: { trigger: sec, start: 'top 80%', once: true },
            opacity: 0, x: -20, duration: .65, ease: 'power2.out'
        });
    }
    gsap.utils.toArray(sec.querySelectorAll('.pj-card')).forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 92%', once: true },
            opacity: 0, y: 18, duration: .5, delay: i * .06, ease: 'power2.out'
        });
    });
});

/* ── 라이트박스 ── */
(function () {
    const overlay = document.createElement('div');
    overlay.className = 'lb-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', '이미지 미리보기');
    overlay.innerHTML = `
    <button class="lb-close" id="lb-close" aria-label="닫기">✕</button>
    <button class="lb-arrow" id="lb-prev" aria-label="이전">&#8592;</button>
    <div class="lb-img-wrap">
        <img id="lb-img" src="" alt="">
    </div>
    <button class="lb-arrow" id="lb-next" aria-label="다음">&#8594;</button>
    <div class="lb-counter" id="lb-counter"></div>`;
    document.body.appendChild(overlay);

    const lbImg     = document.getElementById('lb-img');
    const lbPrev    = document.getElementById('lb-prev');
    const lbNext    = document.getElementById('lb-next');
    const lbCounter = document.getElementById('lb-counter');

    let images = [], cur = 0;

    function updateUI() {
        lbImg.src = images[cur].src;
        lbImg.alt = images[cur].alt || '';
        const multi = images.length > 1;
        lbPrev.classList.toggle('hidden', !multi || cur === 0);
        lbNext.classList.toggle('hidden', !multi || cur === images.length - 1);
        lbCounter.classList.toggle('hidden', !multi);
        if (multi) lbCounter.textContent = (cur + 1) + ' / ' + images.length;
    }

    function open(imgs, startIdx) {
        images = imgs;
        cur = startIdx || 0;
        updateUI();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        lbImg.src = '';
    }

    function prev() { if (cur > 0) { cur--; updateUI(); } }
    function next() { if (cur < images.length - 1) { cur++; updateUI(); } }

    /* 라이트박스 오픈 */
    document.querySelectorAll('.pj-thumb.has-lb').forEach(thumb => {
        const mainImg = thumb.querySelector('img');
        if (!mainImg) return;

        const extra = (thumb.dataset.images || '').split(',').filter(Boolean);
        const imgs  = [{ src: mainImg.src, alt: mainImg.alt }]
            .concat(extra.map(s => ({ src: s.trim(), alt: '' })));

        thumb.addEventListener('click', () => open(imgs, 0));
    });

    document.getElementById('lb-close').addEventListener('click', e => { e.stopPropagation(); close(); });
    lbPrev.addEventListener('click', e => { e.stopPropagation(); prev(); });
    lbNext.addEventListener('click', e => { e.stopPropagation(); next(); });
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    document.addEventListener('keydown', e => {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape')      close();
        if (e.key === 'ArrowLeft')   prev();
        if (e.key === 'ArrowRight')  next();
    });
})();