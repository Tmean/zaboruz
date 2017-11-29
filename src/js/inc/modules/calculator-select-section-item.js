import $ from 'jquery';
import { $document } from '../globals';

$document.ready(() => {
  $('.js-calculator-select-section-item__button').click((event) => {
    const $target = $(event.currentTarget);
    const $item = $target.parents('.js-calculator-select-section-item');

    if (!$item.hasClass('is-active')) {
      const $active = $('.js-calculator-select-section-item.is-active');
      $active.removeClass('is-active');
      $active.find('.js-calculator-select-section-item__button').removeClass('is-active').html('Выбрать');

      $item.addClass('is-active');
      $target.addClass('is-active').html('Выбрано');
    }
  });
});
