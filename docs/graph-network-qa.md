# Graph network acceptance review

The six-location graph passes the bounded acceptance review below. The earlier two-station network has been superseded; the four classic shifts remain available. Evidence was collected against the local prepared build on 24 October 2026.

The acceptance target is an operational multi-branch railway rendered from the same topology used for route checks. A more intricate picture alone does not meet that target.

| Area | Acceptance criterion |
| --- | --- |
| Topology | Declared edges connect existing endpoints; every offered route is a continuous path to its advertised destination. North, depot/relief and terminal branches have playable services or explicit route choices. |
| Conflicts | Actual shared sections and junction resources exclude incompatible routes through proving and tail clearance. An unavailable destination refuses the complete transaction without partial reservations. This graph has no separate at-grade diamond controller. |
| Points | Required normal/reverse positions belong to actual forks. The drawn blade/connected leg changes with the model state; an occupied/locked route prevents both the command and a misleading visual change. |
| Renderer | Geometry, labels and resource identifiers come from topology data. Rendering/panning/zooming cannot mutate railway occupancy, locks, time or train identity. |
| Timetable | A tap on any row cell, label or unused row space selects that service. A labelled keyboard action provides the same selection without duplicate or ambiguous tab stops. |
| Map interaction | Pan/zoom and Fit work by touch and labelled controls. Panning cannot accidentally change a point. Essential point operations remain accessible at a usable touch size. Reduced motion retains state information. |
| Saves and isolation | New graph content is versioned; incompatible network saves receive a clear recovery path. Classic shift state and records stay intact. |

## Observed model and topology evidence

`npm test` passes 27 tests: ten classic regressions, nine graph operating checks, four graph topology checks and four sound-controller checks. `npm run check` passes for all eight browser modules.

The graph contains 94 nodes, 104 operational edges, 25 points, six stations and three boundaries. The topology checks follow every service stage across its possible receiving berths: all declared edges occur in a real offered path. They verify ordered connectivity, endpoints, geometry, resource ownership and consistent point settings, including reverse-direction travel. Both terminal sidings, the northern branch and the through-depot relief itinerary are reachable. Malformed geometry, missing IDs/berths, null records and disconnected data are rejected before rendering.

Operating checks retain the safety coverage from the earlier network using actual graph resources: opposing routes cannot share sections or points during proof, movement or the final tail-clear tick; occupied destinations and protected sidings refuse atomically; alignment and preview grant no authority; confirmation rechecks detection. Changing view preserves railway state and global time. Report acknowledgement remains distinct from removing protection. Moving snapshots retain canonical ordered paths and locks; schema/revision, ownership and path corruption are rejected.

Two deterministic complete campaigns used different destination/path preferences, including path variants 0, 1 and 3. Each completed all seven itineraries and 29 movements without deadlock, scored 100 and retained exactly two freight berth occupancies. This is representative coverage, not proof that every arbitrary player scheduling choice avoids deadlock.

## Observed browser evidence

Chromium used fresh contexts with `hasTouch: true`. Gameplay commands below used rendered taps; a read-only model planner selected legal candidates and Playwright advanced the ordinary clock callbacks. No gameplay state or railway commands were injected during the full journey.

| Check | Result |
| --- | --- |
| Complete expanded shift | Guided/Steady at 1024×768 completed all seven services through 29 confirmed movements at 391 railway seconds: score 100, seven on time, two freights parked. Both important reports were acknowledged and Siding 2 explicitly released. Final reservations and active reports were empty; only F71/F82 occupied their assigned terminal sidings. Seeded classic scores 95/90/85/80 remained intact. |
| Real alternatives | At 768×1024, selecting Path 2 changed the Mizuno→Kawara path from the upper main to the lower main, changed MX/KX requirements to Reverse, retained the destination and confirmed those actual edges. |
| Whole timetable row | Service labels, time cells, position cells and unused cell space selected the intended service. Enter and Space provided the same selection and retained row focus. Selection while paused kept time and reservations unchanged. Tablet row selection closes the drawer, keeping subsequent row cells accessible; Controls explicitly opens the selected service. |
| Actual point state | MX Normal→Reverse→Normal immediately swapped the correct drawn legs, glyph and model. The connected leg had full opacity; the other was dimmed and dashed. For an active owned route, a Reverse request was refused and the model and map both stayed Normal and locked. |
| Touch camera | A CDP single-finger drag continued through a live simulation tick, moving the persistent map by 95×30 pixels while the clock advanced once and the point stayed unchanged. Fit, plus/minus, directional buttons and Locate worked. Zoom out reduced scale even below the fitted narrow-screen scale. Locate revealed and focused the labelled map below the sticky strip. |
| Responsive operation | 1440×900, 1024×768, 768×1024 and 390×844 had no horizontal document overflow. Sampled visible buttons, including point targets, were at least 44×44 CSS pixels. The final landscape map measured 992×510 pixels, from y180 to y690 after Fit; portrait tablet map measured 736 pixels wide. Reduced-motion emulation retained camera and point operation without requiring animation. |
| General renderer | A separate supplied graph with unrelated node, edge, station and point IDs rendered its custom station, four edges and one turnout. Updating its state swapped the actual normal/reverse legs. Fit/zoom/pan did not mutate the supplied model. This tests the renderer contract independently of the authored railway. |
| Save compatibility | A live graph route reopened paused at 81 seconds with its 11-edge path, locks and best score 88. Legacy two-station, malformed JSON and outdated graph saves showed explicit notices. Original raw data remained untouched until Start; the legacy key and classic save remained intact afterwards. New graph saves used schema 2. |
| Classic isolation | First bells was completed again entirely by touch, scoring 100 at 41 railway seconds. Next shift opened Passing places; the chooser still displayed all four original chapters with progression. The classic model test completes every chapter in both modes. |

The review corrected and retested a tablet drawer obstructing timetable cells, narrow-screen zoom-out reversing direction, station label size and disconnected point-target placement. Design independently reviewed the final Fit and selected-Reverse captures and found no visual blocker. Generated captures remain ignored and are not commit deliverables.

## Limits and follow-up

No physical Android tablet, child playtester or screen reader was available. Touch emulation and viewport measurements do not establish device performance, real rotation/browser chrome, independent eight-year-old comprehension or fine print readability for every player. At 390 pixels the global toolbar occupies approximately 308 vertical pixels; the phone layout is operable but less spacious than tablet layouts. The fit view is an overview; point inspection, named controls and zoom supply operational detail.

SVG plus CSS transforms were verified functionally. No GPU acceleration, frame-rate benchmark or power-consumption claim was measured. No physical sound-output or genuine Android background/resume transition was retested in this increment. The prior audio and visibility limitations in [QA report](qa-report.md) still apply. No exhaustive pixel audit of all 104 edges or exhaustive scheduling-policy search was performed. These are evidence limits, not observed release blockers.
