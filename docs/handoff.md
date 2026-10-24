# Local handover — 24 October 2026

The Last Block is playable as four classic shifts plus a complex six-location graph network shift. See [README](../README.md) for launch commands and the first-minute walkthrough, [architecture](architecture.md) for the simulation boundary, and the [QA report](qa-report.md) for observed evidence and device limits.

Final verification: `npm run check` passes; `npm test` passes 27/27 railway, graph-topology, connected-network and audio behavioural checks. Touch-emulated Chromium completed all four Guided shifts through the public interface, including work release and standby recovery. The expanded Guided network also completed all seven services through 29 touch-operated movements, scoring 100 with two freights parked; a fresh classic First bells and Next shift flow passed. No blocking defect remained. Physical Android, child comprehension, screen-reader use, audible sound output and genuine browser background transitions were not verified. The owned preview server has been stopped. No dependencies were installed and nothing was deployed.

## Git status

The commit contains source, Markdown, tests and three required original photographic inputs; generated output is excluded. The configured `core.hooksPath`, `/home/user/linux-dotfiles/git-hooks`, is unavailable in the sandbox. After the initial staging-only handover, the user explicitly authorised committing without those hooks. The commit uses a one-command hooks-path override; persistent Git configuration is unchanged. Hook checks were therefore not run. No push was requested or performed.

Hand-authored app files in `app/`, `scripts/build.py`, `package.json`, game/QA documentation and tests are new deliverables. Generated `dist/`, resized JPEGs, screenshots and browser scratch files are excluded from staging. Three specific original JPEG photographs are included as required build inputs; the rest of the original dossier is excluded. `README.md` was deliberately expanded while preserving its original research introduction. Original images have not been edited. The remaining `images/` and `research/` evidence, environment files and browser profiles are untouched and remain untracked. Browser screenshots remain local evidence and are excluded from source staging.

## Audio correction

The original default-off toggle did not persist and gave no confirmation when enabled. Sound now defaults on after a click/tap, persists mute, and supplies relay, bell, telephone, refusal and handover effects. Enabling plays a test chime; a blocked AudioContext exposes Retry sound. This does not establish audible output through the user’s Linux device; site/tab mute and OS output routing remain browser/system settings.

The user subsequently confirmed that sound works in their own browser. The automated browser checks establish signal generation and lifecycle behaviour; they do not inspect the user’s physical output device.

## Complex network follow-up

The network shift now has six locations, 25 working points, a northern branch, parallel trunk choices, a through-depot relief loop and two terminal sidings. Seven service itineraries use real graph paths and finish with two freights parked. The whole timetable row selects a service; the selected service's Controls opens its route tray. Prepare points, then Confirm path; selection and preparation grant no authority. The selected connected point leg is visible on the map. Fit/Home and screen-space controls preserve usable overview/detail navigation.

Classic UI, four shift records and save format remain unchanged. Network schema 2 has a separate key; the earlier two-station snapshot stays stored with an explicit restart notice. The renderer consumes declarative geometry and current resource state using stable SVG plus CSS camera transforms. GPU composition is browser-dependent, with no measured acceleration claim. See [graph architecture](graph-rendering-architecture.md), [current design](complex-network-design.md) and [graph QA](graph-network-qa.md).

The source-only follow-up uses the same authorised one-command hooks override. Generated build output, browser screenshots and scratch are excluded. The original local evidence outside the three tracked build inputs remains untouched. Launch with `npm start`; no new dependencies or deployment are involved.
