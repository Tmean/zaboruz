import { debounce } from 'lodash';
import { $window, $body } from './globals';

class Fitter {
  constructor($el, positioner) {
    this.$el = $el;
    this.positioner = positioner;
    this.id = Math.random();

    this.debouncePlace = debounce(() => {
      this.place();
    }, 250);

    this.place();
    this.handleWindow();
  }

  place() {
    const { body } = document;
    const html = document.documentElement;
    const elDisplayState = this.$el.css('display');
    const offset = 10;

    const documentWidth = $body.prop('clientWidth');
    const documentHeight = Math.max(
      body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight,
    );
    let coords;
    let $offsetParent;

    if (typeof this.positioner === 'undefined') {
      $offsetParent = this.$el.offsetParent();
      const elOffset = this.$el.offset();
      const parentOffset = $offsetParent.offset();
      coords = {
        x: elOffset.left - parentOffset.left,
        y: elOffset.top - parentOffset.top,
      };
    } else {
      coords = this.positioner();
    }

    this.$el.css({
      left: coords.x,
      top: coords.y,
    });

    if (elDisplayState === 'none') {
      this.$el.css('display', 'inline-block');
    }

    const elOffset = this.$el.offset();
    const width = this.$el.outerWidth();
    const height = this.$el.outerHeight();

    if (elDisplayState === 'none') {
      this.$el.css('display', '');
    }

    if (elOffset.top < 0 + offset) {
      this.$el.css({
        top: coords.y + Math.abs(elOffset.top) + offset,
      });
    }

    if (elOffset.left + width > documentWidth - offset) {
      this.$el.css({
        left: coords.x - (elOffset.left + (width - (documentWidth - offset))),
      });
    }

    if (elOffset.top + height > documentHeight - offset) {
      this.$el.css({
        top: coords.y - (elOffset.top + (height - (documentHeight - offset))),
      });
    }

    if (elOffset.left < 0 + offset) {
      this.$el.css({
        left: coords.x + Math.abs(elOffset.left) + offset,
      });
    }
  }

  handleWindow() {
    $window.bind(`resize.fitter-${this.id}`, (this.debouncePlace).bind(this));
  }

  destroy() {
    this.$el.css({
      left: '',
      top: '',
    });
    $window.unbind(`resize.fitter-${this.id}`);
  }
}

export default Fitter;
