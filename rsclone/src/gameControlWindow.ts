import * as Phaser from 'phaser';
import { disableBtnActive, setBtnActive } from './utils/utilitites';

export default class GameControl extends Phaser.Scene {
  private lang: Record<string, string>;

  private rexUI;

  private tabIndex: number;

  constructor() {
    super({ key: 'GameControl', active: false });
  }

  public create():void {
    this.tabIndex = 0;
    this.lang = this.registry.get('lang');

    this.add
      .text(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 - 300,
        this.lang.gameControl,
        {
          font: '42px monospace',
        },
      ).setOrigin(0.5)
      .setDepth(1000);

    this.add.sprite(this.game.renderer.width / 2, this.game.renderer.height / 2, 'backControl');
    this.add.sprite(this.game.renderer.width / 2 - 180, this.game.renderer.height / 2 - 210, 'arrowRIGHT')
      .setScale(0.2);
    this.add.sprite(this.game.renderer.width / 2 - 280, this.game.renderer.height / 2 - 210, 'arrowLEFT')
      .setScale(0.22);
    this.add.sprite(this.game.renderer.width / 2 - 180, this.game.renderer.height / 2 - 110, 'd')
      .setScale(0.2);
    this.add.sprite(this.game.renderer.width / 2 - 280, this.game.renderer.height / 2 - 110, 'a')
      .setScale(0.22);
    this.add.sprite(this.game.renderer.width / 2 - 180, this.game.renderer.height / 2 + 10, 'arrowUP')
      .setScale(0.22);
    this.add.sprite(this.game.renderer.width / 2 - 280, this.game.renderer.height / 2 + 10, 'w')
      .setScale(0.22);
    this.add.sprite(this.game.renderer.width / 2 - 160, this.game.renderer.height / 2 + 130, 'space')
      .setScale(0.7);
    this.add.sprite(this.game.renderer.width / 2 - 330, this.game.renderer.height / 2 + 130, 'e')
      .setScale(0.22);
    this.add.text(this.game.renderer.width / 2 + 20, this.game.renderer.height / 2 - 170, `${this.lang.left} / ${this.lang.right}`, {
      font: '40px monospace',
    });
    this.add.text(this.game.renderer.width / 2 + 20,
      this.game.renderer.height / 2 - 10, this.lang.jump, {
        font: '40px monospace',
      });
    this.add.text(this.game.renderer.width / 2 + 20,
      this.game.renderer.height / 2 + 105, this.lang.action, {
        font: '40px monospace',
      });

    const COLOR_DARK = 0x260e04;

    const CheckboxesMode = true;
    localStorage.setItem('showControl', JSON.stringify(true));

    const createButton = (scene, text) => scene.rexUI.add.label({
      width: 100,
      height: 40,
      text: scene.add.text(0, 0, text, {
        fontSize: 18,
      }),
      icon: scene.add.circle(0, 0, 15).setStrokeStyle(1, COLOR_DARK),
      space: {
        left: 10,
        right: 10,
        icon: 10,
      },
    });

    const makeSound = () => this.sound.add('save').play({ loop: false });

    const buttons = this.rexUI.add.buttons({
      x: this.game.renderer.width / 2,
      y: this.game.renderer.height / 2 + 220,

      orientation: 'y',

      buttons: [
        createButton(this, this.lang.doNotShowAgain),
      ],

      type: ((CheckboxesMode) ? 'checkboxes' : 'radio'),
      setValueCallback(button) {
        const param = !JSON.parse(localStorage.getItem('showControl'));
        makeSound();
        button.getElement('icon')
          .setFillStyle((param) ? 0xffa300 : undefined);
        localStorage.setItem('showControl', JSON.stringify(param));
        button.getElement('text').setStyle({ font: '30px monospace' });
      },

    })
      .layout();

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.stop();
      this.scene.resume('Scene1');
    }, this);

    const setActive = () => {
      const buttonObjects = buttons.getElement('buttons[0]');
      const parameter = !JSON.parse(localStorage.getItem('showControl'));
      this.sound.add('save').play();
      buttonObjects.getElement('icon')
        .setFillStyle((parameter) ? 0xffa300 : undefined);
      localStorage.setItem('showControl', JSON.stringify(parameter));
    };

    const close = this.add.text(this.game.renderer.width / 2 + 360, this.game.renderer.height / 2 - 330, '✕', {
      font: '60px monospace',
    }).setInteractive();

    close.on('pointerup', () => {
      this.scene.stop();
      this.sound.play('click');
      this.scene.resume('Scene1');
    });

    close.on('pointerover', () => setBtnActive(close));
    close.on('pointerout', () => disableBtnActive(close));

    this.input.keyboard.on('keydown-ENTER', () => {
      setActive();
    });

    this.input.keyboard.on('keydown-SPACE', () => {
      setActive();
    });
  }
}
