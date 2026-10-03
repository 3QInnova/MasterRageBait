# Edge Case

A playable mobile-browser prototype about proving a confidently wrong AI assistant wrong. Choose a request, survive its physical fix, clear three builds, and ship the game before PATCH improves it again.

## Run

From this folder, run `npm start` (requires Python 3), then open http://localhost:8000. On a phone on the same Wi-Fi, open `http://<your-Mac-LAN-IP>:8000`. The local server binds to your network so phones can connect; stop it with Ctrl-C when finished.

No packages, AI API keys, or backend are required. Optional Google Fonts fall back to system fonts if unavailable. This is a browser prototype, not a native iOS/Android app.

## Play

Choose one request. Hold the launch pad to charge, drag left or right to aim, and release to jump. The dotted arc shows the initial direction, not the whole flight. Mouse works too. Keyboard: arrows aim; hold and release Space to jump. Click the page background or focus the launch pad for keyboard movement. Pause with the top-right button or Escape.

The spring launches automatically when you land on its middle; its edges are safe. You can fall to earlier platforms. Hazards end an attempt. Replay preserves the same variant and surprise event; asking for a new fix rerolls. Three successful builds unlock Ship. Best completion time is stored locally if browser storage is available. Leaving the tab pauses automatically.

## Scope and assets

Three request families with three physical outcomes each; three possible unsolicited-event selections (including none). Request cards pause the game. The AI is a fictional authored character, not a live model. The Edge Case character is drawn in canvas from our concept: broken cream token, yellow face, offset notch, and a detached turquoise fragment. No generated sprite sheet or competitor assets are used in gameplay.

Concept art lives under `assets/concepts/`. Originality research is in `ORIGINALITY_REVIEW.md`; uniqueness has not been certified. Visual mockups and prior tower/clamp plans are historical concepts, not the implemented game.

## Verification

Run `npm test` to check executable physics routes for all request/event variants, fixed replay behavior, and completion integrity. A discovered route is evidence of a playable path under this prototype's physics, not proof of player enjoyment or physical-phone usability.
