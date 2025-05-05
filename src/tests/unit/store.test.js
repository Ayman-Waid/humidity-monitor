import persist from '@alpinejs/persist'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockZones } from '@/js/app.js'

Alpine.plugin(persist)

describe('Alpine Store', () => {
  let store
  
  beforeEach(() => {
    // Reset Alpine before each test
    global.Alpine.stores = {}
    document.dispatchEvent(new Event('alpine:init'))
    store = Alpine.store('app')
    Alpine.start()
    
    // Mock localStorage for persist plugin
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn()
    }
  })

  describe('Initialization', () => {
    it('should set default values', () => {
      expect(store.isLoading).toBe(true)
      expect(store.currentView).toBe('dashboard')
      expect(store.zones).toEqual([])
      expect(store.selectedZoneId).toBeNull()
      expect(store.thresholds).toEqual({
        warning: 40,
        critical: 30
      })
      expect(store.activeAlerts).toEqual([])
      expect(store.map).toBeNull()
    })
  })

  describe('Data Loading', () => {
    it('should load mock zones correctly', async () => {
      await store.loadZones()
      
      expect(store.isLoading).toBe(false)
      expect(store.zones.length).toBe(8)
      expect(store.selectedZoneId).toBe(store.zones[0].id)
      expect(store.activeAlerts.length).toBeGreaterThanOrEqual(0)
    })

    it('should handle errors during loading', async () => {
      const originalMock = mockZones
      mockZones = vi.fn(() => { throw new Error('Mock error') })
      
      await store.loadZones()
      
      expect(store.isLoading).toBe(false)
      expect(store.zones).toEqual([])
      
      mockZones = originalMock
    })
  })

  describe('Computed Properties', () => {
    beforeEach(async () => {
      await store.loadZones()
    })

    it('should calculate average moisture correctly', () => {
      const calculatedAvg = store.averageMoisture
      const expectedAvg = store.zones.reduce((sum, z) => sum + z.moisture, 0) / store.zones.length
      
      expect(calculatedAvg).toBeCloseTo(expectedAvg)
      expect(calculatedAvg).toBeGreaterThanOrEqual(0)
      expect(calculatedAvg).toBeLessThanOrEqual(100)
    })

    it('should return selected zone', () => {
      store.selectedZoneId = store.zones[2].id
      expect(store.selectedZone).toEqual(store.zones[2])
    })

    it('should return empty object for invalid selectedZoneId', () => {
      store.selectedZoneId = 999
      expect(store.selectedZone).toEqual({})
    })
  })

  describe('Alert System', () => {
    it('should detect critical alerts', async () => {
      await store.loadZones()
      store.zones[0].moisture = 25 // Below critical threshold
      store.checkAlerts()
      
      expect(store.activeAlerts).toContainEqual(
        expect.objectContaining({
          id: store.zones[0].id,
          type: 'critique'
        })
      )
    })

    it('should detect warning alerts', async () => {
      await store.loadZones()
      store.zones[1].moisture = 35 // Below warning but above critical
      store.checkAlerts()
      
      expect(store.activeAlerts).toContainEqual(
        expect.objectContaining({
          id: store.zones[1].id,
          type: 'avertissement'
        })
      )
    })
  })

  describe('Theme Management', () => {
    it('should toggle dark mode', () => {
      const initial = store.isDark
      store.toggleTheme()
      expect(store.isDark).toBe(!initial)
      expect(localStorage.setItem).toHaveBeenCalledWith('alpine:app_isDark', JSON.stringify(!initial))
    })
  })
})