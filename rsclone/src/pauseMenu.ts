import * as Phaser from 'phaser';

export default class PauseMenu extends Phaser.Scene {
  playButton: Phaser.GameObjects.Text;

  settingsButton: Phaser.GameObjects.Text;

  creditsButton: Phaser.GameObjects.Text;

  menu: string[] | Phaser.GameObjects.Text[];

  btn = {
    font: '32px monospace',
  };

  lastScene: string;

  constructor() {
    super({ key: 'PauseMenu', active: false });
  }

  init(data :Record<string, string>): void {
    this.lastScene = data.key;
  }

  create(): void {
    this.menu = ['Resume', 'Settings', 'Main menu'];
    this.add
      .text(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 - 400,
        'Paused',
        {
          font: '42px monospace',
        },
      )
      .setOrigin(0.5);

    this.menu = this.menu.map((button, index) => this.add
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
      this.scene.sleep(this.lastScene);
      this.scene.start('Menu');
    },
  ];
}
