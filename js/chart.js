// js/chart.js
export function drawChart(ctx, labels, data) {
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Humidité (%)',
          data,
          tension: 0.3
        }]
      },
      options: {
        scales: {
          y: { min: 0, max: 100 }
        }
      }
    });
  }
  