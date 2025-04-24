import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export function createLineChart(ctx, labels, data, options = {}) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{ label: 'Humidité', data, fill: false, tension: 0.1 }]
    },
    options
  });
}

export function createBarChart(ctx, labels, data, options = {}) {
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: 'Humidité %', data }]
    },
    options
  });
}

export function createPieChart(ctx, labels, data, options = {}) {
  return new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{ data }]
    },
    options
  });
}
