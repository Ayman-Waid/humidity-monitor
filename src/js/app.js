import Alpine from 'alpinejs'
import persist from '@alpinejs/persist'
import { createLineChart, createBarChart, createPieChart } from './charts.js'

Alpine.plugin(persist)
window.Alpine = Alpine

const mockZones = () =>
  Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Zone ${i + 1}`,
    moisture: Math.floor(Math.random() * 100),
    history: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)),
    coordinates: [48.8584 + Math.random() * 0.1, 2.2945 + Math.random() * 0.1],
  }))

document.addEventListener('alpine:init', () => {
  Alpine.store('app', {
    isLoading: true,
    currentView: Alpine.$persist('dashboard'),
    zones: [],
    selectedZoneId: null,
    charts: {},
    thresholds: { warning: 40, critical: 30 },
    isDark: Alpine.$persist(false),
    activeAlerts: [],
    map: null,

    get averageMoisture() {
      return this.zones.length
        ? this.zones.reduce((sum, z) => sum + z.moisture, 0) / this.zones.length
        : 0
    },

    get selectedZone() {
      return this.zones.find(z => z.id === this.selectedZoneId) || {}
    },

    async loadZones() {
      this.isLoading = true
      try {
        this.zones = mockZones()
        if (!this.selectedZoneId) this.selectedZoneId = this.zones[0]?.id
        this.checkAlerts()
        // initialisation ou mise à jour selon la vue
        if (['dashboard','zoneDetail'].includes(this.currentView)) this.initZoneChart()
        if (this.currentView === 'dashboard') this.initComparisonChart()
        if (this.currentView === 'analytics') this.initAnalyticsCharts()
        if (['dashboard','map'].includes(this.currentView)) this.initMap()
      } finally {
        this.isLoading = false
      }
    },

    checkAlerts() {
      this.activeAlerts = this.zones
        .filter(z => z.moisture <= this.thresholds.warning)
        .map(z => ({ ...z, type: z.moisture <= this.thresholds.critical ? 'critique' : 'avertissement' }))
    },

    initZoneChart() {
      const el = document.getElementById('zoneChart')
      if (!el) return
      const ctx = el.getContext('2d')
      const data = this.selectedZone.history || []
      if (!this.charts.zone) {
        this.charts.zone = createLineChart(ctx, this.generateHours(), data, { borderColor: '#10B981', tension: 0.4 })
      } else {
        this.charts.zone.data.datasets[0].data = data
        this.charts.zone.update()
      }
    },

    initComparisonChart() {
      const el = document.getElementById('comparisonChart')
      if (!el) return
      const ctx = el.getContext('2d')
      const labels = this.zones.map(z => z.name)
      const data = this.zones.map(z => z.moisture)
      if (!this.charts.comparison) {
        this.charts.comparison = createBarChart(ctx, labels, data, { backgroundColor: '#3B82F6' })
      } else {
        this.charts.comparison.data.labels = labels
        this.charts.comparison.data.datasets[0].data = data
        this.charts.comparison.update()
      }
    },

    initAnalyticsCharts() {
      const crit = this.zones.filter(z => z.moisture <= this.thresholds.critical).length
      const warn = this.zones.filter(z => z.moisture > this.thresholds.critical && z.moisture <= this.thresholds.warning).length
      const norm = this.zones.length - crit - warn

      const sEl = document.getElementById('statusChart')
      if (sEl) {
        const ctx = sEl.getContext('2d')
        if (!this.charts.status) {
          this.charts.status = createPieChart(ctx, ['Critique','Avertissement','Normal'], [crit,warn,norm], ['#EF4444','#F59E0B','#10B981'])
        } else {
          this.charts.status.data.datasets[0].data = [crit,warn,norm]
          this.charts.status.update()
        }
      }

      const tEl = document.getElementById('trendChart')
      if (tEl) {
        const ctx = tEl.getContext('2d')
        const data = this.zones[0]?.history || []
        if (!this.charts.trend) {
          this.charts.trend = createLineChart(ctx, this.generateHours(), data, { borderColor: '#3B82F6' })
        } else {
          this.charts.trend.data.datasets[0].data = data
          this.charts.trend.update()
        }
      }
    },

    initMap() {
      if (!document.getElementById('map')) return
      if (!this.map) {
        this.map = L.map('map').setView([48.8584,2.2945],13)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19, attribution: '© OpenStreetMap'
        }).addTo(this.map)
      }
      // Retirer anciens markers
      this.map.eachLayer(l => l instanceof L.Marker && this.map.removeLayer(l))
      this.zones.forEach(z => {
        L.marker(z.coordinates)
          .addTo(this.map)
          .bindPopup(`<b>${z.name}</b><br>Humidité: ${z.moisture}%`)
      })
    },

    toggleTheme() {
      this.isDark = !this.isDark
      document.documentElement.classList.toggle('dark', this.isDark)
    },

    generateHours() {
      return Array.from({ length: 24 }, (_, i) => `${i}h`)
    },
  })
})

Alpine.start()
