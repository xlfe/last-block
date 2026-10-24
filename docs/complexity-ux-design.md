# A larger railway, one readable desk

Design and implementation brief, 24 October 2026. The user approved a connected-district implementation after reviewing the recommendation. This document separates that immediate release target from the larger ladder; delivery observations belong in [complexity UX review](complexity-ux-review.md). The [clickable control-room study](../design/control-room-study.html) uses invented static data to review navigation, tactile controls and attention management. The existing four-shift, one-station game described in [architecture](architecture.md) is retained alongside the new connected shift. The study is a secondary design record, not the expanded playable game. Technical expansion is considered separately in [network scaling architecture](network-scaling-architecture.md).

## Recommendation

Grow the railway without shrinking the controls. Keep a small whole-network strip permanently above one active district. Put large route endpoints and point-selection buttons on that district's diagram, with one nearby tactile control tray showing the selected station, train, destination and command. A full overview is one tap away; routine arrival, point selection and departure do not require changing views.

The museum's impressive density is a visual destination, not a sensible first touch interface. More kilometres, more simultaneous decisions, unfamiliar equipment, faster time and more disruptions all consume attention. Increase one at a time. A large, quiet railway can be an early exploration experience; a small, busy station can be a demanding puzzle.

## Implemented production increment

The implemented extension is **The connecting line**: two passing stations, Mizuno and Higashi, six services travelling through both, and one canonical single-track link. A transfer reserves that link, its receiving berth and both required station ends. An off-screen Higashi work report must be located/read, and the completion report acknowledged before protection is explicitly released. Assistance and pace are independent choices. Classic shifts and their save remain separate from the new network save.

The first implementation retains explicit point setting at both ends. Its local preview tray offers the required **Mizuno east exit** and **Higashi west entrance** positions together, so an ordinary transfer does not require switching districts. Automatic preparation of all required points from a route request remains a subsequent working-method improvement. Preview is read-only; Confirm rechecks current resources. Blockers use plain station/side/track names, rather than internal resource IDs.

The novice transfer sequence is: select the standing service → select the receiving track in the other station → inspect source and destination in the preview → set both named point groups in place → Confirm → watch the same train cross the link and arrive. Explain that the **receiving track and connecting line** are reserved until tail clearance; the entire neighbouring station is not closed. This is a scope decision for the shipped increment, rather than a requirement to reproduce every future feature in this document. Final observed status belongs in the independent review.

Independent design review inspected the production source and actual 1024×768 landscape and 768×1024 portrait screenshots, including an armed cross-district transfer and final handover. The board uses native on-diagram controls, decorative two-position handles and a preview with both required point groups. A sticky whole-network bar exposes clock, Pause, Reports, Services and district selection while the supporting timetable scrolls. Landscape puts the board and route tray side by side; portrait stacks them and brings the preview into view. Reports carry their own clock/Pause when opened live; Help/journal deliberately pause globally. The initial off-screen-report weakness was corrected before acceptance.

QA reports a complete touch-driven network shift: six trains each stopped at both stations, eighteen paths confirmed, score 100 with all on time; classic saves and records were unchanged. The [independent review](complexity-ux-review.md) owns exact checks and remaining limits. This establishes browser interaction evidence, not physical Android ergonomics or child comprehension. A future readability refinement is increasing the smallest required-point location labels; no touch-target or route-context blocker remained in the inspected layouts.

The release has a two-station whole-network strip, not a separate museum-sized overview. It has two assistance choices and two pace choices, manual point preparation, work reports and a finite authored timetable. Full overview navigation, three-position assistance hardware, automatic routine routing, arbitrary panning/zooming, larger station counts and narrative connection deadlines remain design/prototype scope. The source-only six-station study is retained as a secondary concept, not a menu inside the game or evidence that those features shipped.

## What the photographs contribute

Reviewed the current `app/` source, existing design/QA documents, the Nara desk/board dossier and the original-photo derivatives P02, P05 and P18 for this proposal. Earlier research also examined the entire 34-photo contact-sheet collection and P03/P12 at larger scale.

| Evidence | Useful design principle | Boundary |
| --- | --- | --- |
| P02/P03/P07: repeated station columns, ivory rectangular faces, thin cream arrows, yellow selectors and metal retaining rails | Preserve stable station grouping; make controls tactile, aligned and recognisably different from lamps | Exact `90/95` selector roles and whether nearby faces are lamps/buttons are unresolved. The study's working-method selector is a game invention. |
| P09–P15: single-track links, passing stations, number windows and broad status space | Use a schematic overview plus detailed local choices; keep location names stable across views | Exact route tables, lamp colour code and original button sequence remain unknown. |
| P05/P06: separate incoming-call and station-selection columns, speaker grille and volume knob | Calls should name a location; locating and answering are distinct actions | Actual call sequence, sound and protocol are not supplied. |
| P16–P21, especially P18: dense Shinkansen board with multiple information bands and station-specific complexity | Separate scales of information, rather than drawing every function at equal emphasis | This is a different railway/system. Do not bolt it onto Nara as one original room or label its unknown upper strips as verified controls. |

Sources and original file paths are available through [photo catalogue](../research/photo-index.md), [desk chapter](../research/02-nara-control-desk.md), [board chapter](../research/03-nara-track-display.md), [Shinkansen chapter](../research/04-shinkansen-display.md) and [uncertainty register](../research/10-open-questions.md). No photo upload or external research was needed. The observed materials support visual authenticity; functional rules below are authored design.

## Network size versus active workload

These are initial design budgets to validate through play, not established child-development limits. “Decision” means a choice requiring the player, not every moving train. Automated trains still consume real railway resources and obey the same safety rules.

| Stage | Network in the simulation | Player's active responsibility | Simultaneous decision budget | New learning |
| --- | --- | --- | --- | --- |
| Existing release | One two-track passing station and two off-board queues | Arrival/departure, occasional work or power recovery | Usually 1; opposing meet adds ordering | Path, proof, lock, tail clearance |
| Approved next release: The connecting line | Two passing stations, Mizuno and Higashi, in two districts with one real shared single-track link; six services | Move the same trains between stations and manage Higashi work reports | 2 pending movement decisions; at most 1 new report needing action | An off-screen district remains part of the same railway; link and receiving berth must be available |
| Later river connection | Three passing stations on one single-track corridor; two real interstation sections | Route trains between Mizuno, Nami and Higashi, initially all on one district screen | 2 pending movement decisions; at most 1 call needing action | Choose where two trains meet; a hold at one station affects another |
| Two districts | Five or six stations, one junction or a third platform, two district windows | One owned district first; assistant handles the neighbour; then explicit wider responsibility | 2–3 pending decisions; at most 1 new disruption | Read off-screen consequences and boundary acceptance |
| Whole line | About 8–12 stations in 3 districts | Timetable routing handles routine traffic; player regulates exceptions and important meets | 3–4 decisions; never fill every station with a manual task | Prioritisation, service connections and multi-step recovery |
| Separate high-speed chapter | Double-track district, stopping loops and overtakes | Different traffic pattern with familiar view/alert language | Restart with 1–2 decisions | Overtaking and block spacing, not an unexplained jump in density |

The connected increment is finite: six services and two stations, with one protected worksite producing an initial and completion report. The later three-station river shift can add two opposing pairs, one parcels train and a connection report. First pair meets at Nami; a later delay makes Mizuno the better meeting place. Start with two services and add the rest only after the player observes one complete meet. The later call can explain a human consequence (a school group changing trains), rather than creating an arbitrary alarm. That future shift's success means all six trains clear, the connection decision is recorded and no unresolved protection remains. Travel times, route tables and story are fictional.

Do not add points, power faults, telephone protocols, six stations and a doubled clock in the same lesson. Unlock a larger responsibility after completion, then offer optional hints. Do not infer difficulty from age or quietly speed up after a good score.

## Separate four choices

| Choice | Values | What it changes | What it cannot change |
| --- | --- | --- | --- |
| Workspace | Network overview / district / equipment detail | What is visible and selected | Railway time, authorities, responsibility or score |
| Working method | Route working / manual-points lesson | Whether the player requests a complete path or explicitly prepares points before the same request | Conflicts, proving, locking and occupancy checks |
| Assistance | Mentor / concise / none | Hints, candidate highlighting and optional pause-on-important-event | Hidden railway facts or safe-route rules |
| Challenge | Authored traffic/disruption preset plus separate clock pace | Concurrent decisions, timetable margins, exceptions and rate of time | Touch-target size or access to pause/help |

Timetable routing is a fifth, explicit **assignment of routine work**, introduced later. It must name which stations/services the assistant owns and expose its next planned route. It is not automatic train driving and cannot create a route through a closure. Distinguish game-wide assistance from photographed central/local authority; changing help cannot transfer control of a real simulated station.

For a simple child-friendly setup, provide “Learn this district” and “Take the whole line” presets that show their settings. Keep advanced axes available without requiring a settings exercise before every shift. The prototype demonstrates a three-position **game-designed** assistance selector (Mentor / Concise / None), separately from its manual-points lesson. These are illustrative preferences, not a decoded historic selector. Keep the actual implementation's selector on one named axis; do not put assistance and route-setting method on the same dial.

## The default workspace

Use one active district with a permanent whole-network strip and persistent alert rail. Districts retain their names, order and direction; changing view never mirrors the railway to make the selected train travel left-to-right.

| Alternative | Advantage | Cost | Decision |
| --- | --- | --- | --- |
| Everything on one scaled board | Maximum spatial continuity; resembles the museum wall | Touch targets collide, text becomes tiny, novice has no focal task | Use for non-operative overview only once the network grows |
| Freely panned/zoomed board | Good for exploring a very large topology | Losing location, pinch dependence and off-screen alerts; touch conflicts with point selection | Optional later exploration tool; never required for a route |
| Mutually exclusive overview and districts | Large controls, clear focus | Repeated switching and missed events elsewhere | Add the always-visible network strip and alert rail |
| Overview + one district + local tray | Stable global context, readable local operation, low navigation cost | Some duplication; requires deliberate information budgets | Recommended default |
| Two active districts side by side | Expert can compare boundary conflicts | Divided attention; unsuitable for small tablets | Optional desktop workspace after the single-district model works |

The overview contains station occupancy, train IDs, direction, district boundaries, closure marks and alert counts. Its large district cards are navigation, not signal buttons. A legend says “Select a district to work its controls”. A selected station is kept across overview/district changes. Going back restores the previous local selection and pan position; it does not clear a route plan without explanation.

The active district shows two or three passing stations at full operational scale. Distinct entrance signals, destination tracks and point groups are directly selectable; tiny decorative signal lamps are not themselves 8-pixel targets. The tray stays beside or immediately below the schematic. Equipment detail is an expansion of that tray, not a compulsory third screen for every command. The example study shows one detailed station within each two-station district to keep the concept readable; its six-station map illustrates later scale, not the approved two-station production increment.

## Route and tactile-control interaction

Routine route working: tap a train/entrance → tap a labelled destination track → inspect the highlighted path and full command name → press **Request path** once. The route system sets/proves/locks the necessary points. Arrival, destination and departure choices remain together in the active district; no equipment-detail visit is required. Selected endpoints have an outline and text, distinct from a proved route or occupancy.

Manual-points lessons: select the same train and destination; the tray additionally shows the required entrance/exit points with two large discrete positions. Tapping a position requests a change, then shows detected position or a lock reason. The subsequent route request uses the same checks as route working. Do not make normal scaling require manually clicking every point in the network.

Every command preview names **station · side/signal · service · destination**. Selection never executes. Switching district clears an uncommitted command with a short “Plan cleared” message; returning to the previous district restores selection, not an armed confirmation. A district boundary cannot be one district's invisible exit queue and the neighbour's unrelated spawn: adjacent acceptance, actual train identity and occupied link stay global.

Make ivory square pushbuttons with retaining rails, pressed depth and a separate illuminated status lens. A lever/dial can have a broad handle, fixed positions and a printed arc, but also exposes labelled 48-pixel position buttons with an explicit selected marker and `aria-pressed`/radio semantics. A single tap selects a position; keyboard arrows/radio controls may supplement it. No required drag, rotation, long press, multitouch or simultaneous button press. Retain current/proposed/proved distinctions and a plain lock reason. Unknown `70R`–`75R` keys remain reference-only rather than receiving invented historical effects.

## Notifications: attention without a wall of alarms

All views retain the same queue, railway clock and location badges. One event has one stable ID and lifecycle: new → seen/acknowledged → action pending → resolved. “Locate” centres/selects the affected district/object and changes nothing else. “Acknowledge” silences that event's reminder and records receipt; it does not clear a closure or fault. Resolution follows the model, with a brief retained resolved record.

| Priority | Examples | Presentation | Deadline |
| --- | --- | --- | --- |
| Protect / restore | Control supply lost, route cannot prove, existing protection needs handover | Persistent square warning mark + location + required action; one distinct cue | Show consequence time only if scenario has one; otherwise “Protected; no countdown” |
| Decide soon | Incoming connection report, train approaching a chosen meet | Persistent triangle + affected service/station + next decision | Railway time and relative remaining time, e.g. “Before 07:20 · 90 railway seconds” |
| Information | Arrival complete, route released, routine on-time movement | Local board change and journal entry; no global toast by default | None |

Finite budget: show at most **three expanded actionable cards** (two on a compact tablet layout), plus an always-visible total and **All events** control. Sort unacknowledged protective issues first, then earliest decision deadline; never silently discard overflow. District badges count all unresolved events, including acknowledged ones. Coalesce repeated reports from the same cause; do not emit one alert per blocked train when one power failure explains all of them. A new higher-priority event does not steal focus or change the selected district. Reserve one polite screen-reader summary per meaningful event, not per second or train tick.

Noise policy: one onset cue; no continuous loop by default. A missed actionable call can remind once after 30 railway seconds; then remain visible. Escalate only for a new consequence or priority, with a clear reason. Routine arrivals and successful commands are quiet tactile feedback, not global alarms. Acknowledged events do not keep ringing. Sound off preserves every fact. Reduced motion replaces pulsing locate rings with a static labelled outline.

The learner workload cap is two pending decisions and one new exception. If an authored introductory scenario exceeds it, delay a scheduled lesson event or auto-pause according to the declared assist setting; do not quietly erase trains or move their due times. Experienced presets may reach four decisions but require evidence from playtesting before adding more. Saturation is a scenario-design bug, not proof that the player needs smaller labels.

## One clock, explicit attention rules

View switches, selection, opening the local tray and **Locate** preserve the current run/pause state. Hidden districts continue under the same simulation and protection model. A camera movement is not a time-advance command. Never simulate each district independently and catch it up when opened.

Mentor can enable **Pause for new important events**: pause once when an unseen actionable event first appears, tell the player why, and require Resume. Seen/acknowledged copies do not retrigger it. Dispatcher defaults to continuous time with an ever-present Pause button; no hidden hard deadline can expire merely because the player was forced into a full-screen dialogue. Calls appear in a nonmodal tray first. Opening a longer reference/help page pauses and shows “Paused for reading”; closing keeps the railway paused. Backgrounding/reloading follows the current safe paused-resume policy.

The standalone study deliberately freezes its clock and uses no simulation. Its Run/Pause button demonstrates the visible state only; it cannot validate live workload or timing.

## Device layout and accessibility

- **Desktop 1440×900:** persistent network strip; district and tactile tray occupy the main 70–75%; three actionable cards and a compact running sheet use the side rail. Extra space can show a second read-only district, never smaller essential controls.
- **Landscape tablet 1024×768:** network strip stays three large district targets; one district schematic, linked route controls and two event cards remain together. Long handbook/journal content is an explicit expansion. Aim to fit the operational workspace in the viewport; browser chrome and real finger reach need device testing.
- **Portrait tablet 768×1024:** stack route tray beneath its schematic and use two compact event cards. Keep network strip and clock visible; do not retain a desktop side rail that reduces the board to a sliver. The prototype uses a stacked rail at this breakpoint. Reading extras may scroll, but critical event count/clock should remain available.
- **Narrow phone:** a fallback, not the target for a whole-line control desk. Stack district navigation, station board and tray; all operations remain reachable through ordinary vertical scroll. State this trade-off instead of claiming an identical single-screen experience.

Use minimum 44×44 CSS-pixel targets, prefer 48×48 for points/signals and allow 8-pixel separation. A thin drawn line can have a large native button adjacent to it, with a leader/label. Avoid overlapping invisible hit areas. Essential control copy should normally be 14–16 pixels; secondary static labels can be smaller if they are not needed to decode the next action. Pair colour with line pattern, text and lock/closure shapes. Motion is optional: show a train's section/berth identity and direction even when movement is reduced. Never animate a train onto a route before proving. Preserve focus, selection and in-progress reading when operational state updates; the current whole-DOM rerender approach needs review before a larger board.

## Phased delivery and acceptance

1. **Concept review completed; implementation authorised.** The standalone study is retained as a visibly mock design record. Production work now takes precedence over polishing it.
2. **Improve the existing one-station desk.** Move duplicated point/arrival controls into a coherent diagram+tray, add optional route working and preserve manual teaching. No network expansion yet. Verify command names, touch targets and state feedback against all existing safety tests.
3. **Build the approved connected increment.** Two real stations/districts, one canonical shared link, receiving-berth reservation and one authored finite timetable. Preserve the four classic shifts and saves. Verify cross-station exclusion, real identity transfer and save/resume before increasing size. A later third station adds a meet-location choice.
4. **Introduce two districts and the event queue.** First let the player inspect an assistant-owned neighbour. Then transfer a declared set of responsibilities; test Locate, deadlines, overflow, reading and clock consistency with actual play. Only then add whole-line responsibility.
5. **Add richer historical-feeling apparatus and bigger presets.** Distinct position selectors, number-entry tasks, protected local exceptions and automatic routine routing should each earn their complexity through a scenario. A Shinkansen board remains its own researched chapter.

Acceptance gates: a new player can name the active station, selected service, next destination and whether time is running; finish a meet without changing to equipment detail; find an off-screen event in one tap without acknowledging it; distinguish acknowledgement from resolution; complete all essential actions by touch; and see the same clock/resource state after every view switch. Evaluate scan time, unplanned view switches per movement, missed decisions and perceived workload. There has been no child or physical tablet test of this proposal.

## Trade-offs and questions to settle after review

The hybrid keeps global awareness but spends vertical space on repetition. Route working reduces clicks but hides some point-learning; manual lessons retain that educational texture. A physical selector looks satisfying but is slower than a direct route command; reserve it for meaningful states. Pause-on-event supports reading but can interrupt flow; expose it as assistance, not an invisible rescue.

User review should settle whether the next experience favours hand-setting apparatus or managing a broader timetable; whether automatic routine routing feels like help or lost agency; and whether a tablet in portrait is a primary target or a supported fallback. Playtesting must settle actual district size, decision budgets, useful deadline length and how closely buttons can follow the photographed scale. These questions guide later refinements; the approved increment can preserve the existing four shifts while adding its connected scenario.
