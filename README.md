# DealScope

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![make.fun · rank](https://make.fun/badge/black-friday-deal-finder-01/muhammadaldy198/black-friday-deal-finder-v2/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![make.fun · reward](https://make.fun/badge/black-friday-deal-finder-01/muhammadaldy198/black-friday-deal-finder-v2/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

**Every deal scored. Every cart priced.**

DealScope is a Black Friday deal finder rebuilt from scratch. It does not hand you a flat list and wish you luck — it scores every deal, prices six ready-made carts, and calls out the traps.

- **168 deals** across **31 stores**, all checked **27 Nov 2026**. Total savings across the page: **$35,680.30**.
- **DealScore (0–100)** on every deal, from a published formula: discount % × 1.25 (max 50) + dollars saved ÷ 10 (max 20) + NEW LOW bonus (+20) + multi-store confirmation (+10). The home page leads with the **Top 10 by DealScore**; each deal page breaks its own score down line by line.
- **6 ready-made carts** ("Missions"): a living room, a home office, an audio arsenal, a creator kit, a kitchen reset, and four gifts for $104.98. Each cart's total is the sum of its items' real prices — no bundle discount invented.
- **15 NEW LOWs** — the lowest price ever tracked, each verified from a 27–28 Nov source (AirPods Pro 3 $149, Sony XM6 $348 at Amazon, Beats Solo 4 pink $80, and more).
- **36 products compared across stores**, with the cheapest marked BEST.
- **5 inflated traps caught** — discounts the price history does not support, with the written evidence on the Traps page.
- Search and filters by category, store, and discount, with sorting by discount, savings, or price. Detail pages show the source, the check time, and the evidence for the signal.
- One whole category — vacuums — was left out on purpose: the only sources for those prices were roundups from 17–23 Nov, and a stale price is worse than no price.

## How to run

```sh
node serve.ts        # serves the app on http://localhost:8080
```

Open http://localhost:8080 and browse: `#/` all deals, `#/deal/<id>` a deal, `#/mission/<id>` a cart, `#/compare` cross-store comparison, `#/traps` the traps caught, `#/method` the full method.

## Method

Prices were gathered from primary sources published 27–28 Nov 2026 (CNN Underscored, Android Authority, BeeBulletin, TrendThread, DealNews, TweakTown, and others named on each card). Every card shows its source, its date, and the time it was checked. See the Method page in the app for the full write-up, including the DealScore formula and the trap evidence.

## License

MIT — see [LICENSE](LICENSE).
