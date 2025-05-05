import { mockZones } from '@/js/app.js'
import { describe, it, expect } from 'vitest'

describe('Mock Data Generation', () => {
  it('should generate exactly 8 zones', () => {
    const zones = mockZones()
    expect(zones).toHaveLength(8)
  })

  it('each zone should have complete data structure', () => {
    const zones = mockZones()
    
    zones.forEach((zone, index) => {
      // Required properties
      expect(zone).toHaveProperty('id', index + 1)
      expect(zone).toHaveProperty('name', `Zone ${index + 1}`)
      
      // Moisture validation
      expect(zone.moisture).toBeGreaterThanOrEqual(0)
      expect(zone.moisture).toBeLessThanOrEqual(100)
      
      // History data validation
      expect(zone.history).toHaveLength(24)
      zone.history.forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThanOrEqual(100)
      })
      
      // Coordinates validation
      expect(zone.coords).toHaveLength(2)
      expect(zone.coords[0]).toBeGreaterThanOrEqual(48.8584)
      expect(zone.coords[0]).toBeLessThanOrEqual(48.9584)
      expect(zone.coords[1]).toBeGreaterThanOrEqual(2.2945)
      expect(zone.coords[1]).toBeLessThanOrEqual(2.3945)
      
      // Additional data points
      expect(zone).toHaveProperty('latest')
      expect(zone).toHaveProperty('capture1')
      expect(zone).toHaveProperty('capture2')
    })
  })

  it('should generate different moisture values', () => {
    const zones1 = mockZones()
    const zones2 = mockZones()
    expect(zones1[0].moisture).not.toBe(zones2[0].moisture)
  })
})