# The Last Block

A local railway control-room game, built around photographic research into the preserved Nara Line CTC desk at Kyoto Railway Museum. Work four connected shifts at fictional Mizuno passing station: learn a route, cross opposing trains, protect a work gang, and recover the station control supply.

The playable prototype has Guided and Dispatcher modes, a live track diagram, point and route interlocking, a working timetable, telephone reports, a desk journal, shift scores and browser-local save/resume. All actions use touch-sized buttons; no keyboard or external assets are required. Its analogue appearance is research-informed; stations, route tables, timings, procedures and dialogue are authored abstractions. The complete adventure narrative and historically exact operating procedures are outside this slice.

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

## Verify

```fish
npm run check
node --test tests/*.test.mjs
```

Hand-authored source lives in `app/`; `scripts/build.py` prepares `dist/` from that source and three original JPEG input files under `images/`. Generated web copies, screenshots and browser scratch files are not source deliverables. The companion photographic research dossier remains local reference material.

The independent behavioural suite exercises route proving, conflicting movements, tail-clear locking, work protection, power recovery, pause, all four shifts in both modes, and mixed command sequences. See [QA report](docs/qa-report.md) for the actual browser coverage and remaining limits. Browser touch emulation is not physical Android testing; no child playtesting has been performed.

- [Architecture and safety model](docs/architecture.md)
- [Game design and future scope](docs/game-design.md)
- [Research-to-game decisions](docs/research-notes.md)
- [QA plan](docs/qa-plan.md)

## Photographic research (local companion dossier)

An English-language photographic encyclopaedia and simulator research dossier based on all 34 photographs in `images/`.

Start with the [research index](research/README.md). The [photo catalogue](research/photo-index.md) links every original photograph to an individual description. Equipment chapters explain the visible controls, translations, operating principles and remaining identification gaps.

The originals have not been modified. This directory was not a Git repository when the dossier was prepared.
