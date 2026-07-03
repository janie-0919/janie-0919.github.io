let front = (function () {

    let event = {};
    let fn = {};

    let $body, lastFocusedElement = null;

    event.commonHandlers = function () {
        $(document).on('keydown', '.form-radio, .form-check', handleFormAccessibility); // 웹접근성 - INPUT (RADIO & CHECKBOX)

        $(document).on('click', '._btnLike', toggleLike); // 좋아요 버튼

        // FAQ 아코디언 (._faq)
        $(document).on('click', '._faq .item-head', function () {
            const $btn = $(this);
            const $item = $btn.parent('.item');
            const isExpanded = $item.hasClass('show');

            $('._faq .item').removeClass('show');
            $('._faq .item-head').attr('aria-expanded', 'false');

            if (!isExpanded) {
                $item.addClass('show');
                $btn.attr('aria-expanded', 'true');
            }
        });

        initTooltip();
        initTxtLimit();

        // 상세검색
        let $searchBox = $('._searchDetail');
        let $btnDetail = $('._btnDetail');

        $btnDetail.on('click', function(event) {
            event.stopPropagation();
            $searchBox.toggleClass('show');
        });

        $('._list button').on('click', function () {
            $(this).addClass('on').siblings().removeClass('on');
        });
    };

    function handleFormAccessibility(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            let input = $(this).find('input');
            input.prop('checked', input.attr('type') === 'checkbox' ? !input.prop('checked') : true).trigger('change');
        }
    }

    function toggleLike() {
        let isActive = $(this).hasClass('on');

        $(this).toggleClass('on', !isActive);
        $(this).find('.sr-only').text(isActive ? '좋아요 해제됨' : '좋아요 선택됨');
    }

    // Tab -------------------------------------------------
    event.tabHandlers = function () {
        $('._tabContainer').each(function () {
            let $container = $(this);

            let $tabs = $container.find('._tab .item');
            let $panels = $container.find('._tabContent .tab-panel');

            $tabs.on('click', function () {
                let index = $(this).index();
                $tabs.removeClass('on').eq(index).addClass('on');
                $panels.removeClass('on').eq(index).addClass('on');
            });

            $container.find('._innerTab').each(function () {
                let $innerTab = $(this).find('.item');
                let $innerPanels = $(this).parent().siblings('._tabInnerContent').find('.tab-inner-panel');

                $innerTab.on('click', function () {
                    let innerIndex = $(this).index();
                    $innerTab.removeClass('on').eq(innerIndex).addClass('on');
                    $innerPanels.removeClass('on').eq(innerIndex).addClass('on');
                });
            });
        });
    };
    // --------------------------------------------------------

    // Popup -------------------------------------------------
    event.popupHandlers = function () {
        $(document).on('click', '._popupTrigger', function () {
            lastFocusedElement = document.activeElement;
            fn.openPopup($(this).data('trigger'));
        });

        $(document).on('click', '._popupClose', fn.closePopup);
    };

    fn.openPopup = function (target) {
        const $popup = $(`._popup[data-popup=${target}]`);
        $popup.addClass('open');
        $body.addClass('scrOff');
        setTimeout(() => $popup.find('.btn-popup-close').focus(), 0);
    };

    fn.closePopup = function () {
        const $openPopup = $('._popup.open');
        if ($openPopup.length) {
            $openPopup.removeClass('open');
            $body.removeClass('scrOff');
            lastFocusedElement?.focus();
        }
    };
    // --------------------------------------------------------

    // Loading -------------------------------------------------
    fn.showLoading = function () {
        $('._loading').addClass('open').attr('aria-hidden', 'false');
    };

    fn.hideLoading = function () {
        $('._loading').removeClass('open').attr('aria-hidden', 'true');
    };
    // --------------------------------------------------------

    // tooltip ------------------------------------------------
    function initTooltip() {
        const buttons = document.querySelectorAll('._btnTooltip');

        buttons.forEach((button) => {
            const tooltip = button.nextElementSibling;

            if (!tooltip || !tooltip.classList.contains('_tooltip')) return;

            const popperInstance = Popper.createPopper(button, tooltip, {
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 8],
                        },
                    },
                ],
            });

            function show() {
                tooltip.setAttribute('data-show', '');

                popperInstance.setOptions((options) => ({
                    ...options,
                    modifiers: [
                        ...options.modifiers,
                        { name: 'eventListeners', enabled: true },
                    ],
                }));

                popperInstance.update();
            }

            function hide() {
                tooltip.removeAttribute('data-show');

                popperInstance.setOptions((options) => ({
                    ...options,
                    modifiers: [
                        ...options.modifiers,
                        { name: 'eventListeners', enabled: false },
                    ],
                }));
            }

            const showEvents = ['click', 'focus'];

            showEvents.forEach((eventName) => {
                button.addEventListener(eventName, (e) => {
                    e.stopPropagation();
                    show();
                });
            });

            document.addEventListener('click', (e) => {
                if (!button.contains(e.target) && !tooltip.contains(e.target)) {
                    hide();
                }
            });

            button.addEventListener('blur', hide);
        });
    }
    // --------------------------------------------------------

    // textarea 글자수 카운터 ----------------------------------
    function initTxtLimit() {
        $('.txt-limit').each(function () {
            const $limit = $(this);
            const $textarea = $limit.siblings('textarea').first();
            if (!$textarea.length) return;

            const $value = $limit.find('.value');
            const max = parseInt(($limit.text().split('/')[1] || '').replace(/[^0-9]/g, ''), 10);

            if (max) $textarea.attr('maxlength', max);

            function update() {
                $value.text($textarea.val().length);
            }

            $textarea.on('input', update);
            update();
        });
    }
    // --------------------------------------------------------

    // GNB Dropdown -----------------------------------------------
    event.gnbHandlers = function () {
        const $header = $('.site-header');
        const $dropdown = $('.gnb-dropdown');
        const $menuLinks = $('.gnb-menu-link');
        const $cols = $('.gnb-col');
        const $mobileGnb = $('.gnb-mobile');
        const $mobileOverlay = $('.gnb-mobile-overlay');
        let closeTimer = null;

        function openDropdown(colIndex) {
            clearTimeout(closeTimer);
            $menuLinks.removeClass('is-hover').filter(`[data-col="${colIndex}"]`).addClass('is-hover');
            $cols.removeClass('active').filter(`[data-col="${colIndex}"]`).addClass('active');
            $dropdown.addClass('open').attr('aria-hidden', 'false');
        }

        function scheduleClose() {
            closeTimer = setTimeout(function () {
                $menuLinks.removeClass('is-hover');
                $dropdown.removeClass('open').attr('aria-hidden', 'true');
            }, 150);
        }

        function openMobileGnb() {
            $mobileGnb.addClass('open').attr('aria-hidden', 'false');
            $mobileOverlay.addClass('open');
            $('body').addClass('scrOff');
            $('.gnb-hamburger').attr('aria-expanded', 'true');
        }

        function closeMobileGnb() {
            $mobileGnb.removeClass('open').attr('aria-hidden', 'true');
            $mobileOverlay.removeClass('open');
            $('body').removeClass('scrOff');
            $('.gnb-hamburger').attr('aria-expanded', 'false');
        }

        $menuLinks.on('mouseenter', function () {
            openDropdown($(this).data('col'));
        });

        $header.on('mouseleave', scheduleClose);

        $dropdown.on('mouseenter', function () {
            clearTimeout(closeTimer);
        });

        $(document).on('click', '.gnb-hamburger', openMobileGnb);
        $(document).on('click', '.gnb-mobile-close', closeMobileGnb);
        $mobileOverlay.on('click', closeMobileGnb);

        $(document).on('click', '.gnb-sub-toggle, .gnb-mobile-sub-toggle', function () {
            const $item = $(this).closest('.has-sub');
            const isOpen = $item.hasClass('open');
            $item.toggleClass('open', !isOpen);
            $(this).attr('aria-expanded', String(!isOpen));
        });

        $(document).on('keydown', function (e) {
            if (e.key === 'Escape') {
                if ($dropdown.hasClass('open')) {
                    $dropdown.removeClass('open').attr('aria-hidden', 'true');
                }
                if ($mobileGnb.hasClass('open')) {
                    closeMobileGnb();
                }
                if ($searchPanel.hasClass('open')) {
                    closeSearchPanel();
                }
            }
        });

        // 검색 패널
        const $searchPanel = $('.gnb-search-panel');

        function openSearchPanel() {
            $dropdown.removeClass('open').attr('aria-hidden', 'true');
            $menuLinks.removeClass('is-hover');
            $searchPanel.addClass('open').attr('aria-hidden', 'false');
            setTimeout(() => $searchPanel.find('.gnb-search-input').focus(), 50);
        }

        function closeSearchPanel() {
            $searchPanel.removeClass('open').attr('aria-hidden', 'true');
        }

        $(document).on('click', '.gnb-search', function () {
            if ($searchPanel.hasClass('open')) {
                closeSearchPanel();
            } else {
                openSearchPanel();
            }
        });

        $(document).on('click', function (e) {
            if ($searchPanel.hasClass('open') && !$(e.target).closest('.gnb-search-panel, .gnb-search').length) {
                closeSearchPanel();
            }
        });
    };
    // --------------------------------------------------------

    let init = function () {
        $body = $('body');
        event.commonHandlers();
        event.popupHandlers();
        event.tabHandlers();
        event.gnbHandlers();
    };

    return {
        init,
        fn,
    };
})();

$(document).ready(front.init);

// =============================================
// 강의실 모바일 메뉴
// =============================================
$(function () {
    if (!$('.classroom-wrap').length) return;

    function closeClassroomGNB() {
        $('._classMoMenu').removeClass('on');
        $('._classroomGNB').removeClass('show');
        $('body').removeClass('scrOff');
    }

    // 햄버거 버튼 토글
    $(document).on('click', '._classMoMenu', function () {
        if (!$(this).hasClass('on')) {
            $(this).addClass('on');
            $('._classroomGNB').addClass('show');
            $('body').addClass('scrOff');
        } else {
            closeClassroomGNB();
        }
    });

    // 모바일 GNB 메뉴 클릭 시 활성화 + 닫기
    $(document).on('click', '._classroomGNB .classroom-menu-list .item a', function () {
        $(this).closest('.item').addClass('on').siblings().removeClass('on');
        closeClassroomGNB();
    });

    // 사이드 LNB 메뉴 클릭 시 활성화 동기화
    $(document).on('click', '.classroom-lnb .lnb-item a', function () {
        var idx = $(this).closest('.lnb-item').index();
        $('._classroomGNB .classroom-menu-list .item').eq(idx).addClass('on').siblings().removeClass('on');
    });

    // 리사이즈 시 GNB 닫기
    $(window).on('resize', function () {
        clearTimeout(window._classroomResizeTimer);
        window._classroomResizeTimer = setTimeout(closeClassroomGNB, 200);
    });
});