const openDrawer = document.getElementById('openDrawer');
const drawer = document.getElementById('drawer');
const toast = document.getElementById('toast');
const navItems = document.querySelectorAll('.nav-item');
const drawerItems = document.querySelectorAll('.drawer-item[data-tab-target]');
const utilityItems = document.querySelectorAll('.drawer-item[data-utility-target]');
const quickButtons = document.querySelectorAll('[data-tab-jump]');
const screens = document.querySelectorAll('.tab-screen');

const state = {
  totalVehicles: 48,
  activeVehicles: 39,
  maintenanceDue: 6,
  criticalAlerts: 3,
  fuelToday: 1284,
  openMaint: 4,
  shiftDrivers: 18,
  docAlerts: 5,
  fuelMonthTotal: 18460,
  fuelMonthCost: 912500,
  fuelAvgConsume: 14.8,
  plannedMaintenance: 8,
  openFaults: 3,
  maintenanceMonthCost: 184700,
  riskHigh: 2,
  riskMedium: 5,
  riskLow: 11,
  insights: [
    '2 araçta bakım yaklaşırken 1 araçta yakıt verimsizliği dikkat çekiyor.',
    'Sigortası yaklaşan araçlar nedeniyle evrak takibi önceliklendirilmeli.',
    'Rölanti süresi artan araçlarda kullanım alışkanlığı incelemesi önerilir.',
    'Periyodik bakım planı erkene çekilirse aylık arıza riski düşebilir.'
  ],
  todayTasks: [
    { title: '34 NFY 102', text: 'Muayene bitişine 9 gün kaldı.' },
    { title: '06 NVA 245', text: 'Periyodik bakım 420 km içinde.' },
    { title: '34 FLY 889', text: 'Sigorta yenileme planlanmalı.' }
  ],
  vehicles: [
    { plate: '34 NVA 001', info: 'Ford Transit • Dizel • Şoför: Ahmet K.', status: 'active', label: 'Aktif' },
    { plate: '34 NVA 118', info: 'Fiat Doblo • Dizel • Şoför: Mehmet T.', status: 'idle', label: 'Beklemede' },
    { plate: '06 NVA 245', info: 'Mercedes Atego • Dizel • Şoför: Burak Y.', status: 'service', label: 'Serviste' },
    { plate: '34 FLY 889', info: 'Renault Master • Dizel • Şoför: Hasan A.', status: 'active', label: 'Aktif' }
  ],
  fuelRows: [
    { vehicle: '34 NVA 001', litre: '92 L', amount: '₺4.815', meter: '214.320 km', tag: 'Normal', tagClass: 'good' },
    { vehicle: '34 NVA 118', litre: '68 L', amount: '₺3.562', meter: '187.550 km', tag: 'İzlenmeli', tagClass: 'warn' },
    { vehicle: '06 NVA 245', litre: '146 L', amount: '₺7.644', meter: '8.420 s', tag: 'Kritik', tagClass: 'bad' },
    { vehicle: '34 FLY 889', litre: '81 L', amount: '₺4.237', meter: '294.105 km', tag: 'Normal', tagClass: 'good' }
  ],
  fuelAlerts: [
    { title: '06 NVA 245', text: 'Son 3 kayıtta ortalamanın üzerinde tüketim görüldü.' },
    { title: '34 NVA 118', text: 'Litre/km oranı önceki döneme göre yükseldi.' }
  ],
  maintenanceList: [
    { title: '34 NVA 001', text: 'Yağ ve filtre bakımı 6 gün içinde planlanmalı.' },
    { title: '06 NVA 245', text: 'Fren kontrolü ve genel servis bekliyor.' },
    { title: '34 FLY 889', text: 'Periyodik bakım kilometresi yaklaşıyor.' }
  ],
  maintenanceTimeline: [
    { title: '34 NVA 001', text: '02 Nisan • Yağ değişimi tamamlandı.' },
    { title: '34 NVA 118', text: '29 Mart • Lastik kontrolü işlendi.' },
    { title: '06 NVA 245', text: '25 Mart • Arıza kaydı açıldı.' }
  ],
  novaSuggestions: [
    { title: 'NoVa AI Yakıt Yorumu', text: '06 NVA 245 için yüksek tüketim eğilimi sürüyor, sürüş ve yük analizi önerilir.' },
    { title: 'NoVa AI Bakım Tahmini', text: '34 NVA 001 bakım erkene çekilirse plansız arıza ihtimali azalabilir.' },
    { title: 'NoVa AI Evrak Uyarısı', text: '5 araçta evrak süreleri kritik eşiğe yaklaşıyor.' }
  ]
};

function setActiveTab(tab) {
  screens.forEach(screen => {
    screen.classList.toggle('active', screen.id === `tab-${tab}`);
  });

  navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tab);
  });

  drawer.classList.remove('show');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navItems.forEach(item => {
  item.addEventListener('click', () => setActiveTab(item.dataset.tab));
});

drawerItems.forEach(item => {
  item.addEventListener('click', () => setActiveTab(item.dataset.tabTarget));
});

quickButtons.forEach(item => {
  item.addEventListener('click', () => setActiveTab(item.dataset.tabJump));
});

utilityItems.forEach(item => {
  item.addEventListener('click', () => {
    toast.textContent = `${item.dataset.utilityTarget} modülü sonraki sürümde açılacak.`;
    toast.classList.add('show');
    drawer.classList.remove('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  });
});

if (openDrawer) {
  openDrawer.addEventListener('click', () => drawer.classList.toggle('show'));
}

if (drawer) {
  drawer.addEventListener('click', e => {
    if (e.target === drawer) drawer.classList.remove('show');
  });
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function timeNow() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function flashText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value;
  el.classList.remove('flash');
  void el.offsetWidth;
  el.classList.add('flash');
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function renderTasks() {
  const el = document.getElementById('todayTasks');
  if (!el) return;
  el.innerHTML = state.todayTasks.map(item => `
    <div class="list-item">
      <strong>${item.title}</strong>
      <p>${item.text}</p>
    </div>
  `).join('');
}

function renderVehicles() {
  const el = document.getElementById('vehicleList');
  if (!el) return;
  el.innerHTML = state.vehicles.map(item => `
    <div class="vehicle-item">
      <div>
        <strong>${item.plate}</strong>
        <p>${item.info}</p>
      </div>
      <span class="status-pill ${item.status}">${item.label}</span>
    </div>
  `).join('');
}

function renderFuelTable() {
  const el = document.getElementById('fuelTableBody');
  if (!el) return;
  el.innerHTML = state.fuelRows.map(row => `
    <tr>
      <td>${row.vehicle}</td>
      <td>${row.litre}</td>
      <td>${row.amount}</td>
      <td>${row.meter}</td>
      <td><span class="tag ${row.tagClass}">${row.tag}</span></td>
    </tr>
  `).join('');
}

function renderFuelAlerts() {
  const el = document.getElementById('fuelAlertsList');
  if (!el) return;
  el.innerHTML = state.fuelAlerts.map(item => `
    <div class="list-item">
      <strong>${item.title}</strong>
      <p>${item.text}</p>
    </div>
  `).join('');
}

function renderMaintenance() {
  const list = document.getElementById('maintenanceList');
  const timeline = document.getElementById('maintenanceTimeline');
  if (list) {
    list.innerHTML = state.maintenanceList.map(item => `
      <div class="list-item">
        <strong>${item.title}</strong>
        <p>${item.text}</p>
      </div>
    `).join('');
  }
  if (timeline) {
    timeline.innerHTML = state.maintenanceTimeline.map(item => `
      <div class="timeline-item">
        <strong>${item.title}</strong>
        <p>${item.text}</p>
      </div>
    `).join('');
  }
}

function renderNova() {
  const el = document.getElementById('novaSuggestions');
  if (!el) return;
  el.innerHTML = state.novaSuggestions.map(item => `
    <div class="list-item">
      <strong>${item.title}</strong>
      <p>${item.text}</p>
    </div>
  `).join('');
}

function updateUI() {
  flashText('kpiTotalVehicles', state.totalVehicles);
  flashText('kpiActiveVehicles', state.activeVehicles);
  flashText('kpiMaintenanceDue', state.maintenanceDue);
  flashText('kpiCriticalAlerts', state.criticalAlerts);

  flashText('miniFuelToday', `${state.fuelToday.toLocaleString('tr-TR')} L`);
  flashText('miniOpenMaint', state.openMaint);
  flashText('miniShiftDrivers', state.shiftDrivers);
  flashText('miniDocumentAlerts', state.docAlerts);

  flashText('fuelMonthTotal', `${state.fuelMonthTotal.toLocaleString('tr-TR')} L`);
  flashText('fuelMonthCost', `₺${state.fuelMonthCost.toLocaleString('tr-TR')}`);
  flashText('fuelAvgConsume', state.fuelAvgConsume.toFixed(1));

  flashText('maintPlanned', state.plannedMaintenance);
  flashText('maintOpenFaults', state.openFaults);
  flashText('maintMonthCost', `₺${state.maintenanceMonthCost.toLocaleString('tr-TR')}`);

  flashText('riskHigh', state.riskHigh);
  flashText('riskMedium', state.riskMedium);
  flashText('riskLow', state.riskLow);

  const insight = document.getElementById('homeInsight');
  if (insight) insight.textContent = randomChoice(state.insights);

  const vehicleTime = document.getElementById('vehiclesUpdateTime');
  if (vehicleTime) vehicleTime.textContent = `Güncelleme: ${timeNow()}`;

  renderTasks();
  renderVehicles();
  renderFuelTable();
  renderFuelAlerts();
  renderMaintenance();
  renderNova();
}

function mutateState() {
  state.activeVehicles = Math.max(34, Math.min(43, state.activeVehicles + randomBetween(-1, 1)));
  state.maintenanceDue = Math.max(4, Math.min(9, state.maintenanceDue + randomBetween(-1, 1)));
  state.criticalAlerts = Math.max(2, Math.min(5, state.criticalAlerts + randomBetween(-1, 1)));
  state.fuelToday = Math.max(1100, Math.min(1500, state.fuelToday + randomBetween(-35, 35)));
  state.openMaint = Math.max(2, Math.min(6, state.openMaint + randomBetween(-1, 1)));
  state.shiftDrivers = Math.max(14, Math.min(22, state.shiftDrivers + randomBetween(-1, 1)));
  state.docAlerts = Math.max(3, Math.min(7, state.docAlerts + randomBetween(-1, 1)));
  state.fuelAvgConsume = Math.max(13.2, Math.min(16.1, state.fuelAvgConsume + (randomBetween(-2, 2) / 10)));

  state.riskHigh = Math.max(1, Math.min(3, state.riskHigh + randomBetween(-1, 1)));
  state.riskMedium = Math.max(4, Math.min(7, state.riskMedium + randomBetween(-1, 1)));
  state.riskLow = Math.max(8, Math.min(14, state.riskLow + randomBetween(-1, 1)));

  const statuses = [
    { status: 'active', label: 'Aktif' },
    { status: 'idle', label: 'Beklemede' },
    { status: 'service', label: 'Serviste' }
  ];

  state.vehicles = state.vehicles.map(item => {
    const picked = randomChoice(statuses);
    return { ...item, status: picked.status, label: picked.label };
  });

  const vehicleNames = state.vehicles.map(v => v.plate);

  state.todayTasks[0] = {
    title: randomChoice(vehicleNames),
    text: randomChoice([
      'Vergi bitişine 12 gün kaldı.',
      'Sigorta yenileme süreci başlatılmalı.',
      'Periyodik bakım planına alınmalı.',
      'Muayene tarihi yaklaşıyor.'
    ])
  };

  state.fuelAlerts[0] = {
    title: randomChoice(vehicleNames),
    text: randomChoice([
      'Yakıt tüketimi ortalamanın üzerine çıktı.',
      'Son dolum sonrası litre/km oranı arttı.',
      'Yakıt kaydı önceki döneme göre sapma gösteriyor.'
    ])
  };

  state.maintenanceList[0] = {
    title: randomChoice(vehicleNames),
    text: randomChoice([
      'Genel bakım planlaması bekliyor.',
      'Fren ve yağ kontrolü öneriliyor.',
      'Servis kilometresi kritik eşiğe yaklaşıyor.'
    ])
  };

  state.novaSuggestions[0] = {
    title: randomChoice([
      'NoVa AI Yakıt Yorumu',
      'NoVa AI Bakım Tahmini',
      'NoVa AI Evrak Uyarısı'
    ]),
    text: randomChoice(state.insights)
  };

  state.fuelRows = state.fuelRows.map(row => {
    const litre = parseInt(row.litre, 10) + randomBetween(-6, 6);
    let tagClass = 'good';
    let tag = 'Normal';

    if (litre > 100) {
      tagClass = 'warn';
      tag = 'İzlenmeli';
    }
    if (litre > 130) {
      tagClass = 'bad';
      tag = 'Kritik';
    }

    return {
      ...row,
      litre: `${Math.max(50, litre)} L`,
      tagClass,
      tag
    };
  });
}

updateUI();

setInterval(() => {
  mutateState();
  updateUI();
}, 5000);
