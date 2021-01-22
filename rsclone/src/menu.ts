import * as Phaser from 'phaser';
import { setBtnActive, disableBtnActive, keyboardControl } from './utilitites';

export default class Menu extends Phaser.Scene {
  private btn = {
    font: '32px monospace',
  };

  private lang: Record<string, string>;

  private tabIndex: number;

  private list: ({
    name: string;
    handler: () => void;
    btn: Phaser.GameObjects.Text;
    } | {
    name: string;
    handler: () => void;
    btn?: undefined;
    })[];

  constructor() {
    super({ key: 'Menu', active: false });
  }

  create(): void {
    this.tabIndex = 0;
    this.lang = this.registry.get('lang');
    this.list = [
      {
        name: this.lang.play,
        handler: (): void => {
          this.scene.start('Scene1');
        },
      },
      {
        name: this.lang.settings,
        handler: (): void => {
          this.scene.start('Settings', { pause: false });
        },
      },
      {
        name: this.lang.statistic,
        handler: (): void => {
          this.scene.start('Statistic', { pause: false });
        },
      },
      {
        name: this.lang.savedGames,
        handler: (): void => {
          this.scene.start('Saved_games', { pause: false });
        },
      },
      {
        name: this.lang.credits,
        handler: (): void => {
          this.scene.start('Credits');
        },
      },
    ];
    this.add
      .text(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 - 400,
        this.lang.title,
        {
          font: '42px monospace',
        },
      )
      .setOrigin(0.5);

    this.list.forEach((item, index) => {
      this.list[index].btn = this.add
        .text(
          this.game.renderer.width / 2,
          this.game.renderer.height / 2 - 80 + index * 80,
          item.name,
          this.btn,
        )
        .setOrigin(0.5)
        .setInteractive();
    });

    this.list.forEach((item, index) => {
      item.btn.on('pointerup', item.handler, this);
      item.btn.on('pointerover', () => {
        disableBtnActive(this.list[this.tabIndex].btn);
        this.tabIndex = index;
        setBtnActive(item.btn);
      }, this);
      item.btn.on('pointerout', () => disableBtnActive(item.btn), this);
    });

    this.input.keyboard.on('keydown-ENTER', () => {
      this.list[this.tabIndex].handler();
    }, this);

    this.input.keyboard.on('keydown', (e: KeyboardEvent) => {
      this.tabIndex = keyboardControl(e, this.tabIndex, this.list.map((item) => item.btn));
    }, this);
    setBtnActive(this.list[this.tabIndex].btn);
  }
}
