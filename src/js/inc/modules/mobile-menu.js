import $ from 'jquery';
import { after } from 'lodash';
import { $document, $htmlAndBody, lockContent, unlockContent } from '../globals';

$document.ready(() => {
  const $menu = $('.js-mobile-menu');
  const $button = $('.js-mobile-menu__button');
  const $arrows = $('.js-mobile-menu__arrow');

  const hide = () => {
    unlockContent();
    $menu.stop().animate({
      opacity: 0,
    }, 500, () => {
      $menu.css('display', 'none');
    });

    $document.off('click.mobile-menu-overlay');
  };

  const show = () => {
    $htmlAndBody.scrollTop(0);
    lockContent(false);
    setTimeout(() => {
      lockContent(false);
    }, 50);
    $menu.css('display', 'block').stop().animate({
      opacity: 1,
    }, 500);

    $document.on('click.mobile-menu-overlay', after(2, (event) => {
      const $target = $(event.target);
      if (!$target.hasClass('js-mobile-menu') && $target.parents('.js-mobile-menu').length === 0 && !$target.hasClass('js-mobile-menu__button') && $target.parents('.js-mobile-menu__button').length === 0) {
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

  const hideList = ($list) => {
    $list.stop().css('max-height', `${$list.outerHeight()}px`).animate({
      maxHeight: '0px',
    }, 500);
  };

  const showList = ($list) => {
    $list.stop().animate({
      maxHeight: $list[0].scrollHeight,
    }, 500, () => {
      $list.css('max-height', 'none');
    });
  };

  $arrows.click((event) => {
    event.preventDefault();
    const $target = $(event.currentTarget);
    const $item = $target.parent();
    const $list = $item.next();

    if ($item.hasClass('is-active')) {
      hideList($list);
    } else {
      showList($list);
    }
    $item.toggleClass('is-active');
  });
});
