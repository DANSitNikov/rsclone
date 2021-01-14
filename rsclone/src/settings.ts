import * as Phaser from 'phaser';
import {
  switchLang, setBtnActive, disableBtnActive,
  keyboardControl,
} from './utilitites';

export default class Settings extends Phaser.Scene {
  private lang: Record<string, string>;

  private soundButton: Phaser.GameObjects.Text;

  private backButton: Phaser.GameObjects.Text;

  private rexUI;

  private pause: boolean;

  private lastScene: string;

  private langBtn: Phaser.GameObjects.Text;

  private volume;

  private tabIndex: number;

  private soundLabel: Phaser.GameObjects.Text;

  private langLabel: Phaser.GameObjects.Text;

  private player;

  constructor() {
    super({ key: 'Settings', active: false });
  }

  init(data :{ key: string; pause: boolean; player }): void {
    this.lastScene = data.key;
    this.pause = data.pause;
    this.player = data.player;
  }

  create(): void {
    this.tabIndex = this.tabIndex || 0;
    this.lang = this.registry.get('lang');
    const soundBox = this.add.graphics();
    soundBox.fillStyle(0x222222, 0.8);

    this.add
      .text(this.game.renderer.width / 2, this.game.renderer.height / 2 - 400, this.lang.settings, {
        font: '42px monospace',
      })
      .setOrigin(0.5);

    this.soundLabel = this.add
      .text(this.game.renderer.width / 2,
        this.game.renderer.height / 2,
        this.lang.soundVolume,
        {
          font: '32px monospace',
        })
      .setOrigin(1)
      .setInteractive();

    this.volume = this.rexUI.add
      .slider({
        x: this.game.renderer.width / 2 + 110,
        y: this.game.renderer.height / 2 - 15,
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

    this.langLabel = this.add
      .text(this.game.renderer.width / 2,
        this.game.renderer.height / 2 + 80,
        this.lang.language,
        {
          font: '32px monospace',
        })
      .setOrigin(1, 0.5)
      .setInteractive();

    this.langBtn = this.add
      .text(this.game.renderer.width / 2 + 10,
        this.game.renderer.height / 2 + 80,
        this.lang.languageName,
        {
          font: '32px monospace',
        })
      .setOrigin(0, 0.5)
      .setInteractive();

    this.backButton = this.add
      .text(this.game.renderer.width / 2, this.game.renderer.height - 100, this.lang.backToMenu, {
        font: '32px monospace',
      })
      .setOrigin(0.5)
      .setInteractive();

    const btnLabelsArr = [
      this.soundLabel,
      this.langLabel,
      this.backButton,
    ];

    const btnArr = [
      null,
      () => this.switchLangHandler(),
      () => this.backToMenu(),
    ];

    this.backButton.on('pointerup', this.backToMenu, this);
    this.backButton.on('pointerover', () => {
      disableBtnActive(btnLabelsArr[this.tabIndex]);
      this.tabIndex = btnLabelsArr.indexOf(this.backButton);
      setBtnActive(this.backButton);
    }, this);
    this.backButton.on('pointerout', () => disableBtnActive(this.backButton), this);
    this.input.keyboard.on('keydown-ESC', this.backToMenu, this);
    this.langLabel.on('pointerup', this.switchLangHandler, this);
    this.langLabel.on('pointerover', () => {
      disableBtnActive(btnLabelsArr[this.tabIndex]);
      this.tabIndex = btnLabelsArr.indexOf(this.langLabel);
      setBtnActive(this.langLabel);
    }, this);
    this.langLabel.on('pointerout', () => disableBtnActive(this.langLabel), this);
    this.soundLabel.on('pointerover', () => {
      disableBtnActive(btnLabelsArr[this.tabIndex]);
      this.tabIndex = btnLabelsArr.indexOf(this.soundLabel);
      setBtnActive(this.soundLabel);
    }, this);
    this.soundLabel.on('pointerout', () => disableBtnActive(this.soundLabel), this);
    this.langBtn.on('pointerup', this.switchLangHandler, this);
    this.langBtn.on('pointerover', () => {
      disableBtnActive(btnLabelsArr[this.tabIndex]);
      this.tabIndex = btnLabelsArr.indexOf(this.langBtn);
      setBtnActive(this.langBtn);
    }, this);
    this.langBtn.on('pointerout', () => disableBtnActive(this.langLabel), this);
    this.volume.on('pointerover', () => {
      disableBtnActive(btnLabelsArr[this.tabIndex]);
      this.tabIndex = btnLabelsArr.indexOf(this.soundLabel);
      setBtnActive(this.soundLabel);
    }, this);
    this.volume.on('pointerout', () => disableBtnActive(this.soundLabel), this);

    this.input.keyboard.on('keydown-ENTER', () => {
      if (typeof btnArr[this.tabIndex] === 'function') {
        btnArr[this.tabIndex]();
      }
    }, this);

    this.input.keyboard.on('keydown', (e) => {
      this.tabIndex = keyboardControl(e, this.tabIndex, btnLabelsArr);

      const currentValue = this.volume.getValue();
      if (!(e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return;
      if (this.tabIndex !== btnLabelsArr.indexOf(this.soundLabel)) return;
      const n = e.key === 'ArrowLeft' ? -0.1 : 0.1;
      this.volume.setValue(Math.round((currentValue + n) * 10) / 10);
    }, this);
    setBtnActive(btnLabelsArr[this.tabIndex]);
  }

  backToMenu(): void {
    if (!this.pause) {
      this.scene.start('Menu');
    } else {
      this.scene.start('PauseMenu', { key: this.lastScene, player: this.player });
    }
  }

  switchLangHandler():void {
    this.lang = switchLang(localStorage.getItem('lang'));
    this.registry.set('lang', this.lang);
    this.scene.restart();
  }
}
