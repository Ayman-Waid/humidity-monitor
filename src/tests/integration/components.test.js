import { render, fireEvent, screen, waitFor } from '@testing-library/dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { readFileSync } from 'fs';
import { resolve } from 'path';


const html = readFileSync(resolve(__dirname, '../../../public/index.html'), 'utf-8');
document.body.innerHTML = html;
describe('Component Behavior', () => {
  beforeEach(async () => {
    document.body.innerHTML = html
    Alpine.start()
    await Alpine.store('app').loadZones()
  })

  describe('Zone Cards', () => {
    it('should display all zones', () => {
      expect(screen.getAllByText(/Zone \d+/i).length).toBe(8)
    })

    it('should navigate to zone detail on click', () => {
      const firstZoneBtn = screen.getAllByText(/Voir détails/i)[0]
      fireEvent.click(firstZoneBtn)
      
      expect(Alpine.store('app').currentView).toBe('zoneDetail')
      expect(Alpine.store('app').selectedZoneId).toBe(1)
      expect(screen.getByText(/Zone 1/i)).toBeVisible()
    })
  })

  describe('Alert Cards', () => {
    it('should display active alerts', () => {
      const store = Alpine.store('app')
      store.zones[0].moisture = 25 // Critical
      store.zones[1].moisture = 35 // Warning
      store.checkAlerts()
      
      expect(screen.getAllByText(/Critique/i).length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText(/Avertissement/i).length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Map Component', () => {
    it('should initialize map when view changes', async () => {
      const store = Alpine.store('app')
      store.currentView = 'map'
      await waitFor(() => {
        expect(store.map).not.toBeNull()
        expect(L.map).toHaveBeenCalled()
      })
    })

    it('should display markers for each zone', async () => {
      const store = Alpine.store('app')
      store.currentView = 'map'
      await waitFor(() => {
        expect(L.marker).toHaveBeenCalledTimes(store.zones.length)
      })
    })
  })
})