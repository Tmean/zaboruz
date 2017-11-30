import $ from 'jquery';

import { $document, detectBreakpoint } from '../globals';

$document.ready(() => {
  const $groups = $('.js-calculator-fence-group');

  $document.on('click.calculator-fence-group', '.js-calculator-fence-group__toggle', (event) => {
    const $group = $(event.currentTarget).parents('.js-calculator-fence-group');
    const $content = $group.find('.js-calculator-fence-group__content');

    if ($group.hasClass('is-active')) {
      $content.css({
        maxHeight: `${$content.outerHeight()}px`,
        overflow: 'hidden',
      });
      $group.removeClass('is-active');
      $content.stop().animate({
        maxHeight: '0px',
      }, 500);
    } else {
      $content.css({
        maxHeight: `${$content.outerHeight()}px`,
        overflow: 'hidden',
      });
      $group.addClass('is-active');
      $content.stop().animate({
        maxHeight: `${$content[0].scrollHeight}px`,
      }, 500, () => {
        $content.css({
          maxHeight: 'none',
          overflow: 'auto',
        });
      });
    }
  });

  detectBreakpoint.on('change', (current) => {
    if (current === 'mobile') {
      $groups.filter(':not(.is-active)').find('.js-calculator-fence-group__content').css({
        maxHeight: '0px',
        overflow: 'hidden',
      });
    } else {
      $groups.filter(':not(.is-active)').find('.js-calculator-fence-group__content').css({
        maxHeight: 'none',
        overflow: 'auto',
      });
    }
  });
});
