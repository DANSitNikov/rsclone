import * as Phaser from 'phaser';

export default class Menu extends Phaser.Scene {
  playButton: Phaser.GameObjects.Text;
  constructor() {
    super({ key: 'Menu', active: false });
  }

  init(): void {}

  preload(): void {}

  create(): void {
    this.playButton = this.add
      .text(this.game.renderer.width / 2, this.game.renderer.height / 2, 'play', {
        font: '32px monospace',
      })
      .setInteractive();
    this.playButton.on('pointerup', this.playGame, this);
  }

  playGame(): void {
    this.scene.start('Scene0');
  }
}
