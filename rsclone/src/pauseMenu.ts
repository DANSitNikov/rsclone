import * as Phaser from 'phaser';
import { setBtnActive, disableBtnActive, keyboardControl } from './utilitites';

export default class PauseMenu extends Phaser.Scene {
  private playButton: Phaser.GameObjects.Text;

  private settingsButton: Phaser.GameObjects.Text;

  private creditsButton: Phaser.GameObjects.Text;

  private menuNames: string[];

  private menu: Phaser.GameObjects.Text[];

  private lang: Record<string, string>;

  private btn = {
    font: '32px monospace',
  };

  private lastScene: string;

  private player;

  private tabIndex: number;

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
    this.menuNames = [this.lang.resume, this.lang.settings, this.lang.mainMenu];
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

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.stop();
      this.scene.resume(this.lastScene);
    }, this);

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
      this.scene.stop();
      this.scene.resume(this.lastScene);
    },
    (): void => {
      this.scene.start('Settings', { key: this.lastScene, pause: true, player: this.player });
      this.scene.bringToTop('Settings');
    },
    (): void => {
      this.game.sound.stopAll();

      this.player.stop();

      this.scene.stop(this.lastScene);
      this.scene.start('Menu');
    },
  ];
}
