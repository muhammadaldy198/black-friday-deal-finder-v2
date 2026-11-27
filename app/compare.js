// compare.js — one job: the cross-store compare table. A product counts as
// "compared" when DEALS carries a second store's price for it in `m`.
// The cheapest store in each row is marked BEST; the table is sorted by the
// biggest dollar gap between the dearest and cheapest store.
import { DEALS } from './deals.js';
import { money } from './signal.js';

export function comparedProducts() {
  const rows = [];
  for (const d of DEALS) {
    if (!d.m) continue;
    const prices = { [d.s]: d.p, ...d.m };
    const names = Object.keys(prices);
    if (names.length < 2) continue;
    const vals = names.map((n) => prices[n]);
    const best = Math.min(...vals);
    const worst = Math.max(...vals);
    rows.push({ deal: d, prices, best, gap: Math.round((worst - best) * 100) / 100 });
  }
  rows.sort((a, b) => b.gap - a.gap);
  return rows;
}

export function compareHTML() {
  const rows = comparedProducts();
  const storeNames = [];
  for (const r of rows) {
    for (const s of Object.keys(r.prices)) if (!storeNames.includes(s)) storeNames.push(s);
  }
  storeNames.sort((a, b) => a.localeCompare(b));
  let h = '<p class="page-lede">' + rows.length + ' products priced at 2 or more stores. '
    + 'The cheapest store in each row is marked BEST — same product, same day, '
    + 'checked 27 Nov 2026. The gap column is what you lose by buying at the dearest store.</p>';
  h += '<div class="table-wrap"><table class="compare-table"><thead><tr><th>Product</th>';
  for (const s of storeNames) h += '<th>' + s + '</th>';
  h += '<th>Gap</th></tr></thead><tbody>';
  for (const r of rows) {
    h += '<tr><td><a href="#/deal/' + r.deal.id + '">' + r.deal.n + '</a></td>';
    for (const s of storeNames) {
      const v = r.prices[s];
      if (v === undefined) { h += '<td class="na">—</td>'; continue; }
      const cls = v === r.best ? ' class="best"' : '';
      h += '<td' + cls + '>' + money(v) + (v === r.best ? ' ★ BEST' : '') + '</td>';
    }
    h += '<td class="gap">' + money(r.gap) + '</td></tr>';
  }
  return h + '</tbody></table></div>';
}
