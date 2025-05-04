import { Alpine } from 'alpinejs'
import persist from '@alpinejs/persist'
import { describe, it, expect, beforeAll } from 'vitest'
import { mockZones } from '../../src/js/app.js'

Alpine.plugin(persist)
window.Alpine = Alpine

describe('App Store', () => {
  let store
  
  beforeAll(() => {
    document.addEventListener('alpine:init', () => {
      store = Alpine.store('app')
    })
    Alpine.start()
  })

  it('should initialize with default values', () => {
    expect(store.isLoading).toBe(true)
    expect(store.currentView).toBe('dashboard')
    expect(store.zones).toEqual([])
    expect(store.selectedZoneId).toBeNull()
    expect(store.isDark).toBe(false)
  })

  it('should generate mock zones correctly', () => {
    const zones = mockZones()
    expect(zones.length).toBe(8)
    zones.forEach(zone => {
      expect(zone).toHaveProperty('id')
      expect(zone).toHaveProperty('name')
      expect(zone).toHaveProperty('moisture')
      expect(zone.moisture).toBeGreaterThanOrEqual(0)
      expect(zone.moisture).toBeLessThanOrEqual(100)
      expect(zone).toHaveProperty('coords')
      expect(zone.coords.length).toBe(2)
    })
  })

  it('should calculate average moisture correctly', async () => {
    await store.loadZones()
    const avg = store.averageMoisture
    expect(avg).toBeGreaterThanOrEqual(0)
    expect(avg).toBeLessThanOrEqual(100)
    expect(avg).toBeCloseTo(
      store.zones.reduce((sum, z) => sum + z.moisture, 0) / store.zones.length,
      1
    )
  })

  it('should return selected zone', async () => {
    await store.loadZones()
    store.selectedZoneId = store.zones[0].id
    expect(store.selectedZone).toEqual(store.zones[0])
  })

  it('should check alerts based on thresholds', async () => {
    await store.loadZones()
    store.checkAlerts()
    
    store.zones.forEach(zone => {
      if (zone.moisture <= store.thresholds.warning) {
        const alert = store.activeAlerts.find(a => a.id === zone.id)
        expect(alert).toBeDefined()
        expect(alert.type).toBe(
          zone.moisture <= store.thresholds.critical ? 'critique' : 'avertissement'
        )
      }
    })
  })

  it('should toggle theme', () => {
    const initial = store.isDark
    store.toggleTheme()
    expect(store.isDark).toBe(!initial)
    store.toggleTheme()
    expect(store.isDark).toBe(initial)
  })
})