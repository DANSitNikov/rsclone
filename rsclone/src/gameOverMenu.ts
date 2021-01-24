import * as Phaser from 'phaser';

import {
  setBtnActive, disableBtnActive, keyboardControl,
} from './utilitites';

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

      this.menu = this.menuNames.map((button, index) => this.add
        .text(
          this.game.renderer.width / 2,
          this.game.renderer.height / 2 - 80 + index * 80,
          button,
          this.btn,
        )
        .setOrigin(0.5)
        .setInteractive());
      this.menu.forEach((button, index) => {
        button.on('pointerup', this.onClick[index], this);
        button.on('pointerover', () => {
          disableBtnActive(this.menu[this.tabIndex]);
          this.tabIndex = index;
          setBtnActive(button);
        }, this);
        button.on('pointerout', () => disableBtnActive(button), this);
      });

      this.input.keyboard.on('keydown-ENTER', () => {
        this.onClick[this.tabIndex]();
      }, this);

      this.input.keyboard.on('keydown', (e: KeyboardEvent) => {
        this.tabIndex = keyboardControl(e, this.tabIndex, this.menu);
      }, this);
      setBtnActive(this.menu[this.tabIndex]);
    }

    onClick = [
      (): void => {
        this.sound.stopAll();
        this.scene.start(this.lastScene);
      },
      (): void => {
        this.sound.stopAll();
        localStorage.setItem('deaths_count', JSON.stringify(0));
        localStorage.setItem('gaming_time', JSON.stringify(0));
        this.scene.start('Scene1');
      },
      (): void => {
        this.sound.stopAll();
        localStorage.setItem('deaths_count', JSON.stringify(0));
        localStorage.setItem('gaming_time', JSON.stringify(0));
        this.scene.start('Menu');
      },
    ];
}
