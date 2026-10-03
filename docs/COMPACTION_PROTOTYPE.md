# Context compaction prototype

The room is 1260 × 1500 world pixels, viewed through a 420 × 500 scrolling camera. Evidence checkpoints plus three checkpoints above the start save a deep copy of the room and the grounded player. Reaching a new checkpoint refills 100 tokens. Earlier checkpoints cannot overwrite later saves.

Costs are in `context.js`: left/right press 2 tokens plus 4 per second of actual grounded movement; jump 8 plus up to 12 for power; initial build requests 12/20/16; rebuild bridge 18. Idle time, aiming and menus are free. Movement auto-repeat does not duplicate press costs. Airborne input cannot steer a jump.

Hitting or exceeding the available budget immediately stops play before executing the action. PATCH comments, the room/player return to the last checkpoint snapshot, and a resume button restores 100 tokens. Room clock, hazards, platform changes, event flags and the bridge all roll back together. Progress already saved at a checkpoint remains saved. The token meter rounds up fractional walking costs.

The rebuildable bridge is a first stateful interaction to demonstrate forgetting, not a complete block-pushing puzzle. The bridge is optional so compaction cannot make the climb impossible. Death and the return button use the same checkpoint restore. Asking for another fix starts a new build from the bottom.

Godot remains a scaffold while browser gameplay is being refined. Token balance and checkpoint positions are provisional playtest values.

The evidence wing adds bug interactions and CAPTCHA costs; see [EVIDENCE_PUZZLES.md](EVIDENCE_PUZZLES.md).
