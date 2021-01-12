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

  private waterHands: Phaser.GameObjects.Sprite;

  private water: Phaser.GameObjects.Sprite;

  constructor() {
    super(sceneConfig);
  }

  public create():void {
    const x = 130; // player position
    const y = 560;
    initScene(this, 3, x, y);
    this.boat = this.matter.add.sprite(100, 670, 'boatCollides');
    this.boat.setIgnoreGravity(true).setFixedRotation();
    this.boat.visible = false;
    this.boatSprite = this.add.sprite(100, 0, 'boat');

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
      key: 'water2',
      frames: this.anims.generateFrameNames('water2', {
        start: 1,
        end: 2,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 3,
      repeat: -1,
    });
    this.waterHands = this.add.sprite(0, 900, 'waterHands', 2);
    this.waterHands.anims.play('waterHands', true);
    this.waterHands = this.add.sprite(300, 910, 'waterHands').setScale(-0.9, 1);
    this.waterHands.anims.play('waterHands', true);
    this.waterHands = this.add.sprite(600, 899, 'waterHands', 3).setScale(0.99);
    this.waterHands.anims.play('waterHands', true);
    this.waterHands = this.add.sprite(900, 899, 'waterHands', 1).setScale(-0.9, 1);
    this.waterHands.anims.play('waterHands', true);

    this.water = this.add.sprite(617, 824, 'water2', 1);
    this.water.anims.play('water2', true);
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
		this.boatSprite.y = this.boat.y - 50;
		
		//Kill the character in water
		if (this.player.player.y > 869 && this.player.isAlive) {
			this.player.die();
		}

    this.boatSprite.y = this.boat.y - 70;
    if (this.boat.y > 670) this.boat.y = 670;
    if (boatVelocity.y > 3) this.boat.setVelocityY(2);

    if (boatVelocity.x > boatSpeed) this.boat.setVelocityX(boatSpeed - 2);
  }
}
