# The Last Block — architecture

A local browser game with no JavaScript dependencies about an analogue railway control desk. The district and all scenarios are fictional, inspired by the Nara Line CTC photographs in this repository. The photographs do not establish an exact equipment date, route table or operating procedure; the game makes no exact-replica claim.

## Product and interaction

The player controls one two-track passing station between the Kyoto and Nara approaches. Each train has a direction, arrival time, stopping time and target exit time. The player selects a train, sets the entrance points, requests its arrival route, waits for its tail to clear, sets the exit points and requests departure. The boundary holds are staging queues outside the protected district. Incoming and outgoing movements reserve the corresponding single-line link and station entrance; platform occupancy is separate. A route request is checked, proved, locked, occupied and released over time. Points cannot move under a locked route. Opposing movements cannot reserve the same throat or section.

Four short shifts introduce operation, opposing trains, work protection and a supply failure. Guided mode slows time and gives direct hints. Dispatcher mode runs faster with tighter punctuality scoring; both obey identical interlocking rules. An always-available handbook teaches the controls and links the photographic evidence. Every command is a labelled native button; no hover, dragging, precision hit target or keyboard is required.

## Components

- `app/sim.mjs`: deterministic domain model. `createState`, `command`, `step`, `hint`, `validateState` and scenario metadata work in a browser or Node. Simulation time advances only through `step`; no DOM, wall clock, storage or random values enter the model. Operational commands return an explanatory status and add an operating-log entry. Selection and pause only change their own state.
- `app/app.mjs`: UI rendering, pointer/keyboard events, fixed-step clock, save/resume and optional synthesised sound. Saves capture model state and campaign progress. Reopening always pauses; offline time never advances the railway.
- `app/styles.css`: responsive physical desk: dark enamel mimic board, occupied illuminated rails and number windows, cream metal route controls, paper working timetable and telephone. State has text/shape as well as colour.
- `app/network-data.mjs` and `app/network-paths.mjs`: declarative network topology, geometry, resource ownership, turnout ports, seven service itineraries and bounded path search with consistent point requirements.
- `app/network.mjs`: deterministic graph model. Atomic complete-path reservations, live point checks, ordered geometry-based movement and tail occupancy, structured reports and validated snapshots. The classic simulation remains unchanged.
- `app/network-ui.mjs` and `app/workspace.css`: the full-viewport network map, optional browser fullscreen, persistent HUD, whole-row Services selection, route/point/report sheets and attention views. It delegates operational changes to the command API.
- `app/network-renderer.mjs` and `app/graph.css`: generic stable SVG diagram and transform camera; geometry and live resource/point state drive the same drawn graph. It does not decide route safety.
- `app/continuous.mjs`: bounded seeded traffic admission, freight return itineraries and aggregate continuous-session score, reusing the network authority model.
- `app/offline.mjs` and `app/sw.js`: discreet offline status and the versioned public-asset worker template; the build supplies exact asset hashes without changing game-save storage.
- `app/sound.mjs`: user-gesture-unlocked Web Audio effects and persisted mute. No audio files or external assets. A rejected/suspended context produces a visible Retry sound state. Automatic events never attempt to bypass autoplay restrictions.
- `scripts/build.py`: copies hand-authored app files and prepares 2200-pixel web photographs from three original JPEG inputs. Python 3 and Pillow are preparation prerequisites; generated `dist/` is ignored.
- `app/index.html`: semantic shell, initial loading message and local module entry point. No remote network assets.

The browser stores one versioned save in localStorage. A failed/unavailable store produces a visible warning while play continues. Shift records and unlocks are stored separately from an active shift. Resetting a shift requires an explicit button in its briefing. Starting another shift replaces only the active shift, preserving campaign records.

## Safety model and scope

A train waits in an off-board boundary queue, reserves a moving route, occupies a platform or leaves through an exit section. A queued train is held outside the protected single-line link; the game abstracts the adjacent station’s acceptance and signalling. An arrival owns the entry throat and target platform from request through tail clearance; a departure owns the exit throat and exit section. Both throats can be used independently, but a given throat has one route owner. Route proof takes two simulation seconds and movement never starts before proof. Entrance and departure sections remain reserved for the complete move; physical occupancy is never inferred from a train-number edit. No identity editing is offered in this slice.

An active worksite prohibits routes into its track. A telephone acknowledgement only reads the report; the separate completion report and release action are necessary to reopen it. A supply failure inhibits new route requests while existing locked movements remain protected. Generator starting, available standby supply and transferring load are distinct. These are deliberately authored teaching abstractions, not a real railway operating system or a historical route table.

## Validation and running

Run `npm start` to prepare the assets and serve ignored `dist/` locally. Node/npm, Python 3 and Pillow are required; no installation is performed by the scripts. ES modules require HTTP rather than opening the HTML file directly. Run the Node behavioural tests in `tests/` and inspect desktop and tablet layouts in a browser. See the QA report for observed checks and limitations.

## Audio behaviour

The first version defaulted sound off, forgot the choice on reload, and attempted its very quiet confirmation before enabling sound. The source now defaults sound on, constructs/resumes its AudioContext within a click or tap, waits for a running context, and gives an audible test chime when enabled. Muting immediately cancels scheduled voices and persists independently of the railway save. Relay clicks, approach/proof bells, telephone rings, refusal tones and a handover chime are authored synthesis. A running audio context confirms the browser graph, not physical Linux output or speakers.

## Complex network increment

The network shift now uses a six-location graph with 94 nodes, 104 edges, 25 turnouts and 65 exclusive resources. Seven services cover the northern branch, trunk alternatives, depot relief and terminal sidings. A movement runs from the current node to the next itinerary stop, not a pre-reserved whole journey. The bounded pathfinder rejects contradictory turnout positions and boundary-through paths. Its offered paths are candidates: only confirmation, after live conflict/protection/detection/point checks, establishes a reserved route. Timed proof precedes movement; resources remain locked through tail clearance. Parked terminal freight retains its berth occupation after its journey completes.

Classic `last-block-save-v1` is unchanged. The new graph uses `last-block-network-v2`, validates schema/content IDs and canonical paths, and restores paused. Old network v1 remains stored, with an explicit new-layout notice. Invalid v2 data is retained until the player explicitly starts afresh. Audio preferences remain independent.

Assistance and pace are separate settings. Important reports pause Guided once per event; Independent remains live. Navigation and report reading do not pause. Help/Journal and hidden tabs pause globally. Preview confirmation rechecks live conditions even if the map or clock changed. Point selection and camera movement grant no authority. See [graph/rendering architecture](graph-rendering-architecture.md) for the data and renderer contracts, validation and limitations.

See [offline and continuous architecture](offline-continuous.md) for per-event banner dismissal, independent mode saves, rolling traffic and atomic cached releases.
