import * as Phaser from 'phaser';

export default class Credits extends Phaser.Scene {
  backButton: Phaser.GameObjects.Text;

  alisa: Phaser.GameObjects.Text;

  saidazizkhon: Phaser.GameObjects.Text;

  daniil: Phaser.GameObjects.Text;

  gregory: Phaser.GameObjects.Text;

  openLink: (link: string) => void;

  credits: string[][];

  creditsList: Phaser.GameObjects.Text[];

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
    this.add
      .text(this.game.renderer.width / 2, this.game.renderer.height / 2 - 400, 'Credits', {
        font: '42px monospace',
      })
      .setOrigin(0.5);

    this.credits = [
      ['Alisa Pavlova', 'https://github.com/Alisa-Pavlova'],
      ['Saidazizkhon Akbarov', 'https://github.com/dazik'],
      ['Daniil Sitnikov', 'https://github.com/DANSitNikov'],
      ['Gregory Moskalev', 'https://github.com/GregoryMoskalev'],
    ];

    this.creditsList = this.credits.map((name, index) => this.add
      .text(this.game.renderer.width / 2, 400 + index * 100, name[0], { font: '32px monospace' })
      .setOrigin(0.5)
      .setInteractive());

    this.backButton = this.add
      .text(this.game.renderer.width / 2, this.game.renderer.height - 100, 'back to menu', {
        font: '32px monospace',
      })
      .setOrigin(0.5)
      .setInteractive();

    this.creditsList.forEach((name, index) => {
      name.on('pointerup', () => this.openLink(this.credits[index][1]));
    });
    this.backButton.on('pointerup', this.backToMenu, this);
  }

  backToMenu(): void {
    this.scene.start('Menu');
  }
}
