# Master Rage Bait — proposed MVP

Status: design proposal for discussion; no playable implementation yet.

**Latest concept proposal:** Following the user's preference for an annoying AI and vibe-coding satire, [AI_VIBE_CODING_DIRECTION.md](AI_VIBE_CODING_DIRECTION.md) proposes replacing this tower/clamp design with a game whose AI assistant physically patches the level during play. That proposal is the current discussion direction; the design below remains a prior alternative, not additional scope.

**Originality revision (October 2, 2026):** The defining mechanic is now locking one malfunction into a useful physical state. This replaces delivery as the game's central objective. See [ORIGINALITY_REVIEW.md](ORIGINALITY_REVIEW.md) for researched overlaps and limits. The working title One More Floor is retired because existing games use it.

## Core decision

**Beatable, but unpredictable.** A portrait mobile platformer with one-thumb spring jumps, five short floors, and randomized events that can kill the character, knock it down, or change the way to the exit. The player learns to handle categories of trouble rather than memorizing one sequence.

Working concept: **MasterRageBait prototype** (internal label, not a cleared release title). A small spring-driven maintenance creature climbs a malfunctioning building to shut down its fault generator on floor five. It carries one oversized clamp that can turn a malfunction into a useful surface. Design an original silhouette; avoid the usual humanoid robot, pogo rider, pot-and-hammer character, or square avatar.

An event ending the level means ending the current attempt, not completing the level. A randomized completion rule can also change how the exit opens, but victory requires reaching and shutting down the fault generator.

## Defining mechanic: lock the malfunction

After surviving and observing an eligible malfunction, the player can clamp it at a designed anchor point while safely grounded nearby. A swinging sign becomes a ledge; a retracting platform stays extended; a moving ventilation flap becomes a ramp. This changes route geometry, rather than only switching a trap off.

Only one clamp may be active. Moving it to another fault releases the previous object to its normal event behavior. While safely grounded, tap a clearly visible clamp control to toggle the nearby eligible anchor; hold/drag/release remains the movement gesture. The player never needs to aim at a tiny object during flight.

The clamped object remains fixed for the current attempt even after falling to an earlier floor. Death resets the clamp and rerolls variants. A locked object does not get a substitute surprise: randomness remains on the other floors. No permanent immunity or purchase is involved.

Use three lockable object types in the five-floor prototype: swinging sign, retracting platform, and ventilation flap. Other events can remain unclampable. At least one route must demonstrate a useful shortcut created by a lock; another must demonstrate the cost of moving the clamp and releasing an earlier shortcut. The tower must also have a verified completion route without using the clamp, so random event selection cannot make a required tool unavailable.

This is the proposed source of the game's identity: discover an unpredictable fault, turn it into a route, then choose whether keeping that route is worth losing the clamp elsewhere. It is a differentiation hypothesis, not a claim of an unprecedented mechanic.

## The ten characteristics and their MVP roles

| Reference | Characteristic | Concrete MVP use | Deferred |
| --- | --- | --- | --- |
| Getting Over It | Progress loss and commentary | A missed landing can drop the robot to an earlier floor; occasional failure-specific concierge text | Voice acting and a huge continuous mountain |
| Level Devil | Betrayal of expectations | One landing pad may retract, or a ceiling obstacle may drop when approached | A large library of trap types |
| Jump King | Committed charged jumps | Hold to charge, drag to aim, release; fixed trajectory after launch | Multiple movement abilities |
| Geometry Dash | Rhythm, practice, customization, creation | One floor has visible pulsing hazards; a fixed-variant practice option lets players learn timing | Cosmetics, public editor, community levels |
| TrapAdventure 2 | Surprise traps | Event identity is hidden until activation; some surprises can end the attempt immediately | Long sequences of unavoidable surprise deaths |
| Super Meat Boy | Precision and quick retries | Small authored obstacle sequences; restart requires one tap and targets under one second | Hundreds of levels and bosses |
| Pogostuck | Spring momentum and social competition | Spring launch and elastic rebounds; a local best-run silhouette marks progress | Friend ghosts, networked rankings, multiplayer |
| That Level Again | Familiar space, changed solution | A familiar lobby layout returns with a randomly selected exit rule | Device gestures and sprawling puzzle systems |
| A Difficult Game About Climbing | Fear of falling and recovery | Some misses reach catch ledges; skilled landings can salvage a run | Independent arm controls |
| The Impossible Game | Minimal input, timing, practice | One touch scheme, compact hazards, attempt counter, practice replay | Separate auto-runner mode |

All ten contribute a design lesson. The MVP does not need every feature of every reference.

## Randomness that actually changes attempts

Build a small bank of authored, solvable floor variants rather than generating arbitrary geometry or rolling a death chance every frame.

- Each floor has a safe base layout and **three tested event variants**. Five floors means 15 authored variants.
- Choose a variant on floor entry and keep it hidden until its trigger. Do not change the choice mid-jump in response to the player's input.
- Re-entering the floor during the same attempt preserves the selected variant and its defined reset behavior. A new attempt rerolls the floor choices.
- Avoid immediate repeats where possible. This improves variety; it is not a promise that players can never guess an event.
- Each floor has at most one major surprise event. Repeated rhythmic hazards are part of its base layout.
- Record a seed, content version, floor choices, and event triggers so any outcome can be reproduced for debugging and practice.
- Pause and resume preserve the exact selection, timers, and position. Resuming does not reroll events.

This makes the next attempt uncertain while keeping outcomes testable. A seed is a reproducibility tool, not proof that a level is solvable.

## Beatable does not mean every first attempt survives

There are two event categories:

**Reactive surprises:** the identity is unpredictable, but once activated the event provides a visible response window. Examples: a platform shakes before retracting, an object drops toward a reachable shelter, or a door moves to a second reachable landing. Tune the response window on real phones; start testing at 600–900 ms where grounded movement permits a response.

**Ambush surprises:** a concealed trigger can kill a committed jump before the player has time to react. Include these because unpredictable attempt-ending events are part of the requested direction. Limit the MVP to one possible ambush floor per attempt, within the opening 20 seconds. Each ambush variant needs a specific avoidance route—such as a lower jump or another landing—and may not block every route. Its location or event type can vary on later attempts.

A jump cannot be steered after launch. Therefore a reactive event must activate while the player can still choose a launch, provide a reachable automatic rebound/catch, or be explicitly treated as an ambush. Do not claim an airborne player can dodge with controls they do not have.

Never implement a timer that simply declares failure regardless of position or input. An unlucky attempt may end, but success must follow from an executable route and actions rather than a favorable roll alone.

## Five-floor content plan

| Floor | Base challenge | Three possible event variants | Failure cost |
| --- | --- | --- | --- |
| 1: Lobby | Three generous charge jumps | Concealed spike on one of two routes; falling sign over one approach; floor hatch under one optional landing | Ambush can end attempt; this floor is short |
| 2: Laundry | Aim onto elastic surfaces | Washer lid changes rebound angle; one pad retracts after a shake; detergent makes a marked landing slippery | Drop to lobby or reach a catch ledge |
| 3: Office | Copier hazards pulse visibly | Conveyor switches direction before launch; moving barrier reroutes next jump; copier jams and changes its next visible cycle | Drop to laundry or die on a hazard |
| 4: Familiar lobby | Reused geometry, new exit problem | Door requires maintenance bypass; door requires landing on marked pad; door opens during a visible pulse | Retry positioning or fall one floor |
| 5: Penthouse | Narrow landings and a tempting shortcut | Exit shifts before final launch; shortcut shakes and collapses; ventilation activates on a visible countdown | Fall several floors; lethal contact ends attempt |

Each variant must have a documented completion route and defined trigger/reset behavior before it enters the random pool. Table entries are proposed content, not validated levels.

## Run rules

- Begin at floor one. Shut down the fault generator at floor five for a real win screen.
- A fall keeps play going if the robot lands safely below. A lethal collision ends the attempt.
- One-tap restart begins a new attempt with new floor selections. No lives, energy, ads, or paid rescues in the prototype.
- Keep best height, wins, attempts, and fastest completion locally across deaths.
- Target a skilled clean completion of 2–3 minutes. Learning may take many attempts; measure that rather than promising a completion time.
- Practice can replay the last encountered floor variant with a local checkpoint. Practice results never count as full-tower wins.
- Concierge text appears occasionally after a failure and can be muted. It must not delay restarting.

## Technical scope

Use a lightweight 2D scene with placeholder art, fixed-step movement, large landing hitboxes, and a touch zone below the play area. The build needs the jump controller, floor loader, variant selector, event state machine, clamp/anchor controller, collision/fall handling, local save, pause/resume, and simple win/restart UI. Save the clamp state with the run.

Recommended implementation order is engine-independent. Choose the engine when moving into implementation; native mobile export and on-device input testing are required. A browser prototype can validate the idea, but does not by itself establish native mobile readiness.

Do not include accounts, backend services, live multiplayer, a store, a public level editor, or video export in the MVP.

## Build order and acceptance gates

1. **Movement:** one room, normal and elastic platforms, touch input, restart. Verify repeatable launches and comfortable thumb use on a physical phone.
2. **Randomness and identity:** implement the lobby's three variants, seed capture, and fixed-variant practice. Demonstrate an avoidable ambush, a response-based event, and clamping a fault into a useful landing without changing jump physics.
3. **Complete game:** add the other four floors, fall routes, persistent bests, shutdown win, and commentary. Record successful completion of every floor variant. Include the three clampable objects and validate that locking and releasing each preserves a completion route; releasing must wait until the player is clear of the object's collision volume.
4. **Combination checks:** exhaust the 243 five-floor selection combinations. Check route connectivity and event compatibility for every combination; where timing or physics is involved, use a scripted successful input trace or hands-on replay. Static connectivity alone cannot prove a jump is executable. Any failing combination is blocked from shipping until corrected.
5. **Clamp and phone interruption checks:** the 243 variant combinations do not cover clamp states. Separately verify each eligible anchor's locking, release, return after falling, and safe relocation. Suspend during charging, flight, an event, and a fall. Resume safely with the same run and clamp state; test various frame rates and touch cancellations.
6. **Player test:** observe 10–15 people with varied skill. Measure understanding, voluntary retries, completion, and improvement; separately record reactions to ambush deaths.

For an MVP pass: all permitted variants/combinations have completion evidence; at least three external testers complete the tower without developer intervention; most testers voluntarily retry after a surprise; and testers can distinguish changing obstacles from unreliable controls. These are proposed small-sample gates, not statistical validation.

The critical comparison is a version with early ambushes versus a version with only reactive surprises. Keep the ambushes if they produce more voluntary retries and enjoyment; revise their frequency or penalty if players describe success as luck. Preserve the requested unpredictability in both versions.

## Decision to carry forward

Proposed MVP: **one maintenance creature, one-thumb movement, one movable clamp, five floors, 15 event variants, randomized attempts, falls, immediate retries, practice, and an actual finish.** First validate the jump, a random fault, and turning that fault into a useful ledge. Then complete the tower. If locking faults is not central to how testers describe the game, revisit the design before expanding content.
