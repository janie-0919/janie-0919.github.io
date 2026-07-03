/**
 * --------------------------------------------------------------------------
 *  common.js
 v.0.1 선미 : tab 추가 -- 2021.12.13
 v.0.2 태윤 : 모달 관련 스크립트 추가 -- 2021.12.21
 v.0.3 태윤 : 모달 리팩토링 -- 2021.12.22
 v.0.3 태윤 : 모달 관련 현재 주석처리 -- 2021.12.24
 v.0.4 선미 : ani(스크롤애니메이션) 추가-- 2022.01.03
 v.0.5 태윤 : 모달 관련 현재 주석해제 및 모달 공통화 진행중 -- 2021.01.04
 v.0.6 태윤 : 모달 관련 현재 주석해제 및 모달 공통화 완료 (텍스트변경제외) -- 2022.01.05
 v.0.7 선미 : headerDetails 추가 --2022.01.06
 v.0.8 태윤 : text-change-text & text-change-age 추가 -- 2022.01.12
 v.0.9 주연 : header-detail / header 수정 및 추가 -- 2022.01.21
 v.0.10 주연 : main header 추가 -- 2022.01.24
 v.0.11 주연 : header / 스킨멘토링 & 성분분석 -- 2022.02.17
 v.0.12 선미 : scrOff 추가 -- 2022.02.24
 * --------------------------------------------------------------------------
 */
var front = front || {};

front.common = front.common || {};

front.common = (function () {

    var init = function () {
        this.a();
        this.commonHandler();
        this.tab();
        this.onClickModal();
        this.introScroll();
        this.ani();
        this.header();
        this.headerDetails();
        this.floatBottom();
    }

    var a = function () {
        $('a[href="#"]').on('click', function (e) {
            e.preventDefault();
        });
    }

    var commonHandler = function () {
        /* select */
        $('.custom-select').each(function () {
            $(this).on('change', function () {
                var value = $(this).children("option:selected").attr('value');
                if (!value) {
                    $(this).css({
                        'font-weight': 'normal',
                        'color': '#666666',
                        'background-image': 'url(../../img/common/ico-select-disabled.svg)'
                    });
                } else {
                    $(this).css({
                        'font-weight': 'bold',
                        'color': '#444444',
                        'background-image': 'url(../../img/common/ico-select.svg)'
                    });
                }
            });
        })

        /* modal-select-close */
        $('._toast-popup .select-list > .list').on('click', function () {
            let Popup = $(this).parents('.toast-dim');

            function hidePopup() {
                Popup.addClass('hide');
                setTimeout(() => {
                    Popup.removeClass('fade show').css('display', 'none');
                    $('body').removeClass('scrOff')
                }, 400);
            }


            if ($('._toast-popup .select-list > .list').hasClass("active")) {
                $(this).siblings().removeClass("active");
                $(this).addClass("active");
                hidePopup();
            } else {
                $(this).addClass("active")
                hidePopup();
            }

        })

        /* text-change-text */
        $(document).ready(function () {
            let list = $('._toast-popup.text .select-list > .list');
            list.on("click", function (e) {
                let textValue = $(this).find('span').text();

                function ChangeText() {
                    $('._toast-popup-open.text').find('span').text(textValue).css({
                        'color': '#444444',
                        'font-weight': 'bold'
                    });
                    $('._toast-popup-open.text').css({
                        'background-image': 'url(../../img/common/ico-arrow-down-sm.svg)'
                    })
                }

                list.removeClass("active");
                $(this).addClass("active");
                ChangeText();
            });
        });

        /* text-change-age */
        $(document).ready(function () {
            let list = $('._toast-popup.age .select-list > .list');
            list.on("click", function (e) {
                let textValue = $(this).find('span').text();

                function ChangeText() {
                    $('._toast-popup-open.age').find('span').text(textValue).css({
                        'color': '#444444',
                        'font-weight': 'bold'
                    });
                    $('._toast-popup-open.age').css({
                        'background-image': 'url(../../img/common/ico-arrow-down-sm.svg)'
                    });
                }

                list.removeClass("active");
                $(this).addClass("active");
                ChangeText();
            });
        });

        /* vh 이슈 수정 */
        let vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
        window.addEventListener('resize', () => {
            let vh = window.innerHeight * 0.01
            document.documentElement.style.setProperty('--vh', `${vh}px`)
        })

        /* 알림 팝업 */
        var noticePopup = $('._noticePopup');
        var noticePopupOpen = $('._noticePopupOpen');
        var noticePopupClose = $('._noticePopupClose');
        var noticePopupHeader = $('._popup-header');

        noticePopupOpen.on('click', function () {
            noticePopup.removeClass('hide').addClass('show');
            $('body').addClass('scrOff');
        });

        noticePopupClose.on('click', function () {
            noticePopup.removeClass('show').addClass('hide');
            $('body').removeClass('scrOff');
        });

        var lastScroll = 0;

        noticePopupHeader.find('.popup-content').scroll(function () {
            var st = $(this).scrollTop();

            if (st < 5) {
                noticePopupHeader.removeClass('header-white');
            } else {
                noticePopupHeader.addClass('header-white');
            }
            lastScroll = st;
        });

        /* gnb show */
        $('._gnbShow').on('click', function () {
            $('._gnb').modal('show')
        })

        /* gnb menu */
        $(document).ready(function () {
            var gnbSet = {
                click: function (target, speed) {
                    var _self = this, $target = $(target);
                    _self.speed = speed || 300;
                    $target.each(function () {
                        if (findChildren($(this))) {
                            return;
                        }
                    });

                    function findChildren(obj) {
                        return obj.find('> ul').length > 0;
                    }

                    $target.on('click', 'a', function (e) {
                        e.stopPropagation();
                        var $this = $(this), $depthTarget = $this.next(), $siblings = $this.parent().siblings();
                        $this.parent('li').find('ul li').removeClass('on');
                        $siblings.removeClass('on');
                        $siblings.find('ul').slideUp(250);
                        if ($depthTarget.css('display') == 'none') {
                            _self.activeOn($this);
                            $depthTarget.slideDown(_self.speed);
                        } else {
                            $depthTarget.slideUp(_self.speed);
                            _self.activeOff($this);
                        }
                    })
                }, activeOff: function ($target) {
                    $target.parent().removeClass('on');
                }, activeOn: function ($target) {
                    $target.parent().addClass('on');
                }
            };

            gnbSet.click('#menu li', 300)
        })

        /* select box - 유형선택 */
        var $body = $('body')

        $('._selectBox .btn-select').on('click', function (e) {
            // if ($(this).hasClass('disabled')) return;
            e.stopPropagation();
            $(this).parent().toggleClass('down');
        })

        $('._selectBox li a').on('click', function (e) {
            let text = $(this).text();
            $(this).parent().addClass('on').siblings().removeClass('on');
            console.log($(this).parent().parents('.list').parent())
            $(this).parent().parents('.list').prev('.btn-select').children('.text').text(text);
            $(this).parent().parents('.list').prev('.btn-select').addClass('selected')
            $(this).parent().parents('.list').parent().removeClass('down');
        })

        $body.on('click', function () {
            $('._selectBox').removeClass('down');
        });
    }

    var tab = function () {
        $('._tab .item a').on('click', function () {
            let idx = $(this).parent().index()
            let tabItem = $('._tab .item')
            let tabPane = $('._tab').siblings('.tab-content').children('.tab-pane')
            tabItem.removeClass('active')
            tabItem.eq(idx).addClass('active')
            tabPane.removeClass('active')
            tabPane.eq(idx).addClass('active')
        })
    }

    var introScroll = function introScroll() {
        var lastScroll = 0;
        $('._full-popup > .popup-content').scroll(function () {
            var st = $(this).scrollTop();
            if (st === 0) {
                $('._popup-header').removeClass('header-white');
            } else {
                $('._popup-header').addClass('header-white');
            }
            lastScroll = st;
        });
    }

    var onClickModal = function OnclickModal() {
        let popupOpen = $('._toast-popup-open');
        let popupClose = $('._toast-popup-close');
        let select = $('.toast-dim');

        popupOpen.on('click', function () {
            const idx = popupOpen.index(this);
            select.eq(idx).removeClass('hide').addClass('fade show').css('display', 'block');
            $('body').addClass('scrOff')
        });

        popupClose.on('click', function () {
            select.addClass('hide');
            $('body').removeClass('scrOff')
            setTimeout(() => {
                select.removeClass('fade show').css('display', 'none');
            }, 400);
        });

        /* 외부클릭시 삭제 */
        if($('._toast-popup._no-hide-dim').length == 0){
            $('.toast-dim').mouseup(function (e) {
                let toastPopup = $('.toast-popup');
                if (toastPopup.has(e.target).length === 0) {
                    $('.toast-dim').css('display', 'none');
                    $('body').removeClass('scrOff')
                }
            })
        }
    }

    var headerDetails = function () {
        var didScroll;
        var lastScrollTop = 0;
        var delta = 3;
        var headerDetail = $('.header-details');
        var headerDetailHeight = headerDetail.outerHeight();
        var stepHeading = $('.step-heading');
        var uppperPartHeight = headerDetail.outerHeight() + stepHeading.outerHeight();

        if ($('.container').find('._static').length == false) {
            /* normal case*/
            if ($('.container').find('.step-heading').length == false) {
                $(window).scroll(function () {
                    didScroll = true;
                });

                setInterval(function () {
                    if (didScroll) {
                        hasScrolled();
                        didScroll = false;
                    }
                }, 10);

                function hasScrolled() {
                    var st = $(this).scrollTop();


                    if (Math.abs(lastScrollTop - st) <= delta)
                        return;

                    if (st > lastScrollTop) {
                        // Scroll Up
                        if (st > lastScrollTop) {
                            /*메인페이지 화살표 컨트롤*/
                            $('.sub-main .counting-area .more-box').addClass('hide')
                            if (st > headerDetailHeight) {
                                headerDetail.removeClass('scroll-down').addClass('scroll-up');
                            }
                        }
                    } else {
                        if (st < 10) {
                            /*메인페이지 화살표 컨트롤*/
                            $('.sub-main .counting-area .more-box').removeClass('hide')
                        }
                        // Scroll Down
                        if (st + $(window).height() < $(document).height()) {
                            if (st < delta) {
                                headerDetail.removeClass('scroll-down');
                            } else {
                                headerDetail.removeClass('scroll-up').addClass('scroll-down');
                            }
                        }
                    }
                    lastScrollTop = st;
                }
            }
            /* 스킨멘토링 step이랑 있을 경우 */
            else {
                $(window).scroll(function () {
                    didScroll = true;
                });

                setInterval(function () {
                    if (didScroll) {
                        hasScrolled();
                        didScroll = false;
                    }
                }, 10);

                function hasScrolled() {
                    var st = $(this).scrollTop();

                    if (Math.abs(lastScrollTop - st) <= delta)
                        return;

                    if (st > lastScrollTop) {
                        // Scroll Up
                        if (st > lastScrollTop) {
                            if (st > uppperPartHeight) {
                                headerDetail.removeClass('scroll-down').addClass('scroll-up');
                                stepHeading.removeClass('scroll-down').addClass('scroll-up');
                            }
                        }
                    } else {
                        // Scroll Down
                        if (st + $(window).height() < $(document).height()) {
                            if (st < delta) {
                                headerDetail.removeClass('scroll-down');
                                stepHeading.removeClass('scroll-down');
                            } else {
                                headerDetail.removeClass('scroll-up').addClass('scroll-down');
                                stepHeading.removeClass('scroll-up').addClass('scroll-down');
                            }
                        }
                    }
                    lastScrollTop = st;
                }
            }
        }
    }

    var header = function () {
        var didScroll;
        var lastScrollTop = 0;
        var delta = 5;
        var header = $('._header-sticky');
        var headerWhite = $('.header-white');
        var headerHeight = header.outerHeight();

        /* normal */
        if ($('._header-sticky').length) {
            $(window).scroll(function () {
                didScroll = true;
            });

            setInterval(function () {
                if (didScroll) {
                    hasScrolled();
                    didScroll = false;
                }
            }, 10);

            function hasScrolled() {
                var st = $(this).scrollTop();

                if (Math.abs(lastScrollTop - st) <= delta)
                    return;

                if (st > lastScrollTop) {
                    // Scroll Down
                    $('._floatBottom').removeClass('arrow-off')

                    if (st > lastScrollTop) {
                        if ($('.inside-drg').find('._tab').length) {
                            var tabContentOffset = $('.tab-content').offset().top;
                            if (st > tabContentOffset) {
                                header.removeClass('scroll-down').addClass('scroll-up');
                                $('._tab').addClass('fixed').css('top', '0')
                            }
                        }
                        else if ($('.brand-wrap').find('._tab').length) {
                            var tabContentOffset = $('.section-intro').offset().top;
                            if (st > tabContentOffset) {
                                header.removeClass('scroll-down').addClass('scroll-up');
                                $('._tab').addClass('fixed').css('top', '0')
                            }
                        }
                        else if ($('.event-wrap').find('._tab').length) {
                            var tabContentOffset = $('.event-contents').offset().top;
                            if (st > tabContentOffset) {
                                header.removeClass('scroll-down').addClass('scroll-up');
                                $('._tab').addClass('fixed').css('top', '0')
                            }
                        } else {
                            if (st > headerHeight) {
                                header.removeClass('scroll-down').addClass('scroll-up');
                            }
                        }
                    }
                } else {
                    // Scroll Up
                    if (st + $(window).height() < $(document).height()) {
                        $('._floatBottom').addClass('arrow-off')

                        if ($('.inside-drg').find('._tab').length) {
                            var tabContentOffset = $('.tab-content').offset().top;
                            if (st < tabContentOffset) {
                                $('._tab').removeClass('fixed').css('top', 'auto')
                            } else {
                                $('._tab').addClass('fixed').css('top', headerHeight + 'px')
                            }
                            if (st < delta) {
                                header.removeClass('scroll-down');
                            } else {
                                header.removeClass('scroll-up').addClass('scroll-down');
                            }
                        }
                        else if ($('.brand-wrap').find('._tab').length) {
                            var tabContentOffset = $('.section-intro').offset().top;
                            if (st < tabContentOffset) {
                                $('._tab').removeClass('fixed').css('top', 'auto')
                            } else {
                                $('._tab').addClass('fixed').css('top', headerHeight + 'px')
                            }
                            if (st < delta) {
                                header.removeClass('scroll-down');
                            } else {
                                header.removeClass('scroll-up').addClass('scroll-down');
                            }
                        }
                        else if ($('.event-wrap').find('._tab').length) {
                            var tabContentOffset = $('.event-contents').offset().top;
                            if (st < tabContentOffset) {
                                $('._tab').removeClass('fixed').css('top', 'auto')
                            } else {
                                $('._tab').addClass('fixed').css('top', headerHeight + 'px')
                            }
                            if (st < delta) {
                                header.removeClass('scroll-down');
                            } else {
                                header.removeClass('scroll-up').addClass('scroll-down');
                            }
                        }
                        else {
                            if (st < delta) {
                                $('._floatBottom').removeClass('arrow-off')
                                header.removeClass('scroll-down');
                            } else {
                                header.removeClass('scroll-up').addClass('scroll-down');
                            }
                        }
                    }
                }
                lastScrollTop = st;
            }
        }

        /* white header 경우 */
        if ($('.header-white').length) {
            $(window).scroll(function () {
                didScroll = true;
            });

            setInterval(function () {
                if (didScroll) {
                    hasScrolled();
                    didScroll = false;
                }
            }, 10);

            function hasScrolled() {
                var st = $(this).scrollTop();

                if (Math.abs(lastScrollTop - st) <= delta)
                    return;

                if (st > lastScrollTop) {
                    // Scroll Down
                    $('._floatBottom').removeClass('arrow-off')
                    // $('._chatBotArea').addClass('full')

                    /* Ai피부분석 서브메인 scroll - tab + header  */
                    if ($('.AI-wrap').find('._scrollTabWrap').length) {
                        if (st > sectionStartPos) {
                            sectionTab.show().addClass('fixed').css('top', 0 + 'px');
                            headerWhite.hide();
                        }
                    }
                    /* Ai피부분석 결과 scroll - tab + header  */
                    else if ($('.AI-wrap').find('._scrollAnalysisTab').length) {
                        if (st > sectionStartPos) {
                            sectionTab.show().addClass('fixed').css('top', 0 + 'px');
                            headerWhite.hide();
                        }
                    }
                    /* 성분분석 scroll - tab + header  */
                    else if ($('.analysis-sub-main').find('._section-tab').length) {
                        if (st > sectionStartPos) {
                            sectionTab.show().addClass('fixed').css('top', 0 + 'px');
                            headerWhite.hide();
                        }
                    }
                    /* 스킨멘토링 scroll - tab + header  */
                    else if ($('.mentoring-sub-main').find('._section-tab').length) {
                        if (st > sectionStartPos) {
                            sectionTab.show().addClass('fixed').css('top', 0 + 'px');
                            headerWhite.hide();
                        }
                    }
                } else {
                    // Scroll Up
                    if (st + $(window).height() < $(document).height()) {
                        $('._floatBottom').addClass('arrow-off')
                        /* Ai피부분석 서브메인 scroll - tab + header  */
                        if ($('.AI-wrap').find('._scrollTabWrap').length) {
                            // tab
                            if (st < sectionStartPos) {
                                sectionTab.removeClass('fixed', 'scroll-down').css('top', 0 + 'px');
                                // $('._chatBotArea').removeClass('full')
                            } else {
                                var headerHeight = $('.header-white').outerHeight();
                                sectionTab.addClass('fixed').css('top', headerHeight + 'px');
                                // $('._chatBotArea').removeClass('full')
                            }
                            // header
                            if (st < delta) {
                                $('._floatBottom').removeClass('arrow-off')
                                headerWhite.show().addClass('header-transparent').removeClass('scroll-down');
                            } else {
                                headerWhite.show().removeClass('header-transparent', 'scroll-up').addClass('scroll-down');
                            }
                        }
                        /* Ai피부분석 결과 scroll - tab + header  */
                        else if ($('.AI-wrap').find('._scrollAnalysisTab').length) {
                            // tab
                            if (st < sectionStartPos) {
                                sectionTab.removeClass('fixed', 'scroll-down').css('top', 0 + 'px');
                            } else {
                                var headerHeight = $('.header-white').outerHeight();
                                sectionTab.addClass('fixed').css('top', headerHeight + 'px');
                            }
                            // header
                            if (st < delta) {
                                headerWhite.show().addClass('header-transparent').removeClass('scroll-down');
                            } else {
                                headerWhite.show().removeClass('header-transparent', 'scroll-up').addClass('scroll-down');
                            }
                        }
                        /* 성분분석 scroll - tab + header  */
                        else if ($('.analysis-sub-main').find('._section-tab').length) {
                            // tab
                            if (st < sectionStartPos) {
                                sectionTab.removeClass('fixed', 'scroll-down').css('top', 0 + 'px');
                                // $('._chatBotArea').removeClass('full')
                            } else {
                                var headerHeight = $('.header-white').outerHeight();
                                sectionTab.addClass('fixed').css('top', headerHeight + 'px');
                                // $('._chatBotArea').removeClass('full')
                            }
                            // header
                            if (st < delta) {
                                $('._floatBottom').removeClass('arrow-off')
                                headerWhite.show().addClass('header-transparent').removeClass('scroll-down');
                            } else {
                                headerWhite.show().removeClass('header-transparent', 'scroll-up').addClass('scroll-down');
                            }
                        }
                        /* 스킨멘토링 scroll - tab + header  */
                        else if ($('.mentoring-sub-main').find('._section-tab').length) {
                            // tab
                            if (st < sectionStartPos) {
                                sectionTab.removeClass('fixed', 'scroll-down').css('top', 0 + 'px');
                                // $('._chatBotArea').removeClass('full')
                            } else {
                                var headerHeight = $('.header-white').outerHeight();
                                sectionTab.addClass('fixed').css('top', headerHeight + 'px');
                                // $('._chatBotArea').removeClass('full')
                            }
                            // header
                            if (st < delta) {
                                $('._floatBottom').removeClass('arrow-off')
                                headerWhite.show().addClass('header-transparent').removeClass('scroll-down');
                            } else {
                                headerWhite.show().removeClass('header-transparent', 'scroll-up').addClass('scroll-down');
                            }
                        }
                        /* 기타 */
                        else {
                            if (st < delta) {
                                $('._floatBottom').removeClass('arrow-off');
                                // $('._chatBotArea').removeClass('full');
                                headerWhite.addClass('header-transparent');
                            } else {
                                // $('._chatBotArea').removeClass('full');
                                headerWhite.removeClass('header-transparent');
                            }
                        }
                    }
                }
                lastScrollTop = st;
            }
        }

        /* main header 경우 */
        if ($('.header-main').length) {
            $(window).scroll(function () {
                didScroll = true;
            });

            setInterval(function () {
                if (didScroll) {
                    hasScrolled();
                    didScroll = false;
                }
            }, 10);

            var mainHeader = $('.header-main');
            var mainHeaderHeight = $('.header-main').outerHeight();
            var bannerHeight = $('._mainBanner').outerHeight();

            function hasScrolled() {
                var st = $(this).scrollTop();
                $('._test').text(st)
                if (Math.abs(lastScrollTop - st) <= delta)
                    return;

                if (st > lastScrollTop) {
                    // Scroll Down
                    if (st > mainHeaderHeight + bannerHeight) {
                        mainHeader.removeClass('scroll-up').addClass('header-transparent', 'scroll-down');
                        $('._floatBottom').removeClass('arrow-off')
                        // console.log('1')
                    }
                }
                else {
                    // Scroll Up
                    if (st + $(window).height() < $(document).height()) {
                        if (st < delta) {
                            mainHeader.addClass('header-transparent').removeClass('scroll-up');
                            mainHeader.removeClass('scroll-down');
                            $('._floatBottom').removeClass('arrow-off')
                            // console.log('2')
                        } else {
                            mainHeader.removeClass('header-transparent', 'scroll-down').addClass('scroll-up');
                            $('._floatBottom').addClass('arrow-off')
                            // console.log('3')
                        }
                    }
                }
                lastScrollTop = st;
            }
        }
    }

    var floatBottom = function () {
        var didScroll;
        var lastScrollTop = 0;
        var delta = 5;
        var target = $('._floatBottom');

        if (target.length) {
            $(window).scroll(function () {
                didScroll = true;
            });

            setInterval(function () {
                if (didScroll) {
                    hasScrolled();
                    didScroll = false;
                }
            }, 10);

            function hasScrolled() {
                var st = $(this).scrollTop();

                if (Math.abs(lastScrollTop - st) <= delta)
                    return;

                if (st > lastScrollTop) {
                    // Scroll Down
                    if (st > lastScrollTop) {
                        // console.log('1')
                        target.addClass('hide').removeClass('show');
                    }
                } else {
                    // Scroll Up
                    if (st + $(window).height() < $(document).height()) {
                        // console.log('2')
                        target.addClass('show').removeClass('hide');
                        // if(st < delta) {
                        // } else {
                        // }
                    }
                }
                lastScrollTop = st;
            }
        }

        $('._openMenu').on('click', function () {
            // 열려있으면
            if ($(this).hasClass('open')) {
                $(this).removeClass('open');
                $('.menu-box').removeClass('open').hide();
                $('.menu-drg-img').removeClass('open').hide();
                $('.menu-drg-txt').removeClass('open').hide();
                $('.menu-link-box').removeClass('open').hide();
                $('body').removeClass('scrOff')
                $('.page-dim').hide()
            } else {
                // 닫혀있으면
                $(this).addClass('open');
                $('.menu-box').show().addClass('open')
                $('.menu-drg-img').show().addClass('open')
                $('.menu-drg-txt').show().addClass('open')
                $('.menu-link-box').show().addClass('open')
                $('body').addClass('scrOff')
                $('.page-dim').show()
            }
        })
    }

    var ani = function () {
        AOS.init();
    }

    return {
        a: a,
        commonHandler: commonHandler,
        tab: tab,
        init: init,
        onClickModal: onClickModal,
        introScroll: introScroll,
        ani: ani,
        header: header,
        headerDetails: headerDetails,
        floatBottom: floatBottom
    }
})();

$(function () {
    front.common.init();
});

function showPopup() {
    $('.toast-dim').removeClass('hide').addClass('show fade').css('display', 'block');
}

function hidePopup() {
    $('.toast-dim').addClass('hide');
    setTimeout(() => {
        $('.toast-dim').removeClass('fade show').css('display', 'none');
    }, 400);
}

function openPopup(className) {
    var target = `.${className}`;
    $(target).removeClass('hide').addClass('show fade').css('display', 'block');
}

function closePopup(className) {
    var target = `.${className}`;
    $(target).addClass('hide');
    setTimeout(() => {
        $(target).removeClass('fade show').css('display', 'none');
    }, 400);
}
