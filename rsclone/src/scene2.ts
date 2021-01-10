/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Phaser from 'phaser';
import initScene from './initScene';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Scene2',
};

export default class Scene2 extends Phaser.Scene {
  private boat: any;

  private boatSprite: any;

  private boatActive: boolean;

  private player: any;

  private waterHands: Phaser.GameObjects.Sprite;

  private water: Phaser.GameObjects.Sprite;

  constructor() {
    super(sceneConfig);
  }

  public create():void {
    const x = 0; // player position
    const y = 350;
    initScene(this, 2, x, y);

    this.boat = this.matter.add.sprite(740, 700, 'boatCollides') as any;
    this.boat.visible = false;
    this.boat.setIgnoreGravity(true).setFixedRotation();
    this.boatSprite = this.add.sprite(0, 0, 'boat') as any;
    this.boatActive = false;

    this.anims.create({
      key: 'waterHands',
      frames: this.anims.generateFrameNames('waterHands', {
        start: 1,
        end: 6,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: 'water',
      frames: this.anims.generateFrameNames('water', {
        start: 1,
        end: 2,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 3,
      repeat: -1,
    });

    this.waterHands = this.add.sprite(800, 900, 'waterHands', 2);
    this.waterHands.anims.play('waterHands', true);
    this.waterHands = this.add.sprite(1100, 910, 'waterHands').setScale(-0.9, 1);
    this.waterHands.anims.play('waterHands', true);
    this.waterHands = this.add.sprite(1400, 899, 'waterHands', 3).setScale(0.99);
    this.waterHands.anims.play('waterHands', true);

    this.water = this.add.sprite(1060, 835, 'water', 1);
    this.water.anims.play('water', true);
  }

  public update():void {
    const boatSpeed = 1.8;
    const boatVelocity = this.boat.body.velocity;

    if (this.boatActive && this.boat.x < 1460) {
      this.boat.setVelocityX(boatSpeed);
    }

    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.boatSprite.getBounds(),
        this.player.player.getBounds(),
      )
    ) {
      this.boatActive = true;
      this.player.player.setVelocityX(this.player.player.body.velocity.x + boatVelocity.x);
    }

    this.boatSprite.x = this.boat.x;
    this.boatSprite.y = this.boat.y - 70;
    if (this.boat.y > 700) this.boat.y = 700;

    if (boatVelocity.x > boatSpeed) this.boat.setVelocityX(boatSpeed - 2);
    if (boatVelocity.y > 3) this.boat.setVelocityY(2);

    if (this.boat.x >= 1460) {
      this.player.stop();
      this.scene.start('Scene3');
    }
  }
}
