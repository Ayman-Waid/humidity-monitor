import Alpine from 'alpinejs'
import persist from '@alpinejs/persist'
import { createLineChart, createBarChart, createPieChart } from './charts.js'

Alpine.plugin(persist)
window.Alpine = Alpine

const mockZones = () => {
  return Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Zone ${i + 1}`,
    moisture: Math.floor(Math.random() * 100),
    history: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)),
    coordinates: [48.8584 + Math.random() * 0.1, 2.2945 + Math.random() * 0.1]
  }))
}

document.addEventListener('alpine:init', () => {
  Alpine.store('app', {
    // State
    isLoading: true,
    currentView: Alpine.$persist('dashboard'),
    zones: [],
    selectedZoneId: null,
    charts: {},
    thresholds: { warning: 40, critical: 30 },
    isDark: Alpine.$persist(false),
    activeAlerts: [],
    map: null,

    // Navigation
    navItems: [
      { id: 'dashboard', emoji: '📊', label: 'Dashboard', description: 'Vue globale' },
      { id: 'analytics', emoji: '📈', label: 'Analytics', description: 'Analyse des données' },
      { id: 'map', emoji: '🗺️', label: 'Carte', description: 'Localisation des zones' }
    ],

    // Getters
    get currentViewLabel() {
      return this.navItems.find(n => n.id === this.currentView)?.label || ''
    },

    get currentViewDescription() {
      return this.navItems.find(n => n.id === this.currentView)?.description || ''
    },

    get averageMoisture() {
      return this.zones.length 
        ? this.zones.reduce((sum, z) => sum + z.moisture, 0) / this.zones.length
        : 0
    },

    get selectedZone() {
      return this.zones.find(z => z.id === this.selectedZoneId)
    },

    // Methods
    async loadZones() {
      try {
        this.isLoading = true
        this.zones = mockZones()
        this.selectedZoneId = this.zones[0]?.id
        this.checkAlerts()
        this.initCharts()
        if (this.currentView === 'map') this.initMap()
      } catch (error) {
        console.error('Error:', error)
      } finally {
        this.isLoading = false
      }
    },

    checkAlerts() {
      this.activeAlerts = this.zones.filter(z => 
        z.moisture <= this.thresholds.critical || 
        z.moisture <= this.thresholds.warning
      ).map(z => ({
        ...z,
        type: z.moisture <= this.thresholds.critical ? 'critical' : 'warning'
      }))
    },

    initCharts() {
      this.initZoneChart()
      this.initComparisonChart()
      if (this.currentView === 'analytics') this.initAnalyticsCharts()
    },

    initZoneChart() {
      const ctx = document.getElementById('zoneChart')
      if (!ctx) return
      
      if (this.charts.zone) this.charts.zone.destroy()
      
      this.charts.zone = createLineChart(ctx.getContext('2d'), 
        this.generateHours(),
        this.selectedZone?.history || [],
        {
          borderColor: '#10B981',
          tension: 0.4
        }
      )
    },

    initComparisonChart() {
      const ctx = document.getElementById('comparisonChart')
      if (!ctx) return
      
      if (this.charts.comparison) this.charts.comparison.destroy()
      
      this.charts.comparison = createBarChart(ctx.getContext('2d'),
        this.zones.map(z => z.name),
        this.zones.map(z => z.moisture),
        {
          backgroundColor: '#3B82F6'
        }
      )
    },

    initAnalyticsCharts() {
      const statusCtx = document.getElementById('statusChart')
      const trendCtx = document.getElementById('trendChart')
      
      if (statusCtx) {
        const critical = this.zones.filter(z => z.moisture <= this.thresholds.critical).length
        const warning = this.zones.filter(z => z.moisture > this.thresholds.critical && z.moisture <= this.thresholds.warning).length
        const normal = this.zones.length - critical - warning
        
        if (this.charts.status) this.charts.status.destroy()
        this.charts.status = createPieChart(statusCtx.getContext('2d'),
          ['Critique', 'Avertissement', 'Normal'],
          [critical, warning, normal],
          ['#EF4444', '#F59E0B', '#10B981']
        )
      }

      if (trendCtx) {
        if (this.charts.trend) this.charts.trend.destroy()
        this.charts.trend = createLineChart(trendCtx.getContext('2d'),
          this.generateHours(),
          this.zones[0]?.history || [],
          {
            borderColor: '#3B82F6'
          }
        )
      }
    },

    initMap() {
      if (this.map) return
      
      this.map = L.map('map').setView([48.8584, 2.2945], 13)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(this.map)

      this.zones.forEach(zone => {
        L.marker(zone.coordinates)
          .addTo(this.map)
          .bindPopup(`
            <b>${zone.name}</b><br>
            Humidité: ${zone.moisture}%<br>
            Dernière mise à jour: ${new Date().toLocaleTimeString()}
          `)
      })
    },

    toggleTheme() {
      this.isDark = !this.isDark
      document.documentElement.classList.toggle('dark', this.isDark)
    },

    generateHours() {
      return Array.from({ length: 24 }, (_, i) => `${i}h`)
    },

    updateCharts() {
      if (this.charts.zone) {
        this.charts.zone.data.datasets[0].data = this.selectedZone?.history || []
        this.charts.zone.update()
      }
    }
  })
})

Alpine.start()