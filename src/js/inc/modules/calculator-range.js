import $ from 'jquery';
import 'rangeslider.js';
import { $document } from '../globals';

$document.ready(() => {
  $('.js-calculator-range').each((i, item) => {
    const $el = $(item);
    const $target = $el.find('.js-calculator-range__target');
    const $input = $el.find('.js-calculator-range__input');

    $input.change(() => {
      $target.val($input.val());
      $target.rangeslider('update', true);
      $target.trigger('change');
    });

    $target.rangeslider({
      polyfill: false,
      rangeClass: 'calculator-range__range-input',
      disabledClass: 'calculator-range__range-input_disabled',
      horizontalClass: 'calculator-range__range-input_horizontal',
      verticalClass: 'calculator-range__range-input_vertical',
      fillClass: 'calculator-range__range-input-fill',
      handleClass: 'calculator-range__range-input-handle',
      onSlide(position, value) {
        $input.val(value);
      },
    });
  });
});
