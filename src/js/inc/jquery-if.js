import $ from 'jquery';

export default (selector, func, funcElse) => {
  (function check($el) {
    if ($el.length !== 0) {
      func($el);
    } else
    if (typeof funcElse === 'function') {
      funcElse();
    }
  }($(selector)));
};
