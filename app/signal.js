// signal.js — one job: the deal signal (is it really a deal?) and its math.
// NEW LOW = the lowest price the source has ever tracked, verified from a
// 27–28 Nov source. STRONG = a real cut (15%+ or $20+) from the usual price.
// ROUTINE = a small cut, listed for completeness. INFLATED lives in TRAPS.
export const SIGNALS = {
  N: { label: 'NEW LOW', cls: 'sig-newlow', blurb: 'Lowest price ever tracked' },
  S: { label: 'STRONG', cls: 'sig-strong', blurb: 'A real cut from the usual price' },
  R: { label: 'ROUTINE', cls: 'sig-routine', blurb: 'A small cut — fine, not special' },
};

export function pctOff(d) {
  if (!d.w || d.w <= d.p) return 0;
  return Math.round((1 - d.p / d.w) * 100);
}

export function saved(d) {
  return Math.round((d.w - d.p) * 100) / 100;
}

export function money(n) {
  const v = Math.round(n * 100) / 100;
  return '$' + v.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: 2 });
}

export function badge(g) {
  const s = SIGNALS[g] || SIGNALS.R;
  return '<span class="badge ' + s.cls + '" title="' + s.blurb + '">' + s.label + '</span>';
}

export function signalLabel(g) {
  return (SIGNALS[g] || SIGNALS.R).label;
}
