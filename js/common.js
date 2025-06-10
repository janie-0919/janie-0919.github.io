/**
 * --------------------------------------------------------------------------
 *  common.js
 * --------------------------------------------------------------------------
 */

var front = front || {};

front.common = front.common || {};

front.common = (function () {

  let init = function() {
    this.a();
    this.commonHandler();
  };

  let a = function () {
    $('a[href="#"]').on('click', function (e) {
      e.preventDefault();
    });
  }

  let commonHandler = function () {
      anime({
          targets: '#bubble-1 path',
          d: [
              'M639.86,0c-5.48,25.2-18.66,49.39-38.91,69.59c-39.95,39.84-106.2,62.95-171.17,59.7\n' +
              '\tc-6.9-0.34-13.86-0.95-20.84-1.68c-36.5-3.79-73.69-10.7-106.43,1.11c-27.8,10.03-45.57,31.55-70.66,45.2\n' +
              '\tc-32.82,17.86-76.99,20.78-115.17,11.25c-38.16-9.53-70.5-30.45-94.13-55.56C14.39,120.93,7.16,111.73,0,102.5V0H639.86z',
              'M495.82,0c-4.25,25.2-14.46,49.39-30.15,69.59c-30.96,39.84-82.29,62.95-132.64,59.7\n' +
              '        c-5.35-0.34-10.74-0.95-16.15-1.68c-28.28-3.79-57.1-10.7-82.47,1.11c-21.54,10.03-35.31,31.55-54.75,45.2\n' +
              '\tc-25.43,17.86-59.66,20.78-89.24,11.25c-29.57-9.53-54.63-30.45-72.94-55.56C11.15,120.93,5.55,111.73,0,102.5V0H495.82z'
          ],
          easing: 'easeOutQuad',
          duration: 3000,
          loop: true,
          direction: 'alternate',
      });

      anime({
          targets: '#bubble-2 path',
          d: [
              'M639.86,0c-5.48,25.2-18.66,49.39-38.91,69.59c-39.95,39.84-106.2,62.95-171.17,59.7\n' +
              '\tc-6.9-0.34-13.86-0.95-20.84-1.68c-36.5-3.79-73.69-10.7-106.43,1.11c-27.8,10.03-45.57,31.55-70.66,45.2\n' +
              '\tc-32.82,17.86-76.99,20.78-115.17,11.25c-38.16-9.53-70.5-30.45-94.13-55.56C14.39,120.93,7.16,111.73,0,102.5V0H639.86z',
              'M495.82,0c-4.25,25.2-14.46,49.39-30.15,69.59c-30.96,39.84-82.29,62.95-132.64,59.7\n' +
              '        c-5.35-0.34-10.74-0.95-16.15-1.68c-28.28-3.79-57.1-10.7-82.47,1.11c-21.54,10.03-35.31,31.55-54.75,45.2\n' +
              '\tc-25.43,17.86-59.66,20.78-89.24,11.25c-29.57-9.53-54.63-30.45-72.94-55.56C11.15,120.93,5.55,111.73,0,102.5V0H495.82z'
          ],
          easing: 'easeOutQuad',
          duration: 3000,
          loop: true,
          direction: 'alternate',
      });

      gsap.registerPlugin(ScrollTrigger);

      const SECTIONS = gsap.utils.toArray('section');
      const paginationWrap = document.querySelector('.pagination-wrap ul');

      paginationWrap.innerHTML = SECTIONS.map((_, index) =>
          `<li${index === 0 ? ' class="active"' : ''}><span class="sr-only">${index + 1}</span></li>`
      ).join("");

      const paginationItems = document.querySelectorAll('.pagination-wrap li');

      function findActiveIndex(progress, sectionCount) {
          const step = 1 / sectionCount;
          return Math.min(Math.floor(progress / step), sectionCount - 1);
      }

      ScrollTrigger.create({
          trigger: '#wrap',
          start: 'top top',
          end: 'bottom bottom',
          markers: false,
          onUpdate(self) {
              const activeIndex = findActiveIndex(self.progress, SECTIONS.length);
              paginationItems.forEach((item, index) => {
                  item.classList.toggle('active', index === activeIndex);
              });
          }
      });

      $(document).ready(function() {
          let maxHeight = 0;

          $('.card-wrap .card').each(function() {
              let h = parseInt($(this).css('height'));
              if (maxHeight < h) {
                  maxHeight = h;
              }
          })

          $('.card-wrap ._cardHeight').each(function() {
              $(this).css({
                  height: maxHeight
              });
          })

          $('._careerTitle').on('click', function() {
              if ($(this).parent().hasClass('active')) {
                  $(this).parent().removeClass('active');
                  $(this).siblings('.item-body').slideUp(200);

              } else {
                  $('.item').removeClass('active');
                  $('.item-body').slideUp(200);
                  $(this).parent().addClass('active');
                  $(this).siblings('.item-body').slideDown(200);
              }

              let getGalleryNum = $(this).siblings().children('._imgList').find('a').eq(0).attr('data-magnify')
              // console.log(getGalleryNum)

              $(`[data-magnify = ${getGalleryNum}]`).magnify({
                  title: false,
                  headerToolbar: [
                      'close'
                  ],
                  footerToolbar: [
                      'zoomOut',
                      'zoomIn',
                      'prev',
                      'next',
                  ]
              });
          });

          $('._imgList').each(function(){
              let ranNum = Math.random();
              let galleryNum = Math.floor(ranNum * 100)
              let $img = $(this).children();

              $img.attr('data-magnify',galleryNum);
          });

          function barSet() {
              $('.bar').each(function () {
                  let percent = $(this).data('percent');

                  $(this).css('width', percent + '%');
              });
          }

          barSet();
      });
  };

  return {
    a,
    commonHandler,
    init
  }
})();

$(function () {
  front.common.init();
});