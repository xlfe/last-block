# The dispatcher's desk

Design brief, 23 October 2026. All characters, stories, operating sequences, timings and scoring below are authored game design. The visual and engineering references are recorded in [research notes](research-notes.md). This is a historical railway control-room game inspired by museum exhibits, rather than an exact reconstruction of one installation.

## Experience

The player takes the desk for a small Japanese single-track railway district. Trains carry people, parcels and small personal stories between quiet stations. The pleasure is learning a tangible machine: watching number windows arrive, hearing a station telephone, consulting a paper timetable and making a clear decision before releasing a train.

The audience is ages 8–16, with adults welcome. The game should feel like a serious responsibility made understandable, with warmth and occasional odd railway humour. Borrow the satisfying document/desk attention of *Papers, Please* and the characterful cause-and-effect storytelling of *Day of the Tentacle*. Use original characters and presentation. Avoid punitive bureaucracy, opaque adventure-game combinations or a requirement to memorise engineering jargon.

The promise of the first playable release is a complete short shift with an introduction, teachable decisions, moving trains, a complication, a result and replay. A beautiful static dashboard alone does not meet that promise.

## Immediate implementation agreement

Build a readable district with three main locations: one two-track passing station at its centre and approach/boundary interfaces at either side. These are not three fully modelled stations. Station names and exact layout are fictional; names drawn from the museum should be labelled as inspiration if used. Keep the same spatial arrangement across shifts so players learn their desk.

The implemented loop is: read the next service on the timetable → select it → set the entry points → request reception on a track → watch the route prove and lock → wait for arrival and boarding → set the exit points → clear the departure signal → wait for tail clearance and automatic release → choose the next movement. An incoming call can supply a fact that changes the next choice. A separate path-preview confirmation step is a possible later refinement.

The route preview and labelled controls must be usable with one finger. A rejected route explains its reason and leaves the railway safe. Each train needs a visible origin, direction, destination, current state and useful next action. A completion screen appears only when all required trains have left the district and any required message has been handled.

## Modes

Modes change information and workload; the railway's protection rules stay the same. Age is a suggestion, never a lock.

| Setting | Guided desk, approximately 8–11 | Dispatcher, approximately 12–16 |
| --- | --- | --- |
| Briefing | First-shift steps define points and explain the full movement; desk starts paused | Same briefing with less ongoing help; clock starts on opening the desk |
| Guidance | Selected-train emphasis, state-based next-step hints and reasons for refusals | Route/train state and operational messages; next decision is the player's |
| Tempo | One railway second per real second; pause available | Two railway seconds per real second; pause available |
| Documents | Service identity, direction, arrival, clear-by time and current position | Same timetable, with tighter score consequences |
| Complications | Later shifts introduce work protection, then supply recovery | Same authored complications with less guidance and a faster clock |
| Results | Completion, on-time count, delay, mentor debrief and unlimited retry; no refused-command penalty | Passenger delay counts twice in the score; refused commands deduct up to 15 points; journal retains decisions |

Mode selection applies when starting a shift; it does not silently convert a running desk. Sound is optional; every audible event also has a visible message. Reduced motion preserves all operational information. Adjustable speed beyond these two mode rates, connection-specific documents and more traffic in Dispatcher mode remain future refinements.

Guidance adapts to the current state: a scheduled train explains waiting; an occupied train explains tail clearance; a refused route names the specific conflict; a generator starting explains that proof is still pending. A useful first-release implementation can derive these hints deterministically from state. Later optional support can offer a stronger hint after repeated refusals or prolonged inactivity, without silently changing the railway rules or the chosen difficulty. Shift unlocks follow demonstrated completion, rather than a player's age. An older beginner can use Guided throughout; a confident younger player can choose Dispatcher. Do not advertise automatic difficulty adaptation unless it is implemented.

## Operating rules

These rules simplify known railway principles without claiming to reproduce the original desk's wiring.

1. Each single-track interstation section has one occupancy/reservation state. Opposing movements cannot both receive authority into it.
2. A station platform holds at most one train. A route cannot enter an occupied or protected destination.
3. A route request checks conflicting reservations, occupied sections, a protected worksite and required points. Passing trains may use separate platforms if the authored station throat routes are compatible.
4. The route has a brief setting/proving state before it becomes locked and authorised. Requested, authorised and occupied are visibly different states.
5. Points remain locked during a movement. A player cannot switch them under the train. A label explains the lock.
6. A train follows authority; selecting its card alone does not move it. Moving trains remain present until their tail has cleared the relevant section.
7. When the train clears, the route releases automatically. The next movement must still have a valid destination.
8. Holding a train is an ordinary regulation decision. A refused command is useful feedback, rather than a collision or a lost life.
9. Acknowledging a call or alarm records that it was read; it does not remove a fault or closure.
10. Train identity is distinct from track occupancy. A future number-entry puzzle may correct the name in a window, but must not erase the physical train.

Do not add an expert-mode bypass of these protections. If a future cancellation feature is implemented, returning a button to normal must not immediately unlock points beneath an approaching or occupying train.

## Shift progression

Each shift introduces one conceptual skill before combining skills. Suggested durations are real playing time, not historical railway timings. First release can use fewer trains while retaining the arc.

| Shift | Duration | New skill | Authored situation | Success |
| --- | --- | --- | --- | --- |
| 1. First bells | 2–4 minutes | Request, prove, move, release | Mentor brings one local from the west through the centre to the east | Deliver the local; recognise why a lit request is not yet permission |
| 2. Passing places | 4–6 minutes | Plan a meet | Two opposing locals arrive; the centre has two platforms and shared throats | Bring both into separate tracks, then depart safely in turn |
| 3. The work gang | 5–7 minutes | Read, protect, then release | One track is protected for inspection. A foreman's call later confirms people and tools are clear; passenger and freight services compete for the available track | Hold or regulate services, read the report, then explicitly release protection |
| 4. Reserve power | 6–8 minutes | Recover from disruption | Normal signalling supply fails. An electrician explains the distinct generator start, proof and transfer steps | Retain existing route protection, restore desk supply, then clear the remaining trains |

Provide visible shift selection and replay. Unlock new shifts after completing the previous one; a scenario preview can explain the coming skill. Never describe a scenario as available unless it is playable. In early builds, scope the shift menu to implemented shifts.

The four subjects are implemented in the domain model and interface. Independent domain tests complete every shift in both modes; check the final [QA report](qa-report.md) for browser observations. The suggested durations are design estimates, not measured child-playtest results. The initial design also proposed **Lost minutes**, a passenger-connection priority puzzle, and **Weather turns**, a temporary weather restriction; these remain later scenarios.

Future chapters can extend the same workplace: a mislabelled train number; local station-control handover; a materials-siding shunt inspired by the Shinden notice; weather restrictions; then a distinct Shinkansen district for overtaking. A drivable cab is a separate major scope item, not a button added to the first control room.

## People and story

Keep dialogue short enough to read during play, normally one or two sentences. Named colleagues create continuity without requiring elaborate cut-scenes.

- **Aki, senior dispatcher:** precise and gently dry. Teaches the player to read the whole board: “The number has arrived. Give the last carriage a moment.”
- **Mori, centre-station keeper:** attentive to passengers and small local events. Supplies the reason a connection matters, and reports that the platform is ready.
- **Jun, maintenance technician:** practical and cheerful. Distinguishes a fault report from the later confirmation that equipment is fit to use.

The current four shifts are morning-service scenarios: first confidence, first opposing meet, work protection and supply recovery. Aki appears in hints and debriefs; the work foreman and station electrician supply functional reports. Mori, Jun, a morning-to-evening story and character-specific puzzles remain writing proposals. Future personal stakes can stay modest: a school excursion, a parcel for the festival, a missed connection. Humour can come from a colleague's note or a harmless misplaced lunch, never from asking a child to choose reckless operation. Calls should have clear actionable choices; avoid free-text answers and trick wording.

These are proposed writing hooks. Implemented dialogue should fit the final authored timetable and not promise nonexistent mechanics.

## Interface and visual brief

Use the photographed board's restrained geometry with contemporary clarity. The main workspace is a broad dark/muted blue-green track board in a brushed-metal frame, with cream station lettering, physical lamp apertures, pastel route strokes and black number windows. Under it sit tactile ivory buttons, a shallow angled teal desk, paper cards and a communication area. Group controls by function and station. A small number of screws, labels and repaired patches make it feel maintained; dense random wear will harm readability.

Suggested art tokens, chosen for the game rather than measured from photographs: deep green `#173F3B`, desk teal `#527E7D`, pale metal `#BDD0C8`, paper `#F0E7CF`, ink `#293B36`, lit amber `#EAC472`, occupied coral `#E77561`. Status colour always accompanies text, a pattern or a shape. Green/amber/red alone must never be the only distinction. Train numbers can glow softly without reducing text contrast.

Modern polish means clear visual hierarchy, responsive layout, legible text, restrained transitions, aligned labels and consistent focus/press states. Retain an analogue workplace rather than a futuristic neon dashboard. Japanese station labels can add character beside English names; use established translations, not decorative invented Japanese. Keep engineering IDs secondary to plain labels such as “Platform 2” and “Request route”.

The museum photos contain acrylic covers, strong ceiling reflections, visitor notices, modern camera equipment and treatment stickers. Omit these from a period workplace. The collection does not establish the installation's exact year, original room dimensions or acoustics. Do not assert a specific early Shōwa, 1972 or 2013 setting from this evidence.

## Responsive and accessible play

Desktop uses a wide board with a nearby timetable and compact telephone/log area. Landscape tablet retains the board and essential controls together; portrait can stack the supporting cards beneath the board. Keep the selected train and its available action visible without requiring horizontal page scrolling. If a schematic scales, its text and touch targets must remain readable; adapt the layout before shrinking it indefinitely.

All essential controls are actual labelled buttons with visible focus. Use at least 44×44 CSS-pixel touch targets, comfortable spacing and one-tap selection plus one-tap confirmation. No hover-only instructions, precise dragging, right-click, simultaneous presses or keyboard shortcuts are required. Keyboard shortcuts may supplement the same actions. Prevent accidental double dispatches while a route is setting. Clearly show pause, speed, mute and help; retain an obvious way to return from a briefing or result screen.

A compact legend should state “Waiting”, “Route set”, “Moving” and “Track occupied”, with the exact visual encoding used by the implementation. Include a plain-language glossary for route, points, section, platform and hold. Announce significant results without repeatedly flooding screen readers on every simulation tick.

## First-slice acceptance

- A newcomer can start Guided mode, understand one instruction and move the first train without external explanation.
- Every playable shift has a finite objective, a recognisable completion state and a working retry/next-shift action.
- Two opposing trains create a real decision at a passing loop; invalid movement is refused and explained.
- Point/route state and occupancy remain coherent through pause, speed changes and sequential departures.
- The timetable, call and result correspond to actual scenario state, rather than decorative static text.
- All play, including mode/shift choice, instructions, route commands, calls, pause, help and replay, works by touch at tablet sizes.
- At desktop and tablet widths there is no clipped essential action, inaccessible overlay or required horizontal page scroll.
- Direct visual reference is credited locally; originals remain unmodified and are not uploaded to external services.

Safety invariants warrant behavioural tests. Visual spacing and copy changes need inspection rather than tests that merely repeat their implementation. Implemented scope and verification evidence belong in the project's handover notes.
