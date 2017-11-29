import $ from 'jquery';
import { $document } from '../globals';

$document.ready(() => {
  const $readMoreButton = $('.js-about__read-more');
  $readMoreButton.click(() => {
    const $content = $('.js-about__content');
    $content.animate({
      maxHeight: $content[0].scrollHeight,
    }, 500, () => {
      $content.css('max-height', 'none');
      $content.addClass('is-expanded');
      $readMoreButton.remove();
    });
  });
});
