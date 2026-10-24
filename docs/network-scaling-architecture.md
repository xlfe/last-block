# Scaling the railway without replacing the game

Architecture and implementation follow-up, 24 October 2026. The four classic shifts remain intact. The first connected-district increment described below is now implemented in `app/network.mjs` and `app/network-ui.mjs`; larger graph authoring and additional districts remain proposals. Read it with the [complexity UX design](complexity-ux-design.md) and [interactive control-room study](../design/control-room-study.html). The network and equipment behaviours remain authored teaching rules, not a recovered historical interlocking table.

Keep the existing deterministic `createState` → `command` → `step` boundary. Extend the railway data and its resource checks, then give the same state several views. More screenfuls must not create separate railways or clocks. No framework, server state, worker or database is needed for the next increment.

## Start from the constraints in the current source

`app/sim.mjs` already separates simulation from rendering, protects both station entrances, proves routes before movement, holds locks until clearance, and distinguishes reading a report from resolving its cause. The independent railway tests are useful contracts to retain.

Its simplifying assumptions are specific to Mizuno: two points keyed `west/east`, two platform numbers, one approach in each direction, a fixed fourteen-second movement and scenario events embedded in the tick function. `app/app.mjs` also keeps the selected train inside the railway save, renders the whole desk on each tick, and pauses whenever its current dialog helper opens. Those shortcuts should not become network rules.

| Current assumption | Small next change |
| --- | --- |
| `lockAt(west/east)` | Check named resources required by an authored route |
| Train has one station `track` | Train has a location ID and an optional active movement |
| Platform number doubles as a point position | Point ID and normal/reverse position are independent of track number |
| Scenario index selects hard-coded events | Scenario ID selects data with due ticks and explicit conditions |
| One SVG contains the whole railway | Shared state feeds overview and district views |
| Every dialog pauses | View navigation stays live; Help/reference deliberately pauses globally |

## An authored graph, with explicit routes

Separate a static network definition from its changing state. Stations, boundary signals and junctions connect through named sections. SVG coordinates describe a drawing; they do not define operational connectivity or prove that two paths are compatible.

Use globally unique IDs such as `mizuno:point-west`, `mizuno:platform-2` and `link:mizuno-higashi`. Display names and Japanese labels are presentation data. The single-line link between two districts has **one** definition and state, referenced from both drawings.

The minimum additions are:

- **Section state:** known clear, occupied by a train, or unknown; optional protection. A missing/stale detection report cannot become clear.
- **Point state:** commanded position, proved position, motion/failure status and route owner. A click requests a position; it does not establish proof.
- **Route definition:** entrance, destination, ordered sections, required point positions, protected/conflicting resources and release condition.
- **Movement state:** train ID, route ID, progress and occupied sections, with enough information to retain locks until the train's tail clears.

For the next release, author a finite catalogue of legal routes. An endpoint selection looks up those routes and displays the choices. Do not ask a shortest-path algorithm to invent signal authority. A graph is useful for reachability and drawing connections; authored route tables decide which movements the fictional equipment permits. Signal overlaps or flank protection, if introduced, must be explicit resource requirements rather than inferred from a crossing on the page.

Retain the current compressed timings initially. Replace the single progress interval with a short ordered list of section transitions when trains actually travel between stations. Include train length/tail clearance in that authored movement model before introducing sectional release. Reserve the complete route until its tail clears in the first increment; this is conservative and easier to explain than a partly implemented release system.

## Route setting is one model transaction

The diagram, button bank and a rotary selector must submit the same typed commands. They must not each implement their own safety checks. A route preview is a read-only description, with no reservation or authority; confirmation always checks the live state again.

A route request should:

1. Resolve the selected train, entrance and one legal route from the catalogue.
2. Check destination capacity, all required section/resource owners, work protection, detection knowledge, point/control availability and the relevant supply.
3. Acquire every required reservation together, or acquire none. Reserve during proving too, so two rapid taps cannot both pass the initial checks.
4. Command the points, wait for proof, then establish authority. Occupancy and reservations remain distinct facts.
5. Track passage and tail clearance, then release according to the route's own rule. Changing view, muting, acknowledging an alert or changing the displayed train identity cannot release it.

Start with exclusive resource ownership. This may refuse some theoretically compatible real-world movements; allow sharing only after a specific authored case and test require it. An occupied section blocks other trains. A departing train may occupy its own starting berth without that being treated as a conflicting second train.

A failed proof never produces a clear signal. Preserve its protection until the defined recovery/cancellation rule allows release. Do not add a generic instant “reset all” control. Cancellation after authority is established needs its own approach-locking and clearance rules; it is outside the first network increment.

For an internal link, departure must reserve the shared single-line section and have an acceptable receiving berth at the next station. Recheck that berth as part of the same transaction. This prevents two trains leaving towards each other or both being promised the last free berth. Do not require an entire journey through several stations to be reserved at once: it would needlessly prevent useful meets and create avoidable deadlocks. The current off-board waiting queue remains only at the outer scenario boundary, with that abstraction stated to the player.

Return refusal data such as `reason`, `resourceId` and `blockingTrainId`; the UI supplies plain language and a Locate action. Keep operational text out of safety predicates. Existing command feedback can remain while these structured fields are introduced.

## Districts are views of one simulation

Run one fixed-step clock and one command path for the complete active scenario. Apply each command as a synchronous transaction between completed simulation steps, including while paused. Record its tick and command sequence so ordering is reproducible; never interleave a command with a partly processed step. Keep a documented order for scenario events and movement within each tick. Only ticks advance proof, movement and scenario time. The state after the same ordered command/tick sequence must be reproducible regardless of the viewed district.

Overview, district and equipment detail change selection and rendering only. They do not pause, fast-forward, unload trains or catch up an unseen district later. Keep all district state in memory; render only the current detail plus small global summaries. A few authored stations should be measured before considering a worker or a second process.

Keep Pause and clock status visible everywhere. Help/reference pauses **all** districts and returning leaves them paused until Resume. Guided mode can pause on a new important actionable event; Dispatcher continues unless the player pauses. Record that Guided pause against a stable event ID so reopening its view or locating its equipment does not pause repeatedly. A hidden tab or restored save pauses the whole railway, with no offline advancement.

Keep station orientation consistent (Kyoto/west remains left) and retain selected train/location context when navigating, but clear an unconfirmed route preview on leaving its district. Say that it was cleared. Opening a district through an alert should focus its object without issuing a command or silently acknowledging the alert. These rules prevent a stale selection becoming an accidental instruction to the wrong station.

## Events, notifications and attention

Replace string-only journal messages gradually with structured events. Each needs a stable ID, railway tick, type, affected location/entity and concise payload. A deterministic sequence counter is sufficient; no remote message broker is required. The journal and the attention rail are different projections of those same events and current conditions.

A notification can carry severity, an action/due tick where applicable, a Locate target, and acknowledgement state. Its underlying worksite, failure or train condition remains in the railway model. **Seen**, **acknowledged** and **resolved** are different states. Acknowledging a power alarm cannot restore supply; a completed inspection still requires explicit release. Locate changes the view only.

Deduplicate an ongoing incident by its event/condition identity. Retain unresolved actionable items globally, even when their district is off-screen. Order them predictably by urgency, due tick and occurrence sequence; do not let a stream of routine arrivals push a protected worksite off the actionable list. Resolved items move to the journal. Do not impose today's forty-message journal cap on unresolved tasks.

Build overview counts, pending-call badges and point/track indications from selectors over the canonical state. They are not independent counters that can drift. A district change can therefore redraw immediately without losing a task or its acknowledged state.

## Source and save compatibility

Retain local snapshots for this scope. Add `schemaVersion`, network/scenario IDs and content revisions, one global tick, resource/point state, active movements and the next event sequence. Persist unresolved events and which Guided events have already paused. Save view selection separately from operational state; sound remains an independent browser preference. Restore paused, as today.

Do not silently load a snapshot against a changed route table. Validate IDs, owners, occupancy, movement/route agreement and protection invariants before accepting it. Migrate the four existing index-based campaign records to stable scenario IDs. Keep a version-one loader for the classic Mizuno desk, or offer an explicit restart while retaining its completed records; do not guess where a train was on a newly authored graph. Leave an incompatible save intact until the player chooses recovery.

There is no need for an event-sourced database or a generic migration framework. A versioned snapshot plus a small explicit migration function is enough. Bound historical journal storage separately from the required unresolved incidents.

## Incremental delivery and evidence

1. **Interaction prototype:** review diagram controls, overview/detail navigation, draft clearing and alert language. The retained study is a visibly labelled concept, including future network sizes.
2. **Bounded network model:** add the resource/route command model alongside classic Mizuno, retaining its four shifts, version-one saves and safety tests. This avoids migrating a live classic movement onto a different topology. The network model follows the same deterministic command/step boundary.
3. **One connected neighbour:** add one real shared link and receiving berth, two district views and a persistent attention rail. This increment is delivered. Its tests cover competing boundary departures, berth reservation, unknown detection, rapid commands and save/reload with both districts moving.
4. **Future richer desk:** add more tracks and authored junction routes after tablet evidence supports it. Test every offered route against its resource/conflict table. Unifying classic scenarios into the network catalogue can be a separate compatibility change; it is not required to play the expansion.

Across those increments, preserve tests for proof before authority, conflicting-route exclusion, point locks, tail clearance, protection and power recovery. Add checks that a view switch leaves the railway unchanged, alerts cannot resolve their own causes, Guided pauses once per event, and saving/restoring retains every district's locks. Use browser inspection for reachability, focus and 44-pixel controls rather than tests that merely restate CSS.

The implemented first milestone is one connected neighbour operated from two views: the player can see where a decision is needed, locate its equipment and make it safely on a tablet.

## Delivered boundary

The Connecting line adds Mizuno and Higashi, each with two tracks, a single canonical shared link, four point groups and six trains making complete two-stop journeys. The route catalogue is deliberately limited to authored arrival/transfer/exit patterns derived from each train's direction and stop count. The model does not search a general graph. Transfer confirmation reserves both berths, both relevant entrances and the line atomically; both ends' point positions must be set and remain locked through the movement.

The UI provides diagram endpoint/track buttons, yellow rotary-style handles with explicit Track 1/2 buttons, a persistent district strip and global clock/Pause/Reports/Services controls. Both required remote/local point commands are available in a crossing preview. Guided/Independent assistance and Steady/Brisk pace are separate controls. Reports remain live, with a visible pause control; Help/Journal pause globally. Routine train reports resolve as their next movement is confirmed, and a work completion supersedes its earlier inspection report.

To prevent the novice from filling both stations without a passing berth, the authored traffic rule holds a boundary arrival when it would take the neighbour's opposing train's last receiving berth. This is an explicit regulation rule in addition to interlocking, not a claim that a real interlocking prevents every unwise station fill.

The network uses its own versioned snapshot and leaves classic saves/records intact. It validates canonical resource/point membership, route ownership and train state before rendering a restored desk. Broader classic-to-graph migrations, arbitrary station lengths, sectional release, cancellation after authority and general network editing remain outside this increment. See the QA report for observed tests; future acceptance criteria above are not claims of implementation.

Point detents in this increment change immediately while unlocked; the timed two-second proof belongs to the route. Point-motor delays/failures are not simulated. View and selected-service fields currently share the network snapshot but do not participate in resource checks. A general split between operational and view storage remains a later refactor.
