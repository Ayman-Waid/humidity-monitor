import { Chart } from 'chart.js'
import { createLineChart, createBarChart, createPieChart } from '@/js/charts.js'
import { describe, it, expect, vi } from 'vitest'

describe('Chart Utilities', () => {
  const mockCtx = {
    canvas: document.createElement('canvas'),
    clearRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn()
  }

  const testLabels = ['00:00', '06:00', '12:00', '18:00']
  const testData = [30, 45, 60, 40]
  const testColors = ['#FF0000', '#00FF00', '#0000FF']

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Line Chart', () => {
    it('should create with correct configuration', () => {
      const chart = createLineChart(mockCtx, testLabels, testData, {
        borderColor: '#10B981',
        tension: 0.4
      })
      
      expect(Chart).toHaveBeenCalled()
      expect(chart.config.type).toBe('line')
      expect(chart.data.labels).toEqual(testLabels)
      expect(chart.data.datasets[0].data).toEqual(testData)
      expect(chart.data.datasets[0].borderColor).toBe('#10B981')
      expect(chart.data.datasets[0].tension).toBe(0.4)
      expect(chart.options.responsive).toBe(true)
    })
  })

  describe('Bar Chart', () => {
    it('should create with correct configuration', () => {
      const chart = createBarChart(mockCtx, testLabels, testData, {
        backgroundColor: '#3B82F6'
      })
      
      expect(Chart).toHaveBeenCalled()
      expect(chart.config.type).toBe('bar')
      expect(chart.data.labels).toEqual(testLabels)
      expect(chart.data.datasets[0].data).toEqual(testData)
      expect(chart.data.datasets[0].backgroundColor).toBe('#3B82F6')
      expect(chart.options.plugins.legend.position).toBe('top')
    })
  })

  describe('Pie Chart', () => {
    it('should create with correct configuration', () => {
      const chart = createPieChart(mockCtx, testLabels, testData, testColors)
      
      expect(Chart).toHaveBeenCalled()
      expect(chart.config.type).toBe('pie')
      expect(chart.data.labels).toEqual(testLabels)
      expect(chart.data.datasets[0].data).toEqual(testData)
      expect(chart.data.datasets[0].backgroundColor).toEqual(testColors)
      expect(chart.options.plugins.legend.position).toBe('bottom')
    })
  })
})