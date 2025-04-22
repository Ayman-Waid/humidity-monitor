// js/alerts.js
import { fetchZones } from './api.js';
import { createEl } from './utils.js';

export async function renderAlerts() {
  const list = document.getElementById('alert-list');
  list.innerHTML = '';
  const zones = await fetchZones();
  zones.filter(z => z.humidity < 25).forEach(z => {
    const li = createEl('li', `${z.name} — ${z.humidity}% critique`);
    list.append(li);
    document.getElementById('audio-alert').play();
  });
}
