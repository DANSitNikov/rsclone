import * as Phaser from 'phaser';
import keuboardNavigation from '../utils/keyboardNav';
import createBtnHandlers from '../utils/createBtnHandlers';
import {
  switchLang, backToMenu, List,
} from '../utils/utilitites';

export default class Settings extends Phaser.Scene {
  private lang: Record<string, string>;

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

  private list: List;

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

    this.list = [
      {
        label: this.soundLabel,
        btn: this.volume,
      },
      {
        label: this.langLabel,
        btn: this.langBtn,
        handler: () => this.switchLangHandler(),
      },
      {
        label: this.backButton,
        btn: this.backButton,
        handler: backToMenu.bind(this),
      },
    ];

    createBtnHandlers.call(this);
    keuboardNavigation.call(this, true, true);
  }

  switchLangHandler():void {
    this.sound.play('click');
    this.lang = switchLang(localStorage.getItem('lang'));
    this.registry.set('lang', this.lang);
    this.scene.restart();
  }
}
