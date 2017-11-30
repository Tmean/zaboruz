import $ from 'jquery';
import { debounce } from 'lodash';

import {
  $document, $html, $window,
  getCurrentBreakpoint, scrollbarWidth, isContentLocked,
} from '../globals';

const className = 'js-popup';
const linkClassName = 'js-popup__link';
const cached = {};

function hideAll() {
  Object.keys(cached).forEach((name) => {
    if (cached[name].active) {
      cached[name].hide();
    }
  });
}

class Popup {
  constructor(name) {
    this.$el = $document.find(`.${className}[data-popup=${name}]`);
    this.$content = this.$el.find('.js-popup__content');

    if (this.$el.length === 0) {
      this.error = `Can't get the popup with name "${name}"`;
    }

    this.name = name;
    this.animating = false;
    this.active = false;

    this.touchPos = {
      x: 0,
      y: 0,
    };

    this.debouncePosition = debounce(this.position, 250);
  }

  on(event, func) {
    this.$el.on(event, func);
  }

  trigger(event, data) {
    this.$el.trigger(event, data);
  }

  show($link = false) {
    this.$link = $link;

    if (this.active) {
      this.hideEnd();
    }
    hideAll();

    if (this.$el.data('popup-relative') === true) {
      this.position();
      $window.on('resize.popupPosition', this.debouncePosition.bind(this));
    }

    this.$el.addClass('is-active').hide().show(0);
    this.$el.on('transitionend webkitTransitionEnd oTransitionEnd', () => {
      this.showEnd();
    });
    this.$el.addClass('is-visible');
    this.animating = true;
    this.active = true;
    this.activateLinks();

    $document.on(`touchstart.popup-background-handler_${this.name}`, (event) => {
      this.touchPos = {
        x: event.originalEvent.touches[0].pageX,
        y: event.originalEvent.touches[0].pageY,
      };
    });

    $document.on(`touchend.popup-background-handler_${this.name}`, (event) => {
      if (
        Math.abs(event.originalEvent.changedTouches[
          event.originalEvent.changedTouches.length - 1].pageX
          - this.touchPos.x) <= 10
        && Math.abs(event.originalEvent.changedTouches[
          event.originalEvent.changedTouches.length - 1].pageY
          - this.touchPos.y) <= 10
      ) {
        const $target = $(event.target);

        if (!($target.hasClass(className) || $target.hasClass(linkClassName) ||
          $target.parents(`.${className}`).length !== 0)) {
          this.hide();
        }
      }
    });

    $document.on(`click.popup-background-handler_${this.name}`, (event) => {
      const $target = $(event.target);

      if (!($target.hasClass(className) || $target.hasClass(linkClassName) ||
        $target.parents(`.${className}`).length !== 0)) {
        this.hide();
      }
    });

    return this;
  }

  showEnd() {
    this.$el.off('transitionend webkitTransitionEnd oTransitionEnd');
    this.animating = false;
    this.trigger('show');
  }

  hide() {
    this.showEnd();

    this.$content.css({ left: scrollbarWidth / 2 });

    if (getCurrentBreakpoint() === 'mobile') {
      this.$el.css({ top: this.scrolled });
    }

    $window.off('resize.popupPosition');

    this.$el.removeClass('is-visible');
    this.$el.on('transitionend webkitTransitionEnd oTransitionEnd', () => {
      this.hideEnd();
    });
    this.animating = true;
    this.deactivateLinks();

    $document.off(`click.popup-background-handler_${this.name} touchstart.popup-background-handler_${this.name} touchend.popup-background-handler_${this.name}`);

    return this;
  }

  hideEnd() {
    this.$el.removeClass('is-active');
    this.$el.off('transitionend webkitTransitionEnd oTransitionEnd');
    this.animating = false;
    this.active = false;

    this.$el.css({ top: '', left: '' });

    this.trigger('hide');
  }

  toggle($link) {
    if (this.active) {
      this.hide();
    } else {
      this.show($link);
    }
  }

  position() {
    if (this.$link) {
      const linkPos = this.$link.offset();
      this.$el.css({
        position: isContentLocked() ? 'fixed' : '',
        top: linkPos.top + this.$link.outerHeight() + 10,
        left: Math.min(Math.max(
          (this.$el.outerWidth() / 2) + 10,
          linkPos.left + (this.$link.outerWidth() / 2),
        ), $html.width() -
            (this.$el.outerWidth() / 2) - 10),
      });
    }
  }

  activateLinks() {
    $document.find(`.${linkClassName}[data-popup='${this.name}']`)
      .addClass('is-active');
  }

  deactivateLinks() {
    $document.find(`.${linkClassName}[data-popup='${this.name}']`)
      .removeClass('is-active');
  }

  destroy() {
    this.$el.remove();
    delete cached[this.name];
  }
}

function getInstance(name) {
  if (cached[name] !== undefined) {
    return cached[name];
  }

  cached[name] = new Popup(name);

  if (cached[name].error) {
    console.warn(cached[name].error); // eslint-disable-line
  }

  return cached[name];
}

$document.on('click.popup-link', `.${linkClassName}`, (event) => {
  event.preventDefault();
  getInstance($(event.currentTarget).data('popup')).toggle($(event.currentTarget));
});

$document.on('click.popup-close', `.${className}__close`, () => {
  hideAll();
});

$document.on('click.popup-close', `.${className}__close-exact`, (event) => {
  if ($(event.target).hasClass(`${className}__close-exact`)) {
    hideAll();
  }
});

export default getInstance;
