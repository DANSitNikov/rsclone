/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Phaser from 'phaser';
import initScene from './initScene';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Scene3',
};

export default class Scene3 extends Phaser.Scene {
  private boat: any;

  private boatSprite: Phaser.GameObjects.Sprite;

  private player: any;

  constructor() {
    super(sceneConfig);
  }

  public create():void {
    const x = 130; // player position
    const y = 560;
    initScene(this, 3, x, y);
    this.boat = this.matter.add.sprite(100, 690, 'boatCollides');
    this.boat.setIgnoreGravity(true).setFixedRotation();
    this.boat.visible = false;
    this.boatSprite = this.add.sprite(100, 0, 'boat');
  }

  public update():void {
    const boatSpeed = 1.8;
    const boatVelocity = this.boat.body.velocity;

    if (this.boat.x < 1000) {
      this.boat.setVelocityX(boatSpeed);
    }

    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.boatSprite.getBounds(),
        this.player.player.getBounds(),
      )
    ) {
      this.player.player.setVelocityX(this.player.player.body.velocity.x + boatVelocity.x);
    }

    this.boatSprite.x = this.boat.x;
    this.boatSprite.y = this.boat.y - 70;
    if (this.boat.y > 690) this.boat.y = 690;

    if (boatVelocity.x > boatSpeed) this.boat.setVelocityX(boatSpeed - 2);
  }
}
