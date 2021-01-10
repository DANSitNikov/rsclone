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

  constructor() {
    super(sceneConfig);
  }

  public create():void {
    const x = 0; // player position
    const y = 350;
    initScene(this, 2, x, y);

    this.boat = this.matter.add.sprite(740, 710, 'boatCollides') as any;
    this.boat.visible = false;
    this.boat.setIgnoreGravity(true).setFixedRotation();
    this.boatSprite = this.add.sprite(0, 0, 'boat') as any;
    this.boatActive = false;
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
    if (this.boat.y > 710) this.boat.y = 710;

    if (boatVelocity.x > boatSpeed) this.boat.setVelocityX(boatSpeed - 2);

    if (this.boat.x >= 1460) this.scene.start('Scene3');
  }
}
