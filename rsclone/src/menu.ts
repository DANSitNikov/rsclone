import * as Phaser from 'phaser';

export default class Menu extends Phaser.Scene {
  playButton: Phaser.GameObjects.Text;

  settingsButton: Phaser.GameObjects.Text;

  creditsButton: Phaser.GameObjects.Text;

  menu: string[] | Phaser.GameObjects.Text[];

  btn = {
    font: '32px monospace',
  };

  constructor() {
    super({ key: 'Menu', active: false });
  }

  create(): void {
    this.menu = ['Play', 'Settings', 'Credits'];
    this.add
      .text(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 - 400,
        'Long Legs journey',
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
      .setInteractive({ cursor: 'pointer' }));
    this.menu.forEach((button, index) => {
      button.on('pointerup', this.onClick[index], this);
    });
  }

  onClick = [
    (): void => {
      this.scene.start('Scene1');
    },

    (): void => {
      this.scene.start('Settings');
    },

    (): void => {
      this.scene.start('Credits');
    },
  ];
}
