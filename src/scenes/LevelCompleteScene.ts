import Phaser from 'phaser';
import { LEVELS } from '../data/levels';

export class LevelCompleteScene extends Phaser.Scene {
  constructor() { super('LevelComplete'); }

  create(data: { level: number; lives: number; score: number;
                 timeBonus: number; coinBonus: number; allCoins: boolean }) {
    const { width, height } = this.scale;
    const nextLevel = data.level + 1;
    const hasNext = nextLevel <= LEVELS.length;

    // Background overlay
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

    // Panel
    const panel = this.add.rectangle(width / 2, height / 2, 480, 340, 0x0a1a2a, 0.95);
    panel.setStrokeStyle(2, 0x00ccff);

    this.add.text(width / 2, height / 2 - 130, hasNext ? 'LEVEL COMPLETE!' : 'YOU WIN!', {
      fontSize: '42px', fontFamily: 'Arial Black', color: '#00ffaa',
      stroke: '#007744', strokeThickness: 5,
      shadow: { color: '#00ffaa', blur: 20, fill: true },
    }).setOrigin(0.5);

    const lines = [
      ['Time Bonus', `+${data.timeBonus}`],
      ['Coin Bonus', data.allCoins ? `+${data.coinBonus} ★` : `+0`],
      ['Total Score', `${data.score}`],
    ];
    lines.forEach(([label, val], i) => {
      this.add.text(width / 2 - 120, height / 2 - 60 + i * 40, label, {
        fontSize: '20px', fontFamily: 'Arial', color: '#88aacc',
      }).setOrigin(0, 0.5);
      this.add.text(width / 2 + 120, height / 2 - 60 + i * 40, val, {
        fontSize: '20px', fontFamily: 'Arial Black', color: '#ffffff',
      }).setOrigin(1, 0.5);
    });

    // Lives
    const hearts = '♥'.repeat(data.lives) + '♡'.repeat(3 - data.lives);
    this.add.text(width / 2, height / 2 + 60, hearts, {
      fontSize: '28px', color: '#ff4466',
    }).setOrigin(0.5);

    // Next button
    const btnText = hasNext ? `▶  LEVEL ${nextLevel}` : '▶  PLAY AGAIN';
    const btn = this.add.text(width / 2, height / 2 + 120, btnText, {
      fontSize: '28px', fontFamily: 'Arial Black', color: '#00ffaa',
      padding: { x: 24, y: 10 }, backgroundColor: '#001122',
      stroke: '#007744', strokeThickness: 3,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setScale(1.06));
    btn.on('pointerout', () => btn.setScale(1));
    btn.on('pointerdown', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('Game', {
          level: hasNext ? nextLevel : 1,
          lives: hasNext ? data.lives : 3,
          score: hasNext ? data.score : 0,
        });
      });
    });

    this.input.keyboard!.once('keydown-SPACE', () => btn.emit('pointerdown'));
    this.cameras.main.fadeIn(400, 0, 0, 0);

    // Fireworks
    this.time.addEvent({ delay: 100, repeat: 12, callback: this.spawnFirework, callbackScope: this });
  }

  private spawnFirework() {
    const x = Phaser.Math.Between(100, 860);
    const y = Phaser.Math.Between(60, 300);
    const colors = [0xff4466, 0x00ffaa, 0xffdd00, 0x44aaff, 0xff8800];
    const color = colors[Phaser.Math.Between(0, colors.length - 1)];
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const p = this.add.graphics().setDepth(20);
      p.fillStyle(color);
      p.fillCircle(0, 0, Phaser.Math.Between(3, 6));
      p.x = x; p.y = y;
      const speed = Phaser.Math.Between(60, 180);
      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed,
        alpha: 0,
        duration: Phaser.Math.Between(500, 900),
        ease: 'Quad.easeOut',
        onComplete: () => p.destroy(),
      });
    }
  }
}
