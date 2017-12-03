import $ from 'jquery';
import { after } from 'lodash';
import { $document, $htmlAndBody, lockContent, unlockContent, detectBreakpoint } from '../globals';

$document.ready(() => {
  const $popup = $('.js-mobile-phones');
  const $button = $('.js-mobile-phones__button');
  let breakpointDetection;

  const hide = () => {
    unlockContent();
    breakpointDetection();
    $popup.stop().animate({
      opacity: 0,
    }, 500, () => {
      $popup.css('display', 'none');
    });

    $document.off('click.mobile-phones-overlay');
  };

  const show = () => {
    $htmlAndBody.scrollTop(0);
    lockContent(false);
    breakpointDetection = detectBreakpoint.on('change', (to) => {
      if (to !== 'mobile') {
        $button.removeClass('is-active');
        hide();
      }
    });
    setTimeout(() => {
      lockContent(false);
    }, 50);
    $popup.css('display', 'block').stop().animate({
      opacity: 1,
    }, 500);

    $document.on('click.mobile-phones-overlay', after(2, (event) => {
      const $target = $(event.target);
      if (!$target.hasClass('js-mobile-phones') && $target.parents('.js-mobile-phones').length === 0 && !$target.hasClass('js-mobile-phones__button') && $target.parents('.js-mobile-phones__button').length === 0) {
        hide();
        $button.removeClass('is-active');
      }
    }));
  };

  $button.click(() => {
    if (!$button.hasClass('is-active')) {
      show();
    } else {
      hide();
    }
  });
});
