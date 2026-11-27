// bundles.js — one job: the ready-made carts ("Missions"). Each mission is a
// shopping plan built ONLY from deals already in the ledger: its items are
// deal ids, and its totals are sums of those deals' real prices — no bundle
// discount is invented, no item is added that the ledger does not carry.
// A mission answers "what should I actually buy?" instead of "what is on sale?"
import { DEALS } from './deals.js';

export const MISSIONS = [
{ id: 'home-cinema', name: 'The Living Room, Done', tag: 'One OLED, one headset, one console — movie night for the next five years.',
  items: ['lg-b6-65', 'sonos-ace', 'switch-2-mk-bundle', 'dualsense'],
  why: 'The LG B6 is the cheapest big OLED on the page; the Sonos Ace keeps late movies quiet; the Switch 2 bundle is the same price as the console alone, so the game is effectively free.' },
{ id: 'work-from-home', name: 'Work From Home, Upgraded', tag: 'Laptop, 4K monitor, flagship headphones, kitchen hub.',
  items: ['macbook-air-m5', 'dell-s2725qs', 'sony-xm6', 'echo-show-5'],
  why: 'The M5 Air is the cheapest MacBook on the page, the Dell is the best 4K monitor under $220, and the XM6 is at its lowest price ever — the three things a home office actually needs.' },
{ id: 'audio-arsenal', name: 'The Audio Arsenal', tag: 'Three pairs for $279 — flagship buds, daily buds, open-ear buds, one for every hour.',
  items: ['airpods-pro-3', 'soundcore-liberty-5', 'earfun-clip-2'],
  why: 'AirPods Pro 3 for the commute (lowest ever, $149), Liberty 5 for everyday (42% off), EarFun Clip 2 for workouts (all-time low, $54). Three pairs for less than one flagship headphone.' },
{ id: 'creator-starter', name: 'Creator Starter Kit', tag: 'Shoot it, store it, edit it — a full creator desk under $1,200.',
  items: ['insta360-x4-air', 'gopro-hero13', 'samsung-9100-pro-2tb', 'dell-s2725qc'],
  why: 'Two cameras that cover 360° and action, the fastest SSD on the page for footage, and a 4K USB-C monitor to cut on. Every item is 20%+ off.' },
{ id: 'kitchen-reset', name: 'Kitchen Reset', tag: 'Air fryer, stand mixer, blender, chopper — the four appliances that earn counter space.',
  items: ['cosori-turboblaze', 'kitchenaid-artisan-5', 'vitamix-vx1', 'kitchenaid-mini-chopper'],
  why: 'The Cosori is the No. 1 tested air fryer at $90, the Artisan is $150 off, and the Vitamix VX1 is the 2026 Gear of the Year winner — all four at 25–40% off.' },
{ id: 'stocking-run', name: 'Four Gifts, $105', tag: 'Stocking stuffers that are actually useful, all under $105 total.',
  items: ['airtag-2', 'echo-dot-5', 'blink-outdoor-4', 'kasa-power-strip'],
  why: 'A tracker, a speaker, a camera and a smart plug — four real gifts, none over $40, $104.98 for all four — $104 below list. The cheapest mission on the page.' },
];

export function missionTotals(m) {
  let price = 0, was = 0;
  const items = [];
  for (const id of m.items) {
    const d = DEALS.find((x) => x.id === id);
    if (!d) continue;
    items.push(d);
    price += d.p;
    was += d.w;
  }
  return { items, price: Math.round(price * 100) / 100, was: Math.round(was * 100) / 100, saved: Math.round((was - price) * 100) / 100 };
}
