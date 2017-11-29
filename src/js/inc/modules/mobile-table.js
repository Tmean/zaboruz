import $ from 'jquery';
import { $document, $window, lockContent, unlockContent } from '../globals';

let $popup;
let $close;
let $heading;
let $body;

function set(data = {}) {
  $heading.html(data.heading || '');
  $body.html(data.body || '');
}

function showEnd() {
  $popup.off('transitionend webkitTransitionEnd oTransitionEnd');
}

function hideEnd() {
  $popup.removeClass('is-active');
  $popup.off('transitionend webkitTransitionEnd oTransitionEnd');
  unlockContent();
}

function show() {
  hideEnd();

  lockContent(false);
  $popup.addClass('is-active');
  // Force update opacity
  window.getComputedStyle($popup[0]).opacity; // eslint-disable-line
  $popup.on('transitionend webkitTransitionEnd oTransitionEnd', () => {
    showEnd();
  });
  $popup.addClass('is-visible');
}

function hide() {
  showEnd();
  $popup.removeClass('is-visible');
  $popup.on('transitionend webkitTransitionEnd oTransitionEnd', () => {
    set();
    hideEnd();
  });
  $window.off('resize.table-mobile');
}

$document.ready(() => {
  $popup = $('.js-mobile-table');
  $close = $('.js-mobile-table__close');
  $heading = $('.js-mobile-table__heading');
  $body = $('.js-mobile-table__body');

  $close.click(hide);

  $document.on('click', '.js-mobile-table__link', (event) => {
    const $target = $(event.currentTarget);
    const $content = $($target.data('table-target')).clone();
    $content.find('.help-link').remove();
    set({
      heading: $target.data('table-heading'),
      body: $content,
    });
    show();
  });
});
