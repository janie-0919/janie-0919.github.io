/**
 * --------------------------------------------------------------------------
 *  common.js
 *  v0.1 - footerSelect / selectDefault 추가 - 선미 ( 21.10.28 )
 * --------------------------------------------------------------------------
 */

var front = front || {};


front.common = front.common || {};

front.common = (function () {

  var init = function() {
    this.a();
    this.commonHandler();
    this.scrollHeader();
    this.footerSelect();
    this.selectDefault();
  };

  var a = function () {
    $('a[href="#"]').on('click', function (e) {
      e.preventDefault();
    });
  }
  var scrollHeader = function () {
    var scrollableElement = document.body; //document.getElementById('scrollableElement');
    scrollableElement.addEventListener('wheel', checkScrollDirection);
    // console.log(scrollableElement);
  }

  function checkScrollDirection(event) {
    // console.log('scrollableElement');
    // console.log(event.deltaY < 0);
    // console.log(window.pageYOffset);
    if (event.deltaY < 0) {
      // console.log('UP');
      if (window.pageYOffset > 124){
        $('.header').show()
            .css({'position': 'fixed','top':'0'})
            .addClass('header-sm')
      } else {
        $('.header').show()
            .css({'position': 'relative'})
            .removeClass('header-sm');
        $('.header-main').show()
            .css({'position': 'absolute'})
      }
    } else {
      // console.log('Down');
      // console.log(window.scrollY);
      if (window.pageYOffset > 124){
        $('.header').hide()
      }
    }
  }

  var commonHandler = function () {
    $('._btnTooltip').on('click',function (){
        $('.text-box').hide();
        $(this).siblings().show();
      })

    $('._btnTooltipClose').on('click',function (){
        $(this).parent().hide();
      })

    $('._fileUpload .form-control-file').on('change', function(){
      var target = $(this).parent().find('.file-box');
      if(typeof(this.files) !='undefined'){
        if(this.files.length == 0){
          target.removeClass('withFile').text(target.data('default'));
        }
        else {
          var file = this.files[0];
          var name = file.name;
          target.parent().addClass('withFile');
          target.html('<span>'+ name +'</span><a href="#" class="btn-delete"><em class="sr-only">file delete</em></a>');
        }
      }
      return false;
    });

    if(!$('.full-bg.macrogen.no-bg').length) {
      if($('.full-bg.macrogen').length) {
        if($('html, body').scrollTop() === 0) {
          // 서브 배경 애니메이션
          var sub = setTimeout(function() {
            // console.log($('html, body').scrollTop())
            if($('html, body').scrollTop() !== 0) clearTimeout(sub)
            else $('html, body').animate({scrollTop: 980}, 200);
          }, 3000);
        }
      }
      // 스크롤 애니메이션
      AOS.init();
    }
  }

  var footerSelect = function () {
    var selectSite = $(".family-box ._select_site");
    $('._popup_box').hide();

    selectSite.on('click',function() {
      //드롭다운 닫기
      if(selectSite.hasClass('open')) {
        selectSite.removeClass("open").next('._popup_box').slideUp(200);
      }
      //드롭다운 열기
      else {
        selectSite.addClass("open").next('._popup_box').slideDown(200);
        $('body').on('click',function (e){
          if(selectSite.hasClass('open')) {
            if(!selectSite.has(e.target).length) {
              selectSite.removeClass("open").next('._popup_box').slideUp(200);
            }
          }
        })
      }
    });
    $("._popup_box a").on('click',function() {
      var option = $(this).find('span').text();
      console.log(option)
      $('._select_box ._select_site').find('span').text(option);
    });
  }

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
    a : a,
    commonHandler : commonHandler,
    scrollHeader : scrollHeader,
    footerSelect : footerSelect,
    selectDefault : selectDefault,
    init : init,
  }
})();

$(function () {
  front.common.init();
});
