import $ from 'jquery';
import { debounce } from 'lodash';

import Emitter from './emitter';

const emitter = new Emitter();

export const $document = $(document);
export const $window = $(window);
export const $body = $('body');
export const $html = $('html');
export const $htmlAndBody = $('html, body');
export const $wrapper = $('.js-global-wrapper');

// https://stackoverflow.com/questions/13382516/getting-scroll-bar-width-using-javascript
export const scrollbarWidth = (function getScrollbarWidth() {
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps

  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';
  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);

  return widthNoScroll - widthWithScroll;
}());


export const minWidth = 320;
export const maxWidth = 1200;

export const breakpoints = {
  mobile: 320,
  tablet: 768,
  desktop: 1170,
};

let currentBreakpoint = null;

export function detectBreakpoint() {
  const width = window.innerWidth;
  let breakpoint = 'mobile';
  let value = 0;

  Object.keys(breakpoints).forEach((bp) => {
    if (breakpoints[bp] > value && breakpoints[bp] <= width) {
      breakpoint = bp;
      value = breakpoints[bp];
    }
  });

  if (breakpoint !== currentBreakpoint) {
    currentBreakpoint = breakpoint;
    emitter.emit('change', currentBreakpoint);
  }
}

detectBreakpoint.on = function on(event, func) {
  emitter.on(event, func);
};

export const getCurrentBreakpoint = function getCurrentBreakpoint() {
  return currentBreakpoint;
};

detectBreakpoint();

export const detectBreakpointDebounce = debounce(detectBreakpoint, 300);

$window.resize(detectBreakpointDebounce);

let scrolled = 0;
let locked = false;

export function lockContent(simulateScrollbar = true) {
  if (locked) {
    return scrolled;
  }

  scrolled = Math.max($html.scrollTop(), $body.scrollTop());
  locked = true;
  if (getCurrentBreakpoint() === 'mobile') {
    $wrapper.addClass('is-locked');
    $wrapper.scrollTop(scrolled);
  } else {
    $body.addClass('is-locked');
    $body.scrollTop(scrolled);
    if (simulateScrollbar) {
      $wrapper.css({ 'padding-right': scrollbarWidth });
    }
  }
  return scrolled;
}

export function unlockContent() {
  if (!locked) {
    return;
  }

  $wrapper.removeClass('is-locked');
  $body.removeClass('is-locked');
  $wrapper.css({ 'padding-right': '' });
  $htmlAndBody.scrollTop(scrolled);
  locked = false;
}

export function isContentLocked() {
  return locked;
}

export const formatNumber = function formatNumber(number) {
  return parseFloat(number).toLocaleString('en').replace(/(,)/g, ' ');
};

export const onElementHeightChange = function onElementHeightChange(elm, callback) {
  let lastHeight = elm.clientHeight;
  let newHeight;
  const el = elm;
  (function run() {
    newHeight = elm.clientHeight;
    if (lastHeight !== newHeight) {
      callback();
    }
    lastHeight = newHeight;

    if (elm.onElementHeightChangeTimer) {
      clearTimeout(elm.onElementHeightChangeTimer);
    }
    el.onElementHeightChangeTimer = setTimeout(run, 500);
  }());

  return function removeEventListener() {
    clearTimeout(el.onElementHeightChangeTimer);
  };
};

// Uncomment this code if you have bitmap icons in css

// (function loadIcons() {
//   function getPack() {
//     if (window.matchMedia) {
//       const mq = window.matchMedia('only screen and (min--moz-device-pixel-ratio: 1.5),
//        only screen and (-o-min-device-pixel-ratio: 3/2), only screen and
//        (-webkit-min-device-pixel-ratio: 1.5), only screen and (min-device-pixel-ratio: 1.5),
//          only screen and (min-resolution: 144dpi)');
//       if ((mq && mq.matches) || (window.devicePixelRatio > 1)) {
//         return 'retina';
//       }
//     }
//     return 'default';
//   }

//   const iconsCss = document.createElement('link');
//   iconsCss.setAttribute('rel', 'stylesheet');
//   iconsCss.setAttribute('type', 'text/css');
//   iconsCss.setAttribute('href', `../css/${getPack()}Icons.css`);
//   document.getElementsByTagName('head')[0].appendChild(iconsCss);
// }());
