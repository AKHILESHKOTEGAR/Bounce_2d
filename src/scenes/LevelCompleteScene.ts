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
  private tip: Phaser.GameObjects.Container | null = null;

  constructor() { super('LevelComplete'); }

  create(data: { level: number; lives: number; score: number;
                 timeBonus: number; coinBonus: number; allCoins: boolean;
                 dubuMode?: boolean }) {
    const { width, height } = this.scale;
    const nextLevel = data.level + 1;
    const hasNext = nextLevel <= LEVELS.length;
    const dubu = data.dubuMode ?? false;
    const cx = width / 2, cy = height / 2;

    this.tip = null;

    this.add.rectangle(cx, cy, width, height, 0x000000, 0.7);

    const panelStroke = dubu ? 0xff69b4 : 0x00ccff;
    const panelGfx = this.add.graphics();
    panelGfx.fillStyle(0x0a1a2a, 0.97);
    panelGfx.fillRoundedRect(cx - 260, cy - 280, 520, 560, 16);
    panelGfx.lineStyle(2, panelStroke, 0.85);
    panelGfx.strokeRoundedRect(cx - 260, cy - 280, 520, 560, 16);

    // Header
    const headerColor  = dubu ? '#ff69b4' : '#00ffaa';
    const headerStroke = dubu ? '#660033' : '#007744';
    this.add.text(cx, cy - 225, hasNext ? 'LEVEL COMPLETE!' : 'YOU WIN!', {
      fontSize: '38px', fontFamily: 'Arial Black', color: headerColor,
      stroke: headerStroke, strokeThickness: 5,
      shadow: { color: headerColor, blur: 20, fill: true },
    }).setOrigin(0.5);

    // Love note (dubu only) or star rating (normal)
    if (dubu) {
      const noteIdx = Math.min(data.level - 1, LEVEL_NOTES.length - 1);
      const note = this.add.text(cx, cy - 165, LEVEL_NOTES[noteIdx], {
        fontSize: '12px', fontFamily: 'Arial', color: '#ffb6c1',
        stroke: '#000020', strokeThickness: 2,
        align: 'center', lineSpacing: 4,
        wordWrap: { width: 470 },
      }).setOrigin(0.5, 0).setAlpha(0);
      this.tweens.add({ targets: note, alpha: 1, duration: 700, delay: 250, ease: 'Quad.easeIn' });
    } else {
      const stars = data.allCoins ? 3 : data.timeBonus >= 200 ? 2 : 1;
      const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
      this.add.text(cx, cy - 130, starStr, {
        fontSize: '40px', color: '#ffdd00',
        shadow: { color: '#ffaa00', blur: 10, fill: true },
      }).setOrigin(0.5);
      if (data.allCoins) {
        this.add.text(cx, cy - 80, 'ALL HEARTS COLLECTED!', {
          fontSize: '13px', fontFamily: 'Arial', color: '#00ffaa', letterSpacing: 3,
        }).setOrigin(0.5);
      }
    }

    // Divider
    const divGfx = this.add.graphics();
    divGfx.lineStyle(1, dubu ? 0xff69b4 : 0x224466, 0.5);
    divGfx.lineBetween(cx - 200, cy + 15, cx + 200, cy + 15);

    // Stats
    const lines: [string, string][] = [
      ['Time Bonus',  `+${data.timeBonus}`],
      ['Heart Bonus', data.allCoins ? `+${data.coinBonus} ★` : '+0'],
      ['Total Score', `${data.score}`],
    ];
    lines.forEach(([label, val], i) => {
      this.add.text(cx - 140, cy + 30 + i * 36, label, {
        fontSize: '18px', fontFamily: 'Arial', color: '#88aacc',
      }).setOrigin(0, 0.5);
      this.add.text(cx + 140, cy + 30 + i * 36, val, {
        fontSize: '18px', fontFamily: 'Arial Black', color: '#ffffff',
      }).setOrigin(1, 0.5);
    });

    // Lives
    const hearts = '♥'.repeat(data.lives) + '♡'.repeat(3 - data.lives);
    this.add.text(cx, cy + 148, hearts, {
      fontSize: '26px', color: dubu ? '#ff69b4' : '#ff4466',
    }).setOrigin(0.5);

    // ── Buttons ──────────────────────────────────────────────────

    const btnText = hasNext ? `▶  LEVEL ${nextLevel}` : '▶  PLAY AGAIN';
    const nextTip = dubu
      ? (hasNext ? `Let's keep going! ✨` : 'One more time! 💕')
      : (hasNext ? `Go to Level ${nextLevel}` : 'Play again from Level 1');

    const nextBtn = this.makeBtn(cx, cy + 192, btnText, 340, 50, headerColor, dubu ? 0x1a0010 : 0x001a0e, panelStroke, '24px');
    nextBtn.on('pointerover', () => this.showTip(cx, cy + 192 - 40, nextTip, dubu));
    nextBtn.on('pointerout',  () => this.hideTip());
    nextBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () =>
        this.scene.start('Game', {
          level: hasNext ? nextLevel : 1,
          lives: hasNext ? data.lives : 3,
          score: hasNext ? data.score : 0,
          dubuMode: dubu,
        }));
    });

    const retryTip = dubu ? 'One more try! 💫' : `Retry Level ${data.level}`;
    const retryBtn = this.makeBtn(cx - 98, cy + 249, '↩  RETRY', 175, 40, '#aabbcc', 0x050d1a, 0x334466, '16px');
    retryBtn.on('pointerover', () => this.showTip(cx - 98, cy + 249 - 36, retryTip, dubu));
    retryBtn.on('pointerout',  () => this.hideTip());
    retryBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () =>
        this.scene.start('Game', { level: data.level, lives: 3, score: 0, dubuMode: dubu }));
    });

    const lvl1Tip = dubu ? 'All the way back 🎀' : 'Start from Level 1';
    const lvl1Btn = this.makeBtn(cx + 98, cy + 249, '⏮  LEVEL 1', 175, 40, '#667788', 0x050d1a, 0x223344, '15px');
    lvl1Btn.on('pointerover', () => this.showTip(cx + 98, cy + 249 - 36, lvl1Tip, dubu));
    lvl1Btn.on('pointerout',  () => this.hideTip());
    lvl1Btn.on('pointerdown', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () =>
        this.scene.start('Game', { level: 1, lives: 3, score: 0, dubuMode: dubu }));
    });

    // Slide-in
    [nextBtn, retryBtn, lvl1Btn].forEach((btn, i) => {
      btn.setAlpha(0);
      this.tweens.add({ targets: btn, alpha: 1, duration: 300, delay: 200 + i * 100, ease: 'Quad.easeOut' });
    });

    this.input.keyboard!.once('keydown-SPACE', () => nextBtn.emit('pointerdown'));
    this.cameras.main.fadeIn(400, 0, 0, 0);

    this.time.addEvent({
      delay: 100, repeat: 12,
      callback: () => this.spawnFirework(dubu),
      callbackScope: this,
    });
  }

  // ── Tooltip ────────────────────────────────────────────────────

  private showTip(x: number, y: number, msg: string, dubu: boolean) {
    this.hideTip();

    const bgColor  = dubu ? 0x1a0010 : 0x001122;
    const border   = dubu ? 0xff69b4 : 0x00ffaa;
    const txtColor = dubu ? '#ffb6c1' : '#aaffee';
    const style = { fontSize: '13px', fontFamily: 'Arial', color: txtColor };

    const measured = this.add.text(-2000, -2000, msg, style);
    const tw = measured.width + 26;
    const th = 28;
    measured.destroy();

    const c = this.add.container(x, y).setDepth(300).setAlpha(0);

    const bg = this.add.graphics();
    bg.fillStyle(bgColor, 0.97);
    bg.fillRoundedRect(-tw / 2, -th / 2, tw, th, 8);
    bg.lineStyle(1.5, border, 0.85);
    bg.strokeRoundedRect(-tw / 2, -th / 2, tw, th, 8);
    // Arrow pointing down toward button
    bg.fillStyle(bgColor, 0.97);
    bg.fillTriangle(-6, th / 2, 6, th / 2, 0, th / 2 + 8);
    bg.lineStyle(1.5, border, 0.5);
    bg.lineBetween(-6, th / 2, 0, th / 2 + 8);
    bg.lineBetween(6,  th / 2, 0, th / 2 + 8);

    const txt = this.add.text(0, 0, msg, style).setOrigin(0.5);
    c.add([bg, txt]);

    this.tweens.add({ targets: c, alpha: 1, duration: 140, ease: 'Quad.easeOut' });
    this.tip = c;
  }

  private hideTip() {
    if (!this.tip) return;
    const t = this.tip;
    this.tip = null;
    this.tweens.add({ targets: t, alpha: 0, duration: 100, onComplete: () => t.destroy() });
  }

  // ── Button factory ─────────────────────────────────────────────

  private makeBtn(
    x: number, y: number, label: string,
    w: number, h: number,
    color: string, bgHex: number, strokeHex: number,
    fontSize = '22px',
  ) {
    const c = this.add.container(x, y);
    const gfx = this.add.graphics();
    this.drawBg(gfx, w, h, bgHex, strokeHex, false);
    const txt = this.add.text(0, 1, label, { fontSize, fontFamily: 'Arial Black', color }).setOrigin(0.5);
    c.add([gfx, txt]);
    c.setSize(w, h).setInteractive({ useHandCursor: true });
    c.on('pointerover',  () => { this.tweens.add({ targets: c, scaleX: 1.05, scaleY: 1.05, duration: 110 }); this.drawBg(gfx, w, h, bgHex, strokeHex, true); });
    c.on('pointerout',   () => { this.tweens.add({ targets: c, scaleX: 1,    scaleY: 1,    duration: 110 }); this.drawBg(gfx, w, h, bgHex, strokeHex, false); });
    c.on('pointerdown',  () => this.tweens.add({ targets: c, scaleX: 0.95, scaleY: 0.95, duration: 70, yoyo: true }));
    return c;
  }

  private drawBg(gfx: Phaser.GameObjects.Graphics, w: number, h: number, fill: number, stroke: number, hover: boolean) {
    gfx.clear();
    gfx.fillStyle(fill, 1);
    gfx.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
    gfx.lineStyle(hover ? 2.5 : 1.5, stroke, hover ? 1 : 0.75);
    gfx.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
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
