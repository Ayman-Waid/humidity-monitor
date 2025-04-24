import { createLineChart, createBarChart, createPieChart } from './charts.js';

function generateDummyZones() {
  return Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Zone ${i + 1}`,
    moisture: Math.floor(Math.random() * 100),
    history: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)),
    coordinates: [48.8584 + Math.random() * 0.1, 2.2945 + Math.random() * 0.1]
  }));
}

function getHours() {
  return Array.from({ length: 24 }, (_, i) => `${i}h`);
}

window.app = function() {
  return {
    isLoading: true,
    currentView: 'dashboard',
    zones: [],
    selectedZoneId: null,
    charts: {},
    thresholds: { warning: 40, critical: 30 },
    isDark: localStorage.getItem('theme') === 'dark',
    activeAlerts: [],

    navItems: [
      { id: 'dashboard', emoji: '📊', label: 'Dashboard', description: 'Vue globale' },
      { id: 'zones', emoji: '🌾', label: 'Zones', description: 'Gestion des zones' },
      { id: 'alerts', emoji: '🚨', label: 'Alertes', description: 'Alertes' },
      { id: 'analytics', emoji: '📈', label: 'Analytics', description: 'Analyse approfondie' },
      { id: 'map', emoji: '🗺️', label: 'Carte', description: 'Visualisation géographique' }
    ],

    get currentViewLabel() {
      return this.navItems.find(n => n.id === this.currentView)?.label;
    },
    get currentViewDescription() {
      return this.navItems.find(n => n.id === this.currentView)?.description;
    },
    get averageMoisture() {
      return this.zones.length
        ? this.zones.reduce((sum, z) => sum + z.moisture, 0) / this.zones.length
        : 0;
    },
    get criticalZones() {
      return this.zones.filter(z => z.moisture <= this.thresholds.critical);
    },
    get warningZones() {
      return this.zones.filter(z => z.moisture > this.thresholds.critical && z.moisture <= this.thresholds.warning);
    },

    async initApp() {
      document.documentElement.classList.toggle('dark', this.isDark);
      await this.loadZones();
      this.selectedZoneId = this.zones[0]?.id;
      this.setupWatchers();
      this.setupAutoRefresh();
    },

    async loadZones() {
      this.isLoading = true;
      try {
        await new Promise(r => setTimeout(r, 500));
        this.zones = generateDummyZones();
        this.checkForAlerts();
        this.setupCharts();
      } catch {
        this.notify('error', 'Erreur de chargement');
      } finally {
        this.isLoading = false;
      }
    },

    setupWatchers() {
      this.$watch('currentView', val => {
        if (val === 'dashboard') this.setupCharts();
        if (val === 'analytics') this.createAnalyticsCharts();
        if (val === 'map') this.initializeMap();
      });
      this.$watch('selectedZoneId', () => {
        this.updateZoneChart();
        this.updateAggregateChart();
      });
    },

    setupCharts() {
      this.initZoneChart();
      this.initAggregateChart();
    },

    initZoneChart() {
      const ctx = document.getElementById('zoneChart').getContext('2d');
      if (this.charts.zone) this.charts.zone.destroy();
      this.charts.zone = createBarChart(ctx, getHours(), this.getHistory());
    },

    initAggregateChart() {
      const ctx = document.getElementById('aggregateChart').getContext('2d');
      if (this.charts.aggregate) this.charts.aggregate.destroy();
      this.charts.aggregate = createLineChart(ctx, getHours(), this.getHistory());
    },

    updateZoneChart() {
      const data = this.getHistory();
      this.charts.zone.data.datasets[0].data = data;
      this.charts.zone.options.plugins = { title: { display: true, text: `Zone ${this.selectedZoneId}` } };
      this.charts.zone.update();
    },

    updateAggregateChart() {
      const data = this.getHistory();
      this.charts.aggregate.data.datasets[0].data = data;
      this.charts.aggregate.update();
    },

    getHistory() {
      return this.zones.find(z => z.id === this.selectedZoneId)?.history || [];
    },

    createAnalyticsCharts() {
      const pieCtx = document.getElementById('pieChart').getContext('2d');
      if (this.charts.pie) this.charts.pie.destroy();
      this.charts.pie = createPieChart(pieCtx,
        ['Critiques','Avert','Normales'],
        [this.criticalZones.length, this.warningZones.length, this.zones.length - this.criticalZones.length - this.warningZones.length]
      );

      const barCtx = document.getElementById('barChart').getContext('2d');
      if (this.charts.bar) this.charts.bar.destroy();
      this.charts.bar = createBarChart(barCtx, this.zones.map(z => z.name), this.zones.map(z => z.moisture));

      const avg = getHours().map((_,i) =>
        this.zones.reduce((sum,z) => sum + z.history[i],0) / this.zones.length
      );
      const lineCtx = document.getElementById('lineChart').getContext('2d');
      if (this.charts.line) this.charts.line.destroy();
      this.charts.line = createLineChart(lineCtx, getHours(), avg);
    },

    initializeMap() {
      if (this.map) return;
      this.map = L.map('map').setView([48.8584,2.2945],13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ maxZoom:19 }).addTo(this.map);
      this.zones.forEach(z => L.marker(z.coordinates).addTo(this.map).bindPopup(`${z.name}: ${z.moisture}%`));
    },

    checkForAlerts() {
      this.activeAlerts = [
        ...this.criticalZones.map(z => ({ ...z, type: 'critical' })),
        ...this.warningZones.map(z => ({ ...z, type: 'warning' }))
      ];
    },

    setupAutoRefresh() {
      setInterval(() => {
        this.zones = this.zones.map(z => ({
          ...z,
          moisture: Math.max(0, Math.min(100, z.moisture + (Math.random()*10-5))),
          history: [...z.history.slice(1), Math.floor(Math.random()*100)]
        }));
        this.checkForAlerts();
        if (this.currentView === 'dashboard') this.setupCharts();
      }, 15000);
    },

    toggleTheme() {
      this.isDark = !this.isDark;
      document.documentElement.classList.toggle('dark', this.isDark);
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    },

    notify(type, message) {
      console[type === 'error' ? 'error' : 'log'](message);
    },

    statusColor(m) {
      if (m <= this.thresholds.critical) return 'bg-critical';
      if (m <= this.thresholds.warning) return 'bg-warning';
      return 'bg-primary';
    },

    toastColor(type) {
      return { success: 'bg-primary', warning: 'bg-warning', error: 'bg-critical' }[type];
    },

    toastIcon(type) {
      return { success: '✅', warning: '⚠️', error: '❌' }[type];
    }
  };
};
