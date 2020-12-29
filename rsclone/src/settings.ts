import * as Phaser from 'phaser';

export default class Settings extends Phaser.Scene {
  soundButton: Phaser.GameObjects.Text;
  backButton: Phaser.GameObjects.Text;
  rexUI: any;
  constructor() {
    super({ key: 'Settings', active: false });
  }

  create(): void {
    const soundBox = this.add.graphics();
    soundBox.fillStyle(0x222222, 0.8);

    this.add
      .text(this.game.renderer.width / 2, this.game.renderer.height / 2 - 400, 'Settings', {
        font: '42px monospace',
      })
      .setOrigin(0.5);

    this.add
      .text(this.game.renderer.width / 2 - 100, this.game.renderer.height / 2, 'Volume', {
        font: '32px monospace',
      })
      .setOrigin(0.5);

    this.rexUI.add
      .slider({
        x: this.game.renderer.width / 2 + 100,
        y: this.game.renderer.height / 2,
        width: 200,
        height: 20,
        orientation: 'x',
        value: this.sound.volume,
        track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x222222),
        indicator: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0xffffff),
        thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 12, 0xffffff),

        input: 'click', // 'drag'|'click'
        valuechangeCallback: (value) => {
          this.sound.volume = value;
        },
      })
      .layout();

    this.backButton = this.add
      .text(this.game.renderer.width / 2, this.game.renderer.height - 100, 'back to menu', {
        font: '32px monospace',
      })
      .setOrigin(0.5)
      .setInteractive();

    this.backButton.on('pointerup', this.backToMenu, this);
  }

  soundToggle() {
    this.sound.mute = !this.sound.mute;
  }

  backToMenu(): void {
    this.scene.start('Menu');
  }
}
