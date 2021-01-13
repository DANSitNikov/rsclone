import * as Phaser from 'phaser';
import { setBtnActive, disableBtnActive } from './utilitites';

export default class PauseMenu extends Phaser.Scene {
  playButton: Phaser.GameObjects.Text;

  settingsButton: Phaser.GameObjects.Text;

  creditsButton: Phaser.GameObjects.Text;

  menu: string[] | Phaser.GameObjects.Text[];

  lang: Record<string, string>;

  btn = {
    font: '32px monospace',
  };

  private lastScene: string;

  private player;

  constructor() {
    super({ key: 'PauseMenu', active: false });
  }

  init(data :Record<string, string>): void {
    this.lastScene = data.key;
    this.player = data.player;
  }

  create(): void {
    this.lang = this.registry.get('lang');
    this.menu = [this.lang.resume, this.lang.settings, this.lang.mainMenu];
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

    this.menu = this.menu.map((button, index) => this.add
      .text(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 - 80 + index * 80,
        button,
        this.btn,
      )
      .setOrigin(0.5)
      .setInteractive({ cursor: 'pointer' }));
    this.menu.forEach((button, index) => {
      button.on('pointerup', this.onClick[index], this);
      button.on('pointerover', () => setBtnActive(button), this);
      button.on('pointerout', () => disableBtnActive(button), this);
    });

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.stop();
      this.scene.resume(this.lastScene);
    }, this);
  }

  onClick = [
    (): void => {
      this.scene.stop();
      this.scene.resume(this.lastScene);
    },
    (): void => {
      this.scene.start('Settings', { key: this.lastScene, pause: true });
      this.scene.bringToTop('Settings');
    },
    (): void => {
      this.game.sound.stopAll();
      this.scene.stop(this.lastScene);
      this.player.stop();
      this.scene.start('Menu');
    },
  ];
}
