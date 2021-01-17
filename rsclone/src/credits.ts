import * as Phaser from 'phaser';
import { setBtnActive, disableBtnActive, keyboardControl } from './utilitites';

export default class Credits extends Phaser.Scene {
  private lang: Record<string, string>;

  private openLink: (link: string) => void;

  private tabIndex: number;

  private list: ({
    name: string;
      style: { font: string; };
      btn: Phaser.GameObjects.Text;
      handler?: undefined;
    } | {
      name: string;
      handler: () => void;
      style: { font: string; };
      btn?: undefined;
    } | {
      name: string;
      style: { font: string;};
      btn?: undefined;
      handler?: undefined;
    })[];

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
    this.list.forEach((e, i) => {
      if (!e.handler) return;
      e.btn.on('pointerup', e.handler, this);

      e.btn.on('pointerover', () => {
        disableBtnActive(this.list[this.tabIndex].btn);
        this.tabIndex = i;
        setBtnActive(e.btn);
      }, this);
      e.btn.on('pointerout', () => disableBtnActive(e.btn), this);
    });

    this.input.keyboard.on('keydown-ESC', this.backToMenu, this);
    setBtnActive(this.list[this.tabIndex].btn);

    this.input.keyboard.on('keydown-ENTER', () => {
      if (typeof this.list[this.tabIndex].handler === 'function') {
        this.list[this.tabIndex].handler();
      }
    }, this);

    this.input.keyboard.on('keydown', (e) => {
      this.tabIndex = keyboardControl(e, this.tabIndex, this.list.map((item) => item.btn));
    }, this);
  }

  backToMenu(): void {
    this.scene.start('Menu');
  }
}
