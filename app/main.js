// main.js — one job: boot the app, route the hash, and wire the filter bar.
// Pages: #/ (home grid) · #/deal/<id> · #/compare · #/traps · #/method.
// All data lives in deals.js; all filtering in filters.js; all HTML in views.js.
import { CATS, DEALS } from './deals.js';
import { applyFilters, state, storeList } from './filters.js';
import { compareHTML } from './compare.js';
import { detailHTML, gridHTML, homeHTML, methodHTML, missionDetailHTML, statsHTML, trapsHTML } from './views.js';
import { MISSIONS } from './bundles.js';

const app = document.getElementById('app');

function fillSelects() {
  const cat = document.getElementById('f-cat');
  for (const [key, name] of CATS) {
    const o = document.createElement('option');
    o.value = key; o.textContent = name + ' (' + DEALS.filter((d) => d.c === key).length + ')';
    cat.appendChild(o);
  }
  const store = document.getElementById('f-store');
  for (const s of storeList(DEALS)) {
    const o = document.createElement('option');
    o.value = s; o.textContent = s;
    store.appendChild(o);
  }
}

function readControls() {
  state.q = document.getElementById('f-q').value;
  state.cat = document.getElementById('f-cat').value;
  state.store = document.getElementById('f-store').value;
  state.minPct = Number(document.getElementById('f-minpct').value);
  state.newlow = document.getElementById('f-newlow').checked;
  state.sort = document.getElementById('f-sort').value;
}

function renderHome() {
  readControls();
  app.innerHTML = homeHTML(applyFilters(DEALS, state));
}

function route() {
  const hash = location.hash || '#/';
  const parts = hash.slice(2).split('/');
  const page = parts[0] || '';
  // Detail routes hide the home-only chrome (hero + filter bar) so the
  // content the visitor asked for is what the screen shows first.
  document.body.classList.toggle('detail-route', page !== '');
  if (page === 'deal' && parts[1]) {
    const d = DEALS.find((x) => x.id === parts[1]);
    app.innerHTML = d ? detailHTML(d) : '<p class="empty">No deal with that name. <a href="#/">Back to all deals</a></p>';
  } else if (page === 'mission' && parts[1]) {
    const m = MISSIONS.find((x) => x.id === parts[1]);
    app.innerHTML = m ? missionDetailHTML(m) : '<p class="empty">No cart with that name. <a href="#/">Back to all deals</a></p>';
  } else if (page === 'compare') {
    app.innerHTML = '<section class="page"><h1>Compare across stores</h1>' + compareHTML() + '</section>';
  } else if (page === 'traps') {
    app.innerHTML = trapsHTML();
  } else if (page === 'method') {
    app.innerHTML = methodHTML();
  } else {
    renderHome();
  }
  window.scrollTo(0, 0);
}

function wire() {
  for (const id of ['f-q', 'f-cat', 'f-store', 'f-minpct', 'f-newlow', 'f-sort']) {
    const el = document.getElementById(id);
    el.addEventListener(el.tagName === 'INPUT' && el.type === 'text' ? 'input' : 'change', () => {
      if ((location.hash || '#/').startsWith('#/deal') || (location.hash || '#/').startsWith('#/mission') || location.hash === '#/compare' || location.hash === '#/traps' || location.hash === '#/method') {
        location.hash = '#/';
      }
      renderHome();
    });
  }
  document.getElementById('f-clear').addEventListener('click', () => {
    document.getElementById('f-q').value = '';
    document.getElementById('f-cat').value = 'all';
    document.getElementById('f-store').value = 'all';
    document.getElementById('f-minpct').value = '0';
    document.getElementById('f-newlow').checked = false;
    document.getElementById('f-sort').value = 'save';
    location.hash = '#/';
    renderHome();
  });
  window.addEventListener('hashchange', route);
}

fillSelects();
wire();
route();
