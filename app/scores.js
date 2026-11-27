// scores.js — one job: DealScore, the transparent 0–100 score every deal gets.
// The formula is published on the Method page and broken down on each deal
// page, so anyone can recompute it. No hidden weights, no editorial picks.
//   discount points: pctOff x 1.25, capped at 50  (a 40%-off deal earns 50)
//   savings points:  dollars saved / 10, capped at 20  ($200+ saved earns 20)
//   NEW LOW bonus:   +20  (lowest price ever tracked, 27–28 Nov source only)
//   multi-store:     +10  (the same product is priced at 2+ stores)
// Maximum is 100. A deal can only reach the top with a deep cut AND a big
// dollar saving AND a NEW LOW AND a second store confirming the price.
import { pctOff, saved } from './signal.js';

export function scoreParts(d) {
  const pct = pctOff(d);
  const save = saved(d);
  const discount = Math.min(50, Math.round(pct * 1.25));
  const savings = Math.min(20, Math.floor(save / 10));
  const newlow = d.g === 'N' ? 20 : 0;
  const multi = d.m && Object.keys(d.m).length > 0 ? 10 : 0;
  return { pct, save, discount, savings, newlow, multi, total: Math.min(100, discount + savings + newlow + multi) };
}

export function dealScore(d) {
  return scoreParts(d).total;
}

export function topByScore(deals, n) {
  return [...deals]
    .map((d) => ({ d, s: dealScore(d) }))
    .sort((a, b) => b.s - a.s || (b.d.w - b.d.p) - (a.d.w - a.d.p))
    .slice(0, n);
}
