import * as Phaser from 'phaser';
import keuboardNavigation from '../utils/keyboardNav';
import createBtnHandlers from '../utils/createBtnHandlers';
import { List } from '../utils/utilitites';

export default class Credits extends Phaser.Scene {
  private lang: Record<string, string>;

  private openLink: (link: string) => void;

  private tabIndex: number;

  private list: List;

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
    this.tabIndex = 0;
    this.lang = this.registry.get('lang');
    this.add
      .text(this.game.renderer.width / 2, this.game.renderer.height / 2 - 400, this.lang.credits, {
        font: '42px monospace',
      })
      .setOrigin(0.5);

    this.list = [
      {
        name: this.lang.devs,
        style: { font: '24px monospace' },
      },
      {
        name: 'Alisa Pavlova',
        handler: () => this.openLink('https://github.com/Alisa-Pavlova'),
        style: { font: '32px monospace' },
      },
      {
        name: 'Saidazizkhon Akbarov',
        handler: () => this.openLink('https://github.com/dazik'),
        style: { font: '32px monospace' },
      },
      {
        name: 'Daniil Sitnikov',
        handler: () => this.openLink('https://github.com/DANSitNikov'),
        style: { font: '32px monospace' },
      },
      {
        name: 'Gregory Moskalev',
        handler: () => this.openLink('https://github.com/GregoryMoskalev'),
        style: { font: '32px monospace' },
      },
      {
        name: this.lang.artist,
        style: { font: '24px monospace' },
      },
      {
        name: 'Sofya Ostrovskaya',
        style: { font: '32px monospace' },
      },
      {
        name: this.lang.backToMenu,
        handler: () => this.backToMenu(),
        style: { font: '32px monospace' },
      },
    ];

    this.list.forEach((item, index) => {
      let height = 250 + index * 70;
      if (index === this.list.length - 1) {
        height = this.game.renderer.height - 100;
      }
      if (item.handler) {
        this.list[index].btn = this.add
          .text(this.game.renderer.width / 2, height, item.name, item.style)
          .setOrigin(0.5)
          .setInteractive();
      } else {
        this.add
          .text(this.game.renderer.width / 2, 250 + index * 70, item.name, item.style)
          .setOrigin(0.5);
      }
    });

    this.list = this.list.filter((e) => e.btn);

    createBtnHandlers.call(this);
    keuboardNavigation.call(this, true);
  }

  backToMenu(): void {
    this.sound.play('click');
    this.scene.start('Menu');
  }
}
