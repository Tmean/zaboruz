import $ from 'jquery';
import { $document } from '../globals';
import Fitter from '../fitter';

$document.ready(() => {
  const $nesting = $('.js-menu__nesting');

  $nesting.on('mouseenter', (event) => {
    const $target = $(event.currentTarget);
    const $nested = $target.find('> .js-menu__nested');
    $nested.addClass('is-active');
    const fitter = new Fitter($nested);

    $target.on('mouseleave.menu-leave', () => {
      $nested.removeClass('is-active');
      fitter.destroy();
      $target.off('mouseleave.menu-leave');
    });
  });
});
