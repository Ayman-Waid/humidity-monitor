import { render, fireEvent, screen, waitFor } from '@testing-library/dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { readFileSync } from 'fs';
import { resolve } from 'path';

const html = readFileSync(resolve(__dirname, '../../../public/index.html'), 'utf-8');
document.body.innerHTML = html;
describe('View Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = html
    Alpine.start()
  })

  describe('Navigation', () => {
    const testCases = [
      { view: 'dashboard', label: 'Dashboard' },
      { view: 'analytics', label: 'Analytics' },
      { view: 'alerts', label: 'Alerts' },
      { view: 'zones', label: 'Zones' },
      { view: 'map', label: 'Map' }
    ]

    testCases.forEach(({ view, label }) => {
      it(`should switch to ${view} view`, () => {
        const button = screen.getByText(new RegExp(label, 'i'))
        fireEvent.click(button)
        
        expect(Alpine.store('app').currentView).toBe(view)
        expect(screen.getByText(new RegExp(label, 'i'))).toBeVisible()
      })
    })
  })

  describe('Theme Toggling', () => {
    it('should toggle dark mode class on html element', async () => {
      const toggleBtn = screen.getByLabelText(/toggle theme/i)
      const html = document.documentElement
      
      // Initial state
      expect(html).not.toHaveClass('dark')
      
      // First click - enable dark mode
      fireEvent.click(toggleBtn)
      await waitFor(() => {
        expect(html).toHaveClass('dark')
        expect(Alpine.store('app').isDark).toBe(true)
      })
      
      // Second click - disable dark mode
      fireEvent.click(toggleBtn)
      await waitFor(() => {
        expect(html).not.toHaveClass('dark')
        expect(Alpine.store('app').isDark).toBe(false)
      })
    })
  })

  describe('Data Refresh', () => {
    it('should show loading state during refresh', async () => {
      const store = Alpine.store('app')
      const refreshBtn = screen.getByText(/actualiser/i)
      
      // Mock loadZones to simulate delay
      const originalLoad = store.loadZones
      store.loadZones = vi.fn(() => {
        store.isLoading = true
        return new Promise(resolve => {
          setTimeout(() => {
            store.isLoading = false
            resolve()
          }, 200)
        })
      })
      
      fireEvent.click(refreshBtn)
      
      // Should show loader
      expect(screen.getByTestId('loading-spinner')).toBeVisible()
      
      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeVisible()
      }, { timeout: 300 })
      
      // Restore original function
      store.loadZones = originalLoad
    })
  })
})