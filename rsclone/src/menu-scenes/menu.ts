import * as Phaser from 'phaser';
import keuboardNavigation from '../utils/keyboardNav';
import createBtnHandlers from '../utils/createBtnHandlers';
import { createList, List } from '../utils/utilitites';

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
    // this.sound.play('menu', {loop: true});
    this.tabIndex = 0;
    this.lang = this.registry.get('lang');
    this.list = [
      {
        name: this.lang.play,
        handler: (): void => {
          this.sound.play('click');
          setTimeout(() => {
            this.scene.start('Scene1');
          }, 50);
        },
      },
      {
        name: this.lang.settings,
        handler: (): void => {
          this.sound.play('click');
          this.scene.start('Settings', { pause: false });
        },
      },
      {
        name: this.lang.statistic,
        handler: (): void => {
          this.sound.play('click');
          this.scene.start('Statistic', { pause: false });
        },
      },
      {
        name: this.lang.savedGames,
        handler: (): void => {
          this.sound.play('click');
          this.scene.start('Saved_games', { pause: false });
        },
      },
      {
        name: this.lang.credits,
        handler: (): void => {
          this.sound.play('click');
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
