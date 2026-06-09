import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOver'); }

  create(data: { score: number }) {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85);

    this.add.text(width / 2, height * 0.28, 'GAME OVER', {
      fontSize: '64px', fontFamily: 'Arial Black', color: '#ff2244',
      stroke: '#880011', strokeThickness: 8,
      shadow: { color: '#ff0000', blur: 30, fill: true },
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.48, `Final Score: ${data.score}`, {
      fontSize: '32px', fontFamily: 'Arial', color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.62, 'Better luck next time!', {
      fontSize: '20px', fontFamily: 'Arial', color: '#8899bb',
    }).setOrigin(0.5);

    const btn = this.add.text(width / 2, height * 0.78, '↩  TRY AGAIN', {
      fontSize: '30px', fontFamily: 'Arial Black', color: '#00ffaa',
      padding: { x: 24, y: 10 }, backgroundColor: '#001122',
      stroke: '#007744', strokeThickness: 3,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setScale(1.06));
    btn.on('pointerout', () => btn.setScale(1));
    btn.on('pointerdown', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('Game', { level: 1, lives: 3, score: 0 });
      });
    });

    this.input.keyboard!.once('keydown-SPACE', () => btn.emit('pointerdown'));
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }
}
