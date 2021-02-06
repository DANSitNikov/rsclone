import * as Phaser from 'phaser';
import keuboardNavigation from './utils/keyboardNav';
import createBtnHandlers from './utils/createBtnHandlers';
import { List } from './utils/utilitites';

export default class GameControl extends Phaser.Scene {
  private lang: Record<string, string>;

  private tabIndex: number;

  private checkbox:Phaser.GameObjects.Sprite;

  private checkboxLabel: Phaser.GameObjects.Text;

  private list: List;

  private lastScene;

  constructor() {
    super({ key: 'GameControl', active: false });
  }

  public create():void {
    this.tabIndex = 0;
    this.lang = this.registry.get('lang');
    this.lastScene = 'Scene1';

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

    const makeSound = () => this.sound.add('save').play({ loop: false });

    this.checkbox = this.add.sprite(this.game.renderer.width / 2 - 210, this.game.renderer.height / 2 + 200, 'checkboxOutline').setOrigin(0, 0.1).setInteractive();
    this.checkboxLabel = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 + 200, this.lang.doNotShowAgain, { font: '30px monospace' }).setOrigin(0.5, 0).setInteractive();

    this.list = [
      {
        btn: this.add.text(this.game.renderer.width / 2 + 360, this.game.renderer.height / 2 - 330, '✕', {
          font: '60px monospace',
        }).setInteractive(),
        handler: () => this.closeWindowHandler(),
      },
      {
        btn: this.checkboxLabel,
        handler: () => {
          makeSound();
          const param = !JSON.parse(localStorage.getItem('showControl'));
          localStorage.setItem('showControl', JSON.stringify(param));
          if (param) {
            this.checkbox.setTexture('checkbox').setTint(0xffa300);
          } else {
            this.checkbox.setTexture('checkboxOutline').clearTint();
          }
        },
      },
    ];

    createBtnHandlers.call(this);
    keuboardNavigation.call(this, [true]);
  }

  closeWindowHandler():void {
    this.scene.stop();
    this.scene.resume('Scene1');
  }
}
