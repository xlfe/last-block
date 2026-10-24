# Research to game handover

Prepared 23 October 2026 from the existing local dossier and photographs. This document selects production-relevant findings; the [research index](../research/README.md) remains the detailed evidence source. Proposed interactions are specified in [game design](game-design.md).

## Inspection and provenance

Read the equipment chapters, operating-principles chapter, simulator foundation, translation glossary, unresolved-question register and source catalogue. Inspected all 34 photographs together through the three existing local contact sheets, then opened P03 and P12 at larger size to check the route-control construction and Nara board. Contact sheets support broad composition; they are not sufficient to independently verify every small inscription. No new independent transcription of tiny labels is claimed here.

| Local reference | What was inspected | Production use |
| --- | --- | --- |
| [Contact sheet 1](../research/figures/contact-1.jpg) | P01–P12, power/route desk, number editor, communications and early Nara board | First room's control grouping, materials and route-board grammar |
| [Contact sheet 2](../research/figures/contact-2.jpg) | P13–P24, remaining Nara board, Shinkansen board and charts | Distinguish single-track district from later high-speed scope |
| [Contact sheet 3](../research/figures/contact-3.jpg) | P25–P34, charts, driving cab and cabinets | Paper document appearance and future cab/material references |
| [P03 original](../images/PXL_20261023_062936196.jpg) | Large view: Shinden/Uji/Kohata/Momoyama/Inari station columns | Cream square buttons between metal rails; arrows; yellow selectors; asymmetrical groups; worn/pasted notices |
| [P12 original](../images/PXL_20261023_063018289.jpg) | Large view: Shinden/Uji/Ōbaku board | Two/three-track station geometry, raised number-window frames, station status lights, pastel paths, magenta numerals |

Original identities, sizes and hashes are in the existing [image manifest](../research/image-manifest.json). The [photo catalogue](../research/photo-index.md) links each original and individual description. Photographs and local derivatives were read within the shared project; no images were sent to a third-party service. No new external research was needed for this design selection, and no claim is made to have rechecked the dossier's external URLs live.

## Strong findings and their limits

| Finding | Evidence | Consequence for the game | Boundary |
| --- | --- | --- | --- |
| The collection depicts separate apparatus families | [Evidence chapter](../research/01-evidence-and-design.md), P01–P34 | Start with Nara-inspired dispatch; add Shinkansen/cab separately | Do not present one fictional room as the original installation |
| Historical Nara board has single-track links and passing places | [Nara board](../research/03-nara-track-display.md), P09–P15 | Opposing meets are the central accessible puzzle | Exact route directionality and route tables remain unknown |
| Route controls sit in repeated station groups | [Desk ND01/ND05](../research/02-nara-control-desk.md), P02/P03/P07 | Group actions by station; keep repeated geometry | A two-tap selection is an authored interaction, not a verified original button sequence |
| Commands and proved state differ | [Operating principles](../research/07-operating-principles.md), local RTRI references S09/S10 | Show setting, locked and occupied separately | Exact timers, approach locks and historical circuit sequence are not established |
| Number windows and occupancy are different functions | Desk ND08 and board NB04, P04/P12/P13 | Moving/renaming a card cannot clear occupied track | The original berth stepping algorithm is unknown |
| Communications has station selection and incoming-call columns | Desk ND09, P05/P06 | Phone calls deliver reports and priorities | Sound, call wording and procedure are authored |
| Generator and load changeover are separate | Desk ND03, P01/P08 | A later recovery puzzle needs start, proof and transfer | Not traction power; exact electrical timing/topology is unknown |
| The Shinden warning describes a local exception | Desk ND07; [local crop](../research/crops/shinden-notice.jpg) | Later shunting story can link a notice, call and crossing warning | Do not invent an operational bypass or assert a verified field procedure |
| Paper charts are genuine working diagrams | [Timetable chapter](../research/05-timetable-diagrams.md), P22–P27 | Show planned movement and altered running, with handover notes | 2013 chart dates do not date the control desk; full train transcription is absent |
| Equipment was altered and maintained | P03/P07/P14/P16–P21/P33/P34 | Use a few pasted labels, blanks, repairs and restrained wear | The photographs do not date every alteration |

The existing dossier's [sources table](../research/sources/README.md) separates museum, RTRI, operator and manufacturer support. Seven local RTRI PDFs and their hashes are preserved under `research/sources/`. That table is the attribution route for inherited engineering claims; this design does not promote an unverified manufacturer identification or unread source into a fact.

## Visual findings

The Nara desk face appears muted slate/blue-green, with a paler metal surround. Cream rules divide the surface; small faceplate legends coexist with larger pasted paper names. The short yellow selectors and long ivory power handles differ clearly in silhouette. Route buttons have cream translucent faces, slight ageing and metal retaining rails. Unknown/blank positions remain visible; stations are not perfectly uniform. [P01–P08](../research/photo-index.md)

The Nara board places generous blank space around a low horizontal schematic. Pastel pink, purple, blue, green and yellow strokes have thin pale outlines. Small circular jewels and numbered track boxes sit beside the paths. Train-number windows are dark, raised rectangles; illuminated examples use magenta/red numerals. The game can compress the empty space for tablet legibility while preserving its calm, repetitive geometry. [P09–P15](../research/photo-index.md)

Shinkansen panels are visibly denser, with two long running lines, many small sections and supplementary bands. This suggests a satisfying later increase in scale but would overload the first lesson. The turquoise driving cab, cream meters and scuffed equipment cabinets are useful material references; they do not imply the dispatcher should also drive the first district's trains. [P16–P21/P28–P34](../research/photo-index.md)

Photographic glare is an obstacle to reading evidence, not a visual effect to bake over active controls. Museum acrylic covers, visitor signs, digital camera/monitor and antimicrobial sticker are contemporary exhibit additions. Keep active type sharp and status lamps state-driven. No original audio, exact lamp spectra, flash timings or measured room plan is supplied.

## Language and historical framing

Use “inspired by historical Japanese railway control rooms” or “a fictional analogue railway district”. The desk's precise commissioning/retirement date is not established. Neither “early Shōwa” nor an exact 1972/2013 setting follows from the supplied evidence. The preserved Nara topology should not be silently replaced by the present-day railway.

Preferred English product words: **route** (a protected path), **points** (the switch that changes a path), **section** (a protected stretch of track), **platform/track** (a station berth), **hold** (wait at the station), **request** (ask the system to set a route), **occupied** (a train is still present). Start with these meanings before introducing CTC, interlocking or local signal IDs.

The local [glossary](../research/09-translations.md) establishes 新田 as **Shinden** in this station context and 木幡 as **Kohata**. The Nara chart companion title 山陰 is **San’in**, despite the museum card's conflicting English “Sanyo”. The cab's guarded red 保護接地入 button means “apply protective earthing”; it is not labelled an emergency brake. Avoid using ambiguous photographed numbered keys (`70R`–`75R`) as invented historical controls.

## Deliberate design freedoms

The district topology, finite train roster, compressed travel times, beginner hints, character names, dialogue, music, score and completion conditions are inventions. A button sequence of train → destination → request is chosen for accessible touch play. Readable colour/shape/status labels may differ from unresolved historical lamp meanings. Explicit separation allows strong visual authenticity without presenting guesswork as operating instructions.

The unresolved register is a scope boundary, not a blocker: [research/10-open-questions.md](../research/10-open-questions.md). Seek original manuals and route tables only if a later release claims exact historical reconstruction.
