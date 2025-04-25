import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'top' } },
  scales: { y: { beginAtZero: true, max: 100 } }
}

export function createLineChart(ctx, labels, data, config = {}) {
  return new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{ label: 'Humidité (%)', data, fill: false, borderWidth: 2, ...config }] },
    options: defaultOptions
  })
}

export function createBarChart(ctx, labels, data, config = {}) {
  return new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Humidité (%)', data, borderWidth: 1, ...config }] },
    options: defaultOptions
  })
}

export function createPieChart(ctx, labels, data, colors) {
  return new Chart(ctx, {
    type: 'pie',
    data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 1 }] },
    options: {
      ...defaultOptions,
      plugins: { legend: { position: 'bottom' } }
    }
  })
}
