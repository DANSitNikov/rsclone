import * as Phaser from 'phaser';
import { setBtnActive, disableBtnActive, keyboardControl } from './utilitites';

export default class Menu extends Phaser.Scene {
  private playButton: Phaser.GameObjects.Text;

  private settingsButton: Phaser.GameObjects.Text;

  private creditsButton: Phaser.GameObjects.Text;

  private menuNames: string[];

  private menu: Phaser.GameObjects.Text[];

  private btn = {
    font: '32px monospace',
  };

  private lang: Record<string, string>;

  private tabIndex: number;

  constructor() {
    super({ key: 'Menu', active: false });
  }

  create(): void {
    this.tabIndex = 0;
    this.lang = this.registry.get('lang');
    this.menuNames = [this.lang.play, this.lang.settings, this.lang.credits];
    this.add
      .text(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 - 400,
        this.lang.title,
        {
          font: '42px monospace',
        },
      )
      .setOrigin(0.5);

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
