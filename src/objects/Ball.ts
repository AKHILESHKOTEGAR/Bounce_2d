import Phaser from 'phaser';

const BASE_SPEED = 220;
const JUMP_VEL   = -480;
const MAX_JUMPS  = 2;

export class Ball extends Phaser.Physics.Arcade.Sprite {
  private jumpsLeft = MAX_JUMPS;
  private isGrounded = false;
  private trail: Phaser.GameObjects.Graphics[] = [];
  private trailTimer = 0;
  private glowTween?: Phaser.Tweens.Tween;
  private shieldGfx?: Phaser.GameObjects.Graphics;
  private speedTween?: Phaser.Tweens.Tween;

  // Power-up state (read by GameScene)
  hasShield = false;
  speedBoost = false;
  dubuMode = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'ball');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCircle(22, 2, 2);
    this.setBounce(0.25);
    this.setCollideWorldBounds(true);
    this.setTint(0x44aaff);
    this.setDepth(10);
    this.startGlow();
  }

  private startGlow() {
    this.glowTween = this.scene.tweens.add({
      targets: this,
      alpha: { from: 0.85, to: 1 },
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  resetJumps() { this.jumpsLeft = MAX_JUMPS; }

  land() {
    if (!this.isGrounded) {
      this.isGrounded = true;
      this.resetJumps();
    }
  }

  leave() { this.isGrounded = false; }

  jump() {
    if (this.jumpsLeft > 0) {
      const vel = this.jumpsLeft === MAX_JUMPS ? JUMP_VEL : JUMP_VEL * 0.85;
      (this.body as Phaser.Physics.Arcade.Body).setVelocityY(vel);
      this.jumpsLeft--;
      this.isGrounded = false;
      this.emitJumpParticles();
    }
  }

  bounceUp() {
    (this.body as Phaser.Physics.Arcade.Body).setVelocityY(-900);
    this.jumpsLeft = MAX_JUMPS;
    this.isGrounded = false;
    this.emitJumpParticles();
    this.emitJumpParticles();
  }

  moveLeft(friction = 1) {
    const speed = BASE_SPEED * (this.speedBoost ? 1.8 : 1) * friction;
    (this.body as Phaser.Physics.Arcade.Body).setVelocityX(-speed);
  }

  moveRight(friction = 1) {
    const speed = BASE_SPEED * (this.speedBoost ? 1.8 : 1) * friction;
    (this.body as Phaser.Physics.Arcade.Body).setVelocityX(speed);
  }

  idle(iceDecay = false) {
    const body = this.body as Phaser.Physics.Arcade.Body;
    // ice: 0.995 (almost no friction), normal: 0.75
    body.setVelocityX(body.velocity.x * (iceDecay ? 0.992 : 0.75));
  }

  activateShield() {
    this.hasShield = true;
    this.setTint(0x4488ff);
    if (this.shieldGfx) this.shieldGfx.destroy();
    this.shieldGfx = this.scene.add.graphics().setDepth(9);
    this.scene.tweens.add({
      targets: this.shieldGfx,
      alpha: { from: 0.6, to: 0.2 },
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
  }

  activateSpeed(duration = 5000) {
    this.speedBoost = true;
    this.setTint(0xffdd00);
    if (this.speedTween) this.speedTween.stop();
    this.scene.time.delayedCall(duration, () => {
      this.speedBoost = false;
      this.setTint(this.hasShield ? 0x4488ff : (this.dubuMode ? 0xff69b4 : 0x44aaff));
    });
  }

  consumeShield() {
    this.hasShield = false;
    this.shieldGfx?.destroy();
    this.shieldGfx = undefined;
    const baseColor = this.dubuMode ? 0xff69b4 : 0x44aaff;
    this.setTint(baseColor);
    this.scene.tweens.add({
      targets: this, tint: 0xffffff,
      duration: 100, yoyo: true,
      onComplete: () => this.setTint(baseColor),
    });
  }

  private emitJumpParticles() {
    for (let i = 0; i < 8; i++) {
      const angle = Phaser.Math.FloatBetween(Math.PI * 0.75, Math.PI * 1.25);
      const speed = Phaser.Math.FloatBetween(60, 160);
      const p = this.scene.add.graphics().setDepth(9);
      p.fillStyle(this.dubuMode ? 0xff69b4 : 0x44aaff, 0.9);
      p.fillCircle(0, 0, Phaser.Math.Between(2, 5));
      p.x = this.x;
      p.y = this.y + 20;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      this.scene.tweens.add({
        targets: p,
        x: p.x + vx * 0.4,
        y: p.y + vy * 0.4,
        alpha: 0,
        scaleX: 0.1,
        scaleY: 0.1,
        duration: 400,
        ease: 'Quad.easeOut',
        onComplete: () => p.destroy(),
      });
    }
  }

  update(delta: number) {
    this.trailTimer += delta;
    if (this.trailTimer > 40) {
      this.trailTimer = 0;
      const color = this.speedBoost ? 0xdd9900 : (this.dubuMode ? 0xdd88aa : 0x2266cc);
      const t = this.scene.add.graphics().setDepth(8);
      t.fillStyle(color, 0.35);
      t.fillCircle(this.x, this.y, 18);
      this.trail.push(t);
      this.scene.tweens.add({
        targets: t,
        alpha: 0,
        scaleX: 0.3,
        scaleY: 0.3,
        duration: 250,
        onComplete: () => {
          t.destroy();
          this.trail = this.trail.filter(x => x !== t);
        },
      });
    }

    // Shield halo follows ball
    if (this.shieldGfx && this.hasShield) {
      this.shieldGfx.clear();
      this.shieldGfx.lineStyle(3, 0x4488ff, this.shieldGfx.alpha);
      this.shieldGfx.strokeCircle(this.x, this.y, 30);
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    this.angle += body.velocity.x * 0.003 * delta;
  }

  destroy(fromScene?: boolean) {
    this.glowTween?.stop();
    this.shieldGfx?.destroy();
    this.trail.forEach(t => t.destroy());
    super.destroy(fromScene);
  }
}
