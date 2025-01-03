/**
 * block event
 * */

$('a[href="#"]').on('click', function (e) {
  e.preventDefault();
});

/**
 * ******************************************************************
 * */

/**
 * vh
 * */

const setVh = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`)
};

setVh();
/**
 * ******************************************************************
 * */

/**
 * Input UI
 * */
$('.btn-eye').on('click', function () {
    let inputField = $(this).siblings('.form-control');

    if (inputField.attr('type') === 'password') {
        inputField.attr('type', 'text');
        $(this).addClass('show');
    } else {
        inputField.attr('type', 'password');
        $(this).removeClass('show');
    }
});

$('.btn-del').on('click', function () {
    let inputField = $(this).siblings('.form-control');
    inputField.val('');
});

/**
 * ******************************************************************
 * */

/**
 * header UI
 * */
$(window).scroll(function() {
    if ($(this).scrollTop() > 0) {
        $('.header-wrap').addClass('scrolling');
    } else {
        $('.header-wrap').removeClass('scrolling');
    }
});
/**
 * ******************************************************************
 * */


/**
 * bottom menu UI
 * */
$('.bottom-menu a').on('click', function () {
    $(this).parent().addClass('on').siblings().removeClass('on')
});
/**
 * ******************************************************************
 * */

/**
 * Tab UI
 * */
$('._tabContainer').each(function() {
    let $tabs = $(this).find('._tab .item:not(.disabled)');
    let $tabPanels = $(this).find('.tab-content .tab-panel');

    $tabs.on('click', function() {
        if (!$(this).hasClass('on')) {
            // 현재 선택된 탭 표시
            $tabs.removeClass('on');
            $(this).addClass('on');

            // 해당 탭 패널 표시
            $tabPanels.hide();
            let index = $(this).index();
            $tabPanels.eq(index).show();
        }
    });
});
/**
 * ******************************************************************
 * */

/**
 * Menu Popup UI
 * */
$('._openMenuPopup').on('click', function () {
    const targetMenu = $(this).data('target');
    $('._dim').fadeIn();
    $(targetMenu).addClass('active');
});

$('._closeMenuPopup').on('click', function () {
    const menuPopup = $(this).closest('._menuPopup');
    menuPopup.removeClass('active');
    $('._dim').fadeOut();
});
/**
 * ******************************************************************
 * */

/**
 * Floating Popup UI
 * */
$('._openFloatingPopup').on('click', function () {
    const targetPopup = $(this).data('target');
    $('._dim').fadeIn();
    $(targetPopup).css('bottom', '0');
});

$('._closeFloatingPopup').on('click', function () {
    const popup = $(this).closest('._floatingPopup');
    popup.css('bottom', '-100%');
    $('._dim').fadeOut();
});

$('._dim').on('click', function () {
    $('._floatingPopup').css('bottom', '-100%');
    $('._dim').fadeOut();
});
/**
 * ******************************************************************
 * */