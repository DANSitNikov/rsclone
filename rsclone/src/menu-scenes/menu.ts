import * as Phaser from 'phaser';
import {
  createList, createBtnHandlers, keuboardNavigation, List,
} from '../utils/utilitites';

export default class Menu extends Phaser.Scene {
  private btn = {
    font: '32px monospace',
  };

  private lang: Record<string, string>;

  private tabIndex: number;

  private list: List;

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

    createList.call(this);
    createBtnHandlers.call(this);
    keuboardNavigation.call(this);
  }
}
