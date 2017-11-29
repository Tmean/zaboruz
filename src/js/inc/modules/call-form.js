import $ from 'jquery';
import inputmask from 'inputmask';
import { $document } from '../globals';

$document.ready(() => {
  $('.js-call-form').each((i, form) => {
    const $form = $(form);
    const $name = $form.find('.js-call-form__name');
    const $nameError = $form.find('.js-call-form__name-error');
    const $phone = $form.find('.js-call-form__phone');
    const $phoneError = $form.find('.js-call-form__phone-error');
    const $submit = $form.find('.js-call-form__submit');

    $name.on('input', () => {
      if ($name.val().trim() === '') {
        $name.addClass('is-error');
        $nameError.html('Заполните поле').addClass('is-active');
      } else {
        $name.removeClass('is-error');
        $nameError.removeClass('is-active');
      }
    });

    inputmask('+7 (999) 999-99-99').mask($phone);
    $phone.on('input', () => {
      if (inputmask.isValid($phone.val(), '+7 (999) 999-99-99')) {
        $phone.removeClass('is-error');
        $phoneError.removeClass('is-active');
      } else {
        $phone.addClass('is-error');
        $phoneError.html('Введите корректный номер').addClass('is-active');
      }
    });

    $submit.click(() => {
      $name.trigger('input');
      $phone.trigger('input');
    });
  });
});
