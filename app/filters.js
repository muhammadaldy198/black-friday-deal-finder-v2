// filters.js — one job: the filter + sort state, and applying it to the deals.
// Every control on the filter bar maps to one field of `state`; applyFilters
// is a pure function of (deals, state) so the grid, the counts and the
// screenshots all agree.
export const state = {
  q: '', // free-text search over name + store + category
  cat: 'all', // category key, or 'all'
  store: 'all', // store name, or 'all'
  minPct: 0, // minimum discount percent: 0, 20, 30 or 50
  newlow: false, // NEW LOW only
  sort: 'save', // save | pct | price | name
};

export function storeList(deals) {
  const seen = new Set();
  for (const d of deals) {
    seen.add(d.s);
    if (d.m) for (const s of Object.keys(d.m)) seen.add(s);
  }
  return [...seen].sort((a, b) => a.localeCompare(b));
}

export function pctOf(d) {
  if (!d.w || d.w <= d.p) return 0;
  return Math.round((1 - d.p / d.w) * 100);
}

export function applyFilters(deals, st) {
  const q = st.q.trim().toLowerCase();
  let out = deals.filter((d) => {
    if (st.cat !== 'all' && d.c !== st.cat) return false;
    if (st.store !== 'all' && d.s !== st.store && !(d.m && d.m[st.store] !== undefined)) return false;
    if (st.minPct > 0 && pctOf(d) < st.minPct) return false;
    if (st.newlow && d.g !== 'N') return false;
    if (q) {
      const hay = (d.n + ' ' + d.s + ' ' + d.c).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  out = sortDeals(out, st.sort);
  return out;
}

export function sortDeals(list, sort) {
  const arr = [...list];
  if (sort === 'save') arr.sort((a, b) => (b.w - b.p) - (a.w - a.p));
  else if (sort === 'pct') arr.sort((a, b) => pctOf(b) - pctOf(a));
  else if (sort === 'price') arr.sort((a, b) => a.p - b.p);
  else if (sort === 'name') arr.sort((a, b) => a.n.localeCompare(b.n));
  return arr;
}
