import * as Phaser from 'phaser';

export default class Credits extends Phaser.Scene {
  backButton: Phaser.GameObjects.Text;

  alisa: Phaser.GameObjects.Text;

  saidazizkhon: Phaser.GameObjects.Text;

  daniil: Phaser.GameObjects.Text;

  gregory: Phaser.GameObjects.Text;

  openLink: (link: string) => void;

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

    this.alisa = this.add
      .text(this.game.renderer.width / 2, 400, 'Alisa Pavlova')
      .setOrigin(0.5)
      .setInteractive();

    this.saidazizkhon = this.add
      .text(this.game.renderer.width / 2, 500, 'Saidazizkhon Akbarov', { font: '32px monospace' })
      .setOrigin(0.5)
      .setInteractive();

    this.daniil = this.add
      .text(this.game.renderer.width / 2, 600, 'Daniil Sitnikov', { font: '32px monospace' })
      .setOrigin(0.5)
      .setInteractive();

    this.gregory = this.add
      .text(this.game.renderer.width / 2, 700, 'Gregory Moskalev', { font: '32px monospace' })
      .setOrigin(0.5)
      .setInteractive();

    this.backButton = this.add
      .text(this.game.renderer.width / 2, this.game.renderer.height - 100, 'back to menu', {
        font: '32px monospace',
      })
      .setOrigin(0.5)
      .setInteractive();

    this.alisa.on('pointerup', () => this.openLink('https://github.com/Alisa-Pavlova'));
    this.saidazizkhon.on('pointerup', () => this.openLink('https://github.com/dazik'));
    this.daniil.on('pointerup', () => this.openLink('https://github.com/DANSitNikov'));
    this.gregory.on('pointerup', () => this.openLink('https://github.com/GregoryMoskalev'));
    this.backButton.on('pointerup', this.backToMenu, this);
  }

  backToMenu(): void {
    this.scene.start('Menu');
  }
}
