// js/ui.js
import { getStatusClass } from './utils.js';

// Génère les cartes de zones et gère le clic
export function renderZoneCards(zones, onSelect) {
  const container = document.getElementById('zone-cards');
  container.innerHTML = '';
  zones.forEach(z => {
    const card = document.createElement('div');
    card.className = `zone-card ${getStatusClass(z.humidity)}`;
    card.innerHTML = `
      <h3>${z.name}</h3>
      <p>${z.humidity}%</p>
      <small>${z.timestamp}</small>
    `;
    card.addEventListener('click', () => onSelect(z.id));
    container.appendChild(card);
  });
}
