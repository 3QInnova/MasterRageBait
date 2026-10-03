# Browser refinement before the Godot port

The browser prototype is the active gameplay workspace. Keep the Godot project as a toolchain/character preview until controls and the feature set are agreed and playtested.

## Controls

Selected scheme: hold left/right to walk at 150 world pixels per second with no acceleration or deceleration. Release stops immediately. Only while grounded and stopped, hold the jump pad to charge, drag horizontally to aim, then release to jump. Keyboard arrows walk and Space charges/releases. Starting movement cancels a charge. Walking off an edge causes a fall; movement does not steer a jump in midair.

Baseline input fixes: preserve the current aim when beginning a drag; let only the charging finger release or cancel it; ignore right-click and secondary touch; cancel safely if pointer capture is lost. These do not change jump strength or level difficulty.

Decisions pending player feedback: whether charging time feels useful, whether a slingshot is more direct, desired trajectory assistance, the need for walking or air steering, and how to cancel a charged jump intentionally.

## Feature review

| Existing feature | Question for the next playtest |
| --- | --- |
| Edge Case and smug PATCH | Already central to the agreed identity; keep refining expressions and interactions |
| Three request cards | Are choices funny and consequential enough? |
| Automatic spring bounce | Is it enjoyable or does it feel like losing control? |
| Unsolicited patches | Do they surprise without making victories feel accidental? |
| Same-build retry and new-fix retry | Do players understand the difference? |
| Partial trajectory guide | Does it help aim, or misleadingly suggest the landing? |
| Three successive builds and Ship | Is progression satisfying or repetitive? |
| Timer and best time | Does speed matter to the experience we want? |
| Crisp walking and committed jumps | Does the new stop-before-jump rhythm feel right? |

No feature has been removed or accepted solely because it appears in this review table. Player feedback determines the next changes.

## Port gate

Choose the controls, implement the agreed additions/removals, replay every permitted patch combination for beatability, and playtest on a phone. Then port the selected behavior into Godot rather than maintaining two competing gameplay implementations.
