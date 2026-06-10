import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  private tip: Phaser.GameObjects.Container | null = null;

  constructor() { super('GameOver'); }

  create(data: { score: number; dubuMode?: boolean; level?: number }) {
    const { width, height } = this.scale;
    const dubu = data.dubuMode ?? false;
    const level = data.level ?? 1;
    const cx = width / 2, cy = height / 2;

    this.tip = null;

    this.add.rectangle(cx, cy, width, height, 0x000000, 0.92);
    this.spawnStars();

    // Panel
    const pw = 460, ph = 370;
    const pg = this.add.graphics();
    pg.fillStyle(0x050d1a, 0.97);
    pg.fillRoundedRect(cx - pw / 2, cy - ph / 2, pw, ph, 16);
    pg.lineStyle(2, dubu ? 0xff69b4 : 0xff2244, 0.85);
    pg.strokeRoundedRect(cx - pw / 2, cy - ph / 2, pw, ph, 16);

    // Header
    this.add.text(cx, cy - 148, 'GAME OVER', {
      fontSize: '58px', fontFamily: 'Arial Black',
      color: dubu ? '#ff69b4' : '#ff2244',
      stroke: dubu ? '#660033' : '#880011', strokeThickness: 8,
      shadow: { color: dubu ? '#ff69b4' : '#ff0000', blur: 28, fill: true },
    }).setOrigin(0.5);

    // Score
    this.add.text(cx, cy - 64, `${data.score}`, {
      fontSize: '46px', fontFamily: 'Arial Black', color: '#ffffff',
      stroke: '#000', strokeThickness: 4,
    }).setOrigin(0.5);
    this.add.text(cx, cy - 26, 'FINAL SCORE', {
      fontSize: '12px', fontFamily: 'Arial', color: '#445577', letterSpacing: 5,
    }).setOrigin(0.5);

    const sub = dubu ? "Don't give up, Dubu! ♥" : 'Better luck next time!';
    this.add.text(cx, cy + 8, sub, {
      fontSize: '17px', fontFamily: 'Arial', color: dubu ? '#ff69b4' : '#8899bb',
    }).setOrigin(0.5);

    // Divider
    const divG = this.add.graphics();
    divG.lineStyle(1, dubu ? 0xff69b4 : 0x334466, 0.35);
    divG.lineBetween(cx - 180, cy + 36, cx + 180, cy + 36);

    const accent    = dubu ? 0xff69b4 : 0x00ffaa;
    const accentStr = dubu ? '#ff69b4' : '#00ffaa';
    const accentBg  = dubu ? 0x1a0010  : 0x001a0e;

    // Buttons
    const tryTip  = dubu ? "You can do it, Dubu! 💕"       : `Retry from level ${level}`;
    const lvl1Tip = dubu ? "Let's start fresh together 🌸" : 'Go back to Level 1';

    const tryBtn = this.makeBtn(cx, cy + 86, '↩  TRY AGAIN', 280, 52, accentStr, accentBg, accent, '24px');
    tryBtn.on('pointerover', () => this.showTip(cx, cy + 86 - 42, tryTip, dubu));
    tryBtn.on('pointerout',  () => this.hideTip());
    tryBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () =>
        this.scene.start('Game', { level, lives: 3, score: 0, dubuMode: dubu }));
    });

    const lvl1Btn = this.makeBtn(cx, cy + 151, '⏮  BACK TO LEVEL 1', 240, 40, '#556677', 0x050d1a, 0x334466, '15px');
    lvl1Btn.on('pointerover', () => this.showTip(cx, cy + 151 - 36, lvl1Tip, dubu));
    lvl1Btn.on('pointerout',  () => this.hideTip());
    lvl1Btn.on('pointerdown', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () =>
        this.scene.start('Game', { level: 1, lives: 3, score: 0, dubuMode: dubu }));
    });

    // Slide-in
    [tryBtn, lvl1Btn].forEach((btn, i) => {
      btn.setAlpha(0);
      this.tweens.add({ targets: btn, alpha: 1, duration: 300, delay: 300 + i * 120, ease: 'Quad.easeOut' });
    });

    this.input.keyboard!.once('keydown-SPACE', () => tryBtn.emit('pointerdown'));
    this.cameras.main.fadeIn(500, 0, 0, 0);
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

  private spawnStars() {
    const g = this.add.graphics();
    for (let i = 0; i < 60; i++) {
      const x = Phaser.Math.Between(0, 960);
      const y = Phaser.Math.Between(0, 600);
      g.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.1, 0.5));
      g.fillCircle(x, y, Phaser.Math.FloatBetween(0.5, 2));
    }
  }
}
