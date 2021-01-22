import * as Phaser from 'phaser';
import {
  setBtnActive, disableBtnActive, keyboardControl, makeSavedGamesInfo,
} from './utilitites';

export default class PauseMenu extends Phaser.Scene {
  private lang: Record<string, string>;

  private btn = {
    font: '32px monospace',
  };

  private lastScene: string;

  private player;

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
    super({ key: 'PauseMenu', active: false });
  }

  init(data :Record<string, string>): void {
    this.lastScene = data.key;
    this.player = data.player;
  }

  create(): void {
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
          alert('your game has been saved!!');
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

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.stop();
      this.scene.resume(this.lastScene);
    }, this);

    this.input.keyboard.on('keydown-ENTER', () => {
      this.list[this.tabIndex].handler();
    }, this);

    this.input.keyboard.on('keydown', (e: KeyboardEvent) => {
      this.tabIndex = keyboardControl(e, this.tabIndex, this.list.map((item) => item.btn));
    }, this);
    setBtnActive(this.list[this.tabIndex].btn);
  }
}
