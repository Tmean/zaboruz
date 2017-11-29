import $ from 'jquery';
import { $document } from '../globals';

$document.on('click', '.js-header-button', (e) => {
  const $this = $(e.currentTarget);

  $this.toggleClass('is-active');
});
