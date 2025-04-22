// js/main.js
import { fetchZones, fetchZoneHistory } from './api.js';
import { renderZoneCards } from './ui.js';
import { drawChart } from './chart.js';
import { alertIfNeeded } from './utils.js';

async function init() {
  const zones = await fetchZones();
  const container = document.getElementById('zone-cards');
  // Fade-out pour relancer l'animation
  container.style.opacity = 0;
  setTimeout(() => {
    renderZoneCards(zones, showDetails);
    container.style.transition = 'opacity 0.5s';
    container.style.opacity = 1;
  }, 300);
  zones.forEach(alertIfNeeded);
}

async function showDetails(id) {
  const history = await fetchZoneHistory(id);
  const labels = history.map(p => p.timestamp);
  const data = history.map(p => p.humidity);
  const ctx = document.getElementById('humidityChart').getContext('2d');
  drawChart(ctx, labels, data);
}

// Demande la permission de notification et lance l'interface
Notification.requestPermission();
init();
setInterval(init, 10000);
