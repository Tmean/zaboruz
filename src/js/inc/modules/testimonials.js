import $ from 'jquery';
import 'slick-carousel';
import { $document } from '../globals';

$document.ready(() => {
  const $prevButton = $('.js-testimonials__slider-prev');
  const $nextButton = $('.js-testimonials__slider-next');
  $('.js-testimonials__slider').slick({
    infinite: true,
    dots: false,
    slidesToScroll: 1,
    slidesToShow: 1,
    prevArrow: $prevButton,
    nextArrow: $nextButton,
  });
});

