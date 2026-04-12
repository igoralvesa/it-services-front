var SERVICE_CATALOG = [
  { id: 'desk', name: 'Service Desk mensal 8x5', price: 680.0, leadDays: 3 },
  { id: 'cloud', name: 'Migração Microsoft 365', price: 1850.0, leadDays: 12 },
  { id: 'security', name: 'Auditoria de segurança básica', price: 1250.0, leadDays: 7 },
  { id: 'backup', name: 'Implantação de backup em nuvem', price: 980.0, leadDays: 6 }
];

function formatBrazilianCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDateForBrazil(isoDate) {
  if (!isoDate) return '—';
  var parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  var date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  return date.toLocaleDateString('pt-BR');
}

function getTodayIsoDate() {
  var now = new Date();
  var year = now.getFullYear();
  var month = String(now.getMonth() + 1).padStart(2, '0');
  var day = String(now.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

function addDaysToIsoDate(startIsoDate, daysToAdd) {
  var parts = startIsoDate.split('-');
  var date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  date.setDate(date.getDate() + daysToAdd);
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, '0');
  var day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

function nextRequestNumberAfter(rows) {
  var highest = 1000;
  var i = 0;
  for (i = 0; i < rows.length; i++) {
    var numericPart = parseInt(String(rows[i].requestNumber).replace(/\D/g, ''), 10);
    if (!isNaN(numericPart) && numericPart > highest) {
      highest = numericPart;
    }
  }
  return 'REQ-' + (highest + 1);
}

function getExampleRequestRows() {
  return [
    {
      id: 'seed-1',
      orderDateIso: '2025-01-10',
      requestNumber: 'REQ-5001',
      serviceName: 'Implantação de backup em nuvem',
      status: 'CONCLUÍDO',
      price: 980.0,
      expectedDateIso: '2025-01-16'
    },
    {
      id: 'seed-2',
      orderDateIso: '2025-02-05',
      requestNumber: 'REQ-5002',
      serviceName: 'Service Desk mensal 8x5',
      status: 'EM ANDAMENTO',
      price: 680.0,
      expectedDateIso: '2025-02-08'
    }
  ];
}

function sortRequestsByOrderDate(rows) {
  return rows.slice().sort(function (a, b) {
    return a.orderDateIso.localeCompare(b.orderDateIso);
  });
}

function renderRequestTable(tbodyElement, rows) {
  tbodyElement.innerHTML = '';
  var sortedRows = sortRequestsByOrderDate(rows);
  var i = 0;
  for (i = 0; i < sortedRows.length; i++) {
    var row = sortedRows[i];
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' +
      formatDateForBrazil(row.orderDateIso) +
      '</td><td>' +
      row.requestNumber +
      '</td><td>' +
      row.serviceName +
      '</td><td>' +
      row.status +
      '</td><td>' +
      formatBrazilianCurrency(row.price) +
      '</td><td>' +
      formatDateForBrazil(row.expectedDateIso) +
      '</td><td><button type="button" class="btn btn-secondary btn-row-delete" data-row-id="' +
      row.id +
      '">Excluir</button></td>';
    tbodyElement.appendChild(tr);
  }
}

function findServiceById(serviceId) {
  var i = 0;
  for (i = 0; i < SERVICE_CATALOG.length; i++) {
    if (SERVICE_CATALOG[i].id === serviceId) {
      return SERVICE_CATALOG[i];
    }
  }
  return undefined;
}

function updateServiceSummaryLabels() {
  var serviceSelect = document.getElementById('service-select');
  if (!serviceSelect) return;
  var service = findServiceById(serviceSelect.value);
  if (!service) return;

  var priceLabel = document.getElementById('label-price');
  var leadLabel = document.getElementById('label-lead');
  var expectedLabel = document.getElementById('label-expected-date');
  if (priceLabel) priceLabel.textContent = formatBrazilianCurrency(service.price);
  if (leadLabel) leadLabel.textContent = service.leadDays + ' dias úteis';
  var expectedIso = addDaysToIsoDate(getTodayIsoDate(), service.leadDays);
  if (expectedLabel) expectedLabel.textContent = formatDateForBrazil(expectedIso);
}

function initServicesPage() {
  var session = getSession();
  var userEmail =
    session && session.email ? session.email : 'mariana.souza@email.com';
  var userFullName =
    session && session.fullName ? session.fullName : 'Mariana Souza';

  var sessionEmailLabel = document.getElementById('session-email');
  var sessionNameLabel = document.getElementById('session-fullname');
  if (sessionEmailLabel) sessionEmailLabel.textContent = userEmail;
  if (sessionNameLabel) sessionNameLabel.textContent = userFullName;

  var rows = loadServiceRequests(userEmail);
  if (rows.length === 0) {
    rows = getExampleRequestRows();
    saveServiceRequests(userEmail, rows);
  }

  var tbody = document.getElementById('requests-body');
  var serviceSelect = document.getElementById('service-select');
  var newRequestForm = document.getElementById('new-request-form');
  if (!tbody || !serviceSelect || !newRequestForm) return;

  renderRequestTable(tbody, rows);

  serviceSelect.innerHTML = '';
  var index = 0;
  for (index = 0; index < SERVICE_CATALOG.length; index++) {
    var option = document.createElement('option');
    option.value = SERVICE_CATALOG[index].id;
    option.textContent = SERVICE_CATALOG[index].name;
    serviceSelect.appendChild(option);
  }
  serviceSelect.addEventListener('change', updateServiceSummaryLabels);
  updateServiceSummaryLabels();

  tbody.addEventListener('click', function (event) {
    var deleteButton = event.target.closest('.btn-row-delete');
    if (!deleteButton) return;
    var rowId = deleteButton.getAttribute('data-row-id');
    var updatedRows = [];
    var currentRows = loadServiceRequests(userEmail);
    var r = 0;
    for (r = 0; r < currentRows.length; r++) {
      if (currentRows[r].id !== rowId) {
        updatedRows.push(currentRows[r]);
      }
    }
    saveServiceRequests(userEmail, updatedRows);
    renderRequestTable(tbody, updatedRows);
  });

  newRequestForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var service = findServiceById(serviceSelect.value);
    if (!service) return;
    var orderDateIso = getTodayIsoDate();
    var currentRows = loadServiceRequests(userEmail);
    var newRow = {
      id: 'req-' + Date.now(),
      orderDateIso: orderDateIso,
      requestNumber: nextRequestNumberAfter(currentRows),
      serviceName: service.name,
      status: 'EM ELABORAÇÃO',
      price: service.price,
      expectedDateIso: addDaysToIsoDate(orderDateIso, service.leadDays)
    };
    currentRows.push(newRow);
    saveServiceRequests(userEmail, currentRows);
    renderRequestTable(tbody, currentRows);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  if (typeof isLoggedIn !== 'function' || !isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }
  initServicesPage();
});
