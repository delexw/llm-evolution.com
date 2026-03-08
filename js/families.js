import { FAMILIES, PROVIDER_MAP, getTierClass } from './data.js';

let currentTierFilter = 'all';
let currentSearch = '';

export function renderFamilies() {
  const el = document.getElementById('familyList');
  const search = currentSearch.toLowerCase();
  const tier = currentTierFilter;

  let html = '';
  for (const [fam, mods] of Object.entries(FAMILIES)) {
    const pm = PROVIDER_MAP[fam] || {p:'Other', color:'#94a3b8'};

    let filtered = mods.filter(m => {
      const matchesTier = tier === 'all' || m.tier === tier ||
        (tier === 'nano' && (m.tier === 'edge' || m.tier === 'small'));
      const matchesSearch = !search ||
        m.model.toLowerCase().includes(search) ||
        m.size.toLowerCase().includes(search) ||
        m.tier.toLowerCase().includes(search) ||
        fam.toLowerCase().includes(search) ||
        pm.p.toLowerCase().includes(search);
      return matchesTier && matchesSearch;
    });

    if (filtered.length === 0) continue;

    const rowsHtml = filtered.map(m => `
      <tr>
        <td><span class="model-name">${m.model}</span></td>
        <td><span class="model-size">${m.size}</span></td>
        <td><span class="model-ctx">${m.ctx}</span></td>
        <td><span class="model-date">${m.date}</span></td>
        <td><span class="tier-badge ${getTierClass(m.tier)}">${m.tier}</span></td>
      </tr>
    `).join('');

    html += `
    <div class="family-group">
      <div class="family-header" onclick="toggleFam(this)">
        <div class="family-swatch" style="background:${pm.color}"></div>
        <div class="family-title">${fam}</div>
        <div class="family-count">${filtered.length}${filtered.length !== mods.length ? '/'+mods.length : ''} models</div>
        <div class="family-arrow">▼</div>
      </div>
      <div class="family-body">
        <table class="model-table">
          <thead><tr><th>Model</th><th>Parameters</th><th>Context</th><th>Released</th><th>Tier</th></tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    </div>`;
  }

  el.innerHTML = html || '<div style="color:var(--dim);padding:20px">No models match current filters.</div>';
}

export function toggleFam(header) {
  const body = header.nextElementSibling;
  if (body.classList.contains('show')) {
    body.classList.remove('show');
    header.classList.remove('open');
  } else {
    body.classList.add('show');
    header.classList.add('open');
  }
}

export function filterTier(t, btn) {
  currentTierFilter = t;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('on'));
  btn.classList.add('on');
  renderFamilies();
}

export function filterModels(val) {
  currentSearch = val;
  renderFamilies();
}
