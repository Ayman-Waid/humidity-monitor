import { fireEvent, screen, waitFor } from '@testing-library/dom'
import { describe, it, expect, beforeEach } from 'vitest'
import Alpine from 'alpinejs'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const html = readFileSync(resolve(__dirname, '../../../public/index.html'), 'utf-8')

// Define appData with only serializable properties
const appData = () => ({
  currentView: 'dashboard',
  currentViewLabel: 'Dashboard',
  currentViewDescription: 'Overview',
  isDark: false,
  isLoading: false,
  navItems: [
    { label: 'Dashboard', view: 'dashboard' },
    { label: 'Analytics', view: 'analytics' },
    { label: 'Alerts', view: 'alerts' },
    { label: 'Zones', view: 'zones' },
    { label: 'Map', view: 'map' }
  ],
  zones: [],
  alerts: []
})

describe('View Integration', () => {
  beforeEach(() => {
    // Reset DOM and initialize Alpine.js
    document.body.innerHTML = html
    global.Alpine = Alpine
    Alpine.data('app', appData)
    Alpine.store('app', appData()) // Only serializable data is passed to the store
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
      it(`should switch to ${view} view`, async () => {
        const button = await screen.findByText(new RegExp(label, 'i'))
        fireEvent.click(button)

        const currentView = Alpine.store('app').currentView
        expect(currentView).toBe(view)
      })
    })
  })

  describe('Theme Toggling', () => {
    it('should toggle dark mode class on html element', async () => {
      const toggleBtn = await screen.findByLabelText(/toggle theme/i)
      const html = document.documentElement

      expect(html).not.toHaveClass('dark')
      fireEvent.click(toggleBtn)

      await waitFor(() => {
        const isDark = Alpine.store('app').isDark
        expect(html).toHaveClass('dark')
        expect(isDark).toBe(true)
      })
    })
  })

  describe('Data Refresh', () => {
    it('should show loading state during refresh', async () => {
      const store = Alpine.store('app')
      const refreshBtn = await screen.findByText(/actualiser/i)

      fireEvent.click(refreshBtn)

      const loadingNow = store.isLoading
      expect(loadingNow).toBe(true)

      await waitFor(() => {
        const stillLoading = store.isLoading
        expect(stillLoading).toBe(false)
      })
    })
  })
})