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

  private fish: any;

  private fishUp: number = 0;

  private fishBack: number = 0;

  private fishDown: number = 0;

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
    this.boat = this.matter.add.sprite(300, 100, 'boatCollides') as any;
    this.boat.setIgnoreGravity(true).setFixedRotation();
    this.boatSprite = this.add.sprite(300, 10, 'boat') as any;
    this.player = new Player(this, '', 0, 500);
    this.boatActive = false;

    this.fish = this.matter.add.sprite(140, 990, 'angry-fish') as any;
    this.fish.setIgnoreGravity(true).setFixedRotation();

    setInterval(() => {
      this.fishUp = 1;
    }, 6000);
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

    if (this.boat.x >= 1460) this.scene.start('Scene3');

    if (this.fishUp === 1) {
      this.fishUpFunc();
    } else if (this.fishBack === 2) {
      this.fishBackFunc();
    } else if (this.fishDown === 3) {
      this.fishDownFunc();
    } else {
      this.fishSwim();
    }
  }

  public fishUpFunc():void {
    setTimeout(() => {
      this.fishUp = 0;
      this.fishBack = 2;
    }, 1000);
    this.fish.angle = 90;
    this.fish.y -= 4;
  }

  public fishBackFunc():void {
    setTimeout(() => {
      this.fishBack = 0;
      this.fishDown = 3;
    }, 1000);
    this.fish.x -= 5
    this.fish.angle = 180;
  }

  public fishDownFunc():void {
    setTimeout(() => {
      this.fishDown = 0;
    }, 1000);
    this.fish.y += 4;
    this.fish.angle = 270;
  }

  public fishSwim():void {
    this.fish.x += 3;
    this.fish.angle = 0;
  }
}
