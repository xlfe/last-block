# The operational graph and renderer

The network shift is a separate expansion; `app/sim.mjs`, the four classic shifts, their chooser and `last-block-save-v1` remain intact. The new continuous board replaces the earlier two-station network, rather than painting more branches onto that model. The layout and procedures are fictional, informed by the museum photographs.

## Data and model boundary

`app/network-data.mjs` authors the topology, screen geometry, resource names, point labels and service itineraries. Its current graph contains 94 nodes, 104 edges, 25 turnouts, 65 resources, six locations and three boundaries in a 2400×1120 world. The renderer does not embed those location IDs or station track counts.

| Data | Meaning |
| --- | --- |
| Node | Connected port, boundary or stopping berth, with world coordinates |
| Edge | Two node IDs, polyline geometry, exclusive resource and optional point/position requirement |
| Point | Common port with Normal/Reverse legs, full position labels, compact display ID and location |
| Resource | Canonical lock/detection identity; multiple edges may share it |
| Station | Label position and variable-length list of stopping berths |
| Service | Origin, scheduled/due ticks and ordered station or terminal destinations |

Both legs of a turnout share its point resource. Both halves of a station road share its berth resource. A line crossing on the drawing does not create connectivity: edges join only through their declared nodes. Parallel trunk alternatives share station fans, so they do not imply independent double-track capacity throughout.

`validateGraph` rejects missing collections/IDs, duplicates, invalid geometry/endpoints, unknown references, broken turnout ports, missing berth membership and disconnected topology. It reports malformed authored data before rendering. It is runtime validation in plain JavaScript, not a TypeScript or arbitrary-layout editing system. Static authored metadata is trusted after that validation; importing user-supplied HTML labels or layouts is outside scope.

`app/network-paths.mjs` searches simple paths between the current train node and the next authored itinerary destination. Search is bounded (four offered variants, finite expansion and length limits). A path cannot require both positions of one point or pass through an external boundary. It returns ordered edge/node IDs, unique resources and required point positions. Geometry determines movement length, while graph connectivity and resource identities determine compatibility. It is not a complete route-table generator for real railways.

## One deterministic authority

`app/network.mjs` exposes `createNetworkState`, `networkCommand`, `stepNetwork`, `networkRoutePlan`, `routeOptions`, `checkNetworkRoute` and snapshot validation. Only `stepNetwork` advances railway time. UI camera changes, service selection, sound and reference rendering have no time authority.

A preview describes a candidate without acquiring anything. Set-required-points checks that its switches can be moved and prepares them; it also grants no authority. Confirm recomputes the candidate and checks every detection, protection, occupied resource, reservation and point position against live state. It acquires all required resources together or none. A route reserves during its two-second proof; movement follows only after proof. Points remain owned and the full route stays reserved until tail clearance. Sectional release and cancelling an established authority are deliberately absent.

Movement follows the ordered polyline path. Train-head progress and an 80-world-unit tail determine occupied resources; occupancy and reservation are separate. A train may occupy its own starting berth. Finishing at an outer boundary removes the train; finishing in a terminal siding parks it and retains berth occupancy. Seven journeys can therefore finish with two physical trains still present.

Reports have stable IDs and separate acknowledgement/resolution. The protected second siding opens only after its completion report and explicit release. Routine ready/arrival notices resolve at the next confirmed movement. Guided pauses once for each important new report; Independent does not. Pace is independent of assistance and topology. Help/Journal, hiding and restoration pause the entire railway; there is no per-region catch-up clock.

## Stable drawing and camera

`app/network-renderer.mjs` consumes graph data plus current points, resources, routes, occupation and selected point. Each authored edge has a stable SVG group identified by edge/resource IDs. The connected turnout leg is bright and the disconnected leg dim independently of preview; occupied, reserved and preview paths are separate states. Berth windows and moving markers read the same state. Browser QA also renders an unrelated-ID fixture to check the renderer is not a hardcoded station illustration.

Track casings form one foundation beneath all coloured cores, so an adjoining edge cannot paint a false cream break over its neighbour. Small continuity seats appear only where at least two currently connected edges meet; inactive turnout legs keep their intentional gap/dim state.

The physical finish follows the photographed P12 board: flat pastel strips inside thin cream outlines with mitred bends, narrow inset section jewels, grey raised train-number bezels, black glazing with red-magenta assigned IDs, metal-rimmed circular signal lenses and cream names with underlines. Empty number windows stay dark. The selected point blade follows the first segment of its proved graph leg; section indication remains independent from preview and selection. Restrained panel joins and screw heads are source-native SVG/CSS. The blue-grey palette, sequential station codes and exact fitting placement are authored adaptations, not an exact historical replica.

Native SVG is suitable for this modest 104-edge board: it keeps paths inspectable and avoids a framework, dependency installation, texture pipeline or separate picking geometry. One stable world layer receives CSS translate/scale transforms for camera movement. Browsers may composite that transformed layer using the GPU; SVG rasterisation and actual acceleration remain browser/device decisions. No GPU throughput or frame-rate guarantee is claimed. Canvas/WebGL would need measurement showing a bottleneck before its extra picking/accessibility work was justified.

State updates patch the existing map instead of replacing its root. Live ticks do not destroy pointer capture. Pointer dragging has a threshold and suppresses railway clicks after a drag. Native selection is disabled only inside the map; mouse background pointer-down and native drag are suppressed while point buttons retain click/focus behaviour. Pointer-up, cancellation, capture loss and renderer disposal clear active pan ownership. Other page text remains selectable. Fit/Home, zoom, pan buttons, named regions and Locate provide alternatives; no gesture is required. Screen-space point targets stay at least 44 pixels. Their actual HTML text/control dimensions and rendered station-heading, berth-fitting, boundary and signal bounds feed a deterministic bounded placement pass. It places the selected point first, tries nearby offsets with clear gutters, and merges nearby unselected groups when needed. Duplicate world-space point text is omitted. Leader lines preserve actual anchors, and an explicit caption directs any labels that cannot fit to Points / locations. Identical camera/state inputs retain positions and existing target nodes through ordinary ticks. Station labels retain a 12-pixel screen floor; if their measured bilingual headings collide, the affected headings use the English station name until zoom provides room again. Full names and position buttons appear in the inspector rather than covering the rails with large cards.

`app/network-ui.mjs` owns camera, selected-point and dialog presentation. Whole timetable rows are selectable with touch, Enter or Space; selection closes the tablet drawer to keep subsequent rows accessible. Controls opens it explicitly. Clock/Pause/Reports/Services remain sticky while scrolling. Map navigation reveals the board below that bar; Locate focuses its region without acknowledging a report. Reports remains live; reference dialogs pause.

## Full-viewport network workspace

`app/workspace.css` places the active network in one fixed visual viewport, with dynamic viewport height and safe-area padding. The original four-shift UI stays separate. All HUD controls, train/point targets, operating sheets, alerts and blocking dialogs descend from the same network root. No operating action requires scrolling a page below the map. Services retains selectable timetable rows for boundary and waiting trains; native 44-pixel map targets select standing/moving trains and preview receiving berths. Selection and berth preview still grant no authority.

One nonmodal operating sheet is open at a time: landscape uses a 350-pixel side sheet bounded to 40% width; portrait uses a 44% bottom sheet. Clock/Pause, reports and service controls remain visible and live. Important protection remains a location-aware toast even after acknowledgement, until its cause resolves. Locate uses the actual protected berth or train position. Help, Journal and settings pause globally and closing them leaves the railway paused.

The renderer accepts `getInsets`, `getOverlayRects` and a list of receiving destination IDs from the UI. Fit, named views, Fit path and Locate use the unoccluded camera rectangle; label placement also excludes HUD/sheet and train-hit rectangles. Resize and orientation changes retain a fitted view or the current world centre. Camera changes do not enter the operational model. Background two-pointer pinch scales the railway camera; it does not depend on browser page zoom in fullscreen. Pan/cancel/capture cleanup remains scoped to the map.

A tap calls `requestFullscreen({navigationUI: 'hide'})` directly on the complete root. Fullscreen change/error events update the control label, viewport measurements and visible fallback feedback; exit preserves the desk and its operational state. Unsupported/refused requests leave the normal viewport workspace functional. Fullscreen state is not saved. Classic exit releases fullscreen and the document's fixed-layout class. `visualViewport`, resize and safe-area handling keep sheets inside the visible root. Android/system navigation hiding is a browser/OS decision rather than a guarantee; no PWA or native wrapper is introduced. See [MDN requestFullscreen](https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen) and [Fullscreen guide](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API/Guide).

## Persistence and delivery

The new `last-block-network-v2` snapshot includes schema/content revision, canonical model state, best result and view preferences. Restore validates roster, points, detectors, owner references and exact canonical route nodes/edges/length/requirements before drawing, and pauses. The old `last-block-network-v1` key is retained, with a clear new-layout notice. A damaged or incompatible v2 snapshot is retained until explicit Start; it is not silently interpreted or overwritten on entry. Classic progress and sound preferences use their existing independent keys.

`npm start` prepares local photographs, copies source into ignored `dist/`, and serves localhost. No new dependency is needed. Source modules, tests, Markdown and the research agent's reference SVG are committed; generated assets/screenshots/browser scratch remain ignored. The reference SVG is a design input, not the production graph.

The behavioural suite checks connected paths and operational coverage of all 104 edges, turnout-port consistency, conflicts/proof/tail locks, protection, malformed snapshots, deterministic pause and full seven-service completion. Browser QA covers whole-row selection, point-leg drawing, live touch pan, generic rendering, camera/controls and saves; see [graph QA](graph-network-qa.md). Physical Android performance, children, a full screen-reader audit, arbitrary networks and sustained large-scale workloads remain untested. No network editor or historically exact interlocking is claimed.
