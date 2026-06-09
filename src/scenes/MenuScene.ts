import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  private typedName = '';
  private nameDisplay!: Phaser.GameObjects.Text;
  private cursor!: Phaser.GameObjects.Text;
  private dubuTriggered = false;

  constructor() {
    super('Menu');
  }

  create() {
    const { width, height } = this.scale;

    this.typedName = '';
    this.dubuTriggered = false;

    this.createStars();

    this.add.text(width / 2, height * 0.17, 'BOUNCE 2D', {
      fontSize: '72px',
      fontFamily: 'Arial Black, Arial',
      color: '#ffffff',
      stroke: '#0088ff',
      strokeThickness: 8,
      shadow: { color: '#00ccff', blur: 30, fill: true },
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.31, 'A PLATFORMER ODYSSEY', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#88ccff',
      letterSpacing: 6,
    }).setOrigin(0.5);

    const controls = [
      '← → / A D   Move',
      '↑ / W / SPACE   Jump',
      'Double-jump mid-air',
      'Collect coins · Reach the portal',
    ];
    controls.forEach((line, i) => {
      this.add.text(width / 2, height * 0.43 + i * 26, line, {
        fontSize: '15px',
        fontFamily: 'Courier New',
        color: '#aaccff',
      }).setOrigin(0.5);
    });

    // Name input section
    this.add.text(width / 2, height * 0.66, "who's playing?", {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#88aacc',
      letterSpacing: 3,
    }).setOrigin(0.5);

    // Input box background
    this.add.rectangle(width / 2, height * 0.735, 220, 34, 0x001133, 0.85)
      .setStrokeStyle(1, 0x4488ff);

    this.nameDisplay = this.add.text(width / 2 - 6, height * 0.735, '', {
      fontSize: '19px',
      fontFamily: 'Arial',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.cursor = this.add.text(0, height * 0.735, '|', {
      fontSize: '19px',
      fontFamily: 'Arial',
      color: '#88ccff',
    }).setOrigin(0, 0.5);

    this.tweens.add({
      targets: this.cursor,
      alpha: { from: 1, to: 0 },
      duration: 530,
      yoyo: true,
      repeat: -1,
    });

    this.add.text(width / 2, height * 0.79, 'press ENTER or click PLAY', {
      fontSize: '11px',
      fontFamily: 'Arial',
      color: '#445566',
    }).setOrigin(0.5);

    // Play button
    const btn = this.add.text(width / 2, height * 0.875, '▶  PLAY', {
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
    btn.on('pointerdown', () => this.startGame());

    // Subtle dedication — bottom right
    this.add.text(width - 10, height - 10, 'made for dubu ♥', {
      fontSize: '11px',
      fontFamily: 'Arial',
      color: '#ff69b4',
    }).setOrigin(1, 1).setAlpha(0.45);

    // Keyboard capture
    this.input.keyboard!.on('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Backspace') {
        this.typedName = this.typedName.slice(0, -1);
      } else if (event.key === 'Enter') {
        this.startGame();
      } else if (event.key.length === 1 && /[a-zA-Z]/.test(event.key) && this.typedName.length < 12) {
        this.typedName += event.key;
      }
      this.updateNameDisplay();
    });

    this.cameras.main.fadeIn(600, 0, 0, 0);

    // Position cursor correctly from the start (before any keypress)
    this.updateNameDisplay();
  }

  private updateNameDisplay() {
    this.nameDisplay.setText(this.typedName);
    const { width } = this.scale;
    const textWidth = this.nameDisplay.width;
    this.cursor.setX(width / 2 - 6 + textWidth / 2 + 2);

    const lower = this.typedName.toLowerCase();
    if (!this.dubuTriggered && (lower === 'dubu' || lower === 'janvi')) {
      this.dubuTriggered = true;
      this.triggerDubuTypedEffect();
    }
    if (lower !== 'dubu' && lower !== 'janvi') {
      this.dubuTriggered = false;
      this.nameDisplay.setColor('#ffffff').setShadow(0, 0, '#000000', 0);
    }
  }

  private triggerDubuTypedEffect() {
    const { width, height } = this.scale;

    this.nameDisplay.setColor('#ff69b4').setShadow(0, 0, '#ff69b4', 14, true, true);

    for (let i = 0; i < 14; i++) {
      this.time.delayedCall(i * 55, () => {
        const angle = (i / 14) * Math.PI * 2;
        const heart = this.add.text(width / 2, height * 0.735, '♥', {
          fontSize: `${Phaser.Math.Between(14, 26)}px`,
          color: Phaser.Math.Between(0, 1) === 0 ? '#ff69b4' : '#ffc0cb',
        }).setOrigin(0.5).setAlpha(0.9);
        this.tweens.add({
          targets: heart,
          x: heart.x + Math.cos(angle) * 95,
          y: heart.y + Math.sin(angle) * 95,
          alpha: 0, scale: 0.2,
          duration: 900, ease: 'Quad.easeOut',
          onComplete: () => heart.destroy(),
        });
      });
    }

    const msg = this.add.text(width / 2, height * 0.57, '✨  hi dubu!  💕', {
      fontSize: '26px', fontFamily: 'Arial Black', color: '#ff69b4',
      stroke: '#440022', strokeThickness: 3,
      shadow: { color: '#ff69b4', blur: 14, fill: true },
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: msg,
      alpha: { from: 0, to: 1 },
      duration: 350, hold: 1800, yoyo: true,
      ease: 'Quad.easeInOut',
      onComplete: () => msg.destroy(),
    });
  }

  private startGame() {
    const name = this.typedName.toLowerCase().trim();
    const dubuMode = name === 'dubu' || name === 'janvi';
    this.input.keyboard!.removeAllListeners();
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      if (dubuMode) {
        this.scene.start('DubuIntro', { level: 1, lives: 3, score: 0 });
      } else {
        this.scene.start('Game', { level: 1, lives: 3, score: 0, dubuMode: false });
      }
    });
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
