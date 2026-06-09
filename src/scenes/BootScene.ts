import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    this.generateTextures();
    this.scene.start('Menu');
  }

  private generateTextures() {
    const g = this.make.graphics({ x: 0, y: 0 });

    // Ball
    g.clear();
    g.fillStyle(0xffffff);
    g.fillCircle(24, 24, 24);
    g.generateTexture('ball', 48, 48);

    // Normal platform tile
    g.clear();
    g.fillStyle(0x3366dd);
    g.fillRect(0, 0, 32, 16);
    g.fillStyle(0x5588ff);
    g.fillRect(0, 0, 32, 4);
    g.lineStyle(1, 0x88aaff);
    g.strokeRect(0, 0, 32, 16);
    g.generateTexture('platform', 32, 16);

    // Moving platform tile
    g.clear();
    g.fillStyle(0xcc5500);
    g.fillRect(0, 0, 32, 16);
    g.fillStyle(0xff8844);
    g.fillRect(0, 0, 32, 4);
    g.lineStyle(1, 0xffaa66);
    g.strokeRect(0, 0, 32, 16);
    g.fillStyle(0xffcc88);
    g.fillTriangle(10, 8, 4, 14, 4, 2);
    g.fillTriangle(22, 8, 28, 2, 28, 14);
    g.generateTexture('platform-moving', 32, 16);

    // Hazard platform tile
    g.clear();
    g.fillStyle(0xaa1122);
    g.fillRect(0, 8, 32, 16);
    g.lineStyle(1, 0xff4455);
    g.strokeRect(0, 8, 32, 16);
    g.fillStyle(0xff2244);
    for (let i = 0; i < 4; i++) {
      g.fillTriangle(2 + i * 8, 8, 6 + i * 8, -2, 10 + i * 8, 8);
    }
    g.generateTexture('hazard', 32, 24);

    // Ground spike strip tile
    g.clear();
    g.fillStyle(0x660011);
    g.fillRect(0, 12, 32, 12);
    g.fillStyle(0xff0033);
    for (let i = 0; i < 5; i++) {
      g.fillTriangle(1 + i * 6, 12, 4 + i * 6, 0, 7 + i * 6, 12);
    }
    g.lineStyle(1, 0xff6688);
    g.strokeRect(0, 12, 32, 12);
    g.generateTexture('spike', 32, 24);

    // Ice platform tile — light blue, shiny
    g.clear();
    g.fillStyle(0x66ccff);
    g.fillRect(0, 0, 32, 16);
    g.fillStyle(0xbbeeff);
    g.fillRect(0, 0, 32, 4);
    g.lineStyle(1, 0x44aaff);
    g.strokeRect(0, 0, 32, 16);
    g.fillStyle(0xffffff, 0.7);
    g.fillRect(4, 6, 6, 2);
    g.fillRect(16, 9, 4, 1);
    g.generateTexture('platform-ice', 32, 16);

    // Bounce pad tile — green/yellow with up arrows
    g.clear();
    g.fillStyle(0x228833);
    g.fillRect(0, 0, 32, 16);
    g.fillStyle(0x44cc66);
    g.fillRect(0, 0, 32, 5);
    g.lineStyle(1, 0x88ffaa);
    g.strokeRect(0, 0, 32, 16);
    g.fillStyle(0xffff44);
    g.fillTriangle(7, 1, 3, 9, 11, 9);
    g.fillTriangle(20, 1, 16, 9, 24, 9);
    g.fillRect(5, 9, 4, 5);
    g.fillRect(18, 9, 4, 5);
    g.generateTexture('platform-bounce', 32, 16);

    // Crumble platform tile — brown/orange, cracked
    g.clear();
    g.fillStyle(0x774422);
    g.fillRect(0, 0, 32, 16);
    g.fillStyle(0xaa6644);
    g.fillRect(0, 0, 32, 4);
    g.lineStyle(1, 0xcc9966);
    g.strokeRect(0, 0, 32, 16);
    g.lineStyle(1, 0x331100);
    g.lineBetween(8, 0, 10, 16);
    g.lineBetween(20, 2, 18, 14);
    g.lineBetween(14, 4, 16, 12);
    g.generateTexture('platform-crumble', 32, 16);

    // Conveyor platform tile — gray with right arrow
    g.clear();
    g.fillStyle(0x445566);
    g.fillRect(0, 0, 32, 16);
    g.fillStyle(0x667788);
    g.fillRect(0, 0, 32, 4);
    g.lineStyle(1, 0x99aabb);
    g.strokeRect(0, 0, 32, 16);
    g.fillStyle(0xffffff, 0.9);
    g.fillTriangle(22, 8, 14, 4, 14, 12);
    g.fillRect(6, 6, 10, 4);
    g.generateTexture('platform-conveyor', 32, 16);

    // Disappear platform tile — purple, dotted
    g.clear();
    g.fillStyle(0x5522aa);
    g.fillRect(0, 0, 32, 16);
    g.fillStyle(0x8855dd);
    g.fillRect(0, 0, 32, 4);
    g.lineStyle(1, 0xaa88ff);
    g.strokeRect(0, 0, 32, 16);
    g.fillStyle(0xffffff, 0.5);
    for (let i = 0; i < 4; i++) g.fillCircle(5 + i * 8, 10, 2);
    g.generateTexture('platform-disappear', 32, 16);

    // Portal (open / active)
    g.clear();
    const ringColors = [0x00c8ff, 0x2080ff, 0x5040ff, 0x8000ff, 0xaa00cc];
    for (let i = 0; i < ringColors.length; i++) {
      g.fillStyle(ringColors[i]);
      g.fillCircle(28, 28, 28 - i * 5);
    }
    g.generateTexture('portal', 56, 56);

    // Portal locked
    g.clear();
    const lockedRings = [0x550011, 0x440010, 0x33000e, 0x22000c, 0x11000a];
    for (let i = 0; i < lockedRings.length; i++) {
      g.fillStyle(lockedRings[i]);
      g.fillCircle(28, 28, 28 - i * 5);
    }
    g.fillStyle(0xff4444);
    g.fillRect(20, 24, 16, 12);
    g.lineStyle(3, 0xff8888);
    g.strokeCircle(28, 20, 7);
    g.generateTexture('portal-locked', 56, 56);

    // Coin
    g.clear();
    g.fillStyle(0xffdd00);
    g.fillCircle(8, 8, 8);
    g.lineStyle(2, 0xffaa00);
    g.strokeCircle(8, 8, 8);
    g.fillStyle(0xffee88);
    g.fillCircle(6, 6, 3);
    g.generateTexture('coin', 16, 16);

    // Checkpoint (inactive) — gray flag
    g.clear();
    g.fillStyle(0x888888);
    g.fillRect(10, 0, 3, 30);
    g.fillStyle(0xaaaaaa);
    g.fillTriangle(13, 2, 13, 16, 25, 9);
    g.generateTexture('checkpoint', 28, 32);

    // Checkpoint (active) — gold flag
    g.clear();
    g.fillStyle(0xaaaaaa);
    g.fillRect(10, 0, 3, 30);
    g.fillStyle(0xffdd00);
    g.fillTriangle(13, 2, 13, 16, 25, 9);
    g.fillStyle(0xff8800);
    g.fillCircle(13, 16, 3);
    g.generateTexture('checkpoint-active', 28, 32);

    // Power-up shield — blue circle with shield shape
    g.clear();
    g.fillStyle(0x1144dd);
    g.fillCircle(12, 12, 12);
    g.fillStyle(0x4488ff);
    g.fillCircle(12, 12, 8);
    g.fillStyle(0xffffff, 0.8);
    g.fillRect(9, 6, 6, 7);
    g.fillTriangle(9, 13, 15, 13, 12, 18);
    g.generateTexture('powerup-shield', 24, 24);

    // Power-up speed — orange/yellow lightning
    g.clear();
    g.fillStyle(0xdd8800);
    g.fillCircle(12, 12, 12);
    g.fillStyle(0xffdd00);
    g.fillTriangle(14, 2, 7, 13, 13, 13);
    g.fillTriangle(11, 11, 17, 11, 10, 22);
    g.generateTexture('powerup-speed', 24, 24);

    // Power-up timefreeze — cyan snowflake/clock
    g.clear();
    g.fillStyle(0x009999);
    g.fillCircle(12, 12, 12);
    g.fillStyle(0x00ffff);
    g.fillCircle(12, 12, 7);
    g.lineStyle(2, 0xffffff);
    g.lineBetween(12, 12, 12, 6);
    g.lineBetween(12, 12, 16, 14);
    g.lineStyle(1, 0xffffff);
    g.lineBetween(12, 5, 12, 19);
    g.lineBetween(5, 12, 19, 12);
    g.generateTexture('powerup-timefreeze', 24, 24);

    // Particle
    g.clear();
    g.fillStyle(0xffffff);
    g.fillCircle(4, 4, 4);
    g.generateTexture('particle', 8, 8);

    g.destroy();
  }
}
