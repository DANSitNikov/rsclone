import * as Phaser from 'phaser';
import keuboardNavigation from '../utils/keyboardNav';
import createBtnHandlers from '../utils/createBtnHandlers';
import { createList, List } from '../utils/utilitites';

export default class GameOverMenu extends Phaser.Scene {
    private playButton: Phaser.GameObjects.Text;

    private menuNames: string[];

    private menu: Phaser.GameObjects.Text[];

    private lang: Record<string, string>;

    private btn = {
      font: '32px monospace',
    };

    private lastScene: string;

    private tabIndex: number;

    private list: List;

    constructor() {
      super({ key: 'GameOverMenu', active: false });
    }

    init(data :Record<string, string>): void {
      this.lastScene = data.key;
    }

    create(): void {
      this.tabIndex = 0;
      this.lang = this.registry.get('lang');
      this.menuNames = [this.lang.restart, this.lang.newGame, this.lang.mainMenu];
      this.add
        .text(
          this.game.renderer.width / 2,
          this.game.renderer.height / 2 - 400,
          this.lang.gameOverHeading,
          {
            font: '42px monospace',
          },
        )
        .setOrigin(0.5).setDepth(1000);

      this.list = [
        {
          name: this.lang.restart,
          handler: () => this.startScene(this.lastScene),
        },
        {
          name: this.lang.newGame,
          handler: () => {
            this.startScene('Scene1');
            localStorage.setItem('gaming_time', JSON.stringify(0));
            localStorage.setItem('deaths_count', JSON.stringify(0));
          },
        },
        {
          name: this.lang.mainMenu,
          handler: () => {
            this.startScene('Menu');
            localStorage.setItem('gaming_time', JSON.stringify(0));
            localStorage.setItem('deaths_count', JSON.stringify(0));
          },
        }];

      createList.call(this);
      createBtnHandlers.call(this);
      keuboardNavigation.call(this);
    }

    startScene(scName:string):void {
      this.sound.stopAll();
      this.scene.start(scName);
    }
}
