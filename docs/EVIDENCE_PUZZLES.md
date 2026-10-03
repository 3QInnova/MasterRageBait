# Evidence wing playtest

The room is now 1260 × 1500 pixels. Normal view follows Edge Case horizontally and vertically; Zoom out shows the whole map in the existing 420 × 500 viewport. Zoom does not pause play or consume tokens.

Walk right along the bottom floor:

1. Pick up the `?` glitch at x120 using the contextual interaction button. Carry it to the evidence socket at x480. Deliver it to disprove “No bugs can reach this socket.”
2. Pick up the `}` glitch at x650. Drop it on the first node at x710, then stand on the second at x780. This disproves “Both nodes cannot be active.”
3. Challenge the terminal at x1060. Select the three glitch creatures (`?`, `!`, `}`), leaving PATCH’s approved checkmark unselected. The handcrafted CAPTCHA disproves “Unexpected input cannot pass.” Incorrect answers are retryable.
4. Return to START to save the climb checkpoint and refill tokens. Climb toward the exit, which only accepts all three proofs.

Each proof turns its large VERIFIED checkmark into a cracked, orange DISPROVED stamp. PATCH refuses to concede, while the room accepts the evidence. Bug pickup, drop, delivery and opening the CAPTCHA cost 3 tokens each. Incorrect CAPTCHA submissions cost another 2; selecting tiles is free. Jumping still uses the existing controls while carrying a bug.

Each new proof saves an evidence checkpoint and refills 100 tokens. These precede the three climbing checkpoints. Compaction restores the complete saved world, including bugs, their carried/delivered status, solved claims, bridge state, room clock and hazards. Unsaved interactions are forgotten.

This version uses one evidence wing with three puzzles per build. CAPTCHA is a local game puzzle, not an external verification service. Moving blocks, extra puzzle variants and pinning selected memories remain future work.
