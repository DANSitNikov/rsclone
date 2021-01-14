import * as Phaser from 'phaser';
import initScene from './initScene';
import Player from './player';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Scene5',
};

export default class Scene5 extends Phaser.Scene {
  private cloudOne: Phaser.GameObjects.Image;

  private cloudTwo: Phaser.GameObjects.Image;

  private light: Phaser.GameObjects.Image;

  private ladder: Phaser.GameObjects.Zone;

  private switchStatus: boolean;

  private switchClicked: boolean;

  private switch: Phaser.GameObjects.Sprite;

  private player: Player;

  resetCloudPosition: () => number;

  constructor() {
    super(sceneConfig);

    this.resetCloudPosition = ():number => -400;
  }

  public create():void {
    const x = 200; // player position
    const y = 812;
    initScene(this, 5, x, y);
    this.ladder = this.add.zone(1540, 630, 77, 513);
    this.switch = this.add.sprite(610, 250, 'switchRed').setScale(-0.3, 0.3);
    this.switch.angle = 5;

    this.light = this.add.image(842, 522, 'bgLight');
    this.light.visible = false;

    this.cloudOne = this.add.image(300, 180, 'cloud2').setAlpha(0.6);
    this.cloudTwo = this.add.image(1200, 105, 'cloud1').setAlpha(0.6);

    this.switchClicked = false;
    this.switchStatus = false;
  }

  public update():void {
    const cursors = this.input.keyboard.createCursorKeys();
    const keyboardKeys = this.input.keyboard.addKeys({
      action: 'e',
    });
    // @ts-ignore
    const action = cursors.space.isDown || keyboardKeys.action.isDown;


    this.cloudOne.x = this.moveCloud(this.cloudOne.x, 0.7);
    this.cloudTwo.x = this.moveCloud(this.cloudTwo.x, 0.3);

    // switch
    const PlayerVerticalCenter = new Phaser.Geom.Line(
      this.player.player.getBottomCenter().x,
      this.player.player.getCenter().y,
      this.player.player.getTopCenter().x,
      this.player.player.getTopCenter().y,
    );
    if (
      Phaser.Geom.Intersects.LineToRectangle(PlayerVerticalCenter, this.switch.getBounds())
    ) {
      if (action && !this.switchClicked) {
        if (!this.switchStatus) {
          this.switch.setTexture('switchGreen');
          this.switchStatus = true;
          this.sound.add('switch').play({ loop: false });
          this.light.visible = true;
        } else {
          this.switch.setTexture('switchRed');
          this.switchStatus = false;
          this.sound.add('switch').play({ loop: false });
          this.light.visible = false;
        }
        this.switchClicked = true;
        setTimeout(() => this.switchClicked = false, 500)
      }


    }
  }

  public moveCloud(cloudX:number, speed:number):number {
    return cloudX > window.innerWidth + 400 ? this.resetCloudPosition() : cloudX + speed;
  }
}
