import { Chart } from 'chart.js'
import { createLineChart, createBarChart, createPieChart } from '../../src/js/charts.js'
import { describe, it, expect } from 'vitest'

describe('Chart Creation', () => {
  const mockCtx = document.createElement('canvas').getContext('2d')
  const labels = Array.from({ length: 24 }, (_, i) => `${i}h`)
  const data = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100))

  it('should create a line chart', () => {
    const chart = createLineChart(mockCtx, labels, data, {
      borderColor: '#10B981',
      tension: 0.4
    })
    
    expect(chart).toBeInstanceOf(Chart)
    expect(chart.config.type).toBe('line')
    expect(chart.data.labels).toEqual(labels)
    expect(chart.data.datasets[0].data).toEqual(data)
    expect(chart.data.datasets[0].borderColor).toBe('#10B981')
    expect(chart.data.datasets[0].tension).toBe(0.4)
  })

  it('should create a bar chart', () => {
    const barLabels = ['Zone 1', 'Zone 2', 'Zone 3']
    const barData = [30, 50, 70]
    const chart = createBarChart(mockCtx, barLabels, barData, {
      backgroundColor: '#3B82F6'
    })
    
    expect(chart).toBeInstanceOf(Chart)
    expect(chart.config.type).toBe('bar')
    expect(chart.data.labels).toEqual(barLabels)
    expect(chart.data.datasets[0].data).toEqual(barData)
    expect(chart.data.datasets[0].backgroundColor).toBe('#3B82F6')
  })

  it('should create a pie chart', () => {
    const pieLabels = ['Critique', 'Avertissement', 'Normal']
    const pieData = [5, 10, 15]
    const colors = ['#EF4444', '#F59E0B', '#10B981']
    const chart = createPieChart(mockCtx, pieLabels, pieData, colors)
    
    expect(chart).toBeInstanceOf(Chart)
    expect(chart.config.type).toBe('pie')
    expect(chart.data.labels).toEqual(pieLabels)
    expect(chart.data.datasets[0].data).toEqual(pieData)
    expect(chart.data.datasets[0].backgroundColor).toEqual(colors)
  })
})