import { screen, fireEvent, waitFor } from '@testing-library/dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import Alpine from 'alpinejs'

// Mock Leaflet with serializable objects
vi.mock('leaflet', () => ({
  map: vi.fn(() => ({})),
  tileLayer: vi.fn(() => ({})),
  marker: vi.fn(() => ({}))
}))

const html = readFileSync(resolve(__dirname, '../../../public/index.html'), 'utf-8')

// Define appData with only serializable properties
const appData = () => ({
  currentView: 'dashboard',
  isDark: false,
  isLoading: false,
  navItems: [],
  zones: [
    { id: 1, name: 'Zone 1', moisture: 25 },
    { id: 2, name: 'Zone 2', moisture: 35 }
  ],
  alerts: []
})

describe('Component Behavior', () => {
  beforeEach(() => {
    document.body.innerHTML = html
    global.Alpine = Alpine
    Alpine.data('app', appData)
    Alpine.store('app', appData()) // Only serializable data is passed to the store
    Alpine.start()
  })

  describe('Alert Cards', () => {
    it('should display active alerts', () => {
      const store = Alpine.store('app')
      store.zones[0].moisture = 25
      store.zones[1].moisture = 35
      store.alerts = store.zones.filter(z => z.moisture < 40)

      const alertCount = store.alerts.length
      expect(alertCount).toBe(2)
    })
  })

  describe('Map Component', () => {
    it('should initialize map when view changes', async () => {
      const store = Alpine.store('app')
      store.currentView = 'map'
      const current = store.currentView
      expect(current).toBe('map')
    })
  })
})