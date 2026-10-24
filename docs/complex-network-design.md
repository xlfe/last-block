# One complex, continuous control board

Latest design direction, 24 October 2026: a materially complex continuous layout **for the network shift only**, with point positions reflected on its map and whole-row timetable selection. The four classic shifts, their presentation, chooser/access and saves remain available unchanged. This supersedes the network's two-district default in [complexity UX design](complexity-ux-design.md). That document remains the record of the earlier increment and general accessibility/clock principles; it is not the final network visual target.

## Direct photographic inspection

Reopened the original full photographs for this revision, rather than relying on the reduced study:

- [P09, Kizu junction](../images/PXL_20261023_063003886.jpg): branching interfaces, crossovers, small signal circles/stems, compressed horizontal track runs and distinct direction arrows. The branching fan itself provides complexity; it is not a collection of detached cards.
- [P12, Shinden/Uji](../images/PXL_20261023_063018289.jpg): two- and three-track stations, narrow throats, vertically stacked dark train-number windows, pastel route segments with pale outlines, many small route identifiers and separate status lamps above the track diagram.
- [P15, Kyoto interface](../images/PXL_20261023_063031941.jpg): a terminal fan with multiple numbered tracks, short route suffixes, crossing geometries and end-interface arrows. Fine route suffixes are not all reliably transcribed.
- [P18, Hiroshima section](../images/PXL_20261023_063103010.jpg): long parallel running lines, complex station routes, overtaking tracks, dense subsidiary bands and repeated number windows. It is separate Shinkansen apparatus, not proof of the Nara desk's behaviour.

The new board is a **fictional railway**, drawing its visual vocabulary from these photographs. It is not an exact historical Nara/Shinkansen combination or a decoded original interlocking. Unknown numbered keys, original lamp polarity and undocumented switch functions remain unresolved. Source context is in [photo catalogue](../research/photo-index.md), [Nara board](../research/03-nara-track-display.md), [Shinkansen board](../research/04-shinkansen-display.md) and [uncertainties](../research/10-open-questions.md).

## Proposed operational topology

This is the concrete topology handed to the builder. Final graph IDs, offered routes and delivered services must be checked against production data before describing them as shipped. The [source layout drawing](../design/complex-network-layout.svg) is a schematic design reference, not a live renderer or simulated state.

| Element | Connection and meaningful choice | Approximate world position |
| --- | --- | --- |
| Kyoto west boundary | Feeds the trunk from the left | `(40, 500)` |
| Mizuno | Two platform tracks, with crossover access to the parallel trunk | `(300, 500)` |
| Kawara junction | Three platform/running tracks; chooses trunk, northern passenger branch or southern relief | `(770, 500)` |
| Higashi | Three platform/running tracks; trunk and relief rejoin before east boundary | `(1470, 500)` |
| Nara east boundary | Trunk exit and opposing-service source | `(1880, 500)` |
| Ume | Two-track passing station on the northern single-track branch | `(1040, 200)` |
| Kitayama | Two-track northern station leading to the third boundary | `(1540, 200)` |
| North boundary | Independent passenger destination, reached via Ume and Kitayama | `(1880, 200)` |
| Freight depot | Two reception roads on the southern single-track relief between Kawara and Higashi; two terminal sidings | `(1120, 800)` |

The trunk has two genuinely parallel running paths between Mizuno, Kawara and Higashi, with authored crossover opportunities. The northern line branches from Kawara, passes through Ume and Kitayama, then reaches its own boundary. The southern line branches from Kawara, passes through the depot reception roads and rejoins at Higashi: it is a genuine alternative route around a section of the trunk. The depot's terminal sidings are destinations for freight, rather than decorative lines.

Aim for approximately 16–24 **functional** turnout controls, as allowed by the implemented graph: trunk crossover pairs; three-track station fans; north-branch divergence; Ume/Kitayama loop ends; relief divergence and merge; and depot siding forks. The precise number is less important than a visible variety of useful path choices. Do not draw twenty controls that all perform the same two-track selection or add disconnected branches solely to make the diagram look busy.

Suggested finite service coverage is: west→east local; east→west opposing local; west→north passenger; north→east passenger; west→depot freight; east→depot freight; and an east↔west relief itinerary through the depot. An initial roster can combine these roles into fewer services, but every operational branch must either be used by the roster or available as a meaningful alternate destination/path. Due times are soft regulation targets unless a clearly introduced scenario says otherwise.

## Operational complexity versus decoration

**Playable:** boundaries, platform/reception berths, connecting running sections, turnouts, crossover routes, branch destinations, depot sidings, selected-point paths, reservations, occupancy, signal authority and train movement. Each visible interactive track/point must correspond to graph/resource data and a valid operational rule.

**Reference decoration:** panel seams, a few screws, muted faceplate rules, blank label frames, static infrastructure names and restrained wear. These never masquerade as operative points or occupied sections. If a supplementary upper band is drawn without mechanics, label it “Reference diagram” and omit moving/status-like lamps. A clear railway diagram is preferable to speculative electrical or environmental controls copied from unresolved photographic symbols.

**Out of the immediate scope unless implemented and tested:** unrestricted shunting/reversal, full route cancellation with approach locking, historical fault procedures, coupled rolling-stock lengths, exact Shinkansen ATC, timetable-based automatic routing and arbitrary turnbacks. Terminal freight can end its authored journey in a siding without implying a complete yard simulator.

## Rendering a point's actual physical choice

A point has a common port, normal leg and reverse leg. Its state permits common↔normal **or** common↔reverse; it does not permit a path straight from one diverging leg to the other. Pathfinding and drawing must read that same port/transition definition. Mere geometric contact or crossing on the SVG cannot grant connectivity.

Draw the permanent track plan in thin pale-outlined pastel strokes. Over the short turnout zone, draw a clear connected blade/tongue for the proved position and leave a visible gap/dim segment on the unselected leg. Tapping Normal/Main versus Reverse/Branch must visibly change those local segments even with no train or route selected. A small lever orientation and text position label provide a second cue. At a crossover, both physical point ends have their own state and must form a coherent path; a route's required positions are shown together.

Keep these overlays separate:

| State | Visual language |
| --- | --- |
| Permanent route geometry | Muted pastel tracks with thin cream outline |
| Current proved point alignment | Solid pale blade/connected segment; unselected leg has a short gap/dim section |
| Selected route preview | Dashed amber/cyan path and named endpoints; no reservation or authority |
| Proving/reserved route | Bounded route indication plus “Proving”/“Locked” text |
| Physical occupancy | Coral/amber section fill and train identity; not inferred from a preview |
| Closure/protection | Cross-hatch or × marker and an explicit label |

Changing a point must not recolour the entire route as if it were authorised. Locked points retain their alignment and explain which train/path owns them. Refused commands must name the station/point/resource and offer a useful location cue.

## Whole-board composition

The default screen is one continuous, dense network schematic with the trunk running across it, passenger branch above and relief/depot below. The map should dominate the page. Avoid replacing it with a pair of large station cards, a tab-only view or a string of oversized track buttons. Photographic density comes from several interconnected paths, repeated tiny fixed identifiers, vertically stacked number windows and compact station fans.

Use cream location names, small station code labels, two or three subtle station-status lamps, square track numbers and dark raised number windows with restrained magenta/red text. Prefer horizontal segments and short diagonal fans over long sweeping curves. Dark green/slate blue metal and pale framing preserve the existing room's material language; the original board's apparent brightness is affected by museum lighting and glare, which should not obscure active information.

A compact global header holds clock, Pause, assistance/pace and report count. The selected-train/point tray sits below or beside the map and never replaces its whole topology. The timetable is a supporting running sheet with **the whole service row selectable**, including time and position cells. Its accessible row action must work with keyboard as well as pointer/touch; one tiny train-ID link is insufficient. Selecting a row does not dispatch a train.

## Tablet and navigation

Use a world-coordinate drawing around `1920×1000`, with an initial Fit view that shows all main destinations. Zoom must preserve the selected location; give obvious `−`, `+`, **Fit** and **Locate selected** buttons. Touch panning may supplement those controls. No essential operation should require a pinch gesture or precise manipulation of a tiny turnout symbol.

The tiny point glyph on the fit map can select a control only where hit areas remain unambiguous. The selected-point tray always provides at least 44×44 CSS-pixel Normal/Reverse controls. At a closer zoom, larger map targets may become directly operative. Screen-space targets do not shrink with world coordinates; avoid invisible overlap by deferring dense controls to the tray or a focused local selection list. Tooltips alone cannot identify points on a tablet.

Pan/zoom changes the view, not time or topology. Locate events/selected trains focus the relevant point/section without silently acknowledging, moving or authorising anything. Keep clock/Pause/report access visible while the player looks at a distant branch. Preserve direction/orientation across all camera changes. Reduced motion retains berth/section/direction text and can disable animated camera travel.

## Data-driven renderer and performance boundary

The renderer should consume graph/layout/state data rather than contain station-specific drawing branches. Nodes/ports, polyline edges, labels, signal/berth anchors and point-blade geometry belong to the layout definition. Dynamic reservations, occupancy and selected positions come from simulation state. Timetable rows use service itinerary/location data from the same model.

For this scale, a vector SVG scene with a translated/scaled compositor layer is a sensible first implementation; browser rendering can accelerate transforms without a dependency or custom WebGL engine. Keep accessible HTML controls and labels for actions. A GPU path is useful when it reduces measured rendering work; claiming that SVG guarantees GPU acceleration or adding shaders for a few dozen rails would not establish that benefit. Avoid redrawing the whole app every animation frame; update train/route/point layers where practical. Profile before changing render backends.

## Acceptance for the actual replacement

The complex board replaces the earlier simple layout **inside the network shift**. Keep the classic/network entry choice, all four classic shifts and their saves intact. A completed complex network journey must still offer a clear route back to classic play. Generalising the network renderer must not silently replace classic gameplay or its controls. Verify the exact network-save revision/migration policy separately in the final architecture/QA notes.

Design signoff requires a visibly complex continuous board; actual branch/crossover alternatives and at least three destination classes; selected point positions changing the drawn connected path; source/destination/required-point context in route confirmation; whole-row timetable selection; readable Fit/zoom/Locate; and a completed branch/depot service through the actual command path. QA must distinguish a data-driven rendered graph from painted decorative complexity. Child comprehension, real Android ergonomics and maximum sustainable workload remain untested without corresponding playtests.

## Actual authored graph

Inspected `app/network-data.mjs`, `app/network-paths.mjs`, `app/network-renderer.mjs` and the production interface. The source validates a graph with **94 nodes, 104 edges, 25 points and 65 resources**, laid out in a `2400×1120` coordinate space. The renderer consumes that data and live state; it does not contain a separate station-specific drawing for each place.

| Location | Actual berths |
| --- | --- |
| Mizuno | 2 platform tracks |
| Kawara Junction | 3 tracks |
| Higashi | 3 tracks |
| Ume Town | 2 passing tracks |
| Kitayama | 2 passing tracks |
| Freight Depot | 2 reception tracks and 2 terminal sidings |

The boundaries are `boundary:kyoto`, `boundary:nara` and `boundary:north`. Parallel alternative trunk links join Mizuno/Kawara and Kawara/Higashi. Their shared station fan/point resources can serialise movements, so the presence of two drawn links is not a claim of independent double-track capacity throughout the district. The northern branch and depot relief are real graph connections, not static background art.

The seven authored services exercise distinct destination/path classes: `301` and `402` traverse the trunk in opposing directions; `311` reaches the north boundary through Ume/Kitayama; `412` comes from the north towards Nara; `F71` terminates in depot siding 1; `F82` uses the depot reception and siding 2; and `421` passes through the depot relief before continuing via Kawara/Mizuno to Kyoto. The pathfinder uses point-position requirements and disallows incompatible normal/reverse use of the same turnout within a single path.

The source layout SVG remains a proposal/reference. Actual graph coordinates, names, counts and valid route options come from production data, rather than that static drawing.

## Rendered design acceptance

Reviewed actual desktop and 1024×768 tablet captures of Fit and a located reverse point. The final tablet Fit map is full width, with a retractable nonmodal control tray. Its thin outlined rail segments, compact station fans, vertically stacked dark number windows, pastel branches and cream/slate palette follow the museum's diagram grammar. The entire trunk, north branch, relief and sidings are visible together; named location views are optional camera shortcuts rather than separate railways.

The review found and corrected four material presentation issues before signoff: a narrow tablet map beside a permanent tray; a CSS font rule defeating the intended station-label floor; long duplicate point IDs cluttering the rails; and hit-target collision handling that displaced a point label far from its location. The final renderer uses a true screen-size station-label floor, compact data-defined `P01`–`P25` display labels, clustered 44-pixel targets and leader lines to their actual anchors. Fine detail appears at closer zoom. Selected point `P17` was inspected in Reverse: the lower physical connection is bright, the other leg dims, and the separate named position control reports the same proved state. This change is visible without an active route preview.

The whole service row is selectable, including timetable time/position cells, with visible selection and Enter/Space handling. Selecting does not set a route. The operational tray provides route alternatives, required points, an explicit batch alignment command and a separately revalidated confirmation. Full point names and Normal/Reverse controls remain available at readable touch size even when the Fit map uses small glyphs.

QA reports a complete Guided/Steady touch journey at 1024×768: **29 confirmed movements, seven completed services, score 100, all seven on time and two freights parked**, completed at 391 railway seconds. The journey acknowledged both work reports and explicitly released protection. Final reservations and active events were empty; occupancy remained exactly the two parked freights in their assigned sidings. Actions used rendered taps and normal application timer callbacks; a read-only planner selected legal candidates. The independent [complexity UX review](complexity-ux-review.md) and [QA report](qa-report.md) own detailed interaction, regression and save observations.

No design blocker remained after the final rendered review. This is browser/emulated-touch evidence, not a child playtest, physical Android performance result or historical operating certification. Rendering uses SVG and compositor viewport transforms without a new dependency or custom GPU engine; no measured GPU-speed claim is made. The classic four-shift game remains an accessible, separately saved product path alongside this complex network shift.
