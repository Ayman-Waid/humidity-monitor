import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const DEFAULT_OPTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'top' } },
  scales: { y: { beginAtZero: true, max: 100 } }
}

export function createLineChart(ctx, labels, data, cfg = {}) {
  return new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{ data, fill: false, borderWidth: 2, ...cfg }] },
    options: DEFAULT_OPTS
  })
}

export function createBarChart(ctx, labels, data, cfg = {}) {
  return new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ data, borderWidth: 1, ...cfg }] },
    options: DEFAULT_OPTS
  })
}

export function createPieChart(ctx, labels, data, colors) {
  return new Chart(ctx, {
    type: 'pie',
    data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 1 }] },
    options: { ...DEFAULT_OPTS, plugins: { legend: { position: 'bottom' } } }
  })
}
