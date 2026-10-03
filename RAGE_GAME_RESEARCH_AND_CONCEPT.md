# Master Rage Bait: research and mobile concept

Research date: October 2, 2026.

**Direction update:** The user wants a beatable game with random, unpredictable events that can end an attempt. [MVP_SPEC.md](MVP_SPEC.md) now defines the proposed implementation. The original fixed-trap and campaign-first suggestions below are superseded where they conflict with that specification.

## Recommendation

Build **One More Floor** (working title): a portrait, one-thumb platformer where a spring-loaded delivery robot climbs a tower that actively tries to embarrass it. Its job is to deliver a tiny parcel to the penthouse. Each floor introduces a learnable trick, and each mistake can send it tumbling through floors it already conquered.

The promise: **“One thumb. One delivery. A building that wants you to fail.”**

This is a researched design proposal, not a playable build. The project folder was empty at the start. Rankings below reflect usefulness as design references for this mobile concept, not a verified worldwide popularity or revenue leaderboard. Source descriptions support the mechanics; the lessons, ranking, and proposed adaptations are our design judgments. No hands-on playtesting was performed for this research.

## Ten strongest references

| Rank | Game and source | Relevant characteristic | What our game takes | What needs adaptation |
| --- | --- | --- | --- | --- |
| 1 | [Getting Over It with Bennett Foddy](https://store.steampowered.com/app/240720/Getting_Over_It_with_Bennett_Foddy/) | Physics climbing, severe progress loss, commentary | A visible vertical journey, memorable falls, commentary tied to failure | Translate mastery to touch; avoid requiring mouse-like precision |
| 2 | [Level Devil](https://poki.com/en/g/level-devil) | Floors, spikes, and ceilings betray player expectations | Short, staged trap reveals and apparently simple exits | Make each trick repeatable so players can learn it |
| 3 | [Jump King](https://store.steampowered.com/app/1061090/Jump_King/) | Hold-to-charge jumps; commitment after takeoff; long falls | Charge-and-release commitment and escalating height stakes | Give thumb-friendly aiming and readable landing surfaces |
| 4 | [Geometry Dash](https://store.steampowered.com/app/322170/Geometry_Dash/) | Rhythm platforming, practice mode, customization, level creation | Rhythmic hazards, practice, visible personal progress | Use rhythm in selected rooms; keep the main game a deliberate climb |
| 5 | [TrapAdventure 2](https://apps.apple.com/us/app/trapadventure-2/id1110037150) | A deliberately difficult retro mobile platformer built around traps | Surprise followed by the pleasure of outsmarting a trap | Keep surprise penalties short in the introductory campaign |
| 6 | [Super Meat Boy](https://store.steampowered.com/app/40800/Super_Meat_Boy/) | Precise reflex platforming, escalating challenges, many compact levels | Tight obstacle sequences and fast retry pacing | Fit difficulty to one input scheme rather than importing multi-button movement |
| 7 | [Pogostuck: Rage With Your Friends](https://store.steampowered.com/app/688130/Pogostuck_Rage_With_Your_Friends/) | Pogo momentum, power boosts, shared climbing, rankings | Springy character motion and social comparison | Start with ghost runs; live multiplayer greatly expands scope |
| 8 | [That Level Again](https://play.google.com/store/apps/details?id=ru.iamtagir.game.android&hl=en) | A familiar room with different solutions | Revisit a recognizable floor with a new, hinted rule | Teach rule changes clearly; avoid obscure device tricks |
| 9 | [A Difficult Game About Climbing](https://store.steampowered.com/app/2497920/A_Difficult_Game_About_Climbing/) | Physics arm climbing and persistent fear of falling | Tension at the edge of safety and occasional recovery opportunities | Use landing and rebound surfaces instead of a separate arm-control system |
| 10 | [The Impossible Game](https://store.steampowered.com/app/251630/The_Impossible_Game/) | One-button obstacles, soundtrack timing, restart-on-error, practice checkpoints | Minimal input and readable timing tests | Add tower personality and authored surprises to distinguish the concept |

The PC references are included for their mechanics, not because all are native mobile games. The cited Steam pages describe those editions; Steam Remote Play on Phone does not establish a native mobile release. TrapAdventure 2's App Store page, That Level Again's Google Play page, and Level Devil's Poki page provide direct mobile context.

## What makes the combination coherent

Use one movement system throughout: aim, charge, release, bounce, land. Everything else changes the obstacle or stakes. Do not switch between hammer controls, arm climbing, auto-running, and pogo controls as unrelated minigames.

The emotional loop is: an obvious goal → confident attempt → understandable betrayal → quick recovery or retry → learned counterplay → earned success → a harder temptation.

The revised design uses stable movement with randomized events from a tested pool. Players cannot memorize which trap will appear on the next attempt. They can learn movement, recognize event behavior, and improve their response. Each allowed event combination must have a verified completion route; see the MVP specification for selection and validation rules.

## Character and world

A small delivery robot on a spring leg carries an absurdly delicate package. The tower's building-management AI acts like an excessively cheerful concierge. Floors are themed around everyday annoyances: lobby turnstiles, laundry machinery, office printers, a fitness studio, rooftop ventilation.

The concierge jokes about what happened, with a cooldown so commentary does not repeat on every failure. Examples: “Your parcel is now on a lower floor.” “Excellent. You have discovered gravity.” Let players mute it. The robot's squash, spring wobble, and stunned face make failures readable without needing lengthy dialogue.

## Mobile controls

- Portrait orientation, one thumb, touch area below the main action.
- Touch and hold while grounded to charge the spring; drag horizontally to set launch direction; release to jump.
- Show a clear direction indicator and charge state. Test a short trajectory preview against an angle-only preview before choosing difficulty.
- No steering after launch in the first prototype. Landing resets the jump. Slanted and elastic surfaces can cause a rebound.
- Clamp input to useful ranges. Do not require touching the character, which would obscure landing targets.
- Pausing, backgrounding, and interruption must freeze and preserve the current run. Returning from a call must not cause a fall.

The movement should be predictable, with humorous secondary animation. Excessive ragdoll randomness would make precise control feel unreliable.

## First five floors

1. **Lobby:** three generous landings teach charge and direction. The exit platform retreats when crossed at speed; pausing on the approach reveals the timing.
2. **Laundry:** a clearly marked elastic surface rebounds the robot. Learn to launch with less charge and use the rebound to reach a higher ledge.
3. **Office:** two copier platforms alternate to an audible and visible beat. A short jump at the right time succeeds.
4. **Same lobby, new policy:** familiar geometry returns. A sign says “Exit opens for outgoing deliveries”; a nearby parcel switch now controls the door. The layout is familiar, but the solution changes.
5. **Penthouse preview:** a visible fragile platform offers a fast shortcut while a longer route is safer. Failure drops the robot past its previous best-height marker. In training, a catch ledge limits the loss; the later challenge tower removes that safety.

Trap states reset consistently when restarting a floor. Any floor with multiple states must communicate the state through animation, sound, or signage. Essential cues must work with sound muted.

## Progression and modes

**Campaign first:** short authored sections with reliable checkpoint floors. Aim for meaningful play in 2–5 minutes, with exact suspend/resume support. Players learn the movement and trap vocabulary here.

**Tower challenge later:** a continuous climb with greater fall penalties and few or no checkpoints. Unlock it after introductory mastery. Keep best height and cosmetic unlocks even when position is lost.

**Daily challenge later:** everyone receives the same authored or validated course and competes on completion time and falls. It must be reproducible, not an untested random layout.

**Friend challenges later:** send a course identifier and score; compare against a ghost. Separate practice and assisted scores from unassisted challenge scores.

Campaign checkpoints and punitive tower falls serve different players. Put them in separate modes so the rules stay clear.

## Signature feature

The building remembers how it embarrassed you. A failure at a named landmark can produce a small commemorative sign on a later attempt: “Delivery attempt 12 landed here.” A personal height marker and ghost show improvement even before completion.

On demand, a replay of the last launch and fall could become a short shareable clip with a floor name and challenge link. This is a distribution hypothesis, not evidence that players will share or that the game will go viral. Replay export belongs after movement validation.

## Scope for the first playable test

Build five floors, one robot, one control scheme, three hazard families, one checkpoint system, a timer, a best-height marker, and pause/resume. Placeholder art is sufficient. Include a fast restart, optional commentary text, and a simple practice option.

Leave live multiplayer, a public editor, accounts, cosmetics store, daily content infrastructure, replay video export, and a large campaign for later. Geometry Dash's editor is a valuable longevity lesson, but community tooling and moderation are a substantial project of their own.

## Validation before expanding

Test on physical phones with 10–15 people, including casual mobile players and fans of difficult platformers. This small test is directional, not statistical proof.

Record: time to first successful jump, accidental releases, retries after the first surprise, improvement over attempts, voluntary replay after clearing the section, and quitting points. Ask players to explain the last failure and whether another attempt feels achievable.

Proposed decision gates, to be revised after observing players:

- Most testers execute the basic jump without coaching within 30 seconds.
- At least 7 of 10 retry voluntarily after the first trap.
- At least 7 of 10 can explain the cause of their last failure.
- At least 5 of 10 voluntarily start another run after completing the prototype.
- No lost run or uncontrolled movement after backgrounding and resuming.

If players blame controls, fix input and collision behavior before adding content. If they understand traps but refuse another attempt, reduce repeated travel or strengthen recovery opportunities. If players enjoy clearing it but do not replay, test routes, timing goals, and friend ghosts before increasing difficulty.

## Monetization hypothesis

Start with a free introductory section and test a one-time full-game unlock. Cosmetic robot shells and parcel designs are a later option if players care about the character. Any price needs a real willingness-to-pay test.

Keep retries immediate. Ads after each death and paid rescues would interfere with the central mastery loop. The game's challenge should create the frustration; purchasing should not be required to undo deliberately manufactured friction.

## Next development decision

Prototype the one-thumb spring jump and the lobby trap first. Only expand to the other four floors after it feels accurate and players voluntarily retry. This validates the game's foundation before committing to an engine-specific production plan or a large content pipeline.
