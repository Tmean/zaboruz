import $ from 'jquery';
import { $document } from '../globals';

const fence = {
  isActive: true,
  profile: 'лайт',
  peak: 'литая',
  color: '9005 чёрный янтарь',
  paint: 'без краски',
  structure: 'гладкий профиль',
  amount: 28,
  price: 7150,
  total: 0,
};

const fenceString = () => `Секции — профиль ${fence.profile}, пики ${fence.peak}, цвет ${fence.color}, краска ${fence.paint}, фактура ${fence.structure} <a href='#' class='calculator-fence__estimate-table-blueprint link'>Смотреть чертёж</a>`;
const fenceRow = () => `
<tr>
<td>${fenceString()}</td>
<td>${fence.amount}</td>
<td>шт.</td>
<td>${fence.price.toLocaleString('ru')}</td>
<td>${fence.total.toLocaleString('ru')}</td>
</tr>
`;

const gate = {
  isActive: false,
  type: 'распашные',
  drive: 'без привода',
  opening: 'во двор',
  width: '3.5 м',
  amount: 0,
  price: 18100,
  total: 0,
};

const gateString = () => `Ворота — ${gate.type}, ${gate.drive}, открывание ${gate.opening}, ${gate.width} <a href='#' class='calculator-fence__estimate-table-blueprint link'>Смотреть чертёж</a>`;
const gateRow = () => {
  if (!gate.isActive) {
    return '';
  }
  return `
<tr>
<td>${gateString()}</td>
<td>${gate.amount}</td>
<td>шт.</td>
<td>${gate.price.toLocaleString('ru')}</td>
<td>${gate.total.toLocaleString('ru')}</td>
</tr>
`;
};

const wicket = {
  isActive: false,
  opening: 'вправо на улицу',
  lock: 'без замка',
  amount: 0,
  price: 7100,
  total: 0,
};

const wicketString = () => `Калитка — открывание ${wicket.opening}, ${wicket.lock}, задвижка под навесной замок <a href='#' class='calculator-fence__estimate-table-blueprint link'>Смотреть чертёж</a>`;
const wicketRow = () => {
  if (!wicket.isActive) {
    return '';
  }
  return `
<tr>
<td>${wicketString()}</td>
<td>${wicket.amount}</td>
<td>шт.</td>
<td>${wicket.price.toLocaleString('ru')}</td>
<td>${wicket.total.toLocaleString('ru')}</td>
</tr>
`;
};

const pillar = {
  isActive: false,
  material: 'Металлические',
  size: '80',
  amount: 0,
  price: 1000,
  total: 0,
};

const pillarString = () => `${pillar.material} столбы ${pillar.size} мм <a href='#' class='calculator-fence__estimate-table-blueprint link'>Смотреть чертёж</a>`;
const pillarRow = () => {
  if (!pillar.isActive) {
    return '';
  }
  return `
<tr>
<td>${pillarString()}</td>
<td>${pillar.amount}</td>
<td>шт.</td>
<td>${pillar.price.toLocaleString('ru')}</td>
<td>${pillar.total.toLocaleString('ru')}</td>
</tr>
`;
};

const placeholder = {
  price: 150,
  total: 0,
};

const placeholderRow = () => {
  if (!pillar.isActive) {
    return '';
  }
  return `
<tr>
<td>Заглушка для столбов <a href='#' class='calculator-fence__estimate-table-blueprint link'>Смотреть чертёж</a></td>
<td>${pillar.amount}</td>
<td>шт.</td>
<td>${placeholder.price.toLocaleString('ru')}</td>
<td>${placeholder.total.toLocaleString('ru')}</td>
</tr>
`;
};

let subtotal = 0;

const calculateSubtotal = () => fence.total
  + gate.total + wicket.total + pillar.total + placeholder.total;

const subtotalRow = () => `
<tr>
<td colspan='4'>Итог за материалы</td>
<td>${subtotal.toLocaleString('ru')}</td>
</tr>
`;

const installation = {
  isActive: false,
  type: 'бетонирование',
  pillarPrice: 1000,
  pillarTotal: 0,
  fencePrice: 1000,
  fenceTotal: 0,
  wicketPrice: 3000,
  wicketTotal: 0,
  gatePrice: 5000,
  gateTotal: 0,
  tripPrice: 3000,
  total: 0,
};

const installationSubtotalRows = () => {
  let result = `
<tr class='calculator-fence__estimate-table-body calculator-fence__estimate-table-body-heading'>
<td colspan='5'>Монтаж</td>
</tr>
<tr>
<td>Монтаж столбов ${pillar.size} мм (${installation.type})</td>
<td>${pillar.amount}</td>
<td>шт.</td>
<td>${installation.pillarPrice.toLocaleString('ru')}</td>
<td>${installation.pillarTotal.toLocaleString('ru')}</td>
</tr>
`;

  if (fence.amount) {
    result += `
<tr>
<td>Монтаж секций</td>
<td>${fence.amount}</td>
<td>шт.</td>
<td>${installation.fencePrice.toLocaleString('ru')}</td>
<td>${installation.fenceTotal.toLocaleString('ru')}</td>
</tr>
`;
  }

  if (wicket.amount) {
    result += `
<tr>
<td>Монтаж калитки</td>
<td>${wicket.amount}</td>
<td>шт.</td>
<td>${installation.wicketPrice.toLocaleString('ru')}</td>
<td>${installation.wicketTotal.toLocaleString('ru')}</td>
</tr>
`;
  }

  if (gate.amount) {
    result += `
<tr>
<td>Монтаж ворот</td>
<td>${gate.amount}</td>
<td>шт.</td>
<td>${installation.gatePrice.toLocaleString('ru')}</td>
<td>${installation.gateTotal.toLocaleString('ru')}</td>
</tr>
`;
  }

  result += `
<tr>
<td colspan='4'>Выезд бригады</td>
<td>${installation.tripPrice.toLocaleString('ru')}</td>
</tr>
<tr>
<td colspan='4'>Итого за работу</td>
<td>${installation.total.toLocaleString('ru')}</td>
</tr>
`;

  return result;
};

$document.ready(() => {
  const $itemsBody = $('.js-page-calculator__table-body');
  const $installationBody = $('.js-page-calculator__table-installation-body');

  const $priceTotal = $('.js-page-calculator__price-total');
  const $priceFence = $('.js-page-calculator__price-fence');
  const $priceGateWicket = $('.js-page-calculator__price-gate-wicket');
  const $pricePillarInstallation = $('.js-page-calculator__price-pillar-installation');
  const $pricePillar = $('.js-page-calculator__price-pillar');
  const $priceInstallation = $('.js-page-calculator__price-installation');

  const calculate = () => {
    let resultHtml = '';
    fence.total = fence.amount * fence.price;
    resultHtml += fenceRow();
    gate.total = gate.amount * gate.price;
    resultHtml += gateRow();
    wicket.total = wicket.amount * wicket.price;
    resultHtml += wicketRow();
    pillar.total = pillar.amount * pillar.price;
    resultHtml += pillarRow();
    placeholder.total = pillar.amount * placeholder.price;
    resultHtml += placeholderRow();
    subtotal = calculateSubtotal();
    resultHtml += subtotalRow();
    $itemsBody.html(resultHtml);

    if (installation.isActive) {
      installation.pillarTotal = pillar.amount * installation.pillarPrice;
      installation.fenceTotal = fence.amount * installation.fencePrice;
      installation.wicketTotal = wicket.amount * installation.wicketPrice;
      installation.gateTotal = gate.amount * installation.gatePrice;
      installation.total = installation.pillarTotal + installation.fenceTotal
        + installation.wicketTotal + installation.gateTotal + installation.tripPrice;
      $installationBody.html(installationSubtotalRows());
    } else {
      installation.pillarTotal = 0;
      installation.fenceTotal = 0;
      installation.wicketTotal = 0;
      installation.gateTotal = 0;
      installation.total = 0;
      $installationBody.html('');
    }

    $priceTotal.text((subtotal + installation.total).toLocaleString('ru'));
    $priceFence.text(fence.total.toLocaleString('ru'));
    $priceGateWicket.text((gate.total + wicket.total).toLocaleString('ru'));
    $pricePillarInstallation.text((pillar.total + installation.total).toLocaleString('ru'));
    $pricePillar.text(pillar.total.toLocaleString('ru'));
    $priceInstallation.text(installation.total.toLocaleString('ru'));
  };

  const $sceneImageBrick = $('.js-page-calculator__scene-image-brick');
  const $sceneImageMetal = $('.js-page-calculator__scene-image-metal');
  const $sceneDimensionsBrick = $('.js-page-calculator__scene-dimensions-brick');
  const $sceneDimensionsMetal = $('.js-page-calculator__scene-dimensions-metal');

  // Fence

  const $sectionsRange = $('.js-page-calculator__sections-range');
  const $sectionsRangeMeters = $('.js-page-calculator__sections-range-meters');
  const $fenceProfile = $('.js-page-calculator__fence-profile input:radio');
  const $fencePeak = $('.js-page-calculator__fence-peak');
  const $fenceColor = $('.js-page-calculator__fence-color');
  const $fencePaint = $('.js-page-calculator__fence-paint');
  const $fenceStructure = $('.js-page-calculator__fence-structure');

  (function handleSectionSLiders() {
    $sectionsRange.change(() => {
      $sectionsRangeMeters.val($sectionsRange.val() * $sectionsRangeMeters.prop('step'));
      $sectionsRangeMeters.rangeslider('update', true);
      fence.amount = $sectionsRange.val();
      calculate();
    });

    $sectionsRangeMeters.change(() => {
      $sectionsRange.val($sectionsRangeMeters.val() / $sectionsRangeMeters.prop('step'));
      $sectionsRange.rangeslider('update', true);
      fence.amount = $sectionsRangeMeters.val() / $sectionsRangeMeters.prop('step');
      calculate();
    });
  }());

  $fenceProfile.change((event) => {
    fence.profile = event.target.value.toLowerCase();
    calculate();
  });

  $fencePeak.change((event) => {
    fence.peak = event.target.value === '1' ? 'литая' : 'другая';
    calculate();
  });

  $fenceColor.change((event) => {
    switch (event.target.value) {
      case '1':
        fence.color = '9005 чёрный янтарь';
        break;
      case '2':
        fence.color = '1030 красный';
        break;
      case '3':
        fence.color = '8800 зелёный';
        break;
      default:
        fence.color = '9005 чёрный янтарь';
        break;
    }
    calculate();
  });

  $fencePaint.change((event) => {
    switch (event.target.value) {
      case '1':
        fence.paint = 'без краски';
        break;
      case '2':
        fence.paint = 'квил (Россия)';
        break;
      default:
        fence.paint = 'без краски';
        break;
    }
    calculate();
  });

  $fenceStructure.change((event) => {
    switch (event.target.value) {
      case '1':
        fence.structure = 'гладкий профиль';
        break;
      case '2':
        fence.structure = 'прокованный профиль';
        break;
      default:
        fence.structure = 'гладкий профиль';
        break;
    }
    calculate();
  });

  // Gate

  const $dimensionsGate = $('.js-page-calculator__dimensions-gate');
  const $gateOpening = $('.js-page-calculator__gate-opening input:radio');
  const $gateOpening1 = $('.js-page-calculator__gate-opening-1');
  const $gateOpening2 = $('.js-page-calculator__gate-opening-2');
  const $gateControl = $('.js-page-calculator__gate-control input:radio');
  const $controlsGroup1 = $('.js-page-calculator__controls-group-1');

  let gateOpening1 = 'во двор';
  let gateOpening2 = 'направо';

  $('input:radio[name=gate-width]').change((event) => {
    $dimensionsGate.text(`${event.target.value} м`);
    gate.width = `${event.target.value} м`;
    calculate();
  });

  $gateOpening.change((event) => {
    const value = parseInt(event.target.value, 10);
    if (value === 0) {
      $gateOpening1.removeClass('is-hidden');
      $gateOpening2.addClass('is-hidden');
      gate.type = 'распашные';
      gate.opening = gateOpening1;
    } else {
      $gateOpening1.addClass('is-hidden');
      $gateOpening2.removeClass('is-hidden');
      gate.type = 'откатные';
      gate.opening = gateOpening2;
    }

    calculate();
  });

  $gateOpening1.find('input:radio').change((event) => {
    switch (event.target.value) {
      case '1':
        gateOpening1 = 'во двор';
        break;
      case '2':
        gateOpening1 = 'на улицу';
        break;
      default:
    }

    gate.opening = gateOpening1;
    calculate();
  });

  $gateOpening2.find('input:radio').change((event) => {
    switch (event.target.value) {
      case '1':
        gateOpening2 = 'направо';
        break;
      case '2':
        gateOpening2 = 'налево';
        break;
      default:
    }

    gate.opening = gateOpening2;
    calculate();
  });

  $gateControl.change((event) => {
    const value = parseInt(event.target.value, 10);
    gate.isActive = Boolean(value);
    gate.amount = value;
    if (value === 0) {
      $controlsGroup1.addClass('is-disabled');
      $controlsGroup1.find('input').prop('disabled', true);
    } else {
      $controlsGroup1.removeClass('is-disabled');
      $controlsGroup1.find('input').prop('disabled', false);
    }
    calculate();
  });

  // Wicket

  const $wicketControl = $('.js-page-calculator__wicket-control input:radio');
  const $controlsGroup2 = $('.js-page-calculator__controls-group-2');
  const $wicketOpening = $('.js-page-calculator__wicket-opening');
  const $wicketLock = $('.js-page-calculator__wicket-lock');

  $wicketControl.change((event) => {
    const value = parseInt(event.target.value, 10);
    wicket.isActive = Boolean(value);
    wicket.amount = value;
    if (value === 0) {
      $controlsGroup2.addClass('is-disabled');
      $controlsGroup2.find('input').prop('disabled', true);
    } else {
      $controlsGroup2.removeClass('is-disabled');
      $controlsGroup2.find('input').prop('disabled', false);
    }
    calculate();
  });

  $wicketOpening.change((event) => {
    switch (event.target.value) {
      case '1':
        wicket.opening = 'вправо на улицу';
        break;
      case '2':
        wicket.opening = 'влево на улицу';
        break;
      case '3':
        wicket.opening = 'вправо во двор';
        break;
      case '4':
        wicket.opening = 'влево во двор';
        break;
      default:
        wicket.opening = 'вправо на улицу';
        break;
    }
    calculate();
  });

  $wicketLock.change((event) => {
    const value = parseInt(event.target.value, 10);
    if (value) {
      wicket.lock = 'замок';
    } else {
      wicket.lock = 'нет';
    }
    calculate();
  });

  // Pillar

  const $pillarControl = $('.js-page-calculator__pillar-control input:radio');
  const $controlsGroup3 = $('.js-page-calculator__controls-group-3');
  const $pillarSize = $('.js-page-calculator__pillar-size');

  const $dimensionItems = $('.js-page-calculator__dimensions-item');

  $pillarControl.change((event) => {
    const value = parseInt(event.target.value, 10);
    pillar.isActive = Boolean(value);
    if (pillar.isActive) {
      $controlsGroup3.removeClass('is-disabled');
      $controlsGroup3.find('input').prop('disabled', false);
    } else {
      $controlsGroup3.addClass('is-disabled');
      $controlsGroup3.find('input').prop('disabled', true);
      installation.isActive = false;
    }

    switch (value) {
      case 1:
        pillar.material = 'Металлические';
        pillar.amount = 50;
        $dimensionItems.addClass('calculator-fence__scene-dimensions-item_metal');
        $sceneImageBrick.addClass('is-hidden');
        $sceneImageMetal.removeClass('is-hidden');
        $sceneDimensionsBrick.addClass('is-hidden');
        $sceneDimensionsMetal.removeClass('is-hidden');
        break;
      case 2:
        pillar.material = 'Кирпичные';
        pillar.amount = 50;
        $dimensionItems.removeClass('calculator-fence__scene-dimensions-item_metal');
        $sceneImageBrick.removeClass('is-hidden');
        $sceneImageMetal.addClass('is-hidden');
        $sceneDimensionsBrick.removeClass('is-hidden');
        $sceneDimensionsMetal.addClass('is-hidden');
        break;
      default:
        pillar.amount = 0;
        break;
    }

    calculate();
  });

  $pillarSize.change((event) => {
    const { value } = event.target;

    pillar.size = value;

    calculate();
  });

  // Installation

  const $installation = $('.js-page-calculator__installation input:radio');

  $installation.change((event) => {
    const { value } = event.target;

    if (parseInt(value, 10) === 0) {
      installation.isActive = false;
    } else {
      installation.isActive = true;
      installation.type = value;
    }

    calculate();
  });

  const $dimensionsHeight = $('.js-page-calculator__dimensions-height');
  const $dimensionsWidth = $('.js-page-calculator__dimensions-width');

  function heightHandler() {
    $dimensionsHeight.text(`${this.value} м`);
  }

  function widthHandler() {
    $dimensionsWidth.text(`${this.value} м`);
  }

  $('input:radio[name=fence-height]').change(heightHandler);
  $('input:radio[name=fence-width]').change(widthHandler);
});
