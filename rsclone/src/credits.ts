import * as Phaser from 'phaser';
import { setBtnActive, disableBtnActive } from './utilitites';

export default class Credits extends Phaser.Scene {
  private lang: Record<string, string>;

  private backButton: Phaser.GameObjects.Text;

  private alisa: Phaser.GameObjects.Text;

  private saidazizkhon: Phaser.GameObjects.Text;

  private daniil: Phaser.GameObjects.Text;

  private gregory: Phaser.GameObjects.Text;

  private openLink: (link: string) => void;

  private creditsList: Phaser.GameObjects.Text[];

  private credits: (string | (string | boolean)[])[];

  constructor() {
    super({ key: 'Credits', active: false });

    this.openLink = (link: string): void => {
      const s = window.open(link, '_blank');

      if (s && s.focus) {
        s.focus();
      } else if (!s) {
        window.location.href = link;
      }
    };
  }

  create(): void {
    this.lang = this.registry.get('lang');
    this.add
      .text(this.game.renderer.width / 2, this.game.renderer.height / 2 - 400, this.lang.credits, {
        font: '42px monospace',
      })
      .setOrigin(0.5);

    this.credits = [
      this.lang.devs,
      ['Alisa Pavlova', 'https://github.com/Alisa-Pavlova'],
      ['Saidazizkhon Akbarov', 'https://github.com/dazik'],
      ['Daniil Sitnikov', 'https://github.com/DANSitNikov'],
      ['Gregory Moskalev', 'https://github.com/GregoryMoskalev'],
      this.lang.artist,
      ['Sofya Ostrovskaya', false],
    ];

    this.creditsList = this.credits.map((name, index) => {
      let style = { font: '24px monospace' };
      let n = String(name);
      if (name.length === 2) {
        style = { font: '32px monospace' };
        n = String(name[0]);
      }
      return this.add
        .text(this.game.renderer.width / 2, 250 + index * 70, n, style)
        .setOrigin(0.5)
        .setInteractive();
    });

    this.backButton = this.add
      .text(this.game.renderer.width / 2, this.game.renderer.height - 100, this.lang.backToMenu, {
        font: '32px monospace',
      })
      .setOrigin(0.5)
      .setInteractive();

    this.creditsList.forEach((name, index) => {
      if (!this.credits[index][1] || this.credits[index].length !== 2) {
        return;
      }
      name.on('pointerup', () => this.openLink(String(this.credits[index][1])));
      name.on('pointerover', () => setBtnActive(name), this);
      name.on('pointerout', () => disableBtnActive(name), this);
    });
    this.backButton.on('pointerup', this.backToMenu, this);
    this.backButton.on('pointerover', () => setBtnActive(this.backButton), this);
    this.backButton.on('pointerout', () => disableBtnActive(this.backButton), this);
    this.input.keyboard.on('keydown-ESC', this.backToMenu, this);
  }

  backToMenu(): void {
    this.scene.start('Menu');
  }
}
