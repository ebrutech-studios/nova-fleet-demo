const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
const checkForm = document.getElementById('checkForm');
const toast = document.getElementById('toast');

if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    menu.classList.toggle('show');
  });

  document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('show');
    });
  });
}

const dashboardState = {
  totalAssets: 186,
  checklistCount: 142,
  criticalCount: 9,
  activeMachines: 161,
  upcomingMaintenance: 24,
  efficiency: 87,
  fuelAlerts: 4,
  telemetry: [
    { name: 'CAT 374 Ekskavatör', detail: 'Kazı Alanı A · Operatör: M. Kaya', status: 'active', label: 'Aktif' },
    { name: 'Komatsu HD785 Kaya Kamyonu', detail: 'Taşıma Koridoru · Operatör: A. Yılmaz', status: 'active', label: 'Aktif' },
    { name: 'Volvo EC480', detail: 'Bakım Alanına Yönlendirildi', status: 'service', label: 'Servis' },
    { name: 'Mercedes Arocs Servis Aracı', detail: 'Yakıt İkmal Noktası', status: 'idle', label: 'Beklemede' }
  ],
  fuelRows: [
    { name: 'CAT 374', hours: '8.4 saat', fuel: '312 L', idle: '52 dk', score: 'İyi', className: 'good' },
    { name: 'Komatsu HD785', hours: '10.1 saat', fuel: '498 L', idle: '95 dk', score: 'İzlenmeli', className: 'warn' },
    { name: 'Volvo EC480', hours: '4.2 saat', fuel: '141 L', idle: '18 dk', score: 'İyi', className: 'good' },
    { name: 'Arocs Servis', hours: '6.7 saat', fuel: '74 L', idle: '31 dk', score: 'Düşük', className: 'bad' }
  ],
  maintenanceAlerts: [
    { title: 'CAT 374', text: '12 saat içinde bakım eşiğine ulaşacak.' },
    { title: 'Komatsu HD785', text: 'Motor saati kritik bakım sınırına yaklaşıyor.' },
    { title: 'Volvo EC480', text: 'Hidrolik sistem kontrolü öneriliyor.' },
    { title: 'Arocs Servis Aracı', text: 'Yağ değişimi planlaması gerekiyor.' }
  ],
  timeline: [
    { title: 'CAT 374', text: '07:12 · M. Kaya check-list tamamladı' },
    { title: 'Komatsu HD785', text: '07:18 · A. Yılmaz check-list tamamladı' },
    { title: 'Volvo EC480', text: '07:26 · Hidrolik uyarısı not edildi' },
    { title: 'Arocs Servis', text: '07:31 · Yakıt ikmal formu işlendi' }
  ],
  liveFeed: [
    { color: 'green', title: 'Operasyon başladı', text: 'Sabah vardiyası başarıyla devreye alındı.', time: 'Az önce' },
    { color: 'blue', title: 'Telemetri verisi güncellendi', text: 'Aktif makine sayısı yeniden hesaplandı.', time: '1 dk önce' },
    { color: 'yellow', title: 'Bakım planı güncellendi', text: '2 ekipman için servis planlaması oluşturuldu.', time: '3 dk önce' },
    { color: 'red', title: 'Yakıt alarmı üretildi', text: 'Bir araç için anormal tüketim kontrol listesine eklendi.', time: '5 dk önce' }
  ]
};

const feedTemplates = [
  { color: 'green', title: 'Check-list tamamlandı', text: 'Bir operatör vardiya başlangıç kontrolünü tamamladı.' },
  { color: 'blue', title: 'Makine durumu değişti', text: 'Bir makinenin saha durumu merkez panele güncellendi.' },
  { color: 'yellow', title: 'Bakım planlaması önerildi', text: 'Yaklaşan servis ihtiyacı sistem tarafından işaretlendi.' },
  { color: 'red', title: 'Yakıt sapması algılandı', text: 'Yakıt tüketim verisinde olağandışı bir artış tespit edildi.' }
];

function pad(n) {
  return String(n).padStart(2, '0');
}

function timeNow() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function createTelemetryRow(item) {
  return `
    <div class="telemetry-row">
      <div>
        <strong>${item.name}</strong>
        <p>${item.detail}</p>
      </div>
      <span class="status ${item.status}">${item.label}</span>
    </div>
  `;
}

function renderTelemetry() {
  const list = document.getElementById('telemetryList');
  const preview = document.getElementById('heroTelemetryPreview');
  if (list) {
    list.innerHTML = dashboardState.telemetry.map(createTelemetryRow).join('');
  }
  if (preview) {
    preview.innerHTML = dashboardState.telemetry.slice(0, 3).map(createTelemetryRow).join('');
  }
}

function renderMaintenanceAlerts() {
  const list = document.getElementById('maintenanceAlertList');
  if (!list) return;
  list.innerHTML = dashboardState.maintenanceAlerts.map(item => `
    <div class="alert-item">
      <strong>${item.title}</strong>
      <p>${item.text}</p>
    </div>
  `).join('');
}

function renderFuelTable() {
  const body = document.getElementById('fuelTableBody');
  if (!body) return;
  body.innerHTML = dashboardState.fuelRows.map(row => `
    <tr>
      <td>${row.name}</td>
      <td>${row.hours}</td>
      <td>${row.fuel}</td>
      <td>${row.idle}</td>
      <td><span class="pill ${row.className}">${row.score}</span></td>
    </tr>
  `).join('');
}

function renderTimeline() {
  const list = document.getElementById('timelineList');
  if (!list) return;
  list.innerHTML = dashboardState.timeline.map(item => `
    <div class="timeline-item">
      <strong>${item.title}</strong>
      <p>${item.text}</p>
    </div>
  `).join('');
}

function renderLiveFeed() {
  const list = document.getElementById('liveFeed');
  if (!list) return;
  list.innerHTML = dashboardState.liveFeed.map(item => `
    <div class="feed-item">
      <span class="feed-dot ${item.color}"></span>
      <div>
        <strong>${item.title}</strong>
        <p>${item.text}</p>
      </div>
      <span class="feed-time">${item.time}</span>
    </div>
  `).join('');
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value;
  el.classList.remove('flash');
  void el.offsetWidth;
  el.classList.add('flash');
}

function updateNumbers() {
  setText('heroTotalAssets', dashboardState.totalAssets);
  setText('heroChecklistCount', dashboardState.checklistCount);
  setText('heroCriticalCount', dashboardState.criticalCount);

  setText('metricActiveMachines', dashboardState.activeMachines);
  setText('metricUpcomingMaintenance', dashboardState.upcomingMaintenance);
  setText('metricEfficiency', `%${dashboardState.efficiency}`);
  setText('metricFuelAlerts', dashboardState.fuelAlerts);

  setText('statTotalFleet', dashboardState.totalAssets);
  setText('statActiveFleet', dashboardState.activeMachines);
  setText('statMaintenanceSoon', dashboardState.upcomingMaintenance);
  setText('statCriticalAlerts', dashboardState.criticalCount);

  const timeEl = document.getElementById('dashboardUpdateTime');
  if (timeEl) {
    timeEl.textContent = `Güncelleme: ${timeNow()}`;
  }
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function mutateState() {
  dashboardState.activeMachines = Math.max(150, Math.min(170, dashboardState.activeMachines + randomBetween(-2, 2)));
  dashboardState.upcomingMaintenance = Math.max(20, Math.min(30, dashboardState.upcomingMaintenance + randomBetween(-1, 1)));
  dashboardState.efficiency = Math.max(82, Math.min(92, dashboardState.efficiency + randomBetween(-1, 1)));
  dashboardState.fuelAlerts = Math.max(2, Math.min(8, dashboardState.fuelAlerts + randomBetween(-1, 1)));
  dashboardState.criticalCount = Math.max(6, Math.min(12, dashboardState.criticalCount + randomBetween(-1, 1)));
  dashboardState.checklistCount = Math.max(130, Math.min(180, dashboardState.checklistCount + randomBetween(0, 2)));

  const statuses = [
    { status: 'active', label: 'Aktif' },
    { status: 'idle', label: 'Beklemede' },
    { status: 'service', label: 'Servis' }
  ];

  dashboardState.telemetry = dashboardState.telemetry.map(item => {
    const picked = randomChoice(statuses);
    return { ...item, status: picked.status, label: picked.label };
  });

  dashboardState.fuelRows = dashboardState.fuelRows.map(row => {
    const fuelValue = parseInt(row.fuel, 10) + randomBetween(-12, 12);
    const idleValue = parseInt(row.idle, 10) + randomBetween(-8, 8);

    let className = 'good';
    let score = 'İyi';

    if (fuelValue > 430 || idleValue > 80) {
      className = 'warn';
      score = 'İzlenmeli';
    }
    if (fuelValue > 500 || idleValue > 95) {
      className = 'bad';
      score = 'Düşük';
    }

    return {
      ...row,
      fuel: `${Math.max(55, fuelValue)} L`,
      idle: `${Math.max(8, idleValue)} dk`,
      className,
      score
    };
  });

  const telemetryNames = dashboardState.telemetry.map(t => t.name);
  const chosenTelemetry = randomChoice(telemetryNames);
  const chosenFeed = randomChoice(feedTemplates);

  dashboardState.liveFeed.unshift({
    ...chosenFeed,
    text: `${chosenFeed.text} (${chosenTelemetry})`,
    time: 'Şimdi'
  });
  dashboardState.liveFeed = dashboardState.liveFeed.slice(0, 6);

  dashboardState.timeline.unshift({
    title: chosenTelemetry,
    text: `${timeNow()} · Sistem tarafından yeni durum kaydı işlendi`
  });
  dashboardState.timeline = dashboardState.timeline.slice(0, 5);

  dashboardState.maintenanceAlerts[0] = {
    title: randomChoice(telemetryNames),
    text: randomChoice([
      'Bakım periyodu yaklaşmak üzere.',
      'Servis planlaması öneriliyor.',
      'Motor saati bazlı kontrol eşiği yaklaşıyor.',
      'Sistem bu ekipman için inceleme öneriyor.'
    ])
  };
}

function renderAll() {
  updateNumbers();
  renderTelemetry();
  renderMaintenanceAlerts();
  renderFuelTable();
  renderTimeline();
  renderLiveFeed();
}

if (checkForm) {
  checkForm.addEventListener('submit', function (e) {
    e.preventDefault();
    dashboardState.checklistCount += 1;
    dashboardState.liveFeed.unshift({
      color: 'green',
      title: 'Check-list kaydedildi',
      text: 'Yeni operatör teslim kontrol formu demo olarak işlendi.',
      time: 'Şimdi'
    });
    dashboardState.liveFeed = dashboardState.liveFeed.slice(0, 6);

    dashboardState.timeline.unshift({
      title: 'Yeni Check-list',
      text: `${timeNow()} · Operatör formu başarıyla kaydedildi`
    });
    dashboardState.timeline = dashboardState.timeline.slice(0, 5);

    renderAll();
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  });
}

renderAll();

setInterval(() => {
  mutateState();
  renderAll();
}, 5000);
