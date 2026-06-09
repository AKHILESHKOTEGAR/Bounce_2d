import Phaser from 'phaser';
import { LEVELS } from '../data/levels';

const LEVEL_NOTES: string[] = [
  'To my absolute favorite person in the whole world, my beautiful cutu gf. From the very moment I fell for you, my world became so much brighter and warmer. You are the most beautiful soul I have ever known, both inside and completely out. I love you. 🌸',
  'Hey there, my little Dubu, the one who holds the entire key to my heart. No matter how chaotic or stressful the world outside gets, you are my ultimate safe space. Being wrapped up in your love is the only place I ever want to truly belong. I love you. 💫',
  'I know I love irritating you and pulling your leg just to see that cute smile. My absolute favorite thing in the world is to bite your soft cheeks. You are so adorable when you get annoyed with me, and I love you — every single bit of you. 🦁',
  'You carry so much warmth in your heart, and the way you care for me is unmatched. Seeing how selfless and kind you are makes me admire you more every day. You have a heart of gold, Dubu, and I love you more than words can say. 🌤',
  'Thank you for being my constant rock, my peace, and my greatest supporter. I love you for absolutely everything you are, through every mood and every single stress. We are a team forever, shona, and I am always standing right by your side. ✨',
  'Every single day, I find myself falling for you just a little bit harder than before. You bring a kind of pure joy into my life that I never even knew was possible. You are my blessing, my cutu gf, and I love you with everything I have. 🩰',
  'Even when you are buried under work and thesis stress, your kindness still shines through. The way you look out for others shows the depth of your beautiful soul. I am so incredibly proud to call you mine, and I love you today and every day to come. 🌈',
  'I promise to always hold you tight and protect your peace whenever you feel overwhelmed. Whenever the world gets too heavy, just lean on me and let me carry it for you. I love you, shona — you never have to face a long day alone. 🪄',
  'You are my home, my comfort, and the sweetest part of every single day. I love the way you love me, and I promise to cherish your heart with everything I have. I love you — no matter where life takes us, my heart will always beat for you. 🐾',
  'To the girl who makes my apartment feel like the warmest place on earth. Thank you for being the beautiful, gentle, and incredibly caring soul that you are. I love you to the moon and back, my cutu Dubu, forever and always. ⚡',
  'You inspire me to be a better man just by the beautiful way you live your life. Your generosity and love make the world a much better place for everyone around you. I love you, and I am so deeply grateful that the universe brought you into my arms. 🎯',
  'I cannot wait for all the memories, the laughter, and the cheek-biting moments ahead of us. You are my today, my tomorrow, and every single future plan I ever want to make. I love you — you are my ultimate prize, and I will choose you over and over again. 🍃',
  'Through the quiet nights and the busiest days, you are the only one on my mind. Your smile is my absolute favorite sight, and your happiness is my highest priority. I love you — never forget how deeply you are treasured by your Akki. 💥',
  'Thank you for choosing to walk this life with me and sharing your beautiful heart. I love you for your flaws, your strengths, your stress, and your incredible kindness. You are perfect to me in every single way, my beautiful shona. 🌌',
  'So this is the last level Dubu, just for my absolute favorite player. May it bring a smile to your face the way you always bring peace to my soul. I love you infinitely, my Dubu, my safe space, my forever. 💕',
];

export class LevelCompleteScene extends Phaser.Scene {
  constructor() { super('LevelComplete'); }

  create(data: { level: number; lives: number; score: number;
                 timeBonus: number; coinBonus: number; allCoins: boolean;
                 dubuMode?: boolean }) {
    const { width, height } = this.scale;
    const nextLevel = data.level + 1;
    const hasNext = nextLevel <= LEVELS.length;
    const dubu = data.dubuMode ?? false;

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

    const panelStroke = dubu ? 0xff69b4 : 0x00ccff;
    const panel = this.add.rectangle(width / 2, height / 2, 520, 510, 0x0a1a2a, 0.97);
    panel.setStrokeStyle(2, panelStroke);

    const headerColor = dubu ? '#ff69b4' : '#00ffaa';
    const headerStroke = dubu ? '#660033' : '#007744';
    this.add.text(width / 2, height / 2 - 225, hasNext ? 'LEVEL COMPLETE!' : 'YOU WIN!', {
      fontSize: '38px', fontFamily: 'Arial Black', color: headerColor,
      stroke: headerStroke, strokeThickness: 5,
      shadow: { color: headerColor, blur: 20, fill: true },
    }).setOrigin(0.5);

    // Love note per level
    const noteIdx = Math.min(data.level - 1, LEVEL_NOTES.length - 1);
    const noteColor = dubu ? '#ffb6c1' : '#cce8ff';
    const note = this.add.text(width / 2, height / 2 - 165, LEVEL_NOTES[noteIdx], {
      fontSize: '12px', fontFamily: 'Arial', color: noteColor,
      stroke: '#000020', strokeThickness: 2,
      align: 'center', lineSpacing: 4,
      wordWrap: { width: 470 },
    }).setOrigin(0.5, 0).setAlpha(0);

    this.tweens.add({
      targets: note, alpha: 1, duration: 700, delay: 250, ease: 'Quad.easeIn',
    });

    // Divider
    const divColor = dubu ? 0xff69b4 : 0x224466;
    const divGfx = this.add.graphics();
    divGfx.lineStyle(1, divColor, 0.5);
    divGfx.lineBetween(width / 2 - 200, height / 2 + 15, width / 2 + 200, height / 2 + 15);

    const lines = [
      ['Time Bonus', `+${data.timeBonus}`],
      ['Heart Bonus', data.allCoins ? `+${data.coinBonus} ★` : `+0`],
      ['Total Score', `${data.score}`],
    ];
    lines.forEach(([label, val], i) => {
      this.add.text(width / 2 - 140, height / 2 + 30 + i * 36, label, {
        fontSize: '18px', fontFamily: 'Arial', color: '#88aacc',
      }).setOrigin(0, 0.5);
      this.add.text(width / 2 + 140, height / 2 + 30 + i * 36, val, {
        fontSize: '18px', fontFamily: 'Arial Black', color: '#ffffff',
      }).setOrigin(1, 0.5);
    });

    const hearts = '♥'.repeat(data.lives) + '♡'.repeat(3 - data.lives);
    this.add.text(width / 2, height / 2 + 148, hearts, {
      fontSize: '26px', color: dubu ? '#ff69b4' : '#ff4466',
    }).setOrigin(0.5);

    const btnText = hasNext ? `▶  LEVEL ${nextLevel}` : '▶  PLAY AGAIN';
    const btn = this.add.text(width / 2, height / 2 + 200, btnText, {
      fontSize: '28px', fontFamily: 'Arial Black', color: headerColor,
      padding: { x: 24, y: 10 }, backgroundColor: '#001122',
      stroke: headerStroke, strokeThickness: 3,
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
          dubuMode: dubu,
        });
      });
    });

    this.input.keyboard!.once('keydown-SPACE', () => btn.emit('pointerdown'));
    this.cameras.main.fadeIn(400, 0, 0, 0);

    this.time.addEvent({
      delay: 100, repeat: 12,
      callback: () => this.spawnFirework(dubu),
      callbackScope: this,
    });
  }

  private spawnFirework(dubu: boolean) {
    const x = Phaser.Math.Between(100, 860);
    const y = Phaser.Math.Between(60, 300);
    const normalColors = [0xff4466, 0x00ffaa, 0xffdd00, 0x44aaff, 0xff8800];
    const dubuColors   = [0xff69b4, 0xffc0cb, 0xe9d5ff, 0xf0abfc, 0xfda4af];
    const palette = dubu ? dubuColors : normalColors;
    const color = palette[Phaser.Math.Between(0, palette.length - 1)];
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
