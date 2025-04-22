// js/app.js
import { renderDashboard } from './dashboard.js';
import { renderStats } from './stats.js';
import { renderAlerts } from './alerts.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('📦 app.js démarré');
  const buttons = document.querySelectorAll('.sidebar nav button');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.view').forEach((v) => v.classList.add('hidden'));
      document.getElementById(`view-${btn.dataset.view}`).classList.remove('hidden');
      if (btn.dataset.view === 'dashboard') renderDashboard();
      if (btn.dataset.view === 'stats') renderStats();
      if (btn.dataset.view === 'alerts') renderAlerts();
    });
  });

  // Lancement initial
  renderDashboard();
});
