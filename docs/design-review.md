# Independent design acceptance review

Reviewed 23 October 2026. This review covers product design and source/evidence agreement; [QA report](qa-report.md) records behavioural and browser checks. No child playtest or physical Android-device test was performed.

## Evidence examined

Reviewed the actual `app/app.mjs`, `app/sim.mjs`, HTML and CSS, rather than only the proposed design. Independently reran the eight domain acceptance tests successfully. Inspected QA's local screenshots of the desktop welcome, desktop/tablet first briefing, tablet first result and landscape/portrait live desk. Browser interactions remained with the QA agent to avoid session contention.

| Area | Assessment |
| --- | --- |
| Visual authenticity | Pass for a researched interpretation. Cream/green enamel surfaces, framed dark train-number windows, repeated square controls, paper timetable and the actual museum photograph form a coherent workplace. It does not claim exact hardware behaviour or an established historical date. |
| Modern presentation | Pass in inspected desktop/tablet screenshots. Restrained typography, clear selected service, focused grouping, pressed-button depth and readable paper/board contrast give the desk polish without excessive ornament. |
| Younger-player explanation | First briefing explicitly defines points as track switches, teaches one arrival/departure and explains that the driver moves the train. State hints make waiting, boarding and locks discoverable. This is a reasoned design assessment, not evidence that an eight-year-old completed it independently. |
| Progression | Four finite scenarios introduce one local, opposing trains, work protection and standby supply. Shift unlocks and debriefs make progress concrete. Guided/Dispatcher change hints, time rate and scoring; they do not claim dynamically generated difficulty or separate traffic rosters. |
| Narrative | Appropriate modest first slice: Aki's mentor voice and functional foreman/electrician calls. The game has desk/document attention and causal communication puzzles. It has not yet delivered the broader comic character adventure suggested by the inspirations. |
| Research agreement | Pass. Nara references are local and visible in the museum view. Unknown numbered keys are not given invented historical functions. The district, times and operating rules are labelled fictional; Shinkansen/cab apparatus is not merged into an alleged original room. |

## Bounded findings sent to the builder

1. Match the first tutorial's “Resume the clock” instruction with the actual start state. A paused Guided opening gives a younger player time to orientate.
2. Show movement/progress during the route's travel interval. A number jumping straight into the platform at request time can obscure the important distinction between requesting a path, travelling and arriving.
3. Keep a clear route back to the handover after opening its journal, so a completed desk does not lose its obvious next-shift action.

All three are now present in the final source: Guided starts paused; the board has a moving marker with a percentage; and the completed desk exposes **View handover**. The marker follows the drawn horizontal/diagonal route, and simultaneous movements have separate progress-label positions. The builder reports QA has retested the main changes; the QA report is the record of browser observations. QA separately reported small secondary touch targets and modal-focus behaviour; their final status belongs in the QA report.

The long first briefing requires scrolling at tablet landscape size. Its content is useful and the dialog is scrollable; keeping the action visible while reading would be a future usability refinement rather than grounds for a visual redesign.

## Scope agreement

[Game design](game-design.md) now reflects the actual three-location district (one passing station plus two boundary holds), explicit point-setting sequence, four scenario subjects and current mode differences. Richer characters, passenger-connection stories, weather, train-number editing, separate speed selection and a route-preview confirmation remain proposed scope. Do not describe these as shipped.

The first release meets the intended visual and learnable-mechanics direction, subject to the final QA findings. Its narrative is a restrained foundation for the larger adventure-game ambition. The clearest next content step is a short call whose personal story changes a train-priority decision, followed by a debrief that describes that consequence.
