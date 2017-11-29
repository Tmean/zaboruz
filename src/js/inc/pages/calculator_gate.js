import $ from 'jquery';
import { $document } from '../globals';

const gate = {
  isActive: true,
  type: 'откатные',
  drive: 'без привода',
  opening: 'направо',
  width: '3.5 м',
  amount: 2,
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

let subtotal = 0;

const calculateSubtotal = () => gate.total;

const subtotalRow = () => `
<tr>
<td colspan='4'>Итог за материалы</td>
<td>${subtotal.toLocaleString('ru')}</td>
</tr>
`;

const installation = {
  isActive: false,
  type: 'бетонирование',
  gatePrice: 5000,
  gateTotal: 0,
  trip: false,
  tripPrice: 3000,
  total: 0,
};

const installationSubtotalRows = () => {
  let result = `
<tr class='calculator-fence__estimate-table-body calculator-fence__estimate-table-body-heading'>
<td colspan='5'>Монтаж</td>
</tr>
`;

  result += `
<tr>
<td>Монтаж ворот</td>
<td>${gate.amount}</td>
<td>шт.</td>
<td>${installation.gatePrice.toLocaleString('ru')}</td>
<td>${installation.gateTotal.toLocaleString('ru')}</td>
</tr>
`;

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
  const $priceGate = $('.js-page-calculator__gate-price');
  const $priceShipment = $('.js-page-calculator__shipment-price');

  const calculate = () => {
    let resultHtml = '';
    gate.total = gate.amount * gate.price;
    resultHtml += gateRow();
    subtotal = calculateSubtotal();
    resultHtml += subtotalRow();
    $itemsBody.html(resultHtml);

    if (installation.isActive) {
      installation.gateTotal = gate.amount * installation.gatePrice;
      installation.total = installation.gateTotal + installation.tripPrice;
      $installationBody.html(installationSubtotalRows());
    } else {
      installation.gateTotal = 0;
      installation.total = 0;
      $installationBody.html('');
    }

    $priceTotal.text((subtotal + installation.total).toLocaleString('ru'));
    $priceGate.text(gate.total.toLocaleString('ru'));
    $priceShipment.text((installation.trip * installation.tripPrice).toLocaleString('ru'));
  };

  const $gateAmount = $('.js-page-calculator_gate-amount');
  const $gateCounter = $('.js-page-calculator__gate-counter');
  const $gateWidth = $('.js-page-calculator__gate-width input:radio');
  const $shipment = $('.js-page-calculator__shipment input:radio');

  $gateAmount.change((event) => {
    gate.amount = event.target.value;
    $gateCounter.text(gate.amount);
    calculate();
  });

  $gateWidth.change((event) => {
    gate.width = `${event.target.value} м`;
    calculate();
  });

  $shipment.change((event) => {
    installation.trip = Boolean(parseInt(event.target.value, 10));
    calculate();
  });

  const $installation = $('.js-page-calculator__gate-installation input:radio');

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
});
