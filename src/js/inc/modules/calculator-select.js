import $ from 'jquery';
import { $document, $wrapper, $window } from '../globals';

$document.ready(() => {
  $('.js-calculator-select').each((index, item) => {
    const $select = $(item);
    const $target = $select.find('.js-calculator-select__target');
    const $targetIcon = $select.find('.js-calculator-select__target-icon');
    const $targetTitle = $select.find('.js-calculator-select__target-title');
    const $list = $select.find('.js-calculator-select__list');
    const $items = $select.find('.js-calculator-select__item');

    let $listClone;
    let $cloneItems;
    let isActive = false;

    const hide = () => {
      $select.removeClass('is-active');

      isActive = false;
      $listClone.remove();
      $document.off('click.select-hide');
      $window.off('resize.select-hide');
    };

    const show = () => {
      $select.addClass('is-active');

      isActive = true;
      $listClone = $list.clone();
      $cloneItems = $listClone.find('.js-calculator-select__item');
      $wrapper.append($listClone);

      const offset = $target.offset();

      $listClone.css({
        display: 'inline-block',
        top: offset.top + $target.outerHeight(),
        left: offset.left,
        width: $target.outerWidth(),
      });

      $cloneItems.click((event) => {
        const $item = $(event.currentTarget);
        if (!$item.hasClass('is-selected')) {
          const value = $item.data('select-value');
          $items.removeClass('is-selected').filter(`[data-select-value=${value}]`).addClass('is-selected');
          $targetIcon.css('background-image', `url(${$item.data('select-icon')})`);
          $targetTitle.text($item.find('.js-calculator-select__item-title').text());
          $select.val(value);
          $select.trigger('change');
          hide();
        }
      });

      $document.on('click.select-hide', (event) => {
        const $eTarget = $(event.target);
        if ($eTarget.parents('.js-calculator-select__list').length === 0) {
          hide();
        }
      });

      $window.on('resize.select-hide', () => {
        hide();
      });
    };

    $target.click((event) => {
      if ($select.hasClass('is-disabled')) {
        return;
      }

      if (!isActive) {
        event.stopPropagation();
        show();
      }
    });
  });
});
