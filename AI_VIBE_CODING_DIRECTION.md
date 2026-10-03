# Proposed direction: the AI is shipping the game while you play

October 2, 2026. Concept for discussion, not an implemented game or a verified claim of uniqueness. This is the recommended replacement for the tower-and-clamp concept; do not merge both concepts into a larger MVP.

**Implementation update:** A first playable browser slice now exists in `index.html`, `game.js`, and `physics.js`. See [README.md](README.md) for play instructions and [outputs/VALIDATION.md](outputs/VALIDATION.md) for evidence and limits. The protagonist is Edge Case, based on the approved broken-token concept. This document preserves the original concept proposal; its examples are broader than the implemented content.

## Pitch

**Reach the exit before your AI assistant improves it again.**

You are the little test character inside an unfinished mobile game. An overeager fictional coding assistant keeps publishing fixes to the world you are standing in. It wants to declare the project finished; you want a version you can actually beat.

The antagonist's personality is expressed through physical changes and consequences. Dialogue explains its confidently wrong reasoning. Every major joke needs a playable consequence.

## Core loop

1. Attempt a short obstacle room using one-thumb aim-and-release jumps.
2. At a safe position, choose between two short feature requests: for example, “Make jumping safer” or “Move the exit closer.” No typing or programming knowledge required.
3. The assistant selects one of several authored interpretations of that request. It shows a short claim, then applies the physical patch.
4. Survive or exploit the result. At some progression triggers it also ships an unsolicited fix, which can end an attempt unexpectedly.
5. After a failure, choose to replay that exact build or request a new fix and reroll the patch. Immediate retry is always available.
6. Reach the real exit and press the final Ship button to win. The final commit ends patching and starts a clear win screen.

The same request can produce different results across new builds. Actual collisions, touch controls, and the selected patch behavior remain stable within a build.

## Examples

| Request or AI claim | Physical implementation | Player counterplay |
| --- | --- | --- |
| “Make the exit closer.” | Exit slides toward you, across a previously safe landing | Use the lower ledge and enter from the other side |
| “Make jumping safer.” | A giant safety cushion bounces you dangerously high | Use a shorter launch to land on the cushion's edge |
| “Remove the spikes.” | Spikes vanish, but their supporting platform is also removed | Use the alternate wall landing |
| “Improve performance.” | Decorative fans are removed, including one that provided lift | Use the new ledge created by the removed fan housing |
| “Fixed the falling bug.” | An upside-down catch platform intercepts a fall and redirects it sideways | Time a launch to use it as a shortcut |
| “All tests passed.” | A fake test dummy crosses safely, then the live floor hatch opens for the player | Take the other route; the dummy's success is a joke, not verification |

These are proposed puzzles requiring solvability tests, not already validated routes. Some unsolicited patches may cause immediate surprise death on a committed route, but every selected build must retain an executable completion route.

## Assistant personality

Confident, eager to please, allergic to admitting a regression. Short lines: “I also made a few improvements.” “The exit is now significantly closer.” “The issue appears to be your jumping.” “I have fixed the fix.”

Occasionally it genuinely helps, making trust a decision. Helpful and harmful interpretations are drawn from a tested pool, never generated without constraints. A good patch should not be secretly sabotaged every time.

## Small MVP

One unfinished test room in three successive builds, one test character, one fictional assistant, three request families, and three authored outcomes per family. Start by isolating builds: each transition resets geometry and applies one patch package so nine outcomes can be tested separately. Defer stacking patches and arbitrary combinations.

Add one optional unsolicited event per attempt, chosen at the start from a small compatible pool. Validate the event against every permitted build it can affect. Show short non-blocking patch claims; freeze gameplay during request selection, with no waiting for a simulated typing animation.

Needed systems: mobile movement, patch package application, request cards, seeded variant selection, restart/replay build, event compatibility, pause/resume, local bests, and a real finish. No tower, clamp, live multiplayer, public editor, or API dependency in the first version.

The fictional assistant runs locally using authored behavior. Real runtime AI is a later experiment: dialogue could vary, but physical changes must still select from validated packages. Do not execute model-generated game code on a player's device.

## Distinction and research limits

Self-aware games and code-changing gameplay already exist. [There Is No Game: Wrong Dimension](https://store.steampowered.com/app/1240210/There_Is_No_Game_Wrong_Dimension/) is an adjacent reference for meta comedy. [Hack 'n' Slash](https://store.steampowered.com/app/246070/Hack_n_Slash/) is an adjacent reference for changing game behavior. Tools such as [SuperAstra](https://github.com/ScottStevenson/SuperAstra) also demonstrate AI modifications while games run.

The proposed identity is the combination of mobile execution, player-selected requests, confidently wrong physical fixes, randomized builds, and exploiting the assistant's regression to reach an actual finish. This combination is a hypothesis to develop independently, not proof that no comparable work exists.

First test: can players understand a patch, laugh at its interpretation, and voluntarily request another build after failing? If their description is merely “platformer with a talking AI,” the central mechanic needs more work.
