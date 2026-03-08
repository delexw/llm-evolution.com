import { renderFamilies, toggleFam, filterTier, filterModels } from './families.js';
import { renderTL, filterTL } from './timeline.js';
import { initCharts } from './charts.js';
import { initNav } from './nav.js';

// Expose to inline onclick handlers
window.toggleFam = toggleFam;
window.filterTier = filterTier;
window.filterModels = filterModels;
window.filterTL = filterTL;

document.addEventListener('DOMContentLoaded', () => {
  renderFamilies();
  renderTL();
  initCharts();
  initNav();

  // Auto-expand first 3 families
  const headers = document.querySelectorAll('.family-header');
  [0,1,2].forEach(i => { if(headers[i]) headers[i].click(); });
});
