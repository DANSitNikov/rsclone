import * as Phaser from 'phaser';
import { Engine, Render, World, Bodies, Body, Events } from "matter-js";
import { checkPropertyChange } from 'json-schema';
import Player from "./player";


const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Scene0',
};

export default class Scene0 extends Phaser.Scene {
  private cloudOne: Phaser.GameObjects.Image;
  private cloudTwo: Phaser.GameObjects.Image;
  private groundLayer: Phaser.Tilemaps.TilemapLayer;
  private player: Player;
  private ladder: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;

  constructor() {
    super(sceneConfig);
  }

  public create() {
    //creation collide blocks
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('bg', 'bg');
    this.groundLayer = map.createLayer('BackGround', tileset);
    this.groundLayer.setCollisionByProperty({ collides: true });

    this.cloudOne = this.add.image(300, 180, 'cloud2').setAlpha(0.6);
    this.cloudTwo = this.add.image(1200, 105, 'cloud1').setAlpha(0.6);
    this.ladder = this.add.sprite(1515, 520 , 'ladder') as any;
    this.matter.world.convertTilemapLayer(this.groundLayer);
    this.matter.world.setBounds(0, 0, 1680, 1040);
    this.sound.add('wind').play({ loop: true });

    this.player = new Player(this, 'Scene1');

  }

  public update() {
    this.moveCloud(this.cloudOne, 0.7);
    this.moveCloud(this.cloudTwo, 0.3);
  }

  public moveCloud(cloud, speed) {
    cloud.x += speed;
    if (cloud.x > window.innerWidth + 400) {
      this.resetCloudPosition(cloud);
    }
  }
  public resetCloudPosition(cloud) {
    cloud.x = -400;
  }


}
