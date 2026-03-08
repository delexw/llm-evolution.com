import { ALL_FLAT, getTierClass } from './data.js';

let tlFilter = 'all';

export function renderTL() {
  const el = document.getElementById('tlEl');
  const flat = tlFilter === 'all' ? ALL_FLAT : ALL_FLAT.filter(m => m.provider === tlFilter);

  const seen = new Set();
  const deduped = flat.filter(m => {
    const key = m.model + m.date;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  let html = '';
  let lastYr = '';

  deduped.forEach(m => {
    const yr = m.date.substring(0, 4);
    if (yr !== lastYr) {
      html += `<div class="tl-yr">${yr}</div>`;
      lastYr = yr;
    }
    html += `
    <div class="tl-item">
      <div class="tl-dot" style="background:${m.color};border-color:var(--bg)"></div>
      <div class="tl-card2">
        <div class="tl-row">
          <span class="tl-mname">${m.model}</span>
          <span class="tl-pbadge" style="background:${m.color}22;color:${m.color}">${m.provider}</span>
          <span class="tier-badge ${getTierClass(m.tier)}" style="font-size:10px">${m.tier}</span>
          ${m.size !== 'Undisclosed' ? `<span class="tl-size">${m.size}</span>` : ''}
          ${m.ctx !== 'N/A' ? `<span class="tl-ctx2">ctx:${m.ctx}</span>` : ''}
          <span class="tl-d">${m.date}</span>
        </div>
      </div>
    </div>`;
  });

  el.innerHTML = html;
}

export function filterTL(p, btn) {
  tlFilter = p;
  document.querySelectorAll('#tlFilterBar .fbtn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderTL();
}
