# First playable validation

October 2, 2026. This folder contains screenshots and the browser report for the first playable Edge Case prototype.

- `npm test`: all 27 request/variant/surprise combinations have executable completion routes. The search includes actual charge duration, fixed-step collisions, spring rebounds, moving hazards, and patch triggers. Each discovered route is replayed twice to verify identical outcomes. Inputs are saved in `tests/completion-routes.json`.
- A temporary headless Chromium browser completed three builds using the actual launch-pad pointer events, then activated Ship. It also checked keyboard charging/release, replay identity, pointer cancellation, pause, local best persistence, and mobile horizontal overflow.
- Mobile screenshots use a 390 × 844 CSS-pixel viewport. Desktop rendering was checked at 1280 × 1000. Screenshots were visually inspected for legibility and placement.

The game has not been tested on a physical phone or in Safari. Completion evidence establishes playable paths, not tuned difficulty, enjoyment, or originality certification. The native-app build, sound, and production sprite animations are not part of this browser slice. Reloading starts a new run; hiding or leaving the tab pauses the current one.

Optional browser check: `tests/browser.test.mjs` uses a temporary Playwright install at `/private/tmp/edge-case-browser-check`. To reproduce elsewhere, set `PLAYWRIGHT_MODULE` to an installed Playwright ESM entry point and configure `PLAYWRIGHT_BROWSERS_PATH` if using a non-default browser download location. The game itself has no npm dependencies.
