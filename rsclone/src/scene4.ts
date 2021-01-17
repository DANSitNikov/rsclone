import * as Phaser from 'phaser';
import initScene from './initScene';
import { changeTime, makeDecor } from './utilitites';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Scene4',
};

export default class Scene4 extends Phaser.Scene {
  private demonHand: Phaser.GameObjects.Sprite;

  private player;

  private interval;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    initScene(this, 4, 0, 300);
    this.sound.removeByKey('wind');
    this.sound.add('wind2').play({ loop: true });
    this.demonHand = this.add.sprite(450, 850, 'demonHand').setScale(2);
    this.anims.create({
      key: 'demonHand',
      frames: this.anims.generateFrameNumbers('demonHand', { start: 0, end: 15 }),
      frameRate: 6,
      repeat: -1,
    });
    this.demonHand.anims.play('demonHand', true);

    makeDecor(this);

    this.interval = setInterval(() => {
      changeTime(this);
    }, 1000);
  }

  public update(): void {
    if (this.player.player.getBottomCenter().x >= 1640) {
      clearInterval(this.interval);
    }
  }
}
