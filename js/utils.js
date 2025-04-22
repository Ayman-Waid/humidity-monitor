// js/utils.js

// Classe CSS selon taux
export function getStatusClass(h) {
    if (h<25) return 'crit';
    if (h<50) return 'warn';
    return 'ok';
  }
  
  // Crée un élément DOM
  export function el(tag, text='', cls='') {
    const e = document.createElement(tag);
    if(text) e.textContent = text;
    if(cls) e.className = cls;
    return e;
  }
  
  // Calcule min, max, moyenne
  export function summarize(history) {
    const vals = history.map(p=>p.humidity);
    const sum = vals.reduce((a,b)=>a+b,0);
    return {
      min: Math.min(...vals),
      max: Math.max(...vals),
      avg: Math.round(sum/vals.length)
    };
  }
  