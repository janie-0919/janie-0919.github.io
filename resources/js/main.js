(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!window.gsap || !window.ScrollTrigger || reduceMotion) return;

    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    gsap.from("[data-hero-line] > span", {
      yPercent: 120,
      duration: 1.1,
      ease: "back.out(1.4)",
      stagger: 0.12,
      delay: 0.1
    });

    gsap.from("[data-hero-fade]", {
      opacity: 0,
      y: 20,
      scale: 0.94,
      duration: 0.7,
      ease: "back.out(1.8)",
      stagger: 0.12,
      delay: 0.65
    });

    gsap.from("[data-float]", {
      scale: 0,
      rotation: 40,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
      stagger: 0.12,
      delay: 0.9
    });

    gsap.utils.toArray("[data-float]").forEach((el, index) => {
      gsap.to(el, {
        y: index % 2 === 0 ? 12 : -12,
        duration: 1.8 + index * 0.25,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    gsap.utils.toArray("[data-reveal]").forEach((el) => {
      gsap.from(el, {
        y: 44,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%"
        }
      });
    });

    gsap.utils.toArray("[data-why-card]").forEach((el, index) => {
      gsap.from(el, {
        y: 70,
        opacity: 0,
        rotation: index % 2 === 0 ? -7 : 7,
        duration: 0.85,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: el,
          start: "top 88%"
        }
      });
    });

    gsap.utils.toArray(".count-num").forEach((el) => {
      const target = parseInt(el.dataset.target, 10) || 0;
      const state = { value: 0 };
      gsap.to(state, {
        value: target,
        duration: 1.35,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%"
        },
        onUpdate: () => {
          el.textContent = Math.round(state.value);
        }
      });
    });

    gsap.utils.toArray("[data-obj]").forEach((el) => {
      const trigger = el.closest("section") || el.parentElement;
      if (!trigger) return;
      const speed = parseFloat(el.dataset.speed) || 0.5;
      const rot = parseFloat(el.dataset.rot) || 0;
      gsap.fromTo(el, {
        y: 160 * speed,
        rotation: -rot
      }, {
        y: -220 * speed,
        rotation: rot,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6
        }
      });
    });
  })();

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
    <div class="lb-zoom-controls" id="lb-zoom-controls">
        <button class="lb-zoom-btn" id="lb-zoom-out" aria-label="축소">−</button>
        <span class="lb-zoom-level" id="lb-zoom-level">100%</span>
        <button class="lb-zoom-btn" id="lb-zoom-in" aria-label="확대">＋</button>
    </div>
    <div class="lb-counter" id="lb-counter"></div>`;
    document.body.appendChild(overlay);

    const lbImg     = document.getElementById('lb-img');
    const lbPrev    = document.getElementById('lb-prev');
    const lbNext    = document.getElementById('lb-next');
    const lbCounter = document.getElementById('lb-counter');
    const lbZoomIn  = document.getElementById('lb-zoom-in');
    const lbZoomOut = document.getElementById('lb-zoom-out');
    const lbZoomLvl = document.getElementById('lb-zoom-level');
    const imgWrap   = overlay.querySelector('.lb-img-wrap');

    let images = [], cur = 0;

    /* ── 줌 상태 ── */
    let scale = 1, tx = 0, ty = 0;
    let isDragging = false, dragSX = 0, dragSY = 0, dragTx = 0, dragTy = 0;
    const MIN_SCALE = 1, MAX_SCALE = 4, STEP = 0.5;

    function applyTransform(animate) {
        lbImg.style.transition = animate ? 'transform .15s ease' : 'none';
        lbImg.style.transform  = `translate(${tx}px, ${ty}px) scale(${scale})`;
        lbZoomLvl.textContent  = Math.round(scale * 100) + '%';
        lbZoomOut.disabled     = scale <= MIN_SCALE;
        lbZoomIn.disabled      = scale >= MAX_SCALE;
        imgWrap.style.cursor   = scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default';
    }

    function resetZoom() { scale = 1; tx = 0; ty = 0; applyTransform(true); }

    function zoomTo(newScale, pivotX, pivotY) {
        const rect = imgWrap.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const px = (pivotX != null ? pivotX : cx) - cx;
        const py = (pivotY != null ? pivotY : cy) - cy;

        newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
        const ratio = newScale / scale;
        tx = px * (1 - ratio) + tx * ratio;
        ty = py * (1 - ratio) + ty * ratio;
        scale = newScale;
        if (scale === MIN_SCALE) { tx = 0; ty = 0; }
        applyTransform(true);
    }

    /* 줌 버튼 */
    lbZoomIn.addEventListener('click',  e => { e.stopPropagation(); zoomTo(scale + STEP); });
    lbZoomOut.addEventListener('click', e => { e.stopPropagation(); zoomTo(scale - STEP); });

    /* 마우스 휠 줌 */
    imgWrap.addEventListener('wheel', e => {
        e.preventDefault();
        zoomTo(scale + (e.deltaY < 0 ? STEP : -STEP), e.clientX, e.clientY);
    }, { passive: false });

    /* 더블클릭 줌 토글 */
    imgWrap.addEventListener('dblclick', e => {
        if (scale > 1) resetZoom();
        else zoomTo(2, e.clientX, e.clientY);
    });

    /* 드래그 패닝 */
    imgWrap.addEventListener('mousedown', e => {
        if (scale <= 1) return;
        isDragging = true;
        dragSX = e.clientX; dragSY = e.clientY;
        dragTx = tx;        dragTy = ty;
        imgWrap.style.cursor = 'grabbing';
        e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        tx = dragTx + (e.clientX - dragSX);
        ty = dragTy + (e.clientY - dragSY);
        applyTransform(false);
    });
    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        imgWrap.style.cursor = 'grab';
    });

    /* 핀치 투 줌 */
    let pinchDist0 = 0, pinchScale0 = 1;
    function touchDist(t) { return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY); }
    imgWrap.addEventListener('touchstart', e => {
        if (e.touches.length === 2) { pinchDist0 = touchDist(e.touches); pinchScale0 = scale; }
    }, { passive: true });
    imgWrap.addEventListener('touchmove', e => {
        if (e.touches.length !== 2) return;
        e.preventDefault();
        const t = e.touches;
        zoomTo(pinchScale0 * touchDist(t) / pinchDist0,
               (t[0].clientX + t[1].clientX) / 2,
               (t[0].clientY + t[1].clientY) / 2);
    }, { passive: false });

    function updateUI() {
        lbImg.src = images[cur].src;
        lbImg.alt = images[cur].alt || '';
        const multi = images.length > 1;
        lbPrev.classList.toggle('hidden', !multi || cur === 0);
        lbNext.classList.toggle('hidden', !multi || cur === images.length - 1);
        lbCounter.classList.toggle('hidden', !multi);
        if (multi) lbCounter.textContent = (cur + 1) + ' / ' + images.length;
        resetZoom();
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
        resetZoom();
    }

    function prev() { if (cur > 0) { cur--; updateUI(); } }
    function next() { if (cur < images.length - 1) { cur++; updateUI(); } }

    /* 라이트박스 오픈 */
    document.querySelectorAll('.has-lb').forEach(thumb => {
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
        if (e.key === 'Escape')                  close();
        if (e.key === 'ArrowLeft')               prev();
        if (e.key === 'ArrowRight')              next();
        if (e.key === '+' || e.key === '=')      zoomTo(scale + STEP);
        if (e.key === '-')                        zoomTo(scale - STEP);
        if (e.key === '0')                        resetZoom();
    });
})();

/* ── 사이트 미리보기(iframe) 팝업 ── */
(function () {
    const triggers = document.querySelectorAll('.preview-btn');
    if (!triggers.length) return;

    const CATALOG = {
        macrogen: [
            { label: '메인',   pc: 'project/macrogen/pc/html/macrogen/page-pc-01.html', mo: 'project/macrogen/mo/html/macrogen/page-mo-01.html' },
            { label: '회사소개', pc: 'project/macrogen/pc/html/macrogen/page-pc-02.html', mo: 'project/macrogen/mo/html/macrogen/page-mo-02.html' },
            { label: '연혁',   pc: 'project/macrogen/pc/html/macrogen/page-pc-03.html', mo: 'project/macrogen/mo/html/macrogen/page-mo-04.html' },
            { label: '비전',   pc: 'project/macrogen/pc/html/macrogen/page-pc-04.html', mo: 'project/macrogen/mo/html/macrogen/page-mo-03.html' }
        ],
        drg: [
            { label: '메인',       pc: 'project/drg/pc/html/drg/main.html',     mo: 'project/drg/mo/html/drg/main.html' },
            { label: 'AI 피부분석', pc: 'project/drg/pc/html/drg/sub-ai.html',   mo: 'project/drg/mo/html/drg/sub-ai.html' },
            { label: 'AI 분석결과', pc: 'project/drg/pc/html/drg/sub-ai2.html',  mo: 'project/drg/mo/html/drg/sub-ai2.html' },
            { label: 'AI 리포트',   pc: 'project/drg/pc/html/drg/sub-ai3.html',  mo: 'project/drg/mo/html/drg/sub-ai3.html' }
        ],
        cnr: [
            { label: '직원교육-봄', pc: 'project/cnr/html/main-01.html', mo: 'project/cnr/html/main-01.html' },
            { label: '직원교육-여름', pc: 'project/cnr/html/main-02.html', mo: 'project/cnr/html/main-02.html' },
            { label: '임원교육',   pc: 'project/cnr/html/main-03.html', mo: 'project/cnr/html/main-03.html' },
            { label: '안내사이트', pc: 'project/cnr/html/main-04.html', mo: 'project/cnr/html/main-04.html' }
        ],
        homelearn: [
            { label: '웹-메인',     pc: 'project/homelearn/web/html/page-01.html', mo: 'project/homelearn/web/html/page-01.html' },
            { label: '웹-추천학습', pc: 'project/homelearn/web/html/page-02.html', mo: 'project/homelearn/web/html/page-02.html' },
            { label: '웹-상품상세', pc: 'project/homelearn/web/html/page-03.html', mo: 'project/homelearn/web/html/page-03.html' },
            { label: '태블릿-수학완성', pc: 'project/homelearn/tablet/html/page-01.html' },
            { label: '태블릿-영어완성', pc: 'project/homelearn/tablet/html/page-02.html' },
            { label: '태블릿-영어완성 상세', pc: 'project/homelearn/tablet/html/page-03.html' }
        ]
    };

    const overlay = document.createElement('div');
    overlay.className = 'preview-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', '사이트 미리보기');
    overlay.innerHTML = `
    <div class="preview-modal">
        <div class="preview-modal-header">
            <div class="preview-page-tabs" id="preview-page-tabs"></div>
            <div class="preview-modal-actions">
                <div class="preview-device-toggle" id="preview-device-toggle">
                    <button class="preview-device-btn active" data-device="pc">PC</button>
                    <button class="preview-device-btn" data-device="mo">Mobile</button>
                </div>
                <a class="preview-newtab" id="preview-newtab" href="#" target="_blank" rel="noreferrer">새 탭에서 열기 ↗</a>
                <button class="preview-close" id="preview-close" aria-label="닫기">✕</button>
            </div>
        </div>
        <div class="preview-frame-wrap">
            <iframe id="preview-iframe" title="사이트 미리보기" src="about:blank" allow="unload"></iframe>
        </div>
    </div>`;
    document.body.appendChild(overlay);

    const modal      = overlay.querySelector('.preview-modal');
    const frameWrap  = overlay.querySelector('.preview-frame-wrap');
    const iframe     = document.getElementById('preview-iframe');
    const newTabLink = document.getElementById('preview-newtab');
    const deviceWrap = document.getElementById('preview-device-toggle');
    const deviceBtns = overlay.querySelectorAll('.preview-device-btn');
    const tabsWrap   = document.getElementById('preview-page-tabs');

    const PHONE_RATIO = 430 / 932; // 실제 모바일 기기 화면 비율 (width / height)

    let pages = [];
    let pageIdx = 0;
    let device = 'pc';

    function sizeFrame() {
        if (device !== 'mo') {
            frameWrap.style.width = '';
            frameWrap.style.height = '';
            return;
        }
        const header = overlay.querySelector('.preview-modal-header');
        const modalRect = modal.getBoundingClientRect();
        const headerH = header.getBoundingClientRect().height;
        const gap = parseFloat(getComputedStyle(modal).rowGap || getComputedStyle(modal).gap || '0');
        const availW = modalRect.width;
        const availH = modalRect.height - headerH - gap;

        let w = Math.min(430, availW);
        let h = w / PHONE_RATIO;
        if (h > availH) {
            h = availH;
            w = h * PHONE_RATIO;
        }
        frameWrap.style.width = w + 'px';
        frameWrap.style.height = h + 'px';
    }

    function render() {
        const page = pages[pageIdx];
        const hasMo = !!page.mo;
        if (!hasMo) device = 'pc';

        deviceWrap.classList.toggle('hidden', !hasMo);
        deviceBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.device === device));
        modal.classList.toggle('device-mo', device === 'mo');
        sizeFrame();

        const src = device === 'mo' ? page.mo : page.pc;
        iframe.src = src;
        newTabLink.href = src;

        tabsWrap.querySelectorAll('.preview-tab-btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === pageIdx);
        });
    }

    function renderTabs() {
        tabsWrap.innerHTML = '';
        pages.forEach((page, i) => {
            const btn = document.createElement('button');
            btn.className = 'preview-tab-btn' + (i === pageIdx ? ' active' : '');
            btn.textContent = page.label;
            btn.addEventListener('click', () => {
                pageIdx = i;
                render();
            });
            tabsWrap.appendChild(btn);
        });
    }

    function open(projectKey) {
        pages = CATALOG[projectKey] || [];
        if (!pages.length) return;
        pageIdx = 0;
        device = 'pc';
        renderTabs();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        render();
    }

    function close() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        iframe.src = 'about:blank';
    }

    triggers.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            open(btn.dataset.project);
        });
    });

    deviceBtns.forEach(btn => btn.addEventListener('click', () => { device = btn.dataset.device; render(); }));
    document.getElementById('preview-close').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', e => {
        if (overlay.classList.contains('active') && e.key === 'Escape') close();
    });
    window.addEventListener('resize', () => {
        if (overlay.classList.contains('active')) sizeFrame();
    });
})();

/* ── 기여도 바 ── */
(function () {
    document.querySelectorAll('.career-card').forEach(card => {
        const date = card.querySelector('.career-date');
        const stack = card.querySelector('.career-stack');
        if (!date || !stack) return;

        const match = date.textContent.match(/기여도\s*(\d+)\s*%/);
        if (!match) return;
        const percent = Math.min(100, parseInt(match[1], 10));

        const bar = document.createElement('div');
        bar.className = 'career-contrib';
        bar.innerHTML =
            '<span class="career-contrib-label">기여도 <b>' + percent + '%</b></span>' +
            '<span class="career-contrib-track" aria-hidden="true"><span class="career-contrib-fill" style="width:' + percent + '%"></span></span>';
        stack.before(bar);

        date.textContent = date.textContent.replace(/\s*\/\s*기여도\s*\d+\s*%/, '');
    });

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (window.gsap && window.ScrollTrigger && !reduceMotion) {
        gsap.utils.toArray('.career-contrib-fill').forEach(fill => {
            gsap.from(fill, {
                width: 0,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: fill,
                    start: 'top 90%'
                }
            });
        });
    }
})();

/* ── 더 보기 토글 ── */
(function () {
    document.querySelectorAll('.career-desc-wrap').forEach(wrap => {
        const p = wrap.querySelector('.career-desc-short');
        if (!p) return;

        const btn = document.createElement('button');
        btn.className = 'career-more-btn';
        btn.innerHTML = '<span class="arrow">▾</span> 더 보기';
        wrap.appendChild(btn);

        function checkOverflow() {
            const isExpanded = p.classList.contains('expanded');
            p.style.maxHeight = 'none';
            const full = p.scrollHeight;
            p.style.maxHeight = '';
            const overflows = full > p.clientHeight + 2;
            btn.style.display = (overflows || isExpanded) ? 'inline-block' : 'none';
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
})();