import Phaser from 'phaser';
import { Ball } from '../objects/Ball';
import { LEVELS } from '../data/levels';
import type { LevelData, PlatformDef, LaserDef } from '../data/levels';

// ── Internal tracking types ──────────────────────────────────────

interface MovingPlatEntry {
  tile: Phaser.Physics.Arcade.Image;
  def: PlatformDef;
  origin: { x: number; y: number };
  dir: number;
  curX: number;
  curY: number;
}

interface CrumbleEntry {
  tile: Phaser.Physics.Arcade.Image;
  triggered: boolean;
}

interface ConveyorEntry {
  tile: Phaser.Physics.Arcade.Image;
  dir: 1 | -1;
}

interface DisappearEntry {
  tile: Phaser.Physics.Arcade.Image;
  isOn: boolean;
  elapsed: number;
  interval: number;
}

interface LaserEntry {
  gfx: Phaser.GameObjects.Graphics;
  zone: Phaser.Physics.Arcade.Image;
  isOn: boolean;
  elapsed: number;
  onTime: number;
  offTime: number;
  def: LaserDef;
}

interface WindZoneEntry {
  rect: Phaser.Geom.Rectangle;
  forceX: number;
  forceY: number;
  gfx: Phaser.GameObjects.Graphics;
}

interface GravFlipEntry {
  rect: Phaser.Geom.Rectangle;
  gfx: Phaser.GameObjects.Graphics;
}

// ── Scene ────────────────────────────────────────────────────────

export class GameScene extends Phaser.Scene {
  private ball!: Ball;

  // Static platform groups
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private movingPlatforms!: Phaser.Physics.Arcade.StaticGroup;
  private hazards!: Phaser.Physics.Arcade.StaticGroup;
  private spikes!: Phaser.Physics.Arcade.StaticGroup;
  private icePlatforms!: Phaser.Physics.Arcade.StaticGroup;
  private bouncePlatforms!: Phaser.Physics.Arcade.StaticGroup;
  private crumblePlatforms!: Phaser.Physics.Arcade.StaticGroup;
  private conveyorPlatforms!: Phaser.Physics.Arcade.StaticGroup;
  private disappearPlatforms!: Phaser.Physics.Arcade.StaticGroup;
  private laserZones!: Phaser.Physics.Arcade.StaticGroup;
  private coins!: Phaser.Physics.Arcade.StaticGroup;
  private powerupGroup!: Phaser.Physics.Arcade.StaticGroup;
  private checkpointGroup!: Phaser.Physics.Arcade.StaticGroup;
  private portalSprite!: Phaser.Physics.Arcade.Image;
  private portalLocked = true;

  // Tracking arrays
  private movingPlatData: MovingPlatEntry[] = [];
  private crumbleData: CrumbleEntry[] = [];
  private conveyorData: ConveyorEntry[] = [];
  private disappearData: DisappearEntry[] = [];
  private laserData: LaserEntry[] = [];
  private windZoneData: WindZoneEntry[] = [];
  private gravFlipData: GravFlipEntry[] = [];

  // Per-frame platform state
  private rideTarget: MovingPlatEntry | null = null;
  private onIce = false;
  private onConveyor = false;
  private conveyorForce = 0;
  private onBounce = false;
  private inGravFlip = false;
  private baseGravity = 900;

  // Respawn
  private respawnX = 60;
  private respawnY = 530;

  // Coin streak
  private coinStreak = 0;
  private lastCoinTime = 0;

  // Time freeze
  private timeFrozen = false;

  // Input
  private keys!: {
    left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key;
    up:   Phaser.Input.Keyboard.Key; a:     Phaser.Input.Keyboard.Key;
    d:    Phaser.Input.Keyboard.Key; w:     Phaser.Input.Keyboard.Key;
    space: Phaser.Input.Keyboard.Key;
  };
  private jumpDown = false;

  // HUD
  private livesText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private coinText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private levelTitle!: Phaser.GameObjects.Text;
  private warningText!: Phaser.GameObjects.Text;
  private lifeLostOverlay!: Phaser.GameObjects.Text;
  private portalHintText!: Phaser.GameObjects.Text;
  private streakText!: Phaser.GameObjects.Text;

  // State
  private level!: LevelData;
  private levelIndex = 1;
  private lives = 3;
  private score = 0;
  private dubuMode = false;
  private coinsCollected = 0;
  private totalCoins = 0;
  private timeLeft = 60;
  private timerEvent!: Phaser.Time.TimerEvent;
  private dead = false;
  private transitioning = false;
  private warningActive = false;
  private stars!: Phaser.GameObjects.Graphics;

  constructor() { super('Game'); }

  init(data: { level?: number; lives?: number; score?: number; dubuMode?: boolean }) {
    this.levelIndex    = data.level ?? 1;
    this.lives         = data.lives ?? 3;
    this.score         = data.score ?? 0;
    this.dubuMode      = data.dubuMode ?? false;
    this.dead          = false;
    this.transitioning = false;
    this.jumpDown      = false;
    this.coinsCollected = 0;
    this.warningActive = false;
    this.movingPlatData = [];
    this.crumbleData   = [];
    this.conveyorData  = [];
    this.disappearData = [];
    this.laserData     = [];
    this.windZoneData  = [];
    this.gravFlipData  = [];
    this.rideTarget    = null;
    this.onIce         = false;
    this.onConveyor    = false;
    this.conveyorForce = 0;
    this.onBounce      = false;
    this.inGravFlip    = false;
    this.timeFrozen    = false;
    this.coinStreak    = 0;
    this.lastCoinTime  = 0;
  }

  create() {
    const idx        = Math.min(this.levelIndex, LEVELS.length) - 1;
    this.level       = LEVELS[idx];
    this.timeLeft    = this.level.timeLimit;
    this.portalLocked = true;
    this.baseGravity = this.level.gravity ?? 900;

    this.respawnX = this.level.playerStart.x;
    this.respawnY = this.level.playerStart.y;

    (this.physics.world.gravity as Phaser.Math.Vector2).y = this.baseGravity;

    this.cameras.main.setBackgroundColor(this.level.bg);
    this.stars = this.add.graphics();
    this.drawStars();

    // Create all groups
    this.platforms        = this.physics.add.staticGroup();
    this.movingPlatforms  = this.physics.add.staticGroup();
    this.hazards          = this.physics.add.staticGroup();
    this.spikes           = this.physics.add.staticGroup();
    this.icePlatforms     = this.physics.add.staticGroup();
    this.bouncePlatforms  = this.physics.add.staticGroup();
    this.crumblePlatforms = this.physics.add.staticGroup();
    this.conveyorPlatforms= this.physics.add.staticGroup();
    this.disappearPlatforms = this.physics.add.staticGroup();
    this.laserZones       = this.physics.add.staticGroup();
    this.coins            = this.physics.add.staticGroup();
    this.powerupGroup     = this.physics.add.staticGroup();
    this.checkpointGroup  = this.physics.add.staticGroup();

    this.buildPlatforms();
    this.buildSpikes();
    this.buildCoins();
    this.buildPortal();
    this.buildLasers();
    this.buildWindZones();
    this.buildGravFlipZones();
    this.buildPowerups();
    this.buildCheckpoints();

    this.ball = new Ball(this, this.level.playerStart.x, this.level.playerStart.y);

    // Colliders
    this.physics.add.collider(this.ball, this.platforms, () => {
      this.ball.land();
      this.onIce = false;
      this.onConveyor = false;
    });
    this.physics.add.collider(this.ball, this.icePlatforms, () => {
      this.ball.land();
      this.onIce = true;
      this.onConveyor = false;
    });
    this.physics.add.collider(this.ball, this.movingPlatforms, (_b, tile) => {
      this.ball.land();
      this.rideTarget = this.movingPlatData.find(mp => mp.tile === tile) ?? null;
      this.onIce = false;
      this.onConveyor = false;
    });
    this.physics.add.collider(this.ball, this.crumblePlatforms, (_b, tile) => {
      this.ball.land();
      this.onIce = false;
      this.onConveyor = false;
      this.triggerCrumble(tile as Phaser.Physics.Arcade.Image);
    });
    this.physics.add.collider(this.ball, this.conveyorPlatforms, (_b, tile) => {
      this.ball.land();
      this.onIce = false;
      const entry = this.conveyorData.find(c => c.tile === tile);
      if (entry) {
        this.onConveyor = true;
        this.conveyorForce = entry.dir * 140;
      }
    });
    this.physics.add.collider(this.ball, this.disappearPlatforms, (_b, tile) => {
      const t = tile as Phaser.Physics.Arcade.Image;
      if (t.active && t.visible) {
        this.ball.land();
        this.onIce = false;
        this.onConveyor = false;
      }
    });

    // Overlaps — deadly
    this.physics.add.overlap(this.ball, this.hazards,    () => this.killBall('hazard'));
    this.physics.add.overlap(this.ball, this.spikes,     () => this.killBall('spike'));
    this.physics.add.overlap(this.ball, this.laserZones, () => this.killBall('hazard'));

    // Overlaps — bounce
    this.physics.add.overlap(this.ball, this.bouncePlatforms, () => {
      const body = this.ball.body as Phaser.Physics.Arcade.Body;
      if (body.velocity.y >= 0) {
        this.ball.bounceUp();
        this.emitBurst(this.ball.x, this.ball.y, 0x44ff88, 10);
      }
    });

    // Overlaps — collectibles
    this.physics.add.overlap(this.ball, this.coins, (_b, coin) => {
      this.collectCoin(coin as Phaser.Physics.Arcade.Image);
    });
    this.physics.add.overlap(this.ball, this.powerupGroup, (_b, pu) => {
      this.collectPowerup(pu as Phaser.Physics.Arcade.Image);
    });
    this.physics.add.overlap(this.ball, this.checkpointGroup, (_b, cp) => {
      this.activateCheckpoint(cp as Phaser.Physics.Arcade.Image);
    });

    this.wirePortalOverlap();

    const kb = this.input.keyboard!;
    this.keys = {
      left:  kb.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: kb.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      up:    kb.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      a:     kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      d:     kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      w:     kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      space: kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };

    this.buildHUD();

    this.timerEvent = this.time.addEvent({
      delay: 1000, callback: this.tickTimer, callbackScope: this, loop: true,
    });

    this.cameras.main.setBounds(0, 0, 960, 600);
    this.cameras.main.fadeIn(400, 0, 0, 0);

    this.levelTitle = this.add.text(480, 280,
      `LEVEL ${this.level.id}\n${this.level.title}`, {
      fontSize: '40px', fontFamily: 'Arial Black', color: '#ffffff',
      align: 'center', stroke: '#0066ff', strokeThickness: 6,
    }).setOrigin(0.5).setDepth(50).setAlpha(0);

    this.tweens.add({
      targets: this.levelTitle,
      alpha: { from: 0, to: 1 },
      duration: 500, hold: 1000, yoyo: true,
      ease: 'Quad.easeInOut',
    });

    if (this.dubuMode) this.applyDubuTheme();
  }

  // ── Dubu Mode ────────────────────────────────────────────────

  private applyDubuTheme() {
    this.cameras.main.setBackgroundColor(0x1a0822);
    this.drawDubuStars();

    this.ball.clearTint();
    this.ball.setTint(0xff69b4);
    this.ball.dubuMode = true;

    this.platforms.getChildren().forEach(t =>
      (t as Phaser.Physics.Arcade.Image).setTint(0xd8b4fe));
    this.movingPlatforms.getChildren().forEach(t =>
      (t as Phaser.Physics.Arcade.Image).setTint(0xf0abfc));
    this.icePlatforms.getChildren().forEach(t =>
      (t as Phaser.Physics.Arcade.Image).setTint(0xfda4af));
    this.bouncePlatforms.getChildren().forEach(t =>
      (t as Phaser.Physics.Arcade.Image).setTint(0xfb7185));
    this.crumblePlatforms.getChildren().forEach(t =>
      (t as Phaser.Physics.Arcade.Image).setTint(0xf472b6));
    this.conveyorPlatforms.getChildren().forEach(t =>
      (t as Phaser.Physics.Arcade.Image).setTint(0xc084fc));
    this.disappearPlatforms.getChildren().forEach(t =>
      (t as Phaser.Physics.Arcade.Image).setTint(0xa855f7));

    this.portalSprite.setTint(0xff69b4);

    this.livesText.setColor('#ff69b4');
    this.scoreText.setColor('#ffc0cb');
    this.coinText.setColor('#ffb6c1');
    this.timerText.setColor('#ff69b4');
    this.levelTitle.setStroke('#880044', 6);

    const welcome = this.add.text(480, 240, '✨  Welcome, Dubu!  ✨', {
      fontSize: '34px', fontFamily: 'Arial Black', color: '#ff69b4',
      stroke: '#660033', strokeThickness: 5,
      shadow: { color: '#ff69b4', blur: 20, fill: true },
    }).setOrigin(0.5).setDepth(201).setAlpha(0);

    this.tweens.add({
      targets: welcome,
      alpha: { from: 0, to: 1 },
      duration: 500, hold: 1500, yoyo: true,
      ease: 'Quad.easeInOut',
      onComplete: () => welcome.destroy(),
    });

    this.startPetalRain();
  }

  private drawDubuStars() {
    this.stars.clear();
    for (let i = 0; i < 80; i++) {
      const x = Phaser.Math.Between(0, 960);
      const y = Phaser.Math.Between(0, 600);
      const r = Phaser.Math.FloatBetween(0.5, 2.5);
      this.stars.fillStyle(i % 3 === 0 ? 0xff69b4 : 0xffc0cb, Phaser.Math.FloatBetween(0.3, 0.9));
      this.stars.fillCircle(x, y, r);
    }
  }

  private startPetalRain() {
    this.time.addEvent({
      delay: 600,
      repeat: -1,
      callback: () => {
        if (!this.scene.isActive('Game')) return;
        const x = Phaser.Math.Between(0, 960);
        const petal = this.add.image(x, -10, 'petal')
          .setDepth(1)
          .setAlpha(0.55)
          .setTint(Phaser.Math.Between(0, 1) === 1 ? 0xffc0cb : 0xe9d5ff)
          .setAngle(Phaser.Math.Between(0, 360));
        this.tweens.add({
          targets: petal,
          y: 640,
          x: petal.x + Phaser.Math.Between(-60, 60),
          angle: petal.angle + Phaser.Math.Between(-180, 180),
          alpha: 0,
          duration: Phaser.Math.Between(3000, 5000),
          ease: 'Linear',
          onComplete: () => petal.destroy(),
        });
      },
    });
  }

  // ── Build helpers ────────────────────────────────────────────

  private buildPlatforms() {
    const tileW = 32;

    for (const def of this.level.platforms) {
      const type  = def.type ?? 'normal';
      const count = Math.ceil(def.w / tileW);

      if (type === 'hazard') {
        for (let i = 0; i < count; i++) {
          const t = this.hazards.create(
            def.x + i * tileW + tileW / 2, def.y, 'hazard'
          ) as Phaser.Physics.Arcade.Image;
          t.refreshBody();
        }

      } else if (type === 'moving') {
        const cx = def.x + def.w / 2;
        const cy = def.y;
        const tile = this.movingPlatforms.create(cx, cy, 'platform-moving') as Phaser.Physics.Arcade.Image;
        tile.setDisplaySize(def.w, 16);
        const sb = tile.body as Phaser.Physics.Arcade.StaticBody;
        sb.setSize(def.w, 16, false);
        sb.setOffset(0, 0);
        tile.refreshBody();
        this.movingPlatData.push({
          tile, def,
          origin: { x: cx, y: cy },
          dir: 1,
          curX: cx, curY: cy,
        });

      } else if (type === 'ice') {
        for (let i = 0; i < count; i++) {
          const t = this.icePlatforms.create(
            def.x + i * tileW + tileW / 2, def.y, 'platform-ice'
          ) as Phaser.Physics.Arcade.Image;
          t.refreshBody();
        }

      } else if (type === 'bounce') {
        for (let i = 0; i < count; i++) {
          const t = this.bouncePlatforms.create(
            def.x + i * tileW + tileW / 2, def.y, 'platform-bounce'
          ) as Phaser.Physics.Arcade.Image;
          t.refreshBody();
          // Pulse animation
          this.tweens.add({
            targets: t,
            scaleY: { from: 1, to: 0.7 },
            duration: 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
          });
        }

      } else if (type === 'crumble') {
        for (let i = 0; i < count; i++) {
          const t = this.crumblePlatforms.create(
            def.x + i * tileW + tileW / 2, def.y, 'platform-crumble'
          ) as Phaser.Physics.Arcade.Image;
          t.refreshBody();
          this.crumbleData.push({ tile: t, triggered: false });
        }

      } else if (type === 'conveyor') {
        const dir = def.conveyorDir ?? 1;
        for (let i = 0; i < count; i++) {
          const t = this.conveyorPlatforms.create(
            def.x + i * tileW + tileW / 2, def.y, 'platform-conveyor'
          ) as Phaser.Physics.Arcade.Image;
          if (dir === -1) t.setFlipX(true);
          t.refreshBody();
          this.conveyorData.push({ tile: t, dir });
          // Rolling animation
          this.tweens.add({
            targets: t,
            x: t.x + (dir * 6),
            duration: 300, yoyo: true, repeat: -1, ease: 'Linear',
          });
        }

      } else if (type === 'disappear') {
        const interval = def.disappearInterval ?? 1200;
        const startOff = def.disappearStartOff ?? false;
        for (let i = 0; i < count; i++) {
          const t = this.disappearPlatforms.create(
            def.x + i * tileW + tileW / 2, def.y, 'platform-disappear'
          ) as Phaser.Physics.Arcade.Image;
          t.refreshBody();
          if (startOff) {
            t.setVisible(false);
            t.setActive(false);
            (t.body as Phaser.Physics.Arcade.StaticBody).enable = false;
          }
          this.disappearData.push({
            tile: t,
            isOn: !startOff,
            elapsed: 0,
            interval,
          });
        }

      } else {
        // normal
        for (let i = 0; i < count; i++) {
          const t = this.platforms.create(
            def.x + i * tileW + tileW / 2, def.y, 'platform'
          ) as Phaser.Physics.Arcade.Image;
          t.refreshBody();
        }
      }
    }
  }

  private buildSpikes() {
    const tileW = 32;
    for (const def of this.level.spikes) {
      const count = Math.ceil(def.w / tileW);
      for (let i = 0; i < count; i++) {
        const t = this.spikes.create(
          def.x + i * tileW + tileW / 2, def.y, 'spike'
        ) as Phaser.Physics.Arcade.Image;
        t.refreshBody();
      }
    }
  }

  private buildCoins() {
    this.totalCoins = this.level.coins.length;
    for (const c of this.level.coins) {
      const coin = this.coins.create(c.x, c.y, 'coin') as Phaser.Physics.Arcade.Image;
      coin.refreshBody();
      this.tweens.add({
        targets: coin, y: c.y - 8,
        duration: 800 + Math.random() * 400,
        yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      });
    }
  }

  private buildPortal() {
    const { x, y } = this.level.portal;
    this.portalSprite = this.physics.add.image(x, y, 'portal-locked');
    const pb = this.portalSprite.body as Phaser.Physics.Arcade.Body;
    pb.setAllowGravity(false);
    pb.setImmovable(true);
    this.portalSprite.setDepth(5);

    this.tweens.add({
      targets: this.portalSprite,
      angle: 360, duration: 3000, repeat: -1, ease: 'Linear',
    });
    this.tweens.add({
      targets: this.portalSprite,
      scaleX: { from: 0.9, to: 1.1 }, scaleY: { from: 0.9, to: 1.1 },
      duration: 1200, yoyo: true, repeat: -1,
    });

    const need = this.level.requiredCoins;
    this.portalHintText = this.add.text(x, y + 38, `🔒 Need ${need} ♥`, {
      fontSize: '13px', fontFamily: 'Arial', color: '#ff8888',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5, 0).setDepth(20);
  }

  private buildLasers() {
    for (const def of (this.level.lasers ?? [])) {
      const isH  = def.dir === 'h';
      const w    = isH ? def.len : 6;
      const h    = isH ? 6 : def.len;
      const cx   = def.x + w / 2;
      const cy   = def.y + h / 2;

      // Visual
      const gfx = this.add.graphics().setDepth(12);

      // Kill zone — invisible static body
      const zone = this.laserZones.create(cx, cy, '__DEFAULT') as Phaser.Physics.Arcade.Image;
      zone.setDisplaySize(w, h);
      zone.setAlpha(0);
      zone.setTexture('particle'); // placeholder texture
      const zb = zone.body as Phaser.Physics.Arcade.StaticBody;
      zb.setSize(w, h, false);
      zone.refreshBody();

      const isOn = !(def.startOff ?? false);
      if (!isOn) {
        (zone.body as Phaser.Physics.Arcade.StaticBody).enable = false;
      }

      const entry: LaserEntry = {
        gfx, zone,
        isOn,
        elapsed: 0,
        onTime:  def.onTime,
        offTime: def.offTime,
        def,
      };
      this.laserData.push(entry);
      this.drawLaser(entry);
    }
  }

  private drawLaser(entry: LaserEntry) {
    const { gfx, def, isOn } = entry;
    gfx.clear();
    if (!isOn) return;

    const isH = def.dir === 'h';
    const x1  = def.x;
    const y1  = def.y;
    const x2  = isH ? def.x + def.len : def.x;
    const y2  = isH ? def.y : def.y + def.len;

    // Glow outer
    gfx.lineStyle(6, 0xff2200, 0.3);
    gfx.lineBetween(x1, y1, x2, y2);
    // Core
    gfx.lineStyle(3, 0xff6600, 1.0);
    gfx.lineBetween(x1, y1, x2, y2);
    // Bright center
    gfx.lineStyle(1, 0xffffff, 0.9);
    gfx.lineBetween(x1, y1, x2, y2);
  }

  private buildWindZones() {
    for (const def of (this.level.windZones ?? [])) {
      const gfx = this.add.graphics().setDepth(2).setAlpha(0.18);
      const color = (def.forceY ?? 0) < 0 ? 0x88ddff : 0xffee88;
      gfx.fillStyle(color);
      gfx.fillRect(def.x, def.y, def.w, def.h);
      gfx.lineStyle(1, color, 0.5);
      gfx.strokeRect(def.x, def.y, def.w, def.h);

      // Animated arrow hint
      this.time.addEvent({
        delay: 400, repeat: -1, callback: () => {
          if (!this.scene.isActive('Game')) return;
          const arrowGfx = this.add.graphics().setDepth(3).setAlpha(0.5);
          arrowGfx.fillStyle(color);
          const mx = def.x + def.w / 2;
          const my = def.y + def.h / 2;
          if ((def.forceY ?? 0) < 0) {
            arrowGfx.fillTriangle(mx, my - 12, mx - 8, my + 4, mx + 8, my + 4);
          } else if ((def.forceX ?? 0) > 0) {
            arrowGfx.fillTriangle(mx + 12, my, mx - 4, my - 8, mx - 4, my + 8);
          } else {
            arrowGfx.fillTriangle(mx - 12, my, mx + 4, my - 8, mx + 4, my + 8);
          }
          this.tweens.add({
            targets: arrowGfx,
            y: arrowGfx.y + ((def.forceY ?? 0) < 0 ? -20 : 0),
            x: arrowGfx.x + ((def.forceX ?? 0) !== 0 ? ((def.forceX ?? 0) > 0 ? 20 : -20) : 0),
            alpha: 0,
            duration: 600,
            onComplete: () => arrowGfx.destroy(),
          });
        },
      });

      this.windZoneData.push({
        rect: new Phaser.Geom.Rectangle(def.x, def.y, def.w, def.h),
        forceX: def.forceX ?? 0,
        forceY: def.forceY ?? 0,
        gfx,
      });
    }
  }

  private buildGravFlipZones() {
    for (const def of (this.level.gravFlipZones ?? [])) {
      const gfx = this.add.graphics().setDepth(2).setAlpha(0.12);
      gfx.fillStyle(0xdd00ff);
      gfx.fillRect(def.x, def.y, def.w, def.h);
      gfx.lineStyle(2, 0xdd00ff, 0.4);
      gfx.strokeRect(def.x, def.y, def.w, def.h);

      // Warning label
      this.add.text(
        def.x + def.w / 2, def.y + def.h / 2,
        '⚠ GRAVITY\nFLIP', {
        fontSize: '11px', fontFamily: 'Arial', color: '#dd88ff',
        align: 'center', stroke: '#000', strokeThickness: 2,
      }).setOrigin(0.5).setDepth(3).setAlpha(0.7);

      this.gravFlipData.push({
        rect: new Phaser.Geom.Rectangle(def.x, def.y, def.w, def.h),
        gfx,
      });
    }
  }

  private buildPowerups() {
    for (const def of (this.level.powerups ?? [])) {
      const texKey = `powerup-${def.kind}`;
      const pu = this.powerupGroup.create(def.x, def.y, texKey) as Phaser.Physics.Arcade.Image;
      pu.setData('kind', def.kind);
      pu.refreshBody();
      this.tweens.add({
        targets: pu, y: def.y - 10,
        duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      });
      this.tweens.add({
        targets: pu, angle: 360,
        duration: 2000, repeat: -1, ease: 'Linear',
      });
    }
  }

  private buildCheckpoints() {
    for (const def of (this.level.checkpoints ?? [])) {
      const cp = this.checkpointGroup.create(def.x, def.y - 16, 'checkpoint') as Phaser.Physics.Arcade.Image;
      cp.setData('activated', false);
      cp.setData('spawnX', def.x);
      cp.setData('spawnY', def.y);
      cp.refreshBody();
      this.tweens.add({
        targets: cp,
        angle: { from: -5, to: 5 },
        duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      });
    }
  }

  private wirePortalOverlap() {
    this.physics.add.overlap(this.ball, this.portalSprite, () => {
      if (this.portalLocked) this.showLockedWarning();
      else                   this.reachPortal();
    });
  }

  private buildHUD() {
    const s = { fontSize: '18px', fontFamily: 'Arial Black', color: '#ffffff',
                stroke: '#000000', strokeThickness: 3 };

    this.add.text(12,  8, 'LIVES:', s).setDepth(100);
    this.livesText = this.add.text(80, 8, '♥♥♥', { ...s, color: '#ff4466' }).setDepth(100);

    this.add.text(12, 32, 'SCORE:', s).setDepth(100);
    this.scoreText = this.add.text(80, 32, `${this.score}`, s).setDepth(100);

    this.coinText = this.add.text(480, 8,
      `♥ 0/${this.totalCoins}  (need ${this.level.requiredCoins})`,
      { ...s, color: '#ff88bb' }).setOrigin(0.5, 0).setDepth(100);

    this.timerText = this.add.text(870, 8, `⏱ ${this.timeLeft}s`,
      { ...s, color: '#00ffaa' }).setDepth(100);

    this.add.text(480, 32, `LEVEL ${this.level.id} – ${this.level.title}`, {
      fontSize: '14px', fontFamily: 'Arial', color: '#8899ff',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5, 0).setDepth(100);

    this.warningText = this.add.text(480, 300, '', {
      fontSize: '28px', fontFamily: 'Arial Black', color: '#ff2244',
      stroke: '#000000', strokeThickness: 4,
      shadow: { color: '#ff0000', blur: 16, fill: true },
    }).setOrigin(0.5).setDepth(200).setAlpha(0);

    this.lifeLostOverlay = this.add.text(480, 300, '', {
      fontSize: '52px', fontFamily: 'Arial Black', color: '#ff2244',
      stroke: '#000000', strokeThickness: 6,
      shadow: { color: '#ff0000', blur: 30, fill: true },
    }).setOrigin(0.5).setDepth(200).setAlpha(0);

    this.streakText = this.add.text(480, 58, '', {
      fontSize: '16px', fontFamily: 'Arial Black', color: '#ffaa00',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5, 0).setDepth(100).setAlpha(0);
  }

  // ── Game logic ───────────────────────────────────────────────

  private tickTimer() {
    if (this.dead || this.transitioning || this.timeFrozen) return;
    this.timeLeft--;
    this.timerText.setText(`⏱ ${this.timeLeft}s`);
    if (this.timeLeft <= 10) this.timerText.setColor('#ff4444');
    if (this.timeLeft <= 0)  this.killBall('timeout');
  }

  private collectCoin(coin: Phaser.Physics.Arcade.Image) {
    coin.destroy();
    this.coinsCollected++;

    // Streak multiplier: reset streak after 2.5s with no coin
    const now = this.time.now;
    if (now - this.lastCoinTime < 2500) {
      this.coinStreak++;
    } else {
      this.coinStreak = 1;
    }
    this.lastCoinTime = now;

    const mult   = this.coinStreak >= 6 ? 3 : this.coinStreak >= 3 ? 2 : 1;
    const points = 100 * mult;
    this.score  += points;
    this.scoreText.setText(`${this.score}`);
    this.coinText.setText(`♥ ${this.coinsCollected}/${this.totalCoins}  (need ${this.level.requiredCoins})`);

    if (this.coinsCollected >= this.level.requiredCoins && this.portalLocked) {
      this.unlockPortal();
    }

    // Pop text
    const label = mult > 1 ? `+${points} x${mult}!` : `+${points}`;
    const pop = this.add.text(coin.x, coin.y - 10, label, {
      fontSize: mult > 1 ? '20px' : '16px',
      fontFamily: 'Arial Black',
      color: mult >= 3 ? '#ff8800' : mult === 2 ? '#ffdd00' : '#ffdd00',
    }).setDepth(50).setOrigin(0.5);
    this.tweens.add({
      targets: pop, y: pop.y - 40, alpha: 0, duration: 700,
      onComplete: () => pop.destroy(),
    });

    // Streak HUD
    if (mult > 1) {
      this.streakText.setText(`🔥 ${this.coinStreak} STREAK! x${mult}`);
      this.tweens.killTweensOf(this.streakText);
      this.streakText.setAlpha(1);
      this.tweens.add({
        targets: this.streakText, alpha: 0, duration: 1200, delay: 800,
      });
    }
  }

  private collectPowerup(pu: Phaser.Physics.Arcade.Image) {
    const kind = pu.getData('kind') as string;
    pu.destroy();

    this.emitBurst(pu.x, pu.y, 0xffffff, 12);

    let label = '';
    if (kind === 'shield') {
      this.ball.activateShield();
      label = '🛡 SHIELD!';
    } else if (kind === 'speed') {
      this.ball.activateSpeed(5000);
      label = '⚡ SPEED BOOST!';
    } else if (kind === 'timefreeze') {
      this.activateTimeFreeze(8000);
      label = '❄ TIME FROZEN!';
    }

    const banner = this.add.text(480, 200, label, {
      fontSize: '28px', fontFamily: 'Arial Black', color: '#00ffcc',
      stroke: '#004444', strokeThickness: 4,
      shadow: { color: '#00ffcc', blur: 16, fill: true },
    }).setOrigin(0.5).setDepth(200).setAlpha(0);

    this.tweens.add({
      targets: banner,
      alpha: { from: 0, to: 1 },
      duration: 250, hold: 1200, yoyo: true,
      onComplete: () => banner.destroy(),
    });
  }

  private activateTimeFreeze(duration: number) {
    this.timeFrozen = true;
    this.timerText.setColor('#88ffff');
    // Freeze visual on timer
    this.time.delayedCall(duration, () => {
      this.timeFrozen = false;
      this.timerText.setColor(this.timeLeft <= 10 ? '#ff4444' : '#00ffaa');
    });
  }

  private activateCheckpoint(cp: Phaser.Physics.Arcade.Image) {
    if (cp.getData('activated')) return;
    cp.setData('activated', true);
    cp.setTexture('checkpoint-active');

    this.respawnX = cp.getData('spawnX') as number;
    this.respawnY = cp.getData('spawnY') as number;

    this.cameras.main.flash(150, 255, 220, 0, false);
    const banner = this.add.text(480, 160, '✓ CHECKPOINT!', {
      fontSize: '26px', fontFamily: 'Arial Black', color: '#ffdd00',
      stroke: '#886600', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(200).setAlpha(0);

    this.tweens.add({
      targets: banner,
      alpha: { from: 0, to: 1 },
      duration: 200, hold: 1000, yoyo: true,
      onComplete: () => banner.destroy(),
    });
  }

  private triggerCrumble(tile: Phaser.Physics.Arcade.Image) {
    const entry = this.crumbleData.find(c => c.tile === tile);
    if (!entry || entry.triggered) return;
    entry.triggered = true;

    // Shake then fall
    this.tweens.add({
      targets: tile,
      x: { from: tile.x - 3, to: tile.x + 3 },
      duration: 80, yoyo: true, repeat: 6,
      onComplete: () => {
        // Disable body so no more collision
        (tile.body as Phaser.Physics.Arcade.StaticBody).enable = false;
        this.tweens.add({
          targets: tile,
          y: tile.y + 300,
          alpha: 0,
          duration: 500,
          ease: 'Quad.easeIn',
          onComplete: () => tile.destroy(),
        });
      },
    });
  }

  private unlockPortal() {
    this.portalLocked = false;
    this.portalSprite.setTexture('portal');
    if (this.portalHintText?.active) this.portalHintText.destroy();
    this.coinText.setColor('#00ffaa');

    const banner = this.add.text(480, 240, '✓ PORTAL UNLOCKED!', {
      fontSize: '30px', fontFamily: 'Arial Black', color: '#00ffaa',
      stroke: '#007744', strokeThickness: 5,
      shadow: { color: '#00ffaa', blur: 20, fill: true },
    }).setOrigin(0.5).setDepth(200).setAlpha(0);

    this.tweens.add({
      targets: banner,
      alpha: { from: 0, to: 1 },
      duration: 300, hold: 1200, yoyo: true,
      ease: 'Quad.easeInOut',
      onComplete: () => banner.destroy(),
    });
    this.cameras.main.flash(200, 0, 255, 100, false);
  }

  private showLockedWarning() {
    if (this.warningActive) return;
    this.warningActive = true;
    const need = this.level.requiredCoins - this.coinsCollected;
    this.warningText.setText(`🔒 Collect ${need} more heart${need !== 1 ? 's' : ''} first!`);
    this.tweens.add({
      targets: this.warningText,
      alpha: { from: 0, to: 1 },
      duration: 200, hold: 1400, yoyo: true,
      ease: 'Quad.easeInOut',
      onComplete: () => { this.warningActive = false; },
    });
    const px = this.level.portal.x;
    this.tweens.add({
      targets: this.portalSprite,
      x: { from: px - 6, to: px + 6 },
      duration: 60, yoyo: true, repeat: 4,
      onComplete: () => { this.portalSprite.x = px; },
    });
  }

  private reachPortal() {
    if (this.transitioning) return;
    this.transitioning = true;
    this.timerEvent.remove();

    const timeBonus = this.timeLeft * 10;
    const coinBonus = this.coinsCollected === this.totalCoins ? 500 : 0;
    this.score += timeBonus + coinBonus;

    this.emitBurst(this.level.portal.x, this.level.portal.y, 0x00ccff, 22);
    this.cameras.main.flash(300, 255, 255, 255);

    this.time.delayedCall(800, () => {
      this.scene.start('LevelComplete', {
        level: this.levelIndex, lives: this.lives, score: this.score,
        timeBonus, coinBonus, allCoins: this.coinsCollected === this.totalCoins,
        dubuMode: this.dubuMode,
      });
    });
  }

  // ── Death & respawn ──────────────────────────────────────────

  private killBall(cause: 'hazard' | 'spike' | 'fall' | 'timeout' = 'fall') {
    if (this.dead || this.transitioning) return;

    // Shield absorbs one death
    if (cause !== 'timeout' && this.ball.hasShield) {
      this.ball.consumeShield();
      this.cameras.main.shake(200, 0.01);
      return;
    }

    this.dead = true;
    this.lives--;
    this.updateLivesDisplay();

    const body = this.ball.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    body.setAllowGravity(false);
    this.ball.setTint(0xff2222);

    this.cameras.main.shake(400, 0.02);
    this.cameras.main.flash(200, 255, 0, 0, false);
    this.emitBurst(this.ball.x, this.ball.y, 0xff4422, 18);

    const msg = cause === 'timeout' ? '⏱  TIME UP!' : '💀  LIFE LOST!';
    this.lifeLostOverlay.setText(msg);
    this.tweens.add({
      targets: this.lifeLostOverlay,
      alpha: { from: 0, to: 1 },
      scaleX: { from: 0.5, to: 1 }, scaleY: { from: 0.5, to: 1 },
      duration: 250, hold: 900, yoyo: true,
      ease: 'Back.easeOut',
    });

    if (this.lives > 0) {
      const sub = this.add.text(480, 360,
        `${this.lives} ${this.lives === 1 ? 'life' : 'lives'} remaining`, {
        fontSize: '22px', fontFamily: 'Arial', color: '#ffaaaa',
        stroke: '#000', strokeThickness: 3,
      }).setOrigin(0.5).setDepth(200).setAlpha(0);
      this.tweens.add({
        targets: sub,
        alpha: { from: 0, to: 1 },
        duration: 200, delay: 150, hold: 700, yoyo: true,
        onComplete: () => sub.destroy(),
      });
    }

    this.time.delayedCall(1400, () => {
      if (this.lives <= 0) {
        this.timerEvent.remove();
        this.scene.start('GameOver', { score: this.score, dubuMode: this.dubuMode, level: this.levelIndex });
      } else {
        this.respawn();
      }
    });
  }

  private respawn() {
    this.dead = false;
    this.rideTarget = null;
    this.onIce = false;
    this.onConveyor = false;
    this.inGravFlip = false;
    // Restore normal gravity on respawn
    (this.physics.world.gravity as Phaser.Math.Vector2).y = this.baseGravity;

    this.ball.setPosition(this.respawnX, this.respawnY);
    const body = this.ball.body as Phaser.Physics.Arcade.Body;
    body.reset(this.respawnX, this.respawnY);
    body.setVelocity(0, 0);
    body.setAllowGravity(true);
    this.ball.setTint(this.dubuMode ? 0xff69b4 : 0x44aaff);
    this.timeLeft = this.level.timeLimit;
    this.timerText.setText(`⏱ ${this.timeLeft}s`).setColor('#00ffaa');
    this.timeFrozen = false;
  }

  // ── Particles ─────────────────────────────────────────────────

  private emitBurst(x: number, y: number, color: number, count: number) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = Phaser.Math.Between(60, 200);
      const p = this.add.graphics().setDepth(15);
      p.fillStyle(i % 2 === 0 ? color : 0xffffff);
      p.fillCircle(0, 0, Phaser.Math.Between(3, 8));
      p.x = x; p.y = y;
      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed,
        alpha: 0,
        duration: Phaser.Math.Between(500, 800),
        ease: 'Quad.easeOut',
        onComplete: () => p.destroy(),
      });
    }
  }

  // ── HUD helpers ───────────────────────────────────────────────

  private updateLivesDisplay() {
    const filled = Math.max(0, this.lives);
    const empty  = Math.max(0, 3 - this.lives);
    this.livesText.setText('♥'.repeat(filled) + '♡'.repeat(empty));
    if (this.lives === 1) this.livesText.setColor('#ff8800');
  }

  private drawStars() {
    this.stars.clear();
    for (let i = 0; i < 80; i++) {
      const x = Phaser.Math.Between(0, 960);
      const y = Phaser.Math.Between(0, 600);
      const r = Phaser.Math.FloatBetween(0.5, 2);
      this.stars.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.2, 0.8));
      this.stars.fillCircle(x, y, r);
    }
  }

  // ── Update loop ───────────────────────────────────────────────

  update(_time: number, delta: number) {
    if (this.dead || this.transitioning) return;

    const goLeft  = this.keys.left.isDown  || this.keys.a.isDown;
    const goRight = this.keys.right.isDown || this.keys.d.isDown;
    const jumpPressed = this.keys.up.isDown || this.keys.w.isDown || this.keys.space.isDown;

    // Movement — ice uses 1.0 friction multiplier (normal accel, slow stop)
    if (goLeft)       this.ball.moveLeft();
    else if (goRight) this.ball.moveRight();
    else              this.ball.idle(this.onIce);

    // Conveyor push — only when grounded on conveyor
    if (this.onConveyor) {
      const body = this.ball.body as Phaser.Physics.Arcade.Body;
      body.setVelocityX(body.velocity.x + this.conveyorForce * (delta / 1000) * 8);
    }

    if (jumpPressed && !this.jumpDown) this.ball.jump();
    this.jumpDown = jumpPressed;

    // Ground check — reset platform-type state when airborne
    const body = this.ball.body as Phaser.Physics.Arcade.Body;
    if (!body.blocked.down) {
      this.ball.leave();
      this.rideTarget   = null;
      this.onIce        = false;
      this.onConveyor   = false;
      this.conveyorForce = 0;
    }

    this.ball.update(delta);

    // ── Moving platforms ─────────────────────────────────────
    for (const mp of this.movingPlatData) {
      const oldX  = mp.curX;
      const oldY  = mp.curY;
      const speed = (mp.def.moveSpeed ?? 80) / 1000;
      const range = mp.def.moveRange ?? 100;

      if (mp.def.moveX) {
        mp.curX += speed * delta * mp.dir;
        if (mp.curX >= mp.origin.x + range) { mp.curX = mp.origin.x + range; mp.dir = -1; }
        if (mp.curX <= mp.origin.x - range) { mp.curX = mp.origin.x - range; mp.dir =  1; }
        mp.tile.x = mp.curX;
      } else if (mp.def.moveY) {
        mp.curY += speed * delta * mp.dir;
        if (mp.curY >= mp.origin.y + range) { mp.curY = mp.origin.y + range; mp.dir = -1; }
        if (mp.curY <= mp.origin.y - range) { mp.curY = mp.origin.y - range; mp.dir =  1; }
        mp.tile.y = mp.curY;
      }

      (mp.tile.body as Phaser.Physics.Arcade.StaticBody).reset(mp.curX, mp.curY);

      if (this.rideTarget === mp) {
        const dx = mp.curX - oldX;
        const dy = mp.curY - oldY;
        const b  = this.ball.body as Phaser.Physics.Arcade.Body;
        b.position.x += dx;
        b.position.y += dy;
        b.prev.x     += dx;
        b.prev.y     += dy;
      }
    }

    // ── Disappearing platforms ───────────────────────────────
    for (const dp of this.disappearData) {
      dp.elapsed += delta;
      if (dp.elapsed >= dp.interval) {
        dp.elapsed = 0;
        dp.isOn = !dp.isOn;
        dp.tile.setVisible(dp.isOn);
        dp.tile.setActive(dp.isOn);
        (dp.tile.body as Phaser.Physics.Arcade.StaticBody).enable = dp.isOn;
        // Blink flash
        if (dp.isOn) {
          this.tweens.add({
            targets: dp.tile, alpha: { from: 0.3, to: 1 }, duration: 200,
          });
        } else {
          this.tweens.add({
            targets: dp.tile, alpha: { from: 1, to: 0.1 }, duration: 150,
            onComplete: () => dp.tile.setAlpha(1),
          });
        }
      }
    }

    // ── Lasers ───────────────────────────────────────────────
    for (const laser of this.laserData) {
      laser.elapsed += delta;
      const threshold = laser.isOn ? laser.onTime : laser.offTime;
      if (laser.elapsed >= threshold) {
        laser.elapsed = 0;
        laser.isOn = !laser.isOn;
        (laser.zone.body as Phaser.Physics.Arcade.StaticBody).enable = laser.isOn;
        this.drawLaser(laser);
        // Warning flicker when about to turn on
        if (laser.isOn) {
          this.cameras.main.flash(80, 255, 100, 0, false);
        }
      }
      // Pulsing glow when on
      if (laser.isOn) {
        const pulse = 0.7 + 0.3 * Math.sin(this.time.now / 120);
        laser.gfx.setAlpha(pulse);
      }
    }

    // ── Wind zones ───────────────────────────────────────────
    for (const wz of this.windZoneData) {
      if (Phaser.Geom.Rectangle.Contains(wz.rect, this.ball.x, this.ball.y)) {
        const b = this.ball.body as Phaser.Physics.Arcade.Body;
        b.setVelocityX(b.velocity.x + wz.forceX * (delta / 1000));
        b.setVelocityY(b.velocity.y + wz.forceY * (delta / 1000));
      }
    }

    // ── Gravity flip zones ────────────────────────────────────
    let nowInFlip = false;
    for (const gz of this.gravFlipData) {
      if (Phaser.Geom.Rectangle.Contains(gz.rect, this.ball.x, this.ball.y)) {
        nowInFlip = true;
        break;
      }
    }
    if (nowInFlip !== this.inGravFlip) {
      this.inGravFlip = nowInFlip;
      const newGrav = nowInFlip ? -this.baseGravity : this.baseGravity;
      (this.physics.world.gravity as Phaser.Math.Vector2).y = newGrav;
      // Give slight vertical nudge to help transition
      const b = this.ball.body as Phaser.Physics.Arcade.Body;
      b.setVelocityY(nowInFlip ? -150 : 150);
      this.cameras.main.flash(120, 180, 0, 255, false);
    }

    // Fall-off death
    if (this.ball.y > 630 || this.ball.y < -60) this.killBall('fall');
  }
}
