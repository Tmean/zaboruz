import $ from 'jquery';

import { $document } from './globals';
import Emitter from './emitter';

const events = new Emitter();

const Tab = {};
const activeAnimations = {};

Tab.on = (event, func) => events.on(event, func);

Tab.trigger = (event, data) => events.emit(event, data);

Tab.select = function select(group, tab) {
  const $links = $('.js-tab__link').filter(`[data-tab-group="${group}"]`)
    .removeClass('is-active');
  const $tabs = $('.js-tab').filter(`[data-tab-group="${group}"]`)
    .removeClass('is-active');
  $links.filter(`[data-tab="${tab}"]`).addClass('is-active');
  $tabs.filter(`[data-tab="${tab}"]`).addClass('is-active');
};

$document.on('click', '.js-tab__link', (event) => {
  event.preventDefault();
  const $this = $(event.currentTarget);
  const group = $this.data('tab-group');

  if (activeAnimations[group]) {
    return;
  }

  let current;
  let next;
  let $current;
  let $next;
  let animate = false;

  if ($this.data('tab-rotate')) {
    const $tabs = $('.js-tab').filter(`[data-tab-group="${group}"]`);
    current = $tabs.index($tabs.filter('.is-active')) || 0;
    next = current + 1;
    if (next >= $tabs.length) {
      next = 0;
    }

    $current = $tabs.eq(current);
    $next = $tabs.eq(next);

    animate = $next.data('tab-animate') || false;
  } else {
    const $links = $('.js-tab__link')
      .filter(`[data-tab-group="${$this.data('tab-group')}"]`)
      .removeClass('is-active');
    const $tabs = $('.js-tab')
      .filter(`[data-tab-group="${$this.data('tab-group')}"]`);

    $current = $tabs.filter('.is-active');
    $next = $tabs.filter(`[data-tab="${$this.data('tab')}"]`);

    $links.filter(`[data-tab="${$this.data('tab')}"]`).addClass('is-active');

    animate = $next.data('tab-animate') || false;

    Tab.trigger('change', {
      group: $this.data('tab-group'),
      tab: $this.data('tab'),
    });
  }

  if (animate) {
    activeAnimations[group] = true;
    $current.on('transitionend webkitTransitionEnd oTransitionEnd', (transitionEvent) => {
      $current.off(transitionEvent);
      $current.removeClass(`is-active transition \
        transition_${animate}_leave-from transition_${animate}_active \
        transition_${animate}_active-leave transition_${animate}_leave-to`);
      $next.addClass(`is-active transition transition_${animate}_enter-from`);
      $next.hide().show(0); // force redraw element
      $next.on('transitionend webkitTransitionEnd oTransitionEnd', (nextTransitionEvent) => {
        $next.off(nextTransitionEvent);
        $next.removeClass(`transition transition_${animate}_enter-from \
          transition_${animate}_active transition_${animate}_active-enter \
          transition_${animate}_enter-to`);
        delete activeAnimations[group];
      });
      $next.addClass(`transition_${animate}_active \
        transition_${animate}_active-enter transition_${animate}_enter-to`);
    });
    $current.addClass(`transition transition_${animate}_leave-from`);
    $current.addClass(`transition_${animate}_active \
      transition_${animate}_active-leave transition_${animate}_leave-to`);
  } else {
    $current.removeClass('is-active');
    $next.addClass('is-active');
  }
});

export default Tab;
