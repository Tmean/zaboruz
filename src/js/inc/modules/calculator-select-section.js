import $ from 'jquery';

import { $document } from '../globals';

$document.ready(() => {
  const $button = $('.js-calculator-select-section__button');
  const $additional = $('.js-calculator-select-section__additional');

  $button.click(() => {
    $additional.animate({
      maxHeight: `${$additional[0].scrollHeight}px`,
    }, 500, () => {
      $button.remove();
      $additional.css({
        maxHeight: 'none',
        overflow: 'initial',
      });
    });
  });
});
