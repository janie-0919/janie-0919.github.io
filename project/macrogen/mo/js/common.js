/**
 * --------------------------------------------------------------------------
 *  common.js
 * --------------------------------------------------------------------------
 */
var front = front || {};

front.common = front.common || {};

front.common = (function () {

    var init = function () {
        this.a();
        this.swiperTab();
        this.commonHandler();
        this.scrollHorizon();
        this.selectDefault();
    }

    var a = function () {
        $('a[href="#"]').on('click', function (e) {
            e.preventDefault();
        });
    }

    var swiperTab = function () {
        $(document).ready(function (){
            if($('.macrogen-authorization').length === 1) {
                new Swiper('.snbSwiper', {
                    slidesPerView: 'auto',
                    preventClicks: true,
                    preventClicksPropagation: false,
                    observer: true,
                    observeParents: true,
                    navigation: {
                        nextEl: "._slideRight",
                        prevEl: "._slideLeft",
                    }
                });

                var $snbSwiperItem = $('.snbSwiper .swiper-wrapper .swiper-slide a');
                $snbSwiperItem.click(function () {
                    var target = $(this).parent();
                    $snbSwiperItem.parent().removeClass('on')
                    target.addClass('on');
                    muCenter(target);
                })

                function muCenter(target) {
                    var snbwrap = $('.snbSwiper .swiper-wrapper');
                    var targetPos = target.position();
                    var box = $('.snbSwiper');
                    var boxHarf = box.width() / 2;
                    var pos;
                    var listWidth = 0;

                    snbwrap.find('.swiper-slide').each(function () {
                        listWidth += $(this).outerWidth();
                    })

                    var selectTargetPos = targetPos.left + target.outerWidth() / 2;
                    if (selectTargetPos <= boxHarf) { // left
                        pos = 0;
                    } else if ((listWidth - selectTargetPos) <= boxHarf) { //right
                        pos = listWidth - box.width();
                    } else {
                        pos = selectTargetPos - boxHarf;
                    }

                    setTimeout(function () {
                        snbwrap.css({
                            "transform": "translate3d(" + (pos * -1) + "px, 0, 0)",
                            "transition-duration": "500ms"
                        })
                    }, 200);
                }
            }
        })
    }

    var commonHandler = function () {
        /* s Dropdown Menu */
        var dropdown = $('.dropdown');

        dropdown.on('click', function () {
            $(this).attr('tabindex', 1).focus();
            $(this).toggleClass('active');
            $(this).find('.dropdown-menu').slideToggle(300);
        });

        dropdown.focusout(function () {
            $(this).removeClass('active');
            $(this).find('.dropdown-menu').slideUp(300);
        });

        $('.dropdown .dropdown-menu li').on('click', function () {
            $(this).parents('.dropdown').find('span').text($(this).text());
            $(this).parents('.dropdown').find('input').attr('value', $(this).attr('id'));
        });
        /* e Dropdown Menu */

        /* s zoom */
        $(document).ready(function (){
            if ($('.panzoom > img').length > 0) {
                var webpage = ($('.panzoom > img'))[0];
                var image = ($('.panzoom'))[0];

                var mc = new Hammer.Manager(image);

                var pinch = new Hammer.Pinch();
                var pan = new Hammer.Pan();

                pinch.recognizeWith(pan);

                mc.add([pinch, pan]);

                var adjustScale = 1;
                var adjustDeltaX = 0;
                var adjustDeltaY = 0;

                var currentScale = null;
                var currentDeltaX = null;
                var currentDeltaY = null;
                var currentScroll = window.pageYOffset || document.documentElement.scrollTop;

                webpage.addEventListener('touchstart', function (e) {
                    e.preventDefault()
                });

                mc.on("pinch pan", function (ev) {
                    var transforms = [];

                    currentScale = adjustScale * ev.scale;

                    if (currentScale <= 1) {
                        transforms.push('scale(1)');
                        transforms.push('translate(0px, 0px)');
                        webpage.style.transform = transforms.join(' ');

                        if (ev.additionalEvent === "pandown") {
                            $('html, body').scrollTop(currentScroll - ev.distance);
                        } else if (ev.additionalEvent === "panup") {
                            $('html, body').scrollTop(currentScroll + ev.distance);
                        }
                    } else {
                        currentDeltaX = adjustDeltaX + (ev.deltaX / currentScale);
                        currentDeltaY = adjustDeltaY + (ev.deltaY / currentScale);

                        transforms.push('scale(' + currentScale + ')');

                        transforms.push('translate(' + currentDeltaX + 'px, ' + currentDeltaY + 'px)');
                        webpage.style.transform = transforms.join(' ');
                    }
                });

                mc.on("panend pinchend", function (ev) {
                    if (currentScale <= 1) {
                        currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                        if (ev.additionalEvent === "panright") {
                        } else if (ev.additionalEvent === "panleft") {}
                    }

                    adjustScale = currentScale;
                    adjustDeltaX = currentDeltaX;
                    adjustDeltaY = currentDeltaY;
                });
            }
        })
        /* e zoom */

        /* s AOS */
        AOS.init();
        /* e AOS */

        /* s full-bg 일 경우, 자동 하단으로 스크롤 */
        var screeSize = document.documentElement.clientHeight;
        // console.log(screeSize);

        if($('.full-bg').length) {
            if($('html, body').scrollTop() === 0) {
                // 서브 배경 애니메이션
                var sub = setTimeout(function() {
                    // console.log($('html, body').scrollTop())
                    if($('html, body').scrollTop() !== 0) clearTimeout(sub)
                    else $('html, body').animate({scrollTop: screeSize}, 300);
                }, 2000);
            }
        }
        /* e full-bg 일 경우, 자동 하단으로 스크롤 */

        /* s tooltip */
        $('._btnTooltip').on('click',function (){
            $('.tooltip-box').removeClass('active');
            $(this).parent().addClass('active');
            $('._btnTooltip').css('z-index', '1');
            $(this).css('z-index', '3');
        })

        $('._btnTooltipClose').on('click',function (){
            $(this).parent().parent().removeClass('active');
        })

        $(window).bind("load", function() {
            $('._btnTooltip').each(function () {
                var left = $(this).offset().left * -1 + 20;
                $(this).siblings().css('left', left + 'px')
            })
        });

        $(document).ready(function() {
            $('._btnTooltip').each(function () {
                var left = $(this).offset().left * -1 + 20;
                $(this).siblings().css('left', left + 'px')
            })
        });
        /* e tooltip */

        /* s accordion */
        $('.accordion-button').on('click', function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $(this).siblings('.accordion-content').slideUp(500);
            } else {
                $('.accordion-button').removeClass('active');
                $(this).addClass('active');
                $('.accordion-content').slideUp(500);
                $(this).siblings('.accordion-content').slideDown(500);
            }
        });
        /* s accordion */

        /* 인증 tooltip 이슈 처리 */
        var varUA = navigator.userAgent.toLowerCase();

        if ( varUA.indexOf('android') > -1) {
            // console.log('android')
            $('.macrogen.macrogen-authorization .section .tooltip-box .text-box').css('top','41.5px');
            return "android";
        } else if ( varUA.indexOf("iphone") > -1||varUA.indexOf("ipad") > -1||varUA.indexOf("ipod") > -1 ) {
            // console.log('ios')
            return "ios";
        } else {
            // console.log('others')
            return "other";
        }
    }

    var scrollHorizon = function(){
        /*스크립트 변경*/
        $(document).ready(function(){
            $(".table-scroll").mCustomScrollbar({
                axis:"x",
                theme:"dark",
                setTop: "6px"
            });

            $(".select-option").mCustomScrollbar({
                axis:"y",
            });
            $(".anchor-option").mCustomScrollbar({
                axis:"y",
            });
        });
    };

    var selectDefault = function () {
        var selectDefault = $('.select-box ._select_default');
        $('._select_list').hide();

        selectDefault.on('click',function() {
            var select = $(this);
            //드롭다운 닫기
            if(select.hasClass('open')) {
                select.removeClass('open').next('._select_list').slideUp(200);
            }
            //드롭다운 열기
            else {
                select.addClass("open").next('._select_list').slideDown(200);
                /*  $(document).click(function(event) {
                    if ( !$(event.target).hasClass('open')) {
                      select.removeClass('open');
                      $('._select_list').removeClass('open').slideUp(200);
                    }
                  });*/
            }
            $(this).next().find('span').on('click',function() {
                var option = $(this).text();
                console.log(option)
                $(this).parents('.select-box').find('._select_default .text').text(option);
            });
        });
    }


    return {
        a: a,
        swiperTab : swiperTab,
        commonHandler: commonHandler,
        init: init,
        scrollHorizon : scrollHorizon,
        selectDefault : selectDefault
    }
})();

$(function () {
    front.common.init();
});
