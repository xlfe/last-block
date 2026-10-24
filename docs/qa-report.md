# QA report — The Last Block

Classic game reviewed 23 October 2026; audio, source-layout and connected-network follow-ups reviewed 24 October 2026. Status: the local release passes the checks below; no blocking defect remains from this review. This report records observed behaviour, rather than treating the design specification as test evidence.

## Deterministic simulation

`npm test` passes all 23 checks: ten classic railway checks in `tests/acceptance.test.mjs`, four audio checks in `tests/sound.test.mjs` and nine connected-network checks in `tests/network-acceptance.test.mjs`. `npm run check` passes the source simulation, interface and sound-module syntax checks under `app/`.

1. A paused railway remains unchanged even when elapsed time is requested.
2. Points must match the route; authority is proved before movement; points remain locked through tail clearance.
3. Opposing arrivals cannot reserve the same station track; rapid repeated point commands retain locks.
4. Reading the work call and receiving the completion report do not release protection. Explicit release is required before routing through Track 2.
5. Opposing arrival/departure routes cannot share the same throat or single-line section before tail clearance.
6. Supply loss retains existing locks. Answering the call does not restore power. Generator start, proof and transfer are distinct.
7. The work shift cannot complete while protection remains active, even after all trains have been sent through Track 1. Answering the completion call and explicitly releasing protection completes the handover.
8. Identical passenger and freight scoring fixtures receive different scores for the same delay, with the passenger delay costing more.
9. Every shipped shift can be completed using legal operator commands in both Guided and Dispatcher modes, checking invariants on every tick.
10. A deterministic sequence of 4,000 mixed commands does not break route exclusion, point alignment or protection invariants.

These checks cover the model's authored railway. They do not certify a real interlocking or establish undocumented historical operation. Unknown detection and identity editing are outside this prototype's implemented mechanics.

## Browser evidence

Used the existing Playwright MCP Chromium browser against `http://127.0.0.1:8080/`, with separate clean contexts and `hasTouch: true` for touch journeys. Interactions used real Playwright taps on the rendered buttons. Playwright's browser clock advanced the application's normal timer callbacks; the campaign driver read saves to choose legal actions, without injecting simulation state or bypassing progression.

| Check | Observed result |
| --- | --- |
| Full touch campaign | Completed all four Guided shifts in order through their actual briefings, desk controls, calls, debriefs and Next shift buttons. Scores: 100, 100, 96, 100. All four campaign records persisted. Work shift handled both calls and released protection; supply shift handled its call and finished on proved standby power. No uncaught page errors. |
| Mode coverage | Both modes complete all shifts in the deterministic tests. Guided opens paused with next-step help. Dispatcher clock and scoring differences were verified by source inspection; a full Dispatcher browser campaign was not repeated. |
| Replay/handover | Read journal after a result, closed it, reopened **View handover**, then replayed. Replay reset railway time to zero and preserved the best campaign record. |
| Live save/resume | Reloaded with two opposing arrival routes locked. Both route states survived. Resume opened paused at 07:00:16 and stayed at that time after ten seconds of browser-clock advancement. |
| Invalid saves | Malformed JSON, an outdated version and an invalid scenario each showed a visible recovery warning and a playable fresh welcome screen. |
| Responsive layout | Checked desktop 1440×900, tablet landscape 1024×768, tablet portrait 768×1024 and narrow portrait 390×844. Document width equalled viewport width. No visible button had a rendered width or height below 44 CSS pixels on the final landscape, portrait or narrow desk. |
| Modal accessibility | Initial modal focused its close button and made the underlying main content inert. Closing a guide→museum journey restored focus to the original Desk guide button and removed inert. The narrow guide fit a 366×812 scrollable dialog within the viewport. |
| Reference assets | All three local museum photographs loaded successfully at 2200 pixels wide. Fictional rules and unresolved historical dates are stated in the interface. |
| Movement feedback | Final tablet screenshots show separate progress labels for simultaneous movements and markers on the drawn rail paths. |
| Browser diagnostics | Final page load had no console errors after the missing favicon was corrected. The complete touch campaign produced no uncaught page errors. |

Local evidence captures covered the desktop welcome, landscape and portrait tablet desks, and the final shift handover. Generated screenshots are omitted from version control under the source-only repository policy; the observations above are the durable record.

The review found and retested corrections for small secondary touch targets, modal focus, the Guided opening clock, route movement feedback, return to the completed handover, and the work-shift completion condition. The original [acceptance plan](qa-plan.md) retains the broader criteria and scope boundaries.

## Audio follow-up — 24 October 2026

The previous source started muted on every load, played only short, quiet tones and gave no confirmation when sound was enabled. These were observed application limitations; they do not establish the user's physical Chrome/Linux audio-device state.

The replacement sound controller was tested independently of the railway. Four Node regressions verify deferred context creation and suspended-context recovery; saved mute, confirmation and cancellation of scheduled voices; rejected-resume recovery; and graceful handling of unavailable audio or preference storage.

Browser checks used actual Chromium WebAudio contexts with observers on destination-connected nodes. The observers measured signal and context state; no speaker, microphone or recording was used.

| Check | Observed result |
| --- | --- |
| Gesture lifecycle | Zero contexts before an initial click. After a deliberate gesture, one context was running. Reload with sound enabled still created no context until the next gesture. |
| Confirmation signal | Enabling sound produced a nonzero analyser waveform with a measured peak of approximately 0.079 in normalised PCM samples. This proves generated signal, not physical loudspeaker audibility. |
| Mute | Muting cancelled output; the analyser measured a zero peak after the active cue cleared. The `off` preference survived reload, and subsequent desk gestures created no context while muted. |
| Suspended context | Suspending the real context exposed **Retry sound**. Clicking it returned the same context to `running`. |
| Failure and retry UI | A deliberately rejected resume exposed **Retry sound**, then recovered to **Sound on** when permitted. Removing AudioContext exposed **Audio unavailable**. Touch interactions still opened a paused desk in both cases; no uncaught page errors. |
| Gameplay isolation | The paused railway save was byte-for-byte identical before and after mute, enable, suspension and retry. Reload restored its paused state. |

The sound test preference survived reload independently of campaign progress. Browser failure cases used controlled API overrides and are labelled as such; an organically blocked Chrome policy was not encountered in this session. The source-only layout was verified by running the fourteen tests and syntax checks against `app/`; reproducible `dist/` output and generated browser captures remain outside the committed source.

## Connected network — 24 October 2026

The new two-district shift passes nine independent model checks for shared-link exclusion, far-berth protection, exchange-berth regulation, preview revalidation, global time, event lifecycle and save consistency. All classic and audio regressions remain green.

A complete Guided/Steady touch journey at 1024×768 confirmed 18 paths and brought all six trains through both stations, then out of the railway. It finished at 245 railway seconds with score 100, six on time, no outstanding reports and no uncaught page errors. Its seeded classic active save and four existing scores remained unchanged. Separate checks covered a live transfer restored paused with its resource locks, changing assistance/pace without changing reservations, invalid-save fallback, Reports staying live in Independent mode, Help remaining paused, district/preview focus and keyboard point operation.

The final layouts passed horizontal-overflow and 44-pixel button checks at 1440×900, 1024×768, 768×1024 and 390×844. Transfer point controls and Confirm fit together on both tablet viewports, with clock/Pause/Reports accessible in the sticky global strip. Locate now reveals and focuses the affected board even after deep scrolling, without acknowledging the report or changing the railway clock.

See [complexity UX review](complexity-ux-review.md) for measured bounds, test scope, corrected findings and remaining playtest/device limits. The implemented increment is two connected stations and one finite shift; larger network proposals are not claimed as shipped.

## Device limitations

No physical Android tablet or child playtester was available. Chromium viewport checks and touch emulation do not establish real-device readability, Chrome browser chrome/rotation behaviour, audio policy, tablet performance or independent comprehension by an eight-year-old.

The headless browser kept `document.hidden` false when another tab was foregrounded, so a genuine background-tab visibility transition was not verified. The pause-on-hidden handler and no-offline-time design were inspected in source; real Android background/resume remains a handover check. No screen-reader session or audible sound-output assessment was performed.

No deployment, live infrastructure change or dependency installation was performed. Git commit status is tracked by the lead separately from these passing application checks.
