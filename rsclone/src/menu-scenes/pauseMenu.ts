import * as Phaser from 'phaser';
import keuboardNavigation from '../utils/keyboardNav';
import createBtnHandlers from '../utils/createBtnHandlers';
import {
  makeSavedGamesInfo, notification, makeDecor,
  createList, List,
} from '../utils/utilitites';

export default class PauseMenu extends Phaser.Scene {
  private lang: Record<string, string>;

  private btn = {
    font: '32px monospace',
  };

  private lastScene: string;

  private player;

  private tabIndex: number;

  private rexUI;

  private list: List;

  constructor() {
    super({ key: 'PauseMenu', active: false });
  }

  init(data :Record<string, string>): void {
    this.lastScene = data.key;
    this.player = data.player;
  }

  create(): void {
    makeDecor(this);
    this.tabIndex = 0;
    this.lang = this.registry.get('lang');
    this.list = [
      {
        name: this.lang.resume,
        handler: (): void => {
          this.scene.stop();
          this.scene.resume(this.lastScene);
        },
      },
      {
        name: this.lang.settings,
        handler: (): void => {
          this.scene.start('Settings', { key: this.lastScene, pause: true, player: this.player });
          this.scene.bringToTop('Settings');
        },
      },
      {
        name: this.lang.statistic,
        handler: (): void => {
          this.scene.start('Statistic', { key: this.lastScene, pause: true, player: this.player });
          this.scene.bringToTop('Statistic');
        },
      },
      {
        name: this.lang.saveGame,
        handler: (): void => {
          notification(this, this.rexUI);
          this.sound.add('save').play({ loop: false });
          const time = JSON.parse(localStorage.getItem('gaming_time'));
          const deaths = JSON.parse(localStorage.getItem('deaths_count'));
          const scene = this.lastScene;
          makeSavedGamesInfo(time, deaths, scene);
        },
      },
      {
        name: this.lang.mainMenu,
        handler: (): void => {
          this.game.sound.stopAll();

          this.player.stop();
          localStorage.setItem('gaming_time', JSON.stringify(0));

          localStorage.setItem('deaths_count', JSON.stringify(0));

          this.scene.stop(this.lastScene);
          this.scene.start('Menu');
        },
      },
    ];
    this.add
      .text(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 - 400,
        this.lang.pauseHeading,
        {
          font: '42px monospace',
        },
      )
      .setOrigin(0.5).setDepth(1000);

    createList.call(this);
    createBtnHandlers.call(this);
    keuboardNavigation.call(this, [true]);
  }
}
