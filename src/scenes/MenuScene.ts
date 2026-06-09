import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const { width, height } = this.scale;

    // Starfield background
    this.createStars();

    // Title
    this.add.text(width / 2, height * 0.22, 'BOUNCE 2D', {
      fontSize: '72px',
      fontFamily: 'Arial Black, Arial',
      color: '#ffffff',
      stroke: '#0088ff',
      strokeThickness: 8,
      shadow: { color: '#00ccff', blur: 30, fill: true },
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.38, 'A PLATFORMER ODYSSEY', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#88ccff',
      letterSpacing: 6,
    }).setOrigin(0.5);

    // Controls info
    const controls = [
      '← → / A D   Move',
      '↑ / W / SPACE   Jump',
      'Double-jump mid-air',
      'Collect coins · Reach the portal',
    ];
    controls.forEach((line, i) => {
      this.add.text(width / 2, height * 0.54 + i * 28, line, {
        fontSize: '16px',
        fontFamily: 'Courier New',
        color: '#aaccff',
      }).setOrigin(0.5);
    });

    // Play button
    const btn = this.add.text(width / 2, height * 0.82, '▶  PLAY', {
      fontSize: '36px',
      fontFamily: 'Arial Black',
      color: '#00ffaa',
      stroke: '#007744',
      strokeThickness: 4,
      padding: { x: 32, y: 12 },
      backgroundColor: '#001122',
      shadow: { color: '#00ffaa', blur: 20, fill: true },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setScale(1.08));
    btn.on('pointerout', () => btn.setScale(1));
    btn.on('pointerdown', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('Game', { level: 1, lives: 3, score: 0 });
      });
    });

    // Keyboard shortcut
    this.input.keyboard!.once('keydown-SPACE', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('Game', { level: 1, lives: 3, score: 0 });
      });
    });

    this.cameras.main.fadeIn(600, 0, 0, 0);
  }

  private createStars() {
    const g = this.add.graphics();
    for (let i = 0; i < 120; i++) {
      const x = Phaser.Math.Between(0, 960);
      const y = Phaser.Math.Between(0, 600);
      const r = Phaser.Math.FloatBetween(0.5, 2);
      const a = Phaser.Math.FloatBetween(0.3, 1);
      g.fillStyle(0xffffff, a);
      g.fillCircle(x, y, r);
    }
  }
}
