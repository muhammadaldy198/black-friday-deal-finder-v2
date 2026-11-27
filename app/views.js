// views.js — one job: turning data into HTML for each page (home grid, deal
// detail, traps, method). No state lives here; main.js owns state and routing.
import { CATS, CHECKED, DEALS, TRAPS, TRAP_NOTES } from './deals.js';
import { badge, money, pctOff, saved, signalLabel } from './signal.js';
import { chartsHTML } from './charts.js';
import { dealScore, scoreParts, topByScore } from './scores.js';
import { MISSIONS, missionTotals } from './bundles.js';

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function statsHTML() {
  const stores = new Set();
  let save = 0, nl = 0, cmp = 0;
  for (const d of DEALS) {
    stores.add(d.s);
    if (d.m) { Object.keys(d.m).forEach((s) => stores.add(s)); cmp++; }
    save += d.w - d.p;
    if (d.g === 'N') nl++;
  }
  const stats = [
    [DEALS.length, 'verified deals'],
    [stores.size, 'stores'],
    [nl, 'new all-time lows'],
    [money(Math.round(save)), 'total savings'],
    [TRAPS.length, 'traps caught'],
  ];
  return '<section class="stats" aria-label="Totals">'
    + stats.map(([v, l]) => '<div class="stat"><strong>' + v + '</strong><span>' + l + '</span></div>').join('')
    + '</section>';
}

export function cardHTML(d) {
  const pct = pctOff(d);
  const sc = dealScore(d);
  const link = d.u ? '<a class="src-link" href="' + d.u + '" target="_blank" rel="noopener">Source: ' + esc(d.r) + ', ' + esc(d.d) + ' ↗</a>'
    : '<span class="src-link">Source: ' + esc(d.r) + ', ' + esc(d.d) + '</span>';
  return '<article class="card" data-id="' + d.id + '">'
    + '<div class="card-top">' + badge(d.g) + '<span class="score-badge" title="DealScore: discount + dollars saved + NEW LOW bonus + multi-store confirmation">Score ' + sc + '</span><span class="pct">−' + pct + '%</span></div>'
    + '<h3><a href="#/deal/' + d.id + '">' + esc(d.n) + '</a></h3>'
    + '<p class="store">' + esc(d.s) + (d.m ? ' · <span class="cmp-note">also at ' + (Object.keys(d.m).length) + ' more</span>' : '') + '</p>'
    + '<p class="price-row"><strong class="price">' + money(d.p) + '</strong> <s class="was">' + money(d.w) + '</s></p>'
    + '<p class="save-line">You save ' + money(saved(d)) + ' · ' + signalLabel(d.g) + '</p>'
    + '<p class="checked">Checked ' + CHECKED + ' · ' + link + '</p>'
    + '<p class="card-ev">' + esc(d.e) + '</p>'
    + '</article>';
}

export function gridHTML(list) {
  if (!list.length) return '<p class="empty">No deals match those filters. Clear the search or lower the discount bar.</p>';
  return '<p class="count-line">Showing <strong>' + list.length + '</strong> of ' + DEALS.length + ' deals · sorted by biggest dollar saving</p>'
    + '<div class="grid">' + list.map(cardHTML).join('') + '</div>';
}

export function leaderboardHTML() {
  const top = topByScore(DEALS, 10);
  let h = '<section class="leaderboard" aria-label="Top 10 deals by DealScore"><h2>Top 10 by DealScore</h2>'
    + '<p class="muted">Every deal on this page carries a DealScore from 0 to 100 — discount, dollars saved, NEW LOW bonus, multi-store confirmation. The formula is published on the <a href="#/method">Method</a> page. These ten score highest.</p>'
    + '<table class="leader-table"><thead><tr><th>#</th><th>Score</th><th>Product</th><th>Store</th><th>Price</th><th>Usual</th><th>Off</th><th>Signal</th><th>Checked</th></tr></thead><tbody>';
  top.forEach((row, i) => {
    const d = row.d;
    h += '<tr><td>' + (i + 1) + '</td><td><strong class="score-num">' + row.s + '</strong></td>'
      + '<td><a href="#/deal/' + d.id + '">' + esc(d.n) + '</a></td><td>' + esc(d.s) + '</td>'
      + '<td>' + money(d.p) + '</td><td><s>' + money(d.w) + '</s></td><td>−' + pctOff(d) + '%</td>'
      + '<td>' + badge(d.g) + '</td><td>' + CHECKED + '</td></tr>';
  });
  return h + '</tbody></table></section>';
}

export function missionsHTML() {
  let h = '<section class="missions" aria-label="Ready-made carts"><h2>Ready-made carts — what to actually buy</h2>'
    + '<p class="muted">Six shopping plans built only from deals on this page. Each total is the sum of its items’ real prices — no bundle discount invented.</p><div class="mission-grid">';
  for (const m of MISSIONS) {
    const t = missionTotals(m);
    h += '<article class="mission-card"><h3><a href="#/mission/' + m.id + '">' + esc(m.name) + '</a></h3>'
      + '<p class="mission-tag">' + esc(m.tag) + '</p>'
      + '<p class="mission-items">' + t.items.length + ' items</p>'
      + '<p class="price-row"><strong class="price">' + money(t.price) + '</strong> <s class="was">' + money(t.was) + '</s></p>'
      + '<p class="save-line">You save ' + money(t.saved) + '</p>'
      + '<p><a href="#/mission/' + m.id + '">See the cart →</a></p></article>';
  }
  return h + '</div></section>';
}

export function missionDetailHTML(m) {
  const t = missionTotals(m);
  let h = '<section class="page"><p class="crumb"><a href="#/">← All deals</a></p><h1>' + esc(m.name) + '</h1>'
    + '<p class="page-lede">' + esc(m.tag) + '</p>'
    + '<p class="price-row big"><strong class="price">' + money(t.price) + '</strong> <s class="was">' + money(t.was) + '</s> <span class="save-line">You save ' + money(t.saved) + ' across ' + t.items.length + ' items</span></p>'
    + '<h2>Why these go together</h2><p>' + esc(m.why) + '</p><h2>The cart</h2>';
  for (const d of t.items) {
    h += '<article class="card mission-item"><div class="card-top">' + badge(d.g)
      + '<span class="score-badge">Score ' + dealScore(d) + '</span><span class="pct">−' + pctOff(d) + '%</span></div>'
      + '<h3><a href="#/deal/' + d.id + '">' + esc(d.n) + '</a></h3>'
      + '<p class="store">' + esc(d.s) + '</p>'
      + '<p class="price-row"><strong class="price">' + money(d.p) + '</strong> <s class="was">' + money(d.w) + '</s></p>'
      + '<p class="save-line">You save ' + money(saved(d)) + '</p>'
      + '<p class="checked">Checked ' + CHECKED + ' · Source: ' + esc(d.r) + ', ' + esc(d.d) + '</p>'
      + '<p class="card-ev">' + esc(d.e) + '</p></article>';
  }
  return h + '<p><a href="#/">← Back to all deals</a> · <a href="#/compare">Compare across stores</a></p></section>';
}

export function homeHTML(list) {
  return statsHTML() + leaderboardHTML() + missionsHTML() + gridHTML(list) + chartsHTML();
}

export function scoreBreakdownHTML(d) {
  const p = scoreParts(d);
  const rows = [
    ['Discount: ' + p.pct + '% off', p.discount, 50],
    ['Dollars saved: ' + money(p.save), p.savings, 20],
    ['NEW LOW bonus (lowest price ever tracked)', p.newlow, 20],
    ['Confirmed at 2+ stores', p.multi, 10],
  ];
  let h = '<h2>DealScore: ' + p.total + ' / 100</h2><div class="score-bars">';
  for (const [label, pts, max] of rows) {
    h += '<div class="score-row"><span class="score-label">' + label + '</span>'
      + '<span class="bar-track"><span class="bar-fill" style="width:' + Math.max(pts > 0 ? 4 : 0, Math.round((pts / max) * 100)) + '%"></span></span>'
      + '<span class="bar-value">' + pts + ' / ' + max + '</span></div>';
  }
  return h + '</div><p class="muted">The formula is published on the <a href="#/method">Method</a> page — recompute it yourself from the numbers on this card.</p>';
}

export function detailHTML(d) {
  const pct = pctOff(d);
  const prices = { [d.s]: d.p, ...(d.m || {}) };
  const names = Object.keys(prices).sort((a, b) => prices[a] - prices[b]);
  const best = Math.min(...Object.values(prices));
  let compare = '';
  if (names.length > 1) {
    compare = '<h2>Same product, other stores</h2><table class="mini-table"><thead><tr><th>Store</th><th>Price</th><th></th></tr></thead><tbody>'
      + names.map((s) => '<tr><td>' + esc(s) + '</td><td>' + money(prices[s]) + '</td><td>' + (prices[s] === best ? '<strong class="best-tag">★ BEST</strong>' : '') + '</td></tr>').join('')
      + '</tbody></table><p class="muted">Buying at the dearest store here costs ' + money(Math.max(...Object.values(prices)) - best) + ' more for the same product.</p>';
  }
  const link = d.u ? '<a href="' + d.u + '" target="_blank" rel="noopener">' + esc(d.r) + ', ' + esc(d.d) + ' ↗</a>' : esc(d.r) + ', ' + esc(d.d);
  return '<article class="detail"><p class="crumb"><a href="#/">← All deals</a></p>'
    + '<div class="detail-head">' + badge(d.g) + '<span class="pct big">−' + pct + '%</span></div>'
    + '<h1>' + esc(d.n) + '</h1>'
    + '<p class="store big">' + esc(d.s) + '</p>'
    + '<p class="price-row big"><strong class="price">' + money(d.p) + '</strong> <s class="was">' + money(d.w) + '</s> <span class="save-line">You save ' + money(saved(d)) + '</span></p>'
    + scoreBreakdownHTML(d)
    + '<h2>Why this signal: ' + signalLabel(d.g) + '</h2><p>' + esc(d.e) + '</p>'
    + compare
    + '<h2>Source &amp; check</h2><p>Source: ' + link + '. Price checked ' + CHECKED + '. '
    + 'The usual price is the store’s own list price or the price the product sold at before the sale, as the source states it.</p>'
    + '<p><a href="#/">← Back to all deals</a> · <a href="#/compare">Compare across stores</a> · <a href="#/traps">See the traps we caught</a></p></article>';
}

export function trapsHTML() {
  let h = '<section class="page"><h1>Traps we caught</h1>'
    + '<p class="page-lede">Five listings whose printed discount does not survive a look at the price history. '
    + 'Each one was checked against a year of tracking (SmartHomePerfected followed 146 smart-home products for 90+ days each) '
    + 'or against the fine print (AT&T). A trap is a listing where the crossed-out price was never charged, or where the headline price hides the real cost.</p>';
  for (const t of TRAPS) {
    const link = t.u ? '<a href="' + t.u + '" target="_blank" rel="noopener">' + esc(t.r) + ', ' + esc(t.d) + ' ↗</a>' : esc(t.r) + ', ' + esc(t.d);
    h += '<article class="trap-card"><div class="card-top"><span class="badge sig-inflated">INFLATED</span>'
      + '<span class="pct">claims −' + t.lp + '% · really −' + t.rp + '%</span></div>'
      + '<h3>' + esc(t.n) + '</h3><p class="store">' + esc(t.s) + '</p>'
      + '<p class="price-row"><strong class="price">' + money(t.p) + '</strong> <s class="was">' + money(t.w) + '</s> <span class="save-line">crossed-out price never charged</span></p>'
      + '<div class="trap-bars"><div class="trap-bar-row"><span>Printed discount</span><span class="bar-track"><span class="bar-fill bad" style="width:' + t.lp + '%"></span></span><span>' + t.lp + '%</span></div>'
      + '<div class="trap-bar-row"><span>Real cut</span><span class="bar-track"><span class="bar-fill good" style="width:' + Math.max(t.rp, 2) + '%"></span></span><span>' + t.rp + '%</span></div></div>'
      + '<p>' + esc(t.e) + '</p><p class="checked">Source: ' + link + ' · Checked ' + CHECKED + '</p></article>';
  }
  h += '<h2>Two more, named without dollar prices</h2><p class="muted">The same investigation named these two with percentages only, so they are listed here as evidence, not as deal cards:</p><ul class="trap-notes">'
    + TRAP_NOTES.map((n) => '<li><strong>' + esc(n.n) + ' — claims −' + n.lp + '%, really −' + n.rp + '%.</strong> ' + esc(n.e) + '</li>').join('')
    + '</ul></section>';
  return h;
}

export function methodHTML() {
  return '<section class="page"><h1>How DealScope checks a deal</h1>'
    + '<h2>1. Every price was checked on Black Friday itself</h2>'
    + '<p>Each deal on this page was checked on ' + CHECKED + ' against the source named on its card. The check time is printed on every card. A price is listed only if a store or a deals source showed it when we checked.</p>'
    + '<h2>2. NEW LOW means lowest ever — and only from 27–28 Nov sources</h2>'
    + '<p>A deal earns NEW LOW only when the source says it is the lowest price it has ever tracked, and only when that source is dated 27 or 28 November 2026. Fifteen deals on this page earn it. Older roundups can carry a good price, but they cannot mint a NEW LOW.</p>'
    + '<h2>3. Hero prices get two sources</h2>'
    + '<p>The biggest claims — AirPods Pro 3 at $149, Sony XM6 at $348, MacBook Air M5 at $989 — are confirmed by two independent sources each (CNN Underscored and Android Authority; BeeBulletin and 9to5Toys). Where two sources disagreed, the card says so: the XM6 is $348 at Amazon, Best Buy and Sony; the MacBook Air M5 is $989 at Amazon and $999 at Best Buy.</p>'
    + '<h2>4. The signal is honest about what a cut is</h2>'
    + '<p><strong>NEW LOW</strong> — lowest price ever tracked. <strong>STRONG</strong> — a real cut of 15% or more, or $20+, from the usual price. <strong>ROUTINE</strong> — a small cut, listed for completeness. <strong>INFLATED</strong> — the printed discount does not survive the price history; see <a href="#/traps">Traps we caught</a>.</p>'
    + '<h2>5. Traps are caught with price history, not vibes</h2>'
    + '<p>SmartHomePerfected tracked 146 Amazon smart-home products for at least 90 days each and held every early deal against its own price history on 16 November 2026, then updated the page after Black Friday. A crossed-out price that never appears in a year of tracking is not a discount. The AT&T iPhone trap comes from reading the fine print: a $0 headline over a $1,199.99 phone, a $3,600 plan and a $35 fee.</p>'
    + '<h2>6. What we left out</h2>'
    + '<p>One whole category — vacuums — was left out of this edition. Its only sources were roundups from before the sale opened, and no 27 November source re-checked those prices, so the deals could not be verified to this page’s standard. A stale price is worse than no price.</p>'
    + '<h2>7. Usual price</h2>'
    + '<p>The “usual price” is the store’s own list price, or the price the product sold at before the sale, exactly as the cited source states it. Where a source gave a percentage instead of a dollar figure, the card shows the percentage and says so.</p>'
    + '<h2>8. DealScore — the formula, in full</h2>'
    + '<p>Every deal carries a DealScore from 0 to 100. Discount points: the discount percent × 1.25, capped at 50 (a 40%-off deal earns 50). Savings points: dollars saved ÷ 10, capped at 20 ($200 or more saved earns 20). NEW LOW bonus: +20. Multi-store confirmation: +10 when the same product is priced at two or more stores. Maximum 100. A deal reaches the top only with a deep cut AND a big dollar saving AND a NEW LOW AND a second store confirming the price. Each deal page breaks its own score down line by line.</p>'
    + '<h2>9. Ready-made carts</h2>'
    + '<p>The six carts on the home page are shopping plans built only from deals already in the ledger. Each cart’s total is the sum of its items’ real sale prices, and its saving is the sum of the items’ real savings. No bundle discount is invented, and no item is added that the ledger does not carry with its own source and check time.</p>'
    + '</section>';
}
