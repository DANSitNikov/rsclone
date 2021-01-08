/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Phaser from 'phaser';
import Player from './player';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Scene2',
};

export default class Scene2 extends Phaser.Scene {
  private groundLayer: Phaser.Tilemaps.TilemapLayer;

  private player: Player;

  private boat: any;

  private boatSprite: any;

  private boatActive: boolean;

  constructor() {
    super(sceneConfig);
  }

  public create():void {
    const map = this.make.tilemap({ key: 'map2' });
    const tileset = map.addTilesetImage('bg2', 'bg2');
    this.groundLayer = map.createLayer('Background', tileset);
    this.groundLayer.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(this.groundLayer);
    this.matter.world.setBounds(0, 0, 1680, 1040);
    this.boat = this.matter.add.sprite(300, 970, 'boatCollides') as any;
    this.boat.setIgnoreGravity(true).setFixedRotation();
    this.boatSprite = this.add.sprite(300, 970, 'boat') as any;
    this.player = new Player(this, 'Scene3', 0, 500);
    this.boatActive = false;
  }

  public update():void {
    const boatSpeed = 2;
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
    this.boatSprite.y = this.boat.y - 50;

		if (boatVelocity.x > boatSpeed) this.boat.setVelocityX(boatSpeed - 2);
		//Kill the character in water
		if (this.player.player.y > 969 && this.player.isAlive) {
			this.player.die();
		}

    if (this.boat.x >= 1460) this.scene.start('Scene3');
  }
}
