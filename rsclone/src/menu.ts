import * as Phaser from 'phaser';

export default class Menu extends Phaser.Scene {
  playButton: Phaser.GameObjects.Text;
  creditsButton: Phaser.GameObjects.Text;
  constructor() {
    super({ key: 'Menu', active: false });
  }

  create(): void {
    this.add
      .text(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 - 200,
        'Long Legs journey',
        {
          font: '42px monospace',
        },
      )
      .setOrigin(0.5);

    this.creditsButton = this.add
      .text(0, 20, 'Credits', {
        font: '32px monospace',
      })
      .setInteractive();

    this.playButton = this.add
      .text(this.game.renderer.width / 2, this.game.renderer.height / 2, 'play', {
        font: '32px monospace',
      })
      .setOrigin(0.5)
      .setInteractive();
    this.playButton.on('pointerup', this.playGame, this);
    this.creditsButton.on('pointerup', this.credits, this);
  }

  playGame(): void {
    this.scene.start('Scene0');
  }

  credits(): void {
    this.scene.start('Credits');
  }
}
