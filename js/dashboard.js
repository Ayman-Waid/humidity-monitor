// js/dashboard.js
import { fetchZones, fetchZoneDetails } from './api.js';
import { getStatusClass, el, summarize } from './utils.js';

export async function renderDashboard() {
  console.log('🔄 renderDashboard called');
  const cards = document.getElementById('zone-cards');
  if (!cards) {
    console.error('❌ #zone-cards introuvable !');
    return;
  }
  cards.innerHTML = '';
  const zones = await fetchZones();
  console.log('🎲 Zones simulées :', zones);
  if (!zones.length) cards.textContent = 'Aucune zone renvoyée.';
  zones.forEach((z) => {
    const card = el('div', '', `zone-card ${getStatusClass(z.humidity)}`);
    card.append(el('h3', z.name), el('p', `${z.humidity}%`), el('small', z.timestamp));
    card.addEventListener('click', () => renderZoneDetails(z));
    cards.append(card);
    if (z.humidity < 25) document.getElementById('audio-alert').play();
  });
}

export async function renderZoneDetails(zone) {
  console.log('👉 renderZoneDetails', zone);
  const panel = document.getElementById('zone-details');
  if (!panel) return console.error('❌ #zone-details introuvable !');
  panel.innerHTML = '';
  panel.append(el('h3', zone.name));
  panel.append(el('p', `Actuel : ${zone.humidity}%`));
  panel.append(el('p', `Horodatage : ${zone.timestamp}`));
  
  const history = await fetchZoneDetails(zone.id);
  console.log('📈 Historique :', history);
  const { min, max, avg } = summarize(history);
  const statsDiv = el('div', '', 'stats');
  statsDiv.append(el('div', `Min : ${min}%`), el('div', `Max : ${max}%`), el('div', `Moy : ${avg}%`));
  panel.append(statsDiv);

  // Courbe SVG
  const svg = d3
    .select(panel)
    .append('svg')
    .attr('width', '100%')
    .attr('height', 200);

  const w = panel.clientWidth - 40,
    h = 200,
    m = { top: 10, right: 20, bottom: 30, left: 40 };

  const x = d3.scalePoint().domain(history.map((d) => d.timestamp)).range([m.left, w - m.right]);
  const y = d3.scaleLinear().domain([0, 100]).range([h - m.bottom, m.top]);
  const line = d3.line().x((d) => x(d.timestamp)).y((d) => y(d.humidity)).curve(d3.curveMonotoneX);

  svg.append('g')
    .attr('transform', `translate(0,${h - m.bottom})`)
    .call(d3.axisBottom(x).tickSize(0).tickPadding(6));
  svg.append('g').attr('transform', `translate(${m.left},0)`).call(d3.axisLeft(y));
  svg
    .append('path')
    .datum(history)
    .attr('fill', 'none')
    .attr('stroke', '#036c4c')
    .attr('stroke-width', 2)
    .attr('d', line);
}
