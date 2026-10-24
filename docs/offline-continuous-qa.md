# Offline, continuous operation and notice dismissal review

Reviewed 24 October 2026. All 33 behavioural/build tests and source syntax checks pass. No observed blocker remains for these three changes. Original classic and fixed-network operating checks remain in the suite; earlier map/fullscreen evidence is in [graph network review](graph-network-qa.md).

## Notice dismissal

The rendered × removed the protected-depot banner while leaving the event unread, unresolved and protected. Reports retained its count and reading controls; Show banner restored it without changing protection. A dismissed event survived an actual offline reload with `dismissed: true`, `acknowledged: false` and the siding still drawn as protected.

The later clear report had a different event ID and appeared normally despite the dismissed initial report. Acknowledgement retained protection; explicit release removed it. Existing fixed snapshots without a dismissal field remain accepted. The final landscape × target measured 44×44 pixels and passed centre hit-testing; its sheet began at y136 below the banner ending at y128.

## Continuous simulation and interface

Five independent tests cover per-event dismissal, bounded admissions, repeated traffic cycles, deterministic save/resume and exactly-once scoring. The initial constructor check found a bag-consumption error; it was corrected before the passing runs.

| Check | Observed result |
| --- | --- |
| Several roster cycles | A legal-command policy ran 3,200 railway seconds, completed 52 services and earned 5,200 points. All seven templates appeared. Both sidings received eight distinct freights and physically cleared for reuse. |
| Safety and size | Invariants and exclusive route resources were checked each tick. A generated train's locked point refused a conflicting setting. At most four admitted trains, 32 reports and 150 journal entries were permitted; the final run retained 21 reports. Path memoisation uses fixed graph-node pairs and path limits, not generated service IDs. |
| Capacity and timing | Holding traffic without dispatch filled the four-service limit, then admitted no additional trains or RNG changes. Waiting trains occupied no internal track. Due times were derived from admission, rather than from time spent outside the admitted roster. |
| Determinism and awards | A seeded snapshot paused, ignored 10,000 requested elapsed seconds, then resumed identically to its original run. A late journey earned its declared 25–100-point contribution once. Point/refusal clicks earned nothing; retired services did not score again. Corrupt totals and template IDs were rejected. |
| Fullscreen touch sample | At 546 railway seconds the UI had completed eight services for 800 points through 45 confirmed movements, including two freight departures from sidings. Two services remained active and `complete` stayed false. The HUD showed **800 pts · 8 done**. The journey used rendered map/Services/route taps, stayed in actual Chromium fullscreen and changed from landscape to portrait. No uncaught page errors occurred. |
| Session and mode isolation | Session summary paused without changing or duplicating awards. Switching Continuous→Fixed→Continuous preserved the running totals, the fixed live route and its best score 88. The four seeded classic records stayed unchanged. |

The browser policy read pure route helpers to choose legal candidates and advanced ordinary clock callbacks. It did not inject gameplay commands or score changes. Save fixtures were used separately to check mode isolation. Design independently reviewed the earned-score HUD, session contribution explanation, dismissed Reports and new clear report, and passed their presentation.

## Actual offline and update evidence

Checks used actual Chromium service workers, CacheStorage and `BrowserContext.setOffline(true)`. Network disconnection was not simulated by changing `navigator.onLine`. The build test independently verifies deterministic versions, every public asset digest, the HTML build identifier, the embedded worker manifest and a changed version after source changes.

- **First offline refresh:** On the actual root build, the first page was still uncontrolled. After the worker's ready/activated lifecycle completed and all 18 cache entries existed, the network was disabled. Its first reload loaded the app successfully and became controlled. A second online visit was not needed.
- **Supported application URLs:** Offline root entry and `/rail/index.html?offline-probe=1#network` worked. The latter used an isolated copy beneath a subpath, served with gzip for file responses. Saved continuous state reopened paused at second 1 with its dismissal/protection intact. All three photographs decoded offline at 2,200 pixels wide.
- **Exact allowlist:** The observed cache contained the app's modules, CSS, index, three prepared photographs and manifest: 18 entries. A public test sentinel fetched online remained outside the cache and failed when fetched offline. Worker inspection confirms no arbitrary navigation fallback or repository/docs discovery. Only the application base and its `index.html` are supported navigation paths, with query/fragment bookmarks; an invented nested router is not claimed.
- **Two-release update:** In an isolated prepared-output copy, release A stayed active while complete release B waited. Both workers reported 18 complete assets. An in-memory token survived installation, and reloading the open game still loaded A's matching HTML/module marker. Closing all game clients allowed B to activate; the old cache was removed. B then reloaded offline. There was no forced active-game reload or mixed A/B shell and script.
- **Failed preparation:** A deliberately changed asset with a stale digest failed installation, left no partial cache and showed offline unavailable while online play remained possible. A fresh browser with no installed copy failed its first-ever offline navigation, as expected.

The update fixture used copied static output with controlled release markers and regenerated manifests, not modified production source or a mocked service-worker API. Obsolete version caches are removed on natural activation; the measured update covered one active and one waiting release. No repeated-deployment storage stress test was performed.

The prepared static output and relative worker scope were verified locally at a root and subpath, matching the static-hosting approach intended for Cloudflare Pages. No Cloudflare deployment or production-header inspection was performed. HTTPS/localhost service-worker eligibility was observed; real Android offline behaviour, system bars, storage policy and device performance remain unverified. Generated captures and isolated fixture output are not committed.
