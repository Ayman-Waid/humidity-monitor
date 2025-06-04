import Alpine from 'alpinejs'
import persist from '@alpinejs/persist'
import { createLineChart, createBarChart, createPieChart } from './charts.js'

Alpine.plugin(persist)
window.Alpine = Alpine

const mockZones = () =>
  Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    name: `Zone ${i + 1}`,
    moisture: Math.floor(Math.random() * 100),
    latest: Math.floor(Math.random() * 100),
    capture1: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)),
    capture2: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)),
    history:  Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)),
    coords: [48.8584 + Math.random() * 0.1, 2.2945 + Math.random() * 0.1]
  }))

document.addEventListener('alpine:init', () => {
  Alpine.store('app', {
    isLoading: true,
    currentView: Alpine.$persist('dashboard'),
    zones: [], selectedZoneId: null,
    charts: {}, thresholds: { warning: 40, critical: 30 },
    isDark: Alpine.$persist(false),
    activeAlerts: [], map: null,

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
      const res = await fetch('http://localhost:8080/api/zones')
      if (!res.ok) throw new Error('Erreur de chargement des zones')
      const data = await res.json()
      this.zones = data.zones.map(z => {
        const sensor1 = z.sensorValues?.[0] ?? z.moisture
        const sensor2 = z.sensorValues?.[1] ?? z.moisture
        return {
          ...z,
          latest: Math.max(sensor1, sensor2),
          capture1: Array.from({ length: 24 }, () => sensor1 + (Math.random() * 10 - 5)),
          capture2: Array.from({ length: 24 }, () => sensor2 + (Math.random() * 10 - 5)),
          history: Array.from({ length: 24 }, () => z.moisture + (Math.random() * 10 - 5))
        }
      })
      this.activeAlerts = data.activeAlerts || []
      if (!this.selectedZoneId) this.selectedZoneId = this.zones[0]?.id
    } catch (e) {
      console.error('Chargement échoué, fallback aux données mock')
      this.zones = mockZones()
      if (!this.selectedZoneId) this.selectedZoneId = this.zones[0]?.id
      this.checkAlerts()
    }

    try {
      if (this.currentView === 'dashboard') {
        this.initZoneChart()
        this.initComparisonChart()
        this.initMap()
      }
      if (this.currentView === 'analytics') this.initAnalyticsCharts()
      if (this.currentView === 'map') this.initMap()
      if (this.currentView === 'zoneDetail') this.initZoneDetailCharts()
    } catch (initErr) {
      console.error('Error initializing charts:', initErr)
    }

    this.isLoading = false
  },
    checkAlerts() {
      this.activeAlerts = this.zones
        .filter(z => z.moisture <= this.thresholds.warning)
        .map(z => ({
          ...z,
          type: z.moisture <= this.thresholds.critical ? 'critique' : 'avertissement'
        }))
    },

    initZoneChart() {
      const ctx = document.getElementById('zoneChart')?.getContext('2d')
      if (!ctx) return
      const data = this.zones.find(z=>z.id===this.selectedZoneId)?.history || []
      if (!this.charts.zone) {
        this.charts.zone = createLineChart(ctx, this.generateHours(), data, { borderColor:'#10B981', tension:0.4 })
      } else {
        this.charts.zone.data.datasets[0].data = data
        this.charts.zone.update()
      }
    },

    initComparisonChart() {
      const ctx = document.getElementById('comparisonChart')?.getContext('2d')
      if (!ctx) return
      const labels = this.zones.map(z=>z.name)
      const data   = this.zones.map(z=>z.moisture)
      if (!this.charts.comparison) {
        this.charts.comparison = createBarChart(ctx, labels, data, { backgroundColor:'#3B82F6' })
      } else {
        this.charts.comparison.data.labels = labels
        this.charts.comparison.data.datasets[0].data = data
        this.charts.comparison.update()
      }
    },

    initAnalyticsCharts() {
      const crit = this.zones.filter(z=>z.moisture<=this.thresholds.critical).length
      const warn = this.zones.filter(z=>z.moisture>this.thresholds.critical && z.moisture<=this.thresholds.warning).length
      const norm = this.zones.length - crit - warn

      const ctx1 = document.getElementById('statusChart')?.getContext('2d')
      if (ctx1) {
        if (!this.charts.status) {
          this.charts.status = createPieChart(ctx1, ['Critique','Avertissement','Normal'], [crit,warn,norm], ['#EF4444','#F59E0B','#10B981'])
        } else {
          this.charts.status.data.datasets[0].data = [crit,warn,norm]
          this.charts.status.update()
        }
      }

      const ctx2 = document.getElementById('trendChart')?.getContext('2d')
      if (ctx2) {
        const data = this.zones[0]?.history || []
        if (!this.charts.trend) {
          this.charts.trend = createLineChart(ctx2, this.generateHours(), data, { borderColor:'#3B82F6' })
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
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OSM'}).addTo(this.map)
      }
      this.map.eachLayer(l=>l instanceof L.Marker && this.map.removeLayer(l))
      this.zones.forEach(z => {
        L.marker(z.coords).addTo(this.map).bindPopup(`<b>${z.name}</b><br>Humidité: ${z.moisture.toFixed(1)}%`)
      })
    },

    initZoneDetailCharts() {
      const z = this.selectedZone, hrs = this.generateHours()
      const c1 = document.getElementById('zoneChart1')?.getContext('2d')
      if (c1) {
        if (!this.charts.d1) {
          this.charts.d1 = createLineChart(c1, hrs, z.capture1, { label:'Capture 1', borderColor:'#3B82F6', tension:0.3 })
        } else {
          this.charts.d1.data.datasets[0].data = z.capture1; this.charts.d1.update()
        }
      }

      const c2 = document.getElementById('zoneChart2')?.getContext('2d')
      if (c2) {
        if (!this.charts.d2) {
          this.charts.d2 = createLineChart(c2, hrs, z.capture2, { label:'Capture 2', borderColor:'#10B981', tension:0.3 })
        } else {
          this.charts.d2.data.datasets[0].data = z.capture2; this.charts.d2.update()
        }
      }
    },

    toggleTheme() {
      this.isDark = !this.isDark
    },

    generateHours() {
      return Array.from({ length: 24 }, (_, i) => `${i}h`)
    }
  })
})

Alpine.start()
