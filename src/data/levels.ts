export type PlatformType =
  | 'normal' | 'moving' | 'hazard'
  | 'ice' | 'bounce' | 'crumble' | 'conveyor' | 'disappear';

export interface PlatformDef {
  x: number; y: number; w: number;
  type?: PlatformType;
  // moving
  moveX?: number; moveY?: number; moveRange?: number; moveSpeed?: number;
  // conveyor: 1=right, -1=left
  conveyorDir?: 1 | -1;
  // disappear: half-cycle duration in ms
  disappearInterval?: number;
  disappearStartOff?: boolean;
}

export interface CoinDef { x: number; y: number; }

export interface SpikeDef { x: number; y: number; w: number; }

export interface LaserDef {
  x: number; y: number;
  dir: 'h' | 'v';
  len: number;
  onTime: number;   // ms laser ON (deadly)
  offTime: number;  // ms laser OFF (safe)
  startOff?: boolean;
}

export interface WindZoneDef {
  x: number; y: number; w: number; h: number;
  forceX?: number;   // px/s added per second
  forceY?: number;
}

export interface GravFlipZoneDef {
  x: number; y: number; w: number; h: number;
}

export interface CheckpointDef { x: number; y: number; }

export interface PowerupDef {
  x: number; y: number;
  kind: 'shield' | 'speed' | 'timefreeze';
}

export interface LevelData {
  id: number;
  title: string;
  bg: number;
  playerStart: { x: number; y: number };
  portal: { x: number; y: number };
  platforms: PlatformDef[];
  coins: CoinDef[];
  spikes: SpikeDef[];
  requiredCoins: number;
  timeLimit: number;
  gravity?: number;
  lasers?: LaserDef[];
  windZones?: WindZoneDef[];
  gravFlipZones?: GravFlipZoneDef[];
  checkpoints?: CheckpointDef[];
  powerups?: PowerupDef[];
}

export const LEVELS: LevelData[] = [
  // ── LEVEL 1 ──────────────────────────────────────────────────
  {
    id: 1,
    title: 'First Steps',
    bg: 0x0d0d2a,
    gravity: 800,
    playerStart: { x: 80, y: 500 },
    portal: { x: 880, y: 180 },
    timeLimit: 60,
    requiredCoins: 4,
    platforms: [
      { x: 0,   y: 570, w: 960 },
      { x: 160, y: 460, w: 128 },
      { x: 300, y: 370, w: 96  },
      { x: 420, y: 280, w: 128 },
      { x: 560, y: 360, w: 96  },
      { x: 660, y: 270, w: 128 },
      { x: 780, y: 200, w: 128 },
      { x: 500, y: 480, w: 96  },
      { x: 700, y: 480, w: 96  },
    ],
    spikes: [
      { x: 240, y: 570, w: 80 },
      { x: 450, y: 570, w: 64 },
      { x: 620, y: 570, w: 96 },
    ],
    coins: [
      { x: 200, y: 430 }, { x: 340, y: 340 }, { x: 480, y: 250 },
      { x: 600, y: 330 }, { x: 700, y: 240 }, { x: 840, y: 170 },
    ],
  },
  // ── LEVEL 2 ──────────────────────────────────────────────────
  {
    id: 2,
    title: 'Moving Grounds',
    bg: 0x0d1a0d,
    gravity: 850,
    playerStart: { x: 80, y: 500 },
    portal: { x: 880, y: 140 },
    timeLimit: 70,
    requiredCoins: 4,
    platforms: [
      { x: 0,   y: 570, w: 180 },
      { x: 800, y: 570, w: 160 },
      { x: 140, y: 450, w: 128, type: 'moving', moveX: 1, moveRange: 120, moveSpeed: 80 },
      { x: 320, y: 360, w: 96 },
      { x: 430, y: 440, w: 128, type: 'moving', moveX: 1, moveRange: 100, moveSpeed: 100 },
      { x: 580, y: 300, w: 96 },
      { x: 670, y: 380, w: 128, type: 'moving', moveX: 1, moveRange: 140, moveSpeed: 90 },
      { x: 820, y: 240, w: 128 },
      { x: 820, y: 170, w: 128 },
    ],
    spikes: [
      { x: 190, y: 570, w: 96 },
      { x: 380, y: 570, w: 80 },
      { x: 550, y: 570, w: 80 },
      { x: 700, y: 570, w: 90 },
    ],
    coins: [
      { x: 200, y: 420 }, { x: 380, y: 330 }, { x: 500, y: 410 },
      { x: 630, y: 270 }, { x: 730, y: 350 }, { x: 880, y: 210 },
    ],
  },
  // ── LEVEL 3 ──────────────────────────────────────────────────
  {
    id: 3,
    title: 'Danger Zone',
    bg: 0x1a0d0d,
    gravity: 900,
    playerStart: { x: 80, y: 520 },
    portal: { x: 880, y: 115 },
    timeLimit: 85,
    requiredCoins: 4,
    platforms: [
      { x: 0,   y: 570, w: 160 },
      { x: 150, y: 460, w: 112 },
      { x: 264, y: 460, w: 64,  type: 'hazard' },
      { x: 330, y: 375, w: 112 },
      { x: 444, y: 375, w: 64,  type: 'hazard' },
      { x: 510, y: 295, w: 112, type: 'moving', moveX: 1, moveRange: 70, moveSpeed: 65 },
      { x: 670, y: 220, w: 112 },
      { x: 784, y: 220, w: 64,  type: 'hazard' },
      { x: 790, y: 150, w: 96,  type: 'moving', moveX: 1, moveRange: 55, moveSpeed: 75 },
      { x: 460, y: 490, w: 80 },
      { x: 650, y: 450, w: 80 },
    ],
    spikes: [
      { x: 165, y: 570, w: 64 },
      { x: 340, y: 570, w: 80 },
      { x: 520, y: 570, w: 80 },
      { x: 700, y: 570, w: 80 },
      { x: 840, y: 570, w: 80 },
    ],
    coins: [
      { x: 206, y: 430 }, { x: 386, y: 345 }, { x: 566, y: 265 },
      { x: 726, y: 190 }, { x: 840, y: 120 }, { x: 500, y: 460 },
    ],
  },
  // ── LEVEL 4 ──────────────────────────────────────────────────
  {
    id: 4,
    title: 'Sky Gauntlet',
    bg: 0x0a0a1f,
    gravity: 950,
    playerStart: { x: 60, y: 530 },
    portal: { x: 900, y: 85 },
    timeLimit: 90,
    requiredCoins: 5,
    platforms: [
      { x: 0,   y: 570, w: 130 },
      { x: 840, y: 570, w: 120 },
      { x: 120, y: 468, w: 112, type: 'moving', moveX: 1, moveRange: 80, moveSpeed: 75 },
      { x: 300, y: 390, w: 96 },
      { x: 398, y: 390, w: 48,  type: 'hazard' },
      { x: 450, y: 310, w: 96 },
      { x: 548, y: 310, w: 48,  type: 'hazard' },
      { x: 600, y: 230, w: 96,  type: 'moving', moveX: 1, moveRange: 65, moveSpeed: 90 },
      { x: 750, y: 160, w: 96 },
      { x: 848, y: 160, w: 48,  type: 'hazard' },
      { x: 840, y: 105, w: 96 },
      { x: 190, y: 530, w: 80 },
      { x: 660, y: 430, w: 80 },
    ],
    spikes: [
      { x: 135, y: 570, w: 80 },
      { x: 300, y: 570, w: 80 },
      { x: 460, y: 570, w: 80 },
      { x: 620, y: 570, w: 80 },
      { x: 750, y: 570, w: 80 },
      { x: 370, y: 468, w: 48 },
    ],
    coins: [
      { x: 176, y: 438 }, { x: 348, y: 360 }, { x: 498, y: 280 },
      { x: 651, y: 200 }, { x: 798, y: 130 }, { x: 888, y: 75  },
      { x: 230, y: 500 },
    ],
  },
  // ── LEVEL 5 ──────────────────────────────────────────────────
  {
    id: 5,
    title: 'The Summit',
    bg: 0x050510,
    gravity: 1000,
    playerStart: { x: 60, y: 540 },
    portal: { x: 900, y: 90 },
    timeLimit: 105,
    requiredCoins: 6,
    platforms: [
      { x: 0,   y: 570, w: 110 },
      { x: 100, y: 480, w: 96,  type: 'moving', moveX: 1, moveRange: 90, moveSpeed: 100 },
      { x: 270, y: 400, w: 96 },
      { x: 368, y: 400, w: 48,  type: 'hazard' },
      { x: 430, y: 320, w: 96,  type: 'moving', moveX: 0, moveY: 1, moveRange: 70, moveSpeed: 85 },
      { x: 560, y: 240, w: 96 },
      { x: 658, y: 240, w: 48,  type: 'hazard' },
      { x: 700, y: 160, w: 96 },
      { x: 790, y: 100, w: 96,  type: 'moving', moveX: 1, moveRange: 55, moveSpeed: 105 },
      { x: 180, y: 540, w: 80 },
      { x: 500, y: 480, w: 80 },
      { x: 720, y: 430, w: 80 },
    ],
    spikes: [
      { x: 115, y: 570, w: 80 }, { x: 270, y: 570, w: 80 },
      { x: 430, y: 570, w: 80 }, { x: 590, y: 570, w: 80 },
      { x: 740, y: 570, w: 80 }, { x: 870, y: 570, w: 64 },
      { x: 528, y: 320, w: 32 },
    ],
    coins: [
      { x: 148, y: 450 }, { x: 318, y: 370 }, { x: 478, y: 290 },
      { x: 608, y: 210 }, { x: 748, y: 130 }, { x: 838, y:  70 },
      { x: 220, y: 510 }, { x: 540, y: 450 }, { x: 760, y: 400 },
    ],
  },
  // ── LEVEL 6 ── Slip & Slide ───────────────────────────────────
  {
    id: 6,
    title: 'Slip & Slide',
    bg: 0x071428,
    gravity: 800,
    playerStart: { x: 60, y: 530 },
    portal: { x: 880, y: 160 },
    timeLimit: 90,
    requiredCoins: 5,
    platforms: [
      { x: 0,   y: 570, w: 130 },
      { x: 820, y: 570, w: 140 },
      // ice chain — wide so player builds momentum, hazards at edges punish sliding
      { x: 130, y: 460, w: 180, type: 'ice' },
      { x: 310, y: 460, w: 48,  type: 'hazard' },
      { x: 390, y: 370, w: 180, type: 'ice' },
      { x: 570, y: 370, w: 48,  type: 'hazard' },
      { x: 370, y: 370, w: 48,  type: 'hazard' },
      { x: 630, y: 280, w: 180, type: 'ice' },
      { x: 810, y: 280, w: 48,  type: 'hazard' },
      { x: 610, y: 280, w: 48,  type: 'hazard' },
      { x: 800, y: 200, w: 128, type: 'ice' },
      // safety normals
      { x: 250, y: 500, w: 64 },
      { x: 510, y: 430, w: 64 },
    ],
    spikes: [
      { x: 135, y: 570, w: 80 },
      { x: 360, y: 570, w: 80 },
      { x: 585, y: 570, w: 80 },
      { x: 740, y: 570, w: 80 },
    ],
    coins: [
      { x: 220, y: 430 }, { x: 260, y: 430 },
      { x: 460, y: 340 }, { x: 500, y: 340 },
      { x: 720, y: 250 }, { x: 850, y: 170 },
    ],
  },
  // ── LEVEL 7 ── Bounce House ───────────────────────────────────
  {
    id: 7,
    title: 'Bounce House',
    bg: 0x0f0020,
    gravity: 1100,
    playerStart: { x: 60, y: 530 },
    portal: { x: 880, y: 80 },
    timeLimit: 95,
    requiredCoins: 5,
    platforms: [
      // ground
      { x: 0,   y: 570, w: 120 },
      { x: 130, y: 570, w: 64, type: 'bounce' },  // main launch pad
      { x: 460, y: 570, w: 64, type: 'bounce' },  // fallback bounce
      { x: 700, y: 570, w: 260 },                 // right safe ground
      // staircase — narrower platforms for more precision
      { x: 80,  y: 390, w: 128 },  // step 1
      { x: 270, y: 310, w: 112 },  // step 2
      // moving platform between step 2 and 3 — adds timing challenge
      { x: 370, y: 268, w: 80, type: 'moving', moveX: 1, moveRange: 50, moveSpeed: 65 },
      { x: 440, y: 230, w: 112 },              // step 3
      { x: 440, y: 230, w: 64, type: 'bounce' }, // bounce pad on step 3 → sends to step 4
      // step 4 — narrow landing zone, requires precise bounce aim
      { x: 590, y: 130, w: 128 },
      // hazard right of step 4 — punishes overshoot
      { x: 730, y: 130, w: 48, type: 'hazard' },
    ],
    spikes: [
      { x: 200, y: 570, w: 240 },
      { x: 534, y: 570, w: 150 },
    ],
    coins: [
      { x: 155, y: 355 },  // step 1
      { x: 325, y: 278 },  // near moving platform
      { x: 495, y: 195 },  // step 3
      { x: 648, y:  95 },  // step 4
      { x: 800, y:  80 },  // floating on path to portal
      { x: 882, y:  48 },  // near portal
    ],
    checkpoints: [
      { x: 440, y: 230 },  // step 3
    ],
  },
  // ── LEVEL 8 ── Vanishing Act ──────────────────────────────────
  {
    id: 8,
    title: 'Vanishing Act',
    bg: 0x180a28,
    gravity: 850,
    playerStart: { x: 60, y: 530 },
    portal: { x: 880, y: 120 },
    timeLimit: 100,
    requiredCoins: 5,
    platforms: [
      { x: 0,   y: 570, w: 130 },
      { x: 820, y: 570, w: 140 },
      // disappearing chain — alternating phase so one is always available
      { x: 130, y: 460, w: 112, type: 'disappear', disappearInterval: 1400 },
      { x: 280, y: 380, w: 112, type: 'disappear', disappearInterval: 1400, disappearStartOff: true },
      { x: 430, y: 300, w: 112, type: 'disappear', disappearInterval: 1400 },
      { x: 580, y: 220, w: 112, type: 'disappear', disappearInterval: 1400, disappearStartOff: true },
      { x: 730, y: 160, w: 112, type: 'disappear', disappearInterval: 1400 },
      { x: 840, y: 100, w: 96,  type: 'disappear', disappearInterval: 1400, disappearStartOff: true },
      // safety normals
      { x: 200, y: 510, w: 80 },
      { x: 500, y: 430, w: 64 },
      { x: 680, y: 370, w: 64 },
      // hazards
      { x: 250, y: 380, w: 48, type: 'hazard' },
      { x: 550, y: 220, w: 48, type: 'hazard' },
    ],
    spikes: [
      { x: 135, y: 570, w: 80 },
      { x: 330, y: 570, w: 80 },
      { x: 510, y: 570, w: 80 },
      { x: 700, y: 570, w: 80 },
    ],
    coins: [
      { x: 186, y: 430 }, { x: 336, y: 350 },
      { x: 486, y: 270 }, { x: 636, y: 190 },
      { x: 786, y: 130 }, { x: 868, y:  70 },
    ],
  },
  // ── LEVEL 9 ── Crumble Road ───────────────────────────────────
  {
    id: 9,
    title: 'Crumble Road',
    bg: 0x1a0800,
    gravity: 950,
    playerStart: { x: 60, y: 530 },
    portal: { x: 880, y: 100 },
    timeLimit: 95,
    requiredCoins: 5,
    platforms: [
      { x: 0,   y: 570, w: 120 },
      // crumble chain — must keep moving
      { x: 110, y: 460, w: 128, type: 'crumble' },
      { x: 280, y: 370, w: 128, type: 'crumble' },
      { x: 450, y: 285, w: 128, type: 'crumble' },
      { x: 620, y: 200, w: 128, type: 'crumble' },
      { x: 790, y: 130, w: 128, type: 'crumble' },
      { x: 840, y:  80, w: 96  },
      // safety nets — normal, so player can breathe
      { x: 200, y: 520, w: 80 },
      { x: 510, y: 440, w: 80 },
      { x: 700, y: 360, w: 64 },
      // hazards on the crumble platforms (right edge trap)
      { x: 240, y: 460, w: 48, type: 'hazard' },
      { x: 580, y: 285, w: 48, type: 'hazard' },
    ],
    spikes: [
      { x: 125, y: 570, w: 80 },
      { x: 300, y: 570, w: 80 },
      { x: 470, y: 570, w: 80 },
      { x: 640, y: 570, w: 80 },
      { x: 800, y: 570, w: 80 },
    ],
    coins: [
      { x: 174, y: 430 }, { x: 344, y: 340 },
      { x: 514, y: 255 }, { x: 684, y: 170 },
      { x: 854, y: 100 }, { x: 550, y: 408 },
    ],
    powerups: [
      { x: 350, y: 460, kind: 'shield' },
    ],
    checkpoints: [
      { x: 460, y: 570 },
    ],
  },
  // ── LEVEL 10 ── Laser Grid ────────────────────────────────────
  {
    id: 10,
    title: 'Laser Grid',
    bg: 0x001a1a,
    gravity: 850,
    playerStart: { x: 60, y: 530 },
    portal: { x: 880, y: 150 },
    timeLimit: 110,
    requiredCoins: 5,
    platforms: [
      { x: 0,   y: 570, w: 130 },
      { x: 820, y: 570, w: 140 },
      { x: 140, y: 460, w: 112 },
      { x: 290, y: 380, w: 112 },
      { x: 440, y: 300, w: 112 },
      { x: 590, y: 220, w: 112 },
      { x: 740, y: 160, w: 112 },
      { x: 830, y: 110, w: 112 },
      // safety platforms
      { x: 230, y: 520, w: 80 },
      { x: 520, y: 440, w: 80 },
    ],
    spikes: [
      { x: 135, y: 570, w: 80 },
      { x: 300, y: 570, w: 80 },
      { x: 470, y: 570, w: 80 },
      { x: 640, y: 570, w: 80 },
      { x: 790, y: 570, w: 80 },
    ],
    lasers: [
      // horizontal lasers blocking transitions between platforms
      { x: 155, y: 440, dir: 'h', len: 180, onTime: 1400, offTime: 1000 },
      { x: 305, y: 360, dir: 'h', len: 180, onTime: 1200, offTime: 1200, startOff: true },
      { x: 455, y: 280, dir: 'h', len: 180, onTime: 1600, offTime: 900 },
      { x: 605, y: 200, dir: 'h', len: 180, onTime: 1100, offTime: 1400, startOff: true },
      // vertical laser guarding portal approach
      { x: 820, y:  90, dir: 'v', len: 130, onTime: 1200, offTime: 1200 },
    ],
    coins: [
      { x: 196, y: 430 }, { x: 346, y: 350 },
      { x: 496, y: 270 }, { x: 646, y: 190 },
      { x: 796, y: 130 }, { x: 270, y: 490 },
    ],
    powerups: [
      { x: 500, y: 270, kind: 'timefreeze' },
    ],
    checkpoints: [
      { x: 450, y: 570 },
    ],
  },
  // ── LEVEL 11 ── Conveyor Chaos ────────────────────────────────
  {
    id: 11,
    title: 'Conveyor Chaos',
    bg: 0x1a0f00,
    gravity: 900,
    playerStart: { x: 60, y: 530 },
    portal: { x: 880, y: 130 },
    timeLimit: 100,
    requiredCoins: 5,
    platforms: [
      { x: 0,   y: 570, w: 110 },
      { x: 820, y: 570, w: 140 },
      // conveyor chain — alternating directions force precision
      { x: 110, y: 460, w: 160, type: 'conveyor', conveyorDir:  1 },
      { x: 320, y: 375, w: 160, type: 'conveyor', conveyorDir: -1 },
      { x: 510, y: 295, w: 160, type: 'conveyor', conveyorDir:  1 },
      { x: 700, y: 215, w: 160, type: 'conveyor', conveyorDir: -1 },
      { x: 830, y: 160, w: 128, type: 'conveyor', conveyorDir:  1 },
      // safety normals
      { x: 230, y: 520, w: 72 },
      { x: 620, y: 430, w: 72 },
      // hazards at the edge each conveyor pushes you toward
      { x: 270, y: 460, w: 48, type: 'hazard' },  // right edge of conv-1 (dir +1 pushes right)
      { x: 272, y: 375, w: 48, type: 'hazard' },  // left edge of conv-2  (dir -1 pushes left)
      { x: 670, y: 295, w: 48, type: 'hazard' },  // right edge of conv-3 (dir +1 pushes right)
    ],
    spikes: [
      { x: 115, y: 570, w: 80 },
      { x: 295, y: 570, w: 80 },
      { x: 480, y: 570, w: 80 },
      { x: 670, y: 570, w: 80 },
      { x: 820, y: 570, w: 80 },
    ],
    coins: [
      { x: 190, y: 430 }, { x: 400, y: 345 },
      { x: 590, y: 265 }, { x: 780, y: 185 },
      { x: 884, y: 100 }, { x: 665, y: 400 },
    ],
    powerups: [
      { x: 320, y: 345, kind: 'speed' },
    ],
    checkpoints: [
      { x: 500, y: 570 },
    ],
  },
  // ── LEVEL 12 ── Wind Riders ───────────────────────────────────
  {
    id: 12,
    title: 'Wind Riders',
    bg: 0x0a1f2e,
    gravity: 700,
    playerStart: { x: 60, y: 540 },
    portal: { x: 880, y: 100 },
    timeLimit: 110,
    requiredCoins: 6,
    platforms: [
      { x: 0,   y: 570, w: 130 },
      { x: 820, y: 570, w: 140 },
      { x: 140, y: 470, w: 112 },
      { x: 300, y: 390, w: 112 },
      { x: 460, y: 310, w: 112 },
      { x: 620, y: 230, w: 112 },
      { x: 780, y: 160, w: 128 },
      { x: 840, y: 110, w: 96  },
      // wind-assisted secret platforms (higher up, need updraft)
      { x: 200, y: 300, w: 80  },
      { x: 540, y: 190, w: 80  },
      // hazards
      { x: 270, y: 390, w: 48, type: 'hazard' },
      { x: 580, y: 230, w: 48, type: 'hazard' },
    ],
    spikes: [
      { x: 135, y: 570, w: 80 },
      { x: 300, y: 570, w: 80 },
      { x: 470, y: 570, w: 80 },
      { x: 640, y: 570, w: 80 },
      { x: 795, y: 570, w: 80 },
    ],
    windZones: [
      // updraft channels lift ball between platforms
      { x: 100, y: 220, w: 70, h: 350, forceY: -550 },
      { x: 380, y: 130, w: 70, h: 350, forceY: -550 },
      { x: 740, y:  60, w: 70, h: 350, forceY: -600 },
      // side winds — tailwind helping right, headwind punishing greed
      { x: 260, y: 300, w: 180, h: 140, forceX: 220 },
      { x: 620, y: 140, w: 180, h: 140, forceX: -180 },
    ],
    coins: [
      { x: 196, y: 440 }, { x: 240, y: 270 },
      { x: 356, y: 360 }, { x: 516, y: 280 },
      { x: 580, y: 160 }, { x: 836, y: 130 },
      { x: 884, y:  70 },
    ],
    powerups: [
      { x: 200, y: 270, kind: 'shield' },
    ],
    checkpoints: [
      { x: 460, y: 570 },
    ],
  },
  // ── LEVEL 13 ── Power Play ────────────────────────────────────
  {
    id: 13,
    title: 'Power Play',
    bg: 0x0a0820,
    gravity: 1000,
    playerStart: { x: 60, y: 530 },
    portal: { x: 880, y: 80 },
    timeLimit: 110,
    requiredCoins: 6,
    platforms: [
      { x: 0,   y: 570, w: 110 },
      { x: 830, y: 570, w: 130 },
      // path mixing multiple types
      { x: 110, y: 460, w: 112, type: 'ice' },
      { x: 270, y: 380, w: 112, type: 'crumble' },
      { x: 430, y: 300, w: 112 },
      { x: 542, y: 300, w: 48,  type: 'hazard' },  // right edge of normal platform
      { x: 550, y: 420, w: 112, type: 'moving', moveX: 1, moveRange: 80, moveSpeed: 90 },
      { x: 670, y: 240, w: 112, type: 'bounce' },
      { x: 790, y: 170, w: 112 },
      { x: 840, y: 100, w: 112 },
      // safety
      { x: 200, y: 530, w: 72 },
      { x: 490, y: 480, w: 72 },
    ],
    spikes: [
      { x: 115, y: 570, w: 80 },
      { x: 280, y: 570, w: 80 },
      { x: 450, y: 570, w: 80 },
      { x: 630, y: 570, w: 80 },
      { x: 800, y: 570, w: 80 },
    ],
    coins: [
      { x: 166, y: 430 }, { x: 326, y: 350 },
      { x: 480, y: 270 }, { x: 606, y: 390 },
      { x: 726, y: 210 }, { x: 840, y: 140 },
      { x: 884, y:  50 },
    ],
    powerups: [
      { x: 200, y: 430, kind: 'shield'     },
      { x: 486, y: 270, kind: 'speed'      },
      { x: 730, y: 140, kind: 'timefreeze' },
    ],
    checkpoints: [
      { x: 430, y: 570 },
    ],
  },
  // ── LEVEL 14 ── Gravity Storm ─────────────────────────────────
  {
    id: 14,
    title: 'Gravity Storm',
    bg: 0x1a0020,
    gravity: 900,
    playerStart: { x: 60, y: 530 },
    portal: { x: 880, y: 480 },
    timeLimit: 120,
    requiredCoins: 6,
    platforms: [
      // normal gravity section — left third
      { x: 0,   y: 570, w: 160 },
      { x: 170, y: 460, w: 112 },
      { x: 310, y: 380, w: 112 },
      // gravity flip zone 1: x=390 to x=590
      // platforms here are at TOP of screen (act as floor when flipped)
      { x: 390, y: 24, w: 128 },
      { x: 540, y: 60, w: 128 },
      // re-entry landing: normal gravity resumes at x=590
      { x: 590, y: 380, w: 112 },
      { x: 700, y: 300, w: 112 },
      // gravity flip zone 2: x=760 to x=880 (smaller flip pocket)
      { x: 760, y: 30, w: 128 },
      { x: 820, y: 80, w: 128 },
      // portal at top-right in flip zone 2 (y=480 in flipped coords appears near ceiling)
      // safety
      { x: 440, y: 530, w: 80 },
      { x: 640, y: 490, w: 80 },
      // hazards at flip zone borders
      { x: 370, y: 570, w: 48, type: 'hazard' },
      { x: 570, y: 570, w: 48, type: 'hazard' },
    ],
    spikes: [
      { x: 165, y: 570, w: 80 },
      { x: 320, y: 570, w: 80 },
      { x: 630, y: 570, w: 80 },
      { x: 730, y: 570, w: 80 },
    ],
    gravFlipZones: [
      { x: 390, y: 0, w: 200, h: 600 },
      { x: 760, y: 0, w: 200, h: 600 },
    ],
    coins: [
      { x: 226, y: 430 }, { x: 366, y: 350 },
      { x: 454, y: 560 }, { x: 596, y: 560 },  // in flip zones near "floor" (bottom)
      { x: 454, y:  50 }, { x: 596, y:  50 },  // flip zone ceiling coins (top)
      { x: 800, y:  50 }, { x: 860, y: 100 },
    ],
    powerups: [
      { x: 400, y: 540, kind: 'shield'     },
      { x: 770, y: 540, kind: 'timefreeze' },
    ],
    checkpoints: [
      { x: 390, y: 570 },
      { x: 760, y: 570 },
    ],
  },
  // ── LEVEL 15 ── Final Gauntlet ────────────────────────────────
  {
    id: 15,
    title: 'Final Gauntlet',
    bg: 0x000000,
    gravity: 1000,
    playerStart: { x: 60, y: 530 },
    portal: { x: 880, y: 80 },
    timeLimit: 150,
    requiredCoins: 8,
    platforms: [
      { x: 0,   y: 570, w: 110 },
      { x: 840, y: 570, w: 120 },
      // section 1: ice + crumble
      { x: 110, y: 460, w: 128, type: 'ice' },
      { x: 290, y: 380, w: 128, type: 'crumble' },
      // section 2: conveyor + moving
      { x: 460, y: 300, w: 128, type: 'conveyor', conveyorDir:  1 },
      { x: 620, y: 390, w: 96,  type: 'moving', moveX: 1, moveRange: 60, moveSpeed: 100 },
      { x: 630, y: 220, w: 128, type: 'conveyor', conveyorDir: -1 },
      // section 3: bounce + disappear
      { x: 760, y: 320, w: 64,  type: 'bounce' },
      { x: 800, y: 160, w: 112, type: 'disappear', disappearInterval: 1200 },
      { x: 840, y: 100, w: 96  },
      // hazards everywhere
      { x: 240, y: 460, w: 48, type: 'hazard' },
      { x: 440, y: 380, w: 48, type: 'hazard' },
      { x: 590, y: 300, w: 48, type: 'hazard' },
      { x: 760, y: 220, w: 48, type: 'hazard' },
      // safety nets
      { x: 200, y: 530, w: 72 },
      { x: 520, y: 480, w: 72 },
      { x: 700, y: 450, w: 72 },
    ],
    spikes: [
      { x: 115, y: 570, w: 80 },
      { x: 280, y: 570, w: 80 },
      { x: 450, y: 570, w: 80 },
      { x: 610, y: 570, w: 80 },
      { x: 770, y: 570, w: 80 },
    ],
    lasers: [
      { x: 290, y: 355, dir: 'h', len: 160, onTime: 1200, offTime: 1000 },
      { x: 625, y: 195, dir: 'h', len: 160, onTime: 1100, offTime: 1100, startOff: true },
      { x: 855, y:  85, dir: 'v', len: 120, onTime: 1400, offTime: 900 },
    ],
    windZones: [
      { x: 460, y: 100, w: 80, h: 300, forceY: -500 },
    ],
    gravFlipZones: [],
    coins: [
      { x: 174, y: 430 }, { x: 354, y: 350 },
      { x: 524, y: 270 }, { x: 684, y: 360 },
      { x: 694, y: 190 }, { x: 810, y: 290 },
      { x: 856, y: 130 }, { x: 884, y:  50 },
      { x: 246, y: 500 },
    ],
    powerups: [
      { x: 174, y: 430, kind: 'shield'     },
      { x: 524, y: 270, kind: 'speed'      },
      { x: 694, y: 190, kind: 'timefreeze' },
    ],
    checkpoints: [
      { x: 300, y: 570 },
      { x: 630, y: 570 },
    ],
  },
];
