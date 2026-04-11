const openDrawer = document.getElementById('openDrawer');
const drawer = document.getElementById('drawer');
const toast = document.getElementById('toast');
const checkForm = document.getElementById('checkForm');
const navItems = document.querySelectorAll('.nav-item');
const drawerItems = document.querySelectorAll('.drawer-item');
const quickButtons = document.querySelectorAll('[data-tab-jump]');
const screens = document.querySelectorAll('.tab-screen');

const state = {
  totalFleet: 186,
  activeMachines: 161,
  maintenanceSoon: 24,
  criticalAlerts: 9,
  checklistCount: 142,
  efficiency: 87,
  riskScore: 72,
  telemetry: [
    { name: 'CAT 374 Ekskavatör', detail: 'Kazı Alanı A · Operatör: M. Kaya', status: 'active', label: 'Aktif' },
    { name: 'Komatsu HD785 Kaya Kamyonu', detail: 'Taşıma Koridoru · Operatör: A. Yılmaz', status: 'active', label: 'Aktif' },
    { name: 'Volvo EC480', detail: 'Bakım Alanına Yönlendirildi', status: 'service', label: 'Servis' },
    { name: 'Mercedes Arocs Servis Aracı', detail: 'Yakıt İkmal Noktası', status: 'idle', label: 'Beklemede' }
  ],
  feed: [
    { color: 'lime', title: 'Operasyon başladı', text: 'Sabah vardiyası başarıyla devreye alındı.', time: 'Az önce' },
    { color: 'purple', title: 'Telemetri güncellendi', text: 'Aktif makine sayısı yeniden hesaplandı.', time: '1 dk önce' },
    { color: 'orange', title: 'Bakım planı üretildi', text: '2 ekipman için servis planı oluşturuldu.', time: '3 dk önce' },
    { color: 'red', title: 'Yakıt alarmı oluştu', text: 'Bir araçta anormal tüketim gözlendi.', time: '5 dk önce' }
  ],
  alerts: [
    { title: 'CAT 374', text: '12 saat içinde bakım eşiğine ulaşacak.' },
    { title: 'Komatsu HD785', text: 'Motor saati kritik bakım sınırına yaklaşıyor.' },
    { title: 'Volvo EC480', text: 'Hidrolik sistem kontrolü öneriliyor.' }
  ],
  timeline: [
    { title: 'CAT 374', text: '07:12 · M. Kaya check-list tamamladı' },
    { title: 'Komatsu HD785', text: '07:18 · A. Yılmaz check-list tamamladı' },
    { title: 'Volvo EC480', text: '07:26 · Hidrolik uyarısı not edildi' }
  ],
  novaSuggestions: [
    { title: 'NoVa AI verimlilik yorumu', text: 'Komatsu HD785 için rölanti süresi yükseliyor. Vardiya alışkanlıkları kontrol edilmeli.' },
    { title: 'NoVa AI bakım tahmini', text: 'CAT 374 bakım periyodu mevcut üretim planına göre erkene çekilebilir.' },
    { title: 'NoVa AI operasyon analizi', text: 'Servis araçlarında bekleme süresi optimizasyon potansiyeli taşıyor.' }
  ],
  fuelRows: [
    { name: 'CAT 374', motor: '8.4 s', fuel: '312 L', idle: '52 dk', score: 'İyi', className: 'good' },
    { name: 'Komatsu HD785', motor: '10.1 s', fuel: '498 L', idle: '95 dk', score: 'İzlenmeli', className: 'warn' },
    { name: 'Volvo EC480', motor: '4.2 s', fuel: '141 L', idle: '18 dk', score: 'İyi', className: 'good' },
    { name: 'Arocs Servis', motor: '6.7 s', fuel: '74 L', idle: '31 dk', score: 'Düşük', className: 'bad' }
  ],
  insights: [
    'Komatsu HD785 için rölanti süresi artıyor. Yakıt optimizasyon kontrolü öneriliyor.',
    'CAT 374 bakım planı erkene çekilirse arıza riski düşebilir.',
    'Servis araçlarında bekleme süresi operasyon akışına göre yeniden ayarlanabilir.',
    'Volvo EC480 hidrolik izleme verisi artan dikkat ihtiyacına işaret ediyor.'
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

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function flashText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value;
  el.classList.remove('flash');
  void el.offsetWidth;
  el.classList.add('flash');
}

function renderTelemetry() {
  const el = document.getElementById('telemetryList');
  if (!el) return;

  el.innerHTML = state.telemetry.map(item => `
    <div class="machine-item">
      <div>
        <strong>${item.name}</strong>
        <p>${item.detail}</p>
      </div>
      <span class="status ${item.status}">${item.label}</span>
    </div>
  `).join('');
}

function renderFeed() {
  const el = document.getElementById('liveFeed');
  if (!el) return;

  el.innerHTML = state.feed.map(item => `
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

function renderAlerts() {
  const el = document.getElementById('maintenanceAlertList');
  if (!el) return;

  el.innerHTML = state.alerts.map(item => `
    <div class="alert-item">
      <strong>${item.title}</strong>
      <p>${item.text}</p>
    </div>
  `).join('');
}

function renderTimeline() {
  const el = document.getElementById('timelineList');
  if (!el) return;

  el.innerHTML = state.timeline.map(item => `
    <div class="timeline-item">
      <strong>${item.title}</strong>
      <p>${item.text}</p>
    </div>
  `).join('');
}

function renderNovaSuggestions() {
  const el = document.getElementById('novaSuggestionList');
  if (!el) return;

  el.innerHTML = state.novaSuggestions.map(item => `
    <div class="nova-item">
      <strong>${item.title}</strong>
      <p>${item.text}</p>
    </div>
  `).join('');
}

function renderFuelTable() {
  const el = document.getElementById('fuelTableBody');
  if (!el) return;

  el.innerHTML = state.fuelRows.map(row => `
    <tr>
      <td>${row.name}</td>
      <td>${row.motor}</td>
      <td>${row.fuel}</td>
      <td>${row.idle}</td>
      <td><span class="pill ${row.className}">${row.score}</span></td>
    </tr>
  `).join('');
}

function updateUI() {
  flashText('kpiActiveMachines', state.activeMachines);
  flashText('kpiMaintenanceSoon', state.maintenanceSoon);
  flashText('kpiCriticalAlerts', state.criticalAlerts);

  flashText('totalFleet', state.totalFleet);
  flashText('checklistCount', state.checklistCount);
  flashText('efficiencyScore', `%${state.efficiency}`);
  flashText('riskScore', `${state.riskScore}/100`);

  const metricFuelAlerts = document.getElementById('metricFuelAlerts');
  if (metricFuelAlerts) {
    flashText('metricFuelAlerts', Math.max(2, Math.min(8, state.criticalAlerts - 4)));
  }

  const insight = document.getElementById('novaInsightText');
  if (insight) insight.textContent = randomChoice(state.insights);

  const updateTime = document.getElementById('dashboardUpdateTime');
  if (updateTime) updateTime.textContent = `Güncelleme: ${timeNow()}`;

  renderTelemetry();
  renderFeed();
  renderAlerts();
  renderTimeline();
  renderNovaSuggestions();
  renderFuelTable();
}

function mutateState() {
  state.activeMachines = Math.max(150, Math.min(170, state.activeMachines + randomBetween(-2, 2)));
  state.maintenanceSoon = Math.max(20, Math.min(30, state.maintenanceSoon + randomBetween(-1, 1)));
  state.criticalAlerts = Math.max(6, Math.min(12, state.criticalAlerts + randomBetween(-1, 1)));
  state.checklistCount = Math.max(130, Math.min(180, state.checklistCount + randomBetween(0, 2)));
  state.efficiency = Math.max(82, Math.min(92, state.efficiency + randomBetween(-1, 1)));
  state.riskScore = Math.max(62, Math.min(88, state.riskScore + randomBetween(-2, 2)));

  const statuses = [
    { status: 'active', label: 'Aktif' },
    { status: 'idle', label: 'Beklemede' },
    { status: 'service', label: 'Servis' }
  ];

  state.telemetry = state.telemetry.map(item => {
    const picked = randomChoice(statuses);
    return { ...item, status: picked.status, label: picked.label };
  });

  const telemetryNames = state.telemetry.map(t => t.name);
  const chosenMachine = randomChoice(telemetryNames);

  state.feed.unshift({
    color: randomChoice(['purple', 'lime', 'orange', 'red']),
    title: randomChoice([
      'Durum değişimi algılandı',
      'Yeni operasyon kaydı işlendi',
      'NoVa AI uyarı üretti',
      'Sistem verisi güncellendi'
    ]),
    text: `${chosenMachine} için yeni veri işlendi.`,
    time: 'Şimdi'
  });
  state.feed = state.feed.slice(0, 5);

  state.timeline.unshift({
    title: chosenMachine,
    text: `${timeNow()} · Yeni operasyon kaydı işlendi`
  });
  state.timeline = state.timeline.slice(0, 4);

  state.alerts[0] = {
    title: randomChoice(telemetryNames),
    text: randomChoice([
      'Bakım periyodu yaklaşmak üzere.',
      'Servis planlaması öneriliyor.',
      'Motor saati eşiği yükseliyor.',
      'NoVa AI bu ekipman için kontrol öneriyor.'
    ])
  };

  state.novaSuggestions[0] = {
    title: randomChoice([
      'NoVa AI verimlilik yorumu',
      'NoVa AI bakım tahmini',
      'NoVa AI operasyon analizi'
    ]),
    text: randomChoice(state.insights)
  };

  state.fuelRows = state.fuelRows.map(row => {
    const fuelValue = parseInt(row.fuel, 10) + randomBetween(-12, 12);
    const idleValue = parseInt(row.idle, 10) + randomBetween(-7, 7);

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
}

if (checkForm) {
  checkForm.addEventListener('submit', e => {
    e.preventDefault();

    state.checklistCount += 1;
    state.feed.unshift({
      color: 'lime',
      title: 'Check-list kaydedildi',
      text: 'Yeni operatör formu demo olarak işlendi.',
      time: 'Şimdi'
    });
    state.feed = state.feed.slice(0, 5);

    state.timeline.unshift({
      title: 'Yeni Check-list',
      text: `${timeNow()} · Operatör formu başarıyla kaydedildi`
    });
    state.timeline = state.timeline.slice(0, 4);

    updateUI();
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  });
}

updateUI();

setInterval(() => {
  mutateState();
  updateUI();
}, 5000);
