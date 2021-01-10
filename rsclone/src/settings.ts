/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Phaser from 'phaser';

export default class Settings extends Phaser.Scene {
  lang: Record<string, string>;

  soundButton: Phaser.GameObjects.Text;

  backButton: Phaser.GameObjects.Text;

  rexUI: any;

  pause: boolean;

  lastScene: string;

  constructor() {
    super({ key: 'Settings', active: false });
  }

  init(data :{ key: string; pause: boolean; }): void {
    this.lastScene = data.key;
    this.pause = data.pause;
  }

  create(): void {
    this.lang = this.registry.get('lang');
    const soundBox = this.add.graphics();
    soundBox.fillStyle(0x222222, 0.8);

    this.add
      .text(this.game.renderer.width / 2, this.game.renderer.height / 2 - 400, this.lang.settings, {
        font: '42px monospace',
      })
      .setOrigin(0.5);

    this.add
      .text(this.game.renderer.width / 2 - 150,
        this.game.renderer.height / 2,
        this.lang.soundVolume,
        {
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
        value: localStorage.getItem('volume'),
        track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x222222),
        indicator: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0xffffff),
        thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 12, 0xffffff),

        input: 'click',
        valuechangeCallback: (value) => {
          this.game.sound.volume = value;
          localStorage.setItem('volume', value);
        },
      })
      .layout();

    this.backButton = this.add
      .text(this.game.renderer.width / 2, this.game.renderer.height - 100, this.lang.backToMenu, {
        font: '32px monospace',
      })
      .setOrigin(0.5)
      .setInteractive({ cursor: 'pointer' });

    this.backButton.on('pointerup', this.backToMenu, this);
    this.input.keyboard.on('keydown-ESC', this.backToMenu, this);
  }

  soundToggle():void {
    this.sound.mute = !this.sound.mute;
  }

  backToMenu(): void {
    if (!this.pause) {
      this.scene.start('Menu');
    } else {
      this.scene.start('PauseMenu', { key: this.lastScene });
    }
  }
}
