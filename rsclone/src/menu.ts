import * as Phaser from 'phaser';

export default class Menu extends Phaser.Scene {
  playButton: Phaser.GameObjects.Text;
  settingsButton: Phaser.GameObjects.Text;
  creditsButton: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'Menu', active: false });
  }

  create(): void {
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

    this.playButton = this.add
      .text(this.game.renderer.width / 2, this.game.renderer.height / 2 - 80, 'play', {
        font: '32px monospace',
      })
      .setOrigin(0.5)
      .setInteractive();

    this.settingsButton = this.add
      .text(this.game.renderer.width / 2, this.game.renderer.height / 2, 'Settings', {
        font: '32px monospace',
      })
      .setOrigin(0.5)
      .setInteractive();

    this.creditsButton = this.add
      .text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 80, 'Credits', {
        font: '32px monospace',
      })
      .setOrigin(0.5)
      .setInteractive();

    this.playButton.on('pointerup', this.playGame, this);
    this.settingsButton.on('pointerup', this.settings, this);
    this.creditsButton.on('pointerup', this.credits, this);
  }

  private playGame(): void {
    this.scene.start('Scene0');
  }

  private settings(): void {
    this.scene.start('Settings');
  }

  private credits(): void {
    this.scene.start('Credits');
  }
}
