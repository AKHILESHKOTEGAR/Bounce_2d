import Phaser from 'phaser';

export class DubuIntroScene extends Phaser.Scene {
  constructor() { super('DubuIntro'); }

  create(data: { level?: number; lives?: number; score?: number }) {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor(0x1a0822);

    // Pink stars
    const g = this.add.graphics();
    for (let i = 0; i < 70; i++) {
      g.fillStyle(i % 2 === 0 ? 0xff69b4 : 0xffc0cb, Phaser.Math.FloatBetween(0.2, 0.8));
      g.fillCircle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.FloatBetween(0.5, 2.5)
      );
    }

    // Rising hearts
    this.time.addEvent({
      delay: 280, repeat: 12,
      callback: () => {
        const x = Phaser.Math.Between(80, 880);
        const sz = Phaser.Math.Between(16, 38);
        const heart = this.add.text(x, height + 10, '♥', {
          fontSize: `${sz}px`,
          color: Phaser.Math.Between(0, 1) === 0 ? '#ff69b4' : '#ffc0cb',
        }).setAlpha(0.8);
        this.tweens.add({
          targets: heart,
          y: -40,
          x: heart.x + Phaser.Math.Between(-50, 50),
          alpha: 0,
          duration: Phaser.Math.Between(2200, 3400),
          ease: 'Linear',
          onComplete: () => heart.destroy(),
        });
      },
    });

    // Petal rain
    this.time.addEvent({
      delay: 450, repeat: -1,
      callback: () => {
        if (!this.scene.isActive('DubuIntro')) return;
        const x = Phaser.Math.Between(0, width);
        const petal = this.add.image(x, -10, 'petal')
          .setAlpha(0.55)
          .setTint(Phaser.Math.Between(0, 1) === 1 ? 0xffc0cb : 0xe9d5ff)
          .setAngle(Phaser.Math.Between(0, 360));
        this.tweens.add({
          targets: petal,
          y: 650, x: petal.x + Phaser.Math.Between(-60, 60),
          angle: petal.angle + Phaser.Math.Between(-180, 180),
          alpha: 0,
          duration: Phaser.Math.Between(2800, 4500),
          ease: 'Linear',
          onComplete: () => petal.destroy(),
        });
      },
    });

    // Big heart emoji
    const bigHeart = this.add.text(width / 2, height * 0.28, '💕', {
      fontSize: '88px',
    }).setOrigin(0.5).setAlpha(0).setScale(0.2);

    this.tweens.add({
      targets: bigHeart,
      alpha: 1, scale: 1,
      duration: 700, ease: 'Back.easeOut',
    });

    // "this game was made just for you~"
    const sub = this.add.text(width / 2, height * 0.53, 'this game was made just for you~', {
      fontSize: '21px', fontFamily: 'Arial', color: '#ffc0cb',
      stroke: '#440022', strokeThickness: 3,
    }).setOrigin(0.5).setAlpha(0);

    this.time.delayedCall(750, () => {
      this.tweens.add({ targets: sub, alpha: 1, duration: 500 });
    });

    // "dubu ♥"
    const nameText = this.add.text(width / 2, height * 0.68, 'dubu ♥', {
      fontSize: '56px', fontFamily: 'Arial Black', color: '#ff69b4',
      stroke: '#660033', strokeThickness: 5,
      shadow: { color: '#ff69b4', blur: 30, fill: true },
    }).setOrigin(0.5).setAlpha(0);

    this.time.delayedCall(1200, () => {
      this.tweens.add({ targets: nameText, alpha: 1, duration: 600, ease: 'Quad.easeIn' });
    });

    // Pulse nameText forever
    this.time.delayedCall(1900, () => {
      this.tweens.add({
        targets: nameText,
        scale: { from: 1, to: 1.06 },
        duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      });
    });

    // Auto-advance after 3.8s
    this.time.delayedCall(3800, () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('Game', {
          level: data.level ?? 1,
          lives: data.lives ?? 3,
          score: data.score ?? 0,
          dubuMode: true,
        });
      });
    });

    this.cameras.main.fadeIn(450, 0, 0, 0);
  }
}
