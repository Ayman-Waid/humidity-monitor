// js/api.js
// Simule les données

export async function fetchZones() {
    const count = Math.floor(Math.random()*3)+4;
    const zones = [];
    for(let i=1; i<=count; i++) {
      const h = Math.floor(Math.random()*101);
      zones.push({
        id: i,
        name: `Zone ${String.fromCharCode(64+i)}`,
        humidity: h,
        timestamp: new Date().toLocaleString()
      });
    }
    await new Promise(r=>setTimeout(r,200));
    return zones;
  }
  
  export async function fetchZoneDetails(id) {
    // Simule un historique (toutes les 2h sur 24h)
    const now = Date.now();
    const history = [];
    for(let t=24; t>=0; t-=2) {
      const time = new Date(now - t*3600*1000);
      history.push({
        timestamp: time.toLocaleTimeString('fr-CH',{hour:'2-digit',minute:'2-digit'}),
        humidity: Math.floor(Math.random()*101)
      });
    }
    await new Promise(r=>setTimeout(r,200));
    return history;
  }
  