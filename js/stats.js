// js/stats.js
import { fetchStats, fetchDistribution } from './api.js';

export async function renderStats() {
  // VIDAGE
  document.getElementById('bar-chart').innerHTML = '';
  document.getElementById('pie-chart').innerHTML = '';

  const barData = await fetchStats();
  drawBarChart('#bar-chart', barData);

  const pieData = await fetchDistribution();
  drawPieChart('#pie-chart', pieData);
}

function drawBarChart(selector, data) {
  const width = 600, height = 300, margin = 40;
  const svg = d3.select(selector)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([margin, width - margin])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height - margin, margin]);

  svg.append('g')
    .attr('transform', `translate(0,${height - margin})`)
    .call(d3.axisBottom(x));

  svg.append('g')
    .attr('transform', `translate(${margin},0)`)
    .call(d3.axisLeft(y));

  svg.selectAll('.bar')
    .data(data)
    .join('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.avg))
      .attr('width', x.bandwidth())
      .attr('height', d => height - margin - y(d.avg));
}

function drawPieChart(selector, data) {
  const width = 300, height = 300, radius = Math.min(width, height) / 2;
  const svg = d3.select(selector)
    .append('svg')
      .attr('width', width)
      .attr('height', height)
    .append('g')
      .attr('transform', `translate(${width/2},${height/2})`);

  const pie = d3.pie().value(d => d.value);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.name))
    .range(d3.schemeTableau10);

  svg.selectAll('path')
    .data(pie(data))
    .join('path')
      .attr('d', arc)
      .attr('class', 'slice')
      .attr('fill', d => color(d.data.name));

  svg.selectAll('text')
    .data(pie(data))
    .join('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .text(d => d.data.name);
}
