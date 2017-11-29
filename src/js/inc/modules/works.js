import $ from 'jquery';
import 'slick-carousel';
import { $document, breakpoints } from '../globals';

$document.ready(() => {
  const $prevButton = $('.js-works__slider-prev');
  const $nextButton = $('.js-works__slider-next');
  $('.js-works__slider').slick({
    infinite: true,
    dots: false,
    slidesToScroll: 1,
    slidesToShow: 1,
    mobileFirst: true,
    prevArrow: $prevButton,
    nextArrow: $nextButton,
    responsive: [
      {
        breakpoint: breakpoints.tablet - 1,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: breakpoints.desktop - 1,
        settings: {
          slidesToShow: 4,
        },
      },
    ],
  });
});

