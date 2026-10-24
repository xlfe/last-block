# Control-room game acceptance plan

The release target is a local, browser-based railway-control game for ages 8–16, playable with touch alone on an Android tablet and with pointer or keyboard on a desktop. Easy and harder modes should teach the same safety principles with different guidance and pressure. This plan is independent of implementation details; only mechanics actually shipped will receive a passing result.

## Historical and educational boundary

- Identify the railway district, route tables, timings, incidents and sounds as authored reconstruction where the dossier does not establish their historical operation.
- Use the local photographs and traceable dossier references in an accessible reference view. Do not combine Nara, Shinkansen and cab apparatus into an allegedly exact original control centre.
- Keep requested action, proved authority, track occupancy and train identity visibly distinct.
- Explain a refusal in operational language. Refused unsafe commands cause a learning opportunity and delay, rather than a collision spectacle.

## Meaningful behaviour checks

| Area | Acceptance check |
| --- | --- |
| First play | A child can choose a mode, start the first shift, understand the current goal and complete its first meaningful action without hover or keyboard input. |
| Safety | Two opposing trains cannot obtain incompatible authority into the same single-track section, even after repeated rapid commands. |
| Proving | A requested route is proved and locked before a train moves; unavailable points or unknown detection refuse authority. |
| Occupancy | Occupied track cannot be reused before the train has physically cleared it. Identity or timetable edits do not remove occupancy. |
| Fault recovery | Acknowledging a call or alarm does not repair a fault. Generator start, proof and load transfer are separate if power recovery is included. |
| Protection | A protected worksite refuses ordinary routing until explicit release conditions are met, if worksites are included. |
| Pause and speed | Pause freezes simulation time and train motion; faster speed changes time rate without weakening safety checks. |
| Progression | Completing a shift records a result and unlocks the intended next shift. Locked stages cannot be selected by ordinary UI actions. Replay and switching modes do not corrupt progress. |
| Save/resume | Reload preserves the durable state advertised by the interface. A resumed live shift starts paused or safely explains its state. Invalid saved data recovers without a blank page. |
| Easy/harder | Easy guidance remains understandable; harder mode measurably changes prompts, workload or timing while preserving safety rules. |
| Reference | Photographs load locally with useful descriptions; reference/help opens and closes without losing the shift. |
| Audio | A deliberate sound gesture starts an audible-level reconstructed soundscape or explains a blocked/unavailable audio context. Muting stops output, the preference survives reload, and restoring a suspended context works from a user gesture. Audio changes do not advance a paused railway or alter train, route or campaign state. |

## Browser interaction and layout

Check representative desktop (1440×900), tablet landscape (1024×768), tablet portrait (768×1024) and narrow portrait (390×844) viewports. Inspect actual rendered bounds as well as screenshots. The page must not acquire unintended horizontal scrolling; the diagram may scroll only if clearly indicated and all operations remain reachable.

- Every essential action is an actual labelled button or equally accessible control. Targets should be at least 44×44 CSS pixels, with adequate spacing and no hover-only instructions.
- Route selection and confirmation work by tap/click without drag gestures, precision pointing or physical keyboard entry.
- Scroll, opening/closing panels and rotating between viewport shapes retain the selected train and current task.
- Dialogs have a visible close control, readable content, appropriate focus handling and fit within the viewport.
- Status is communicated by text/shape as well as colour; motion and sound have usable controls where included.
- Keyboard users can reach and activate primary controls with visible focus. No uncaught browser errors, missing required assets or failing local requests.

## Evidence and limitations

Use deterministic Node behavioural tests where the simulation exposes an importable API; use the existing Playwright MCP browser for the rendered game. Keep the final report in tracked source documentation; generated screenshots, recordings and other output remain local and untracked. Record viewport sizes, tested journeys, exact check commands and any unresolved defect. For audio, distinguish WebAudio context state and measured signal from human verification of speaker output. Desktop viewport resizing and emulated touch are supporting evidence, not a claim of testing real Android hardware. A real Android Chrome check remains a handover item if no device is available.
