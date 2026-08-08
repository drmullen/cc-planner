# CC Planner Pro

**Protection Readiness & Planning** — a local-first planning tool for airborne-infection precautions: track protective supplies, plan an activity, compare the recommendations against what you already own, and see the gaps before you leave.

**Version 2.1.0** (revised August 8, 2026)

**Live site:** https://drmullen.github.io/cc-planner/
**Launch the app:** https://drmullen.github.io/cc-planner/app/

---

## The loop

**Inventory → Plan → Compare → Prepare**, and back around as supplies run down.

## Features

- **Inventory** across eight categories (respirators, filters, purifiers, tests, monitors, eye protection, sanitizers, other) with location, quantity, spec, vendor, cost, notes, search, and category/location filters.
- **Three replacement models** — consumable (projected depletion from a usage rate), timed (interval from last replacement), and durable — plus expiration dates. The soonest date wins.
- **Alerts** bucketed urgent (under 7 days), upcoming (under 30), and planned, each stating its reason, sortable by soonest, category, location, or replacement cost.
- **Reorder links** you save yourself, per item. No affiliate links, no marketplace, no vendor relationships.
- **Kits** — reusable packing lists built from items you already track, suggested automatically when a plan matches them.
- **Planner** with seven presets (flight, medical appointment, concert or event, work or school day, family gathering, hotel stay, public transit) plus custom scenarios you can create, edit, duplicate, and favorite.
- **Tiered recommendations** (essential, recommended, optional) with a plain-language reason attached, compared against your inventory into *You already have*, *Needs attention*, and *Consider adding*.
- **Environment assessment** — ventilation, crowding, duration, optional CO₂ reading, and masking feasibility in; qualitative preparation guidance out.
- **Air changes calculator** — equivalent air changes per hour (eACH) from purifier CADR, mechanical ventilation, and a natural-ventilation estimate, with every step of the arithmetic and its assumptions printed alongside the result.
- **Learn** — an evidence library (claim, plain-language explanation, evidence strength, sources with DOIs, last-reviewed date, limitations), conversational responses to common claims, and adaptable advocacy letter and speech templates.
- **Data** — full-state JSON backup, inventory CSV export, preview-and-confirm CSV/JSON import (merge or replace), and a printable readiness report.
- **Optional modules** — a local vaccination record that can be switched off entirely, and clearly labelled demo data you choose to load and can remove permanently.
- **Appearance and accessibility** — dark, light, or system theme; date-format choice; keyboard-operable navigation; desktop sidebar and mobile bottom navigation.

## Privacy and local-first behavior

- No account, no sign-in, no user-data server, no analytics, no tracking.
- Inventory, kits, scenarios, settings, and the optional health record are stored in your browser's local storage, on your device, in that browser profile. The app makes no network requests for your data.
- **Encryption is optional and off by default.** Default browser storage is not encrypted. When you set a passphrase, the app encrypts stored state with AES-256-GCM using a key derived by PBKDF2-SHA-256 at 310,000 iterations through the Web Crypto API. If Web Crypto is unavailable, encryption is refused rather than faked — there is no fallback cipher. The passphrase is never stored or transmitted and cannot be recovered.
- Exported JSON, CSV, and printed reports are plain files under your control. Once a backup leaves the app, its security is whatever your storage or transport provides.
- No absolute security guarantee is made or implied.

## Planning aid, not a risk model

CC Planner Pro can summarize conditions that generally raise or lower exposure opportunity and translate those conditions into practical preparation guidance. It **cannot** calculate a person's probability of infection, is **not** a validated clinical or epidemiological risk model, is not a medical device or diagnostic system, and does not replace individualized medical advice.

## Repository structure

```text
cc-planner/
├── index.html          Public product page (GitHub Pages root)
├── app/
│   ├── index.html      The CC Planner Pro application (single file)
│   ├── manifest.json   PWA manifest, project-site-safe relative paths
│   ├── sw.js           Service worker, scoped to /app/
│   └── icons/          App icons (192, 512, maskable 192/512, apple-touch)
├── README.md
├── .nojekyll
└── .gitignore
```

## Deployment

Plain static files. No build step, no package manager, no server-side code.

Enable GitHub Pages for this repository from the `main` branch, root folder. The site publishes to `https://drmullen.github.io/cc-planner/`; the app lives at `/cc-planner/app/`. `.nojekyll` is included so nothing is filtered by Jekyll.

All paths in both the page and the app are relative, so the project subpath works without modification, and the app can also be served from any other directory or a domain root unchanged. The service worker registers from `app/` and therefore scopes itself to `/cc-planner/app/` — it does not control the product page at `/cc-planner/`.

Service workers and PWA installation require a secure origin (HTTPS or `localhost`); the product page itself also opens correctly from `file://`.

## Author and publisher

Designed by **Dr. Sean P. Mullen**. Published by **Mind to Motion Studios, LLC**. © 2026 Mind to Motion Studios, LLC, as declared in the application's own metadata. The canonical source repository is `https://github.com/drmullen/cc-planner`.

## Citation

No formal software citation has been established for CC Planner Pro, and none is invented here. If you need to reference it, use the application name, version, and publisher as they appear in the app's About panel.

## License

The supplied application source does not include a license file or a license declaration; it declares only copyright. No license is asserted in this repository. Until the publisher adds explicit terms, all rights are reserved by default and this software should not be described as open source.
