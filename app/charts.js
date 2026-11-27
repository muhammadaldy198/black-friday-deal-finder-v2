// charts.js — one job: the two small charts on the home page, drawn with plain
// CSS bars (no library, no images): deals per category, and dollars saved
// per category. Both read only DEALS, so they can never disagree with the grid.
import { CATS, DEALS } from './deals.js';
import { money } from './signal.js';

function catName(key) {
  const row = CATS.find((c) => c[0] === key);
  return row ? row[1] : key;
}

export function dealsByCategory() {
  const counts = {};
  for (const d of DEALS) counts[d.c] = (counts[d.c] || 0) + 1;
  return Object.entries(counts)
    .map(([key, n]) => ({ key, name: catName(key), n }))
    .sort((a, b) => b.n - a.n);
}

export function savedByCategory() {
  const sums = {};
  for (const d of DEALS) sums[d.c] = (sums[d.c] || 0) + (d.w - d.p);
  return Object.entries(sums)
    .map(([key, s]) => ({ key, name: catName(key), s: Math.round(s) }))
    .sort((a, b) => b.s - a.s);
}

function barRows(rows, valueOf, format) {
  const max = Math.max(...rows.map((r) => valueOf(r)), 1);
  return rows.map((r) => {
    const v = valueOf(r);
    const w = Math.max(4, Math.round((v / max) * 100));
    return '<div class="bar-row"><span class="bar-label">' + r.name + '</span>'
      + '<span class="bar-track"><span class="bar-fill" style="width:' + w + '%"></span></span>'
      + '<span class="bar-value">' + format(v) + '</span></div>';
  }).join('');
}

export function chartsHTML() {
  const byCount = dealsByCategory();
  const bySaved = savedByCategory();
  return '<section class="charts" aria-label="Deals by category">'
    + '<div class="chart-box"><h2>Deals by category</h2>'
    + barRows(byCount, (r) => r.n, (v) => String(v))
    + '</div>'
    + '<div class="chart-box"><h2>Dollars saved by category</h2>'
    + barRows(bySaved, (r) => r.s, (v) => money(v))
    + '</div></section>';
}
