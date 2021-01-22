import * as Phaser from 'phaser';
import initScene from './initScene';
import Player from "./player";
import getTintAppendFloatAlphaAndSwap = Phaser.Renderer.WebGL.Utils.getTintAppendFloatAlphaAndSwap;

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Scene6',
};

export default class Scene6 extends Phaser.Scene {
  private lantern: Phaser.GameObjects.Sprite;

  private ladder: Phaser.GameObjects.Zone;

  private door: Phaser.GameObjects.Sprite;

  private player: Player;

  private doorOpened: boolean;

  private doorClicked: boolean;

  private doorBlock: Phaser.Physics.Matter.Sprite;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    initScene(this, 6, 0, 740);
    this.anims.create({
      key: 'lantern',
      frames: this.anims.generateFrameNames('lantern', {
        start: 1,
        end: 3,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 11,
      repeat: -1,
    });
    this.anims.create({
      key: 'door',
      frames: this.anims.generateFrameNames('door', {
        start: 1,
        end: 6,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 15,
      repeat: 0,
    });
    this.lantern = this.add.sprite(900, 565, 'lantern', 1);
    this.lantern.anims.play('lantern', true);
    this.ladder = this.add.zone(1030, 730, 77, 220);
    this.door = this.add.sprite(680, 799, 'door', 1).setDepth(1);
    this.player.player.setDepth(2);
    this.doorBlock = this.matter.add.sprite(630, 797, 'door').setScale(0.2, 1);
    this.doorBlock.setStatic(true);
    this.doorBlock.setVisible(false);


    this.doorOpened = false;
    this.doorClicked = false;

  }

  public update(): void {
    const cursors = this.input.keyboard.createCursorKeys();
    const keyboardKeys = this.input.keyboard.addKeys({
      action: 'e',
    });
    // @ts-ignore
    const action = cursors.space.isDown || keyboardKeys.action.isDown;
    if (Phaser.Geom.Intersects.RectangleToRectangle(
      this.door.getBounds(), this.player.player.getBounds(),
    )) {

      if (action && !this.doorClicked) {
        if (this.doorOpened) {
          this.door.anims.play('door');
          this.doorOpened = false;
          this.sound.add('door').play({ loop: false });
          this.doorBlock.setY(797);

        } else {
          this.door.anims.playReverse('door');
          this.doorOpened = true;
          this.sound.add('door').play({ loop: false });
          this.doorBlock.setY(0);
        }
        this.doorClicked = true;
        setTimeout(() => this.doorClicked = false, 500)
      }
    }

  }



}
