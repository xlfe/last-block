# Complexity UX review

Reviewed 24 October 2026. The shipped connected shift passes this review, with the device and playtest limits below. It adds two stations/districts and one shared single-track link; the larger network ladder remains a design proposal. The four original shifts remain available.

## Acceptance and observed evidence

The extension increases responsibility without shrinking the working controls. Guided assistance pauses once per important report; Independent assistance continues running. Steady/Brisk pace is a separate setting. Changing these settings on a live saved railway retained its routes, reservations and point positions. This supports different experience levels without an age lock; its suitability for children remains a playtest question.

| Area | Observed result |
| --- | --- |
| View versus operation | The persistent strip names both districts and shared-link state. The active board, selected service and preview name their locations. A transfer preview names both stations/tracks and both required point groups. Switching district retains the selected service but clears the unconfirmed preview. |
| Physical controls | On-board selectors combine a decorative lever with discrete native Track 1/2 buttons. A keyboard Space press changed the chosen point and retained its correct control focus. No rotation gesture, drag, simultaneous press or precise lamp tap was needed. These are authored controls, not a claim to decode unknown museum selectors. |
| Touch density | No rendered button was below 44×44 CSS pixels in checked 1440×900, 1024×768, 768×1024 and 390×844 layouts. Desktop and both tablet layouts had no horizontal overflow; the narrow fallback also passed that check. |
| Attention outside the view | Sticky Reports, Services, clock/Pause and district targets remained reachable while operating a lower preview. Locate revealed and focused the named board below the sticky strip without acknowledging the report or changing time/run state. Acknowledged protection remained unresolved until its explicit release. |
| Timing | Reports continued advancing the global railway in Independent mode. Guide/close left the entire railway paused until Resume. Model checks confirmed navigation does not create a separate clock and Guided pauses once per important event. |
| State readability | Clear, reserved, occupied and protected states use labels, line/border patterns or symbols as well as colour. Train identity is shown alongside occupancy/reservation text. Unknown detection refuses authority in the model; a dedicated unknown-detector incident/presentation was not exercised in this shift. |
| Focus and task continuity | District navigation retained focus on the correct district. Selecting a service from the compact picker returned focus to Services. Required-point focus stayed in the preview rather than jumping to its duplicate on-board control. A stale confirmation disappeared after district change. |
| Responsive operation | At 1024×768 a transfer preview's two point buttons and Confirm were visible together; Confirm occupied y=684–730, below a 128-pixel sticky strip. At 768×1024 the stacked preview also kept Confirm visible at y=929–979. Long timetable/report details still scroll; this is not a claim that the entire railway fits on one screen. |

## Behavioural evidence

`npm test` passes 23 checks: 14 existing railway/audio checks and nine new checks in `tests/network-acceptance.test.mjs`. The new checks cover opposing link ownership through proving/tail clearance, occupied/protected receiving berths, the authored exchange-berth guard, read-only/stale previews, navigation/global time, persistent protection and one-time Guided pauses, live snapshots/corruption rejection, and complete six-service operation with naturally retired routine notices. `npm run check` passes.

In a clean Chromium touch context at 1024×768, the full Guided/Steady shift completed through the rendered controls: 18 confirmed arrival/transfer/exit paths, six trains stopping at both stations, all on time, score 100 at 245 railway seconds. Both work reports were handled and protection released. No unresolved notices or uncaught page errors remained. Browser-clock advancement ran normal application callbacks; only planning used read-only saved state, with no injected route commands.

A separate live-transfer snapshot restored its link/point locks and best score, paused at 07:00:47; ten seconds of browser-clock advancement left it frozen. Changing assistance/pace preserved the active resources. Malformed JSON, incompatible content and missing-point saves each showed a usable fresh-network warning while preserving classic records. A seeded classic active save remained byte-for-byte unchanged throughout the complete network journey; all four classic shifts and their records remained available afterwards.

The review prompted corrections for exchange-berth gridlock, incomplete save validation, obsolete routine notices, tablet alert access and deep-scroll Locate/focus. Their bounded regressions or browser retests pass. Generated screenshots remain local and untracked.

## Remaining limits

No child playtest or physical Android tablet was available. The automated 100-point journey demonstrates reachability, not intuitive comprehension or fair workload for an eight-year-old. Larger networks, extra disruptions, automatic routing and simultaneous decision budgets need further authored scenarios and playtests. The full browser journey used Guided/Steady; Independent reports and settings were checked separately, rather than repeating the entire campaign in every combination. Physical dial operation, screen-reader use, speaker output and tablet performance were not assessed. These tests do not certify a real railway interlocking.
