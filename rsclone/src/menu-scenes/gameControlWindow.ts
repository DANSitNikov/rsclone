import * as Phaser from 'phaser';

export default class GameControl extends Phaser.Scene {
  private lang: Record<string, string>;

  private rexUI;

  private btn = {
    font: '32px monospace',
  };

  private lastScene: string;

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
        this.game.renderer.height / 2 - 400,
        this.lang.gameControl,
        {
          font: '42px monospace',
        },
      ).setOrigin(0.5)
      .setDepth(1000);

    this.add.sprite(this.game.renderer.width / 2, this.game.renderer.height / 2, 'backControl').setScale(1.5);
    this.add.sprite(this.game.renderer.width / 2 - 180, this.game.renderer.height / 2 - 200, 'arrow')
      .setScale(0.15).setAngle(90);
    this.add.sprite(this.game.renderer.width / 2 - 280, this.game.renderer.height / 2 - 200, 'arrow')
      .setScale(0.15).setAngle(-90);
    this.add.sprite(this.game.renderer.width / 2 - 180, this.game.renderer.height / 2 - 100, 'd')
      .setScale(0.2);
    this.add.sprite(this.game.renderer.width / 2 - 280, this.game.renderer.height / 2 - 100, 'a')
      .setScale(0.2);
    this.add.sprite(this.game.renderer.width / 2 - 180, this.game.renderer.height / 2 + 30, 'arrow')
      .setScale(0.15);
    this.add.sprite(this.game.renderer.width / 2 - 280, this.game.renderer.height / 2 + 30, 'w')
      .setScale(0.2);
    this.add.sprite(this.game.renderer.width / 2 - 230, this.game.renderer.height / 2 + 180, 'space')
      .setScale(0.8);
    this.add.text(this.game.renderer.width / 2 + 20, this.game.renderer.height / 2 - 160, `${this.lang.left} / ${this.lang.right}`, {
      font: '40px monospace',
    });
    this.add.text(this.game.renderer.width / 2 + 20,
      this.game.renderer.height / 2 + 10, this.lang.jump, {
        font: '40px monospace',
      });
    this.add.text(this.game.renderer.width / 2 + 20,
      this.game.renderer.height / 2 + 160, this.lang.action, {
        font: '40px monospace',
      });

    const COLOR_DARK = 0x260e04;

    const CheckboxesMode = true;
    localStorage.setItem('showControl', JSON.stringify(true));

    const createButton = (scene, text, name = '') => {
      if (name === '') {
        name = text;
      }
      const button = scene.rexUI.add.label({
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

        name,
      });

      return button;
    };

    const buttons = this.rexUI.add.buttons({
      x: this.game.renderer.width / 2,
      y: this.game.renderer.height / 2 + 260,

      orientation: 'y',

      buttons: [
        createButton(this, this.lang.doNotShowAgain),
      ],

      type: ((CheckboxesMode) ? 'checkboxes' : 'radio'),
      setValueCallback(button) {
        const param = !JSON.parse(localStorage.getItem('showControl'));
        button.getElement('icon')
          .setFillStyle((param) ? 0xffffff : undefined);
        localStorage.setItem('showControl', JSON.stringify(param));
        button.getElement('text').setStyle({ font: '30px monospace' });
      },

    })
      .layout();

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.stop();
      this.scene.resume('Scene1');
    }, this);

    this.input.keyboard.on('keydown-ENTER', () => {
      const buttonObjects = buttons.getElement('buttons[0]');
      const parameter = !JSON.parse(localStorage.getItem('showControl'));
      buttonObjects.getElement('icon')
        .setFillStyle((parameter) ? 0xffffff : undefined);
      localStorage.setItem('showControl', JSON.stringify(parameter));
    });

    this.input.keyboard.on('keydown-SPACE', () => {
      const buttonObjects = buttons.getElement('buttons[0]');
      const parameter = !JSON.parse(localStorage.getItem('showControl'));
      buttonObjects.getElement('icon')
        .setFillStyle((parameter) ? 0xffffff : undefined);
      localStorage.setItem('showControl', JSON.stringify(parameter));
    });
  }
}
