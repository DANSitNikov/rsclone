import * as Phaser from 'phaser';
import Player from './player';

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private ladder: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private switch: any;

  resetCloudPosition: () => void;

  constructor() {
    super(sceneConfig);

    this.resetCloudPosition = ():number => -400;
  }

  public create():void {
    // creation collide blocks
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('bg', 'bg');
    this.groundLayer = map.createLayer('Background', tileset);
    this.groundLayer.setCollisionByProperty({ collides: true });

    this.cloudOne = this.add.image(300, 180, 'cloud2').setAlpha(0.6);
    this.cloudTwo = this.add.image(1200, 105, 'cloud1').setAlpha(0.6);

    this.ladder = this.add.zone(1540, 630, 77, 513);

    this.matter.world.convertTilemapLayer(this.groundLayer);
    this.matter.world.setBounds(0, -100, 1680, 1040);
    this.sound.add('wind').play({ loop: true });

    this.player = new Player(this, 'Scene1', 200, 812);

    this.switch = this.add.sprite(580, 230, 'switchRed').setScale(-0.3, 0.3) as any;
    this.switch.angle = 5;
  }

  public update():void {
    this.cloudOne.x = this.moveCloud(this.cloudOne.x, 0.7);
    this.cloudTwo.x = this.moveCloud(this.cloudTwo.x, 0.3);
  }

  public moveCloud(cloudX:any, speed:number):number {
    return cloudX > window.innerWidth + 400 ? this.resetCloudPosition() : cloudX + speed;
  }
}
