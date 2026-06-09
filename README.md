# Bounce 2D

A browser-based 2D platformer built with **Phaser 4** and **TypeScript**. Guide a glowing ball through 15 hand-crafted levels packed with 8 distinct obstacle types, 3 power-ups, checkpoints, a coin streak multiplier, and a gravity-flipping final act.

---

## Quick Start

```bash
npm install
npm run dev       # dev server → http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build
```

**Stack:** Phaser 4 · TypeScript · Vite

---

## Controls

| Action | Keys |
|--------|------|
| Move left | `←` or `A` |
| Move right | `→` or `D` |
| Jump | `↑`, `W`, or `Space` |
| Double jump | Press jump again while airborne |

---

## Core Mechanics

### Ball
- Double jump (second jump is 85% height of first)
- Trail effect + spin based on velocity
- Tint/aura changes when power-ups are active

### Coins & Portal
- Collect the required number of coins to unlock the portal
- Touching a locked portal shows how many coins remain
- Collecting **all** coins in a level awards a 500-point bonus at level end

### Scoring
| Source | Points |
|--------|--------|
| Coin | 100 (× streak multiplier) |
| Time bonus | `timeLeft × 10` |
| All-coins bonus | +500 |

### Coin Streak Multiplier
Collect coins within 2.5 seconds of each other to build a streak:
- 3 in a row → **2×**
- 6 in a row → **3×**

Streak resets after 2.5 s with no coin collected.

### Lives
Start with 3 lives. Lose one on: spike, hazard, laser, fall off screen, or timeout. Game over at 0 lives. Lives carry between levels.

---

## Obstacle Reference

| Type | Visual | Behaviour |
|------|--------|-----------|
| **Normal** | Blue tile | Static, safe to stand on |
| **Moving** | Orange tile with arrows | Oscillates horizontally or vertically; ball rides it |
| **Hazard** | Red tile with upward spikes | Instant death on any contact |
| **Spike strip** | Red floor spikes | Instant death — placed in ground gaps |
| **Ice** | Light-blue shiny tile | Near-zero friction — ball slides and is hard to stop |
| **Bounce pad** | Green tile with spring arrows | Launches ball upward at 900 px/s regardless of jump state |
| **Crumble** | Brown cracked tile | Shakes for ~1 s after landing, then falls |
| **Conveyor** | Gray tile with direction arrows | Constantly pushes ball left or right while standing |
| **Disappear** | Purple dotted tile | Toggles visible/collidable on a configurable interval |
| **Laser** | Glowing orange beam | Horizontal or vertical; pulses ON/OFF on a timer — deadly when ON |

### Environmental Zones
| Zone | Visual | Effect |
|------|--------|--------|
| **Wind zone** | Translucent blue/yellow column | Applies continuous force (up, left, or right) every frame while inside |
| **Gravity flip zone** | Translucent purple column | Inverts world gravity while inside — platforms near the ceiling become the floor |

---

## Power-ups

Collected by touching the floating icon. One-time use.

| Icon | Name | Effect |
|------|------|--------|
| 🛡 Blue shield | **Shield** | Absorbs the next lethal hit instead of losing a life |
| ⚡ Yellow lightning | **Speed Boost** | 1.8× movement speed for 5 seconds |
| ❄ Cyan clock | **Time Freeze** | Pauses the countdown timer for 8 seconds |

---

## Checkpoints

Grey flag → turns gold when activated. Sets mid-level respawn point. Timer resets to full on any death (whether checkpoint is active or not).

---

## Level Guide

| # | Title | New Mechanic | Gravity | Time | Req. Coins |
|---|-------|-------------|---------|------|-----------|
| 1 | First Steps | — | 800 | 60s | 4 |
| 2 | Moving Grounds | Moving platforms | 850 | 70s | 4 |
| 3 | Danger Zone | Hazard platforms | 900 | 85s | 4 |
| 4 | Sky Gauntlet | H + V movers | 950 | 90s | 5 |
| 5 | The Summit | Fast movers | 1000 | 105s | 6 |
| 6 | Slip & Slide | Ice platforms | 800 | 90s | 5 |
| 7 | Bounce House | Bounce pads | 1100 | 95s | 5 |
| 8 | Vanishing Act | Disappearing platforms | 850 | 100s | 5 |
| 9 | Crumble Road | Crumble platforms + shield | 950 | 95s | 5 |
| 10 | Laser Grid | Pulsing lasers + time freeze | 850 | 110s | 5 |
| 11 | Conveyor Chaos | Conveyor belts + speed boost | 900 | 100s | 5 |
| 12 | Wind Riders | Wind zones | 700 | 110s | 6 |
| 13 | Power Play | All 3 power-ups + mixed types | 1000 | 110s | 6 |
| 14 | Gravity Storm | Gravity flip zones | 900 | 120s | 6 |
| 15 | Final Gauntlet | Everything combined | 1000 | 150s | 8 |

### Level Design Notes

**L6 — Slip & Slide:** Ice platforms have hazards at both edges. Build just enough momentum to reach the next platform without sliding off.

**L7 — Bounce House:** Ground bounce pads launch you ~450 px high (heavy gravity = fast fall). Chain bounces with mid-air platforms to climb.

**L8 — Vanishing Act:** Alternating start phases mean one platform is always visible — but you must keep moving. Standing still = platform disappears under you.

**L9 — Crumble Road:** Every main-path platform crumbles. Never stop on a crumble tile — use the safety nets below only as a last resort.

**L10 — Laser Grid:** Each laser has a distinct on/off rhythm. Wait on the platform below until the beam goes dark, then cross immediately.

**L11 — Conveyor Chaos:** Conveyors alternate right/left. A right-conveyor pushes you into the hazard at its right edge; a left-conveyor into the hazard at its left. Fight the direction — or use the push to extend your jump.

**L12 — Wind Riders:** Updraft columns in three spots boost vertical height significantly. The headwind in the right half reduces horizontal range — factor it into your jump timing.

**L14 — Gravity Storm:** Two purple columns flip gravity. Fall upward onto ceiling platforms, then fall back down when you exit. Both column edges have checkpoint flags — use them.

**L15 — Final Gauntlet:** Ice → crumble → conveyor → moving platform → conveyor → bounce pad → disappear → portal. Three lasers, one wind updraft, two checkpoints, three power-ups. Use the shield early, the speed boost on the conveyor section, and the time freeze only if the timer drops below 30 s.

---

## Project Structure

```
src/
├── main.ts                   # Phaser game config + scene list
├── data/
│   └── levels.ts             # All 15 level definitions + type interfaces
├── objects/
│   └── Ball.ts               # Player ball: movement, jumps, power-up state, trail
└── scenes/
    ├── BootScene.ts          # Procedural texture generation (all assets)
    ├── MenuScene.ts          # Title screen
    ├── GameScene.ts          # Main game loop, all obstacle logic
    ├── LevelCompleteScene.ts # Score breakdown + next level
    └── GameOverScene.ts      # Game over screen
```

### Adding a New Level

1. Add an entry to the `LEVELS` array in `src/data/levels.ts`
2. Use any combination of the existing `PlatformType` values and optional zone/obstacle arrays
3. No code changes needed — `GameScene` and `LevelCompleteScene` auto-detect `LEVELS.length`

### Adding a New Platform Type

1. Add the type string to the `PlatformType` union in `levels.ts`
2. Add a texture in `BootScene.generateTextures()`
3. Add a new `Phaser.Physics.Arcade.StaticGroup` in `GameScene`
4. Handle creation in `GameScene.buildPlatforms()`
5. Wire a `physics.add.collider` or `overlap` for the new group
6. Add any per-frame update logic in the `GameScene.update()` loop

---

## Physics Reference

Arcade physics. Gravity is per-level (`gravity` field in `LevelData`).

| Parameter | Value |
|-----------|-------|
| Ball move speed | 220 px/s (396 with speed boost) |
| First jump velocity | −480 px/s |
| Double jump velocity | −408 px/s (85%) |
| Bounce pad velocity | −900 px/s |
| Ice friction (per frame) | velocity × 0.992 |
| Normal friction (per frame) | velocity × 0.75 |
| Conveyor push force | ±140 px/s (applied each frame) |
