# The Last Block

A local railway control-room game, built around photographic research into the preserved Nara Line CTC desk at Kyoto Railway Museum. Work four classic shifts at fictional Mizuno passing station, then take the **Junction district** network shift across six connected locations, a northern branch, depot relief loop and two freight sidings.

The classic desk has Guided and Dispatcher modes, a live track diagram, point and route interlocking, a working timetable, telephone reports, a desk journal, shift scores and browser-local save/resume. All actions use touch-sized buttons; no keyboard or external assets are required. Its analogue appearance is research-informed; stations, route tables, timings, procedures and dialogue are authored abstractions. The complete adventure narrative and historically exact operating procedures are outside this slice.

## Run locally

The browser game has no JavaScript dependencies or bundler. Local preparation requires Node/npm, Python 3 and Pillow. The supplied environment already has these tools. From this directory in fish:

```fish
npm start
```

This prepares the three museum photographs and copies the authored app into ignored `dist/`, then serves it. Open <http://127.0.0.1:8080/>. Stop the server with Ctrl+C. Opening the HTML directly will not load ES modules reliably. If Pillow is missing, preparation stops with a message; add it to the project environment before rerunning. No dependency installation happens automatically.

For an Android tablet on the same trusted local network, bind to the computer's network interfaces:

```fish
npm run build
python3 -m http.server 8080 --bind 0.0.0.0 --directory dist
```

Visit `http://COMPUTER_LAN_IP:8080/` on the tablet, substituting the computer's actual local address. Network isolation/firewall settings may prevent access. This serves only `dist`; there is no deployment or hosted service.

## First minute at the desk

Choose Guided → Take the first shift → Open the desk. Guided opens paused. Press Resume, wait for 101 at the Kyoto boundary, set Kyoto points to Track 1, then Receive on Track 1. Wait for arrival and boarding. Set Nara points to Track 1 and clear the departure signal. Aki's instructions under the route controls explain the next step.

Sound defaults on and starts after the first click or tap. The Sound toggle is available in the welcome dialog and at the desk; muting persists across reloads. Enabling it plays a test chime. If the button reads **Retry sound**, tap it to retry Chrome’s audio unlock. If Chrome still stays silent, check the tab/site mute and Linux output volume/device. The game can detect a running Web Audio graph, but cannot determine whether your physical speakers are audible.

Pause whenever needed. Opening the guide, journal, museum or shifts also pauses the clock; Resume restarts it. Trains never advance while the tab is hidden, closed or restored from a save. You can prepare controls with the clock paused. Desktop keyboard operation is supported through normal button focus, but every action is available by touch.

The next shift unlocks on completion. Replay a completed shift from Shifts or the handover. Starting a new shift replaces the current desk while preserving best scores. Save data stays in this browser at this exact origin; changing host, port, device or browser creates separate saves. There is no account, cloud sync or export. Clearing browser site data clears progress. A corrupt/unavailable save produces an in-game warning.

## The junction district

Choose **Network desk** in the classic header or **Open the network shift** on the welcome/shift menu. The original four shifts remain available from **More → Exit desk · classic shifts**. The fixed network shift has seven services and a continuous operational map: Mizuno, Kawara Junction, Higashi, Ume Town, Kitayama and Freight Depot. Northern services use the branch; a relief local runs through the depot loop; two freights finish parked in separate sidings. Parallel upper/lower trunk paths share station fans and do not provide independent double-track capacity throughout.

Start the network shift paused, then Resume. Select a train window or moving marker on the map, or open **Services** and tap anywhere on its timetable row for a waiting/boundary service. Selection never dispatches a train. Open **service Controls**, choose its next destination berth and inspect the offered path variants. **Set all required points** prepares the switches without giving authority; **Confirm path** rechecks the complete live path, reserves its sections and points together, then proves it before movement. Individual point positions remain available in the preview and Points inspector. A locked point cannot move until the train's tail clears.

The full map shows 25 working points. Tap a compact point badge to inspect it; clustered badges open a choice. Its selected connected blade is bright and the other leg dim, independently of any route preview. **Fit / Home** restores the whole board. Zoom, pan arrows, background dragging and named region buttons provide detail; dragging never issues a railway command. Point names and position controls have 44-pixel touch targets even when the overview rails are small. The network desk fills the browser viewport. A single operating sheet overlays the right side in landscape and the bottom in portrait; close it to expose more board. Services, reports, point inspection and route controls all remain inside this map workspace.

The shared clock, Pause, Reports, Services, selected-service Controls and camera buttons remain over the map. **Locations** zooms to a named region; Fit and Locate account for the space occupied by sheets and HUD controls. Drag to pan or use two fingers to zoom; camera buttons provide touch alternatives. **More** contains assistance/pace settings, sound, guide, journal, restart and the classic-shift exit. **Guided / Independent** controls hints and whether each new important report pauses once. **Steady 1× / Brisk 2×** controls pace independently; neither changes topology or safety. Help and Journal pause the whole railway and leave it paused on return. Reports and Services remain live operating views. Locate reveals a location without acknowledging its report. Acknowledgement only records reading: Siding 2 needs its completion report acknowledged and a separate protection release. Handover requires all seven journeys complete and that protection safely released; parked freights continue occupying their sidings.

**Fullscreen** requests browser fullscreen from your tap, including a request to hide navigation UI. The entire network root enters fullscreen, so reports, route sheets, settings and dialogs remain available. **Exit fullscreen** returns to the viewport desk; it does not abandon the shift. Android/Chrome decides whether system bars hide, remain or reappear with an edge gesture. If fullscreen is unavailable or refused, a visible message appears and the viewport desk remains usable. No installation or native permission is required. Hidden tabs still pause the railway; changing fullscreen itself does not advance, reset or resume time. Physical Android fullscreen/system-bar behaviour has not yet been verified.

Choose **Fixed shift** for the seven-service handover or **Continuous** for a rolling timetable and running points. Continuous admits at most four services, assigns their due times on admission, and keeps the same railway clock and resource state indefinitely. Freight loads for 30 railway seconds, then you route it back out of the siding. Completed boundary journeys earn 25–100 points according to lateness; refused commands do not cost points. The score button opens a paused summary with completed/on-time totals, last award and quality. More → Fixed shift / Continuous switches between separately saved desks; a new session requires explicit Start.

The protected-siding banner has **Dismiss banner**: it hides that notice without reading the report or releasing protection. Reports keeps the item and can show its banner again. A new completion report appears separately. Use Acknowledge and then Release when the work is actually clear.

The graph shift uses a new, separate browser save (`last-block-network-v2`). The old two-station network snapshot is retained under its previous key and produces an explicit new-layout notice. It is not guessed onto the new map. A damaged/incompatible new snapshot is kept untouched until you explicitly start a new shift. The four classic records and their save format remain unchanged. Reloading or hiding the tab pauses the whole railway; no offline time advances.

## Offline use

Open the site online over HTTPS (or localhost) once and let the complete offline copy download. **More** shows the status. When it says the copy is cached, the first refresh can be online or offline; its reload action is also available. Once controlled and complete it says **Offline ready in this browser**. Refreshing works without a network, including the museum photographs. Plain HTTP on a tablet's LAN address cannot register a service worker; HTTPS hosting supports it.

Updates wait while game tabs are open. When More reports an update, close all game tabs and reopen the same address. No active game is forcibly reloaded. Offline assets and game saves are separate local browser storage: clearing site data or browser eviction can remove them, and neither syncs across devices. Root/index entry URLs and their query/hash variants are supported; there is no deep-route URL scheme. See [offline and continuous design](docs/offline-continuous.md).

## Verify

```fish
npm run check
node --test tests/*.test.mjs
```

Hand-authored source lives in `app/`; `scripts/build.py` prepares `dist/` from that source and three original JPEG input files under `images/`. Generated web copies, screenshots and browser scratch files are not source deliverables. The companion photographic research dossier remains local reference material.

Tests use the launch prerequisites, including Python/Pillow for an isolated offline-build regression. The independent behavioural suite exercises route proving, conflicting movements, tail-clear locking, work protection, power recovery, pause, all four shifts in both modes, and mixed command sequences. See [QA report](docs/qa-report.md) for the actual browser coverage and remaining limits. Browser touch emulation is not physical Android testing; no child playtesting has been performed.

- [Architecture and safety model](docs/architecture.md)
- [Game design and future scope](docs/game-design.md)
- [Research-to-game decisions](docs/research-notes.md)
- [QA plan](docs/qa-plan.md)
- [Graph and rendering architecture](docs/graph-rendering-architecture.md)
- [Network scaling architecture](docs/network-scaling-architecture.md)
- [Complex network design](docs/complex-network-design.md)
- [Complexity and control design](docs/complexity-ux-design.md)

## Photographic research (local companion dossier)

An English-language photographic encyclopaedia and simulator research dossier based on all 34 photographs in `images/`.

Start with the [research index](research/README.md). The [photo catalogue](research/photo-index.md) links every original photograph to an individual description. Equipment chapters explain the visible controls, translations, operating principles and remaining identification gaps.

The originals have not been modified. This directory was not a Git repository when the dossier was prepared.
