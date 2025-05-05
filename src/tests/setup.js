import { expect, vi } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'
import { JSDOM } from 'jsdom'
import { readFileSync } from 'fs';
import { resolve } from 'path';

const html = readFileSync(resolve(__dirname, '../../public/index.html'), 'utf-8');
const dom = new JSDOM(html);
global.document = dom.window.document;
global.window = dom.window;

// Add DOM matchers
expect.extend(matchers)

// Enhanced Alpine.js mock
if (!global.Alpine) {
  global.Alpine = {
    stores: {
      app: {
        navItems: [
          { label: 'Dashboard', view: 'dashboard', icon: '📊' },
          { label: 'Zones', view: 'zones', icon: '🌱' },
          { label: 'Map', view: 'map', icon: '🗺️' }
        ],
        currentView: 'dashboard',
        currentViewLabel: 'Dashboard',
        currentViewDescription: 'Overview of your agricultural data',
        isLoading: false,
        isDark: false,
        toggleTheme: vi.fn(),
        loadZones: vi.fn(),
        setView: vi.fn()
      }
    },
    store: (name, callback) => {
      if (typeof callback === 'function') {
        const store = callback()
        global.Alpine.stores[name] = store
        return store
      }
      return global.Alpine.stores[name]
    },
    start: vi.fn(),
    plugin: vi.fn(),
    // Add directive mocks if needed
    directive: vi.fn()
  }
}

// Mock Chart.js (unchanged)
vi.mock('chart.js', () => ({
  Chart: vi.fn().mockImplementation(() => ({
    destroy: vi.fn(),
    update: vi.fn(),
    data: { labels: [], datasets: [] },
    options: {}
  })),
  registerables: [],
  register: vi.fn(),
  _adapters: {
    _date: {
      parse: vi.fn(),
      format: vi.fn()
    }
  }
}));

// Enhanced Leaflet mock
global.L = {
  map: vi.fn().mockReturnValue({
    setView: vi.fn(),
    eachLayer: vi.fn(),
    removeLayer: vi.fn()
  }),
  tileLayer: vi.fn().mockReturnValue({
    addTo: vi.fn()
  }),
  marker: vi.fn().mockReturnValue({
    addTo: vi.fn(),
    bindPopup: vi.fn()
  }),
  // Add more Leaflet methods as needed
  icon: vi.fn(),
  latLng: vi.fn()
}

// Helper to render navigation items
function renderNavItems() {
  const nav = document.createElement('nav');
  nav.className = 'flex-1 p-4 space-y-2';
  
  global.Alpine.stores.app.navItems.forEach(item => {
    const button = document.createElement('button');
    button.textContent = item.label;
    button.className = 'nav-item';
    button.dataset.view = item.view;
    nav.appendChild(button);
  });
  
  document.body.appendChild(nav);
}

// Initialize the mock navigation
renderNavItems();