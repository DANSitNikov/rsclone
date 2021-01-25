import * as Phaser from 'phaser';
import initScene from './initScene';
import Player from './player';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Scene1',
};

export default class Scene1 extends Phaser.Scene {
  private isPaused: boolean;

  private lantern: Phaser.GameObjects.Sprite;

  private spikes1: Phaser.GameObjects.Zone;

  private spikes2: Phaser.GameObjects.Zone;

  private player: Player;

  private cloudOne;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const x = 350; // player position
    const y = 640;

    initScene.call(this, 1, x, y);

    this.sound.add('wind').play({ loop: true });

    this.anims.create({
      key: 'lantern',
      frames: this.anims.generateFrameNames('lantern', {
        start: 1,
        end: 4,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 11,
      repeat: -1,
    });
    this.lantern = this.add.sprite(300, 525, 'lantern', 1).setScale(0.8);
    this.lantern.anims.play('lantern', true);
    this.spikes1 = this.add.zone(1048, 940, 200, 150);
    this.spikes2 = this.add.zone(1420, 670, 160, 20);

    this.cloudOne = this.add.image(300, 110, 'cloud2').setAlpha(0.6).setScale(0.9);
  }

  public update(): void {
    this.killOnSpikes(this.spikes1);
    this.killOnSpikes(this.spikes2);
    this.cloudOne.x = this.moveCloud(this.cloudOne.x, 0.7);
  }

  private killOnSpikes(spikeid): void {
    if (Phaser.Geom.Intersects.RectangleToRectangle(
      spikeid.getBounds(), this.player.player.getBounds(),
    )) {
      this.player.die();
    }
  }
  public moveCloud(cloudX:number, speed:number):number {
    return cloudX > window.innerWidth + 400 ? -500 : cloudX + speed;
  }
}
