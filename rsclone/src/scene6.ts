import * as Phaser from 'phaser';
import initScene from './initScene';
import Player from './player';
import { makeStatisticInfo, statisticInGame } from './utils/utilitites';

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

  private friend: Phaser.GameObjects.Sprite;

  private dialogue: Phaser.GameObjects.Sprite;

  private text: Phaser.GameObjects.Text;

  private lang: Record<string, string>;

  private pause: boolean;

  private theEnd: boolean;

  private atHome: boolean;

  private clicksControl: number;

  private controlUpdate: boolean;

  private end: boolean;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.lang = this.registry.get('lang');
    initScene.call(this, 6, 0, 740);
    this.sound.play('wind2', { loop: true });
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
    this.anims.create({
      key: 'friendSit',
      frames: this.anims.generateFrameNames('friendSit', {
        start: 1,
        end: 12,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: 'friendWave',
      frames: this.anims.generateFrameNames('friendWave', {
        start: 1,
        end: 14,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 12,
      repeat: -1,
    });
    this.lantern = this.add.sprite(900, 565, 'lantern', 1);
    this.lantern.anims.play('lantern', true);
    this.ladder = this.add.zone(1030, 730, 77, 220);
    this.door = this.add.sprite(680, 799, 'door', 1).setDepth(1);
    this.player.player.setDepth(2);
    this.doorBlock = this.matter.add.sprite(630, 797, 'door').setScale(0.2, 1);
    this.doorBlock.setStatic(true);
    this.doorBlock.setVisible(false);
    this.friend = this.add.sprite(1240, 580, 'friendSit').setScale(0.4);
    this.doorOpened = false;
    this.doorClicked = false;

    this.dialogue = this.add.sprite(800, 200, 'dialogueArm').setDepth(999);
    this.text = this.add.text(
      530,
      100,
      this.lang.scene6_greeting,
      {
        font: '22px monospace',
      },
    ).setDepth(1000);
    this.initDialogue();

    this.atHome = false;
    statisticInGame.call(this);

    this.controlUpdate = true;

    this.theEnd = false;
    localStorage.setItem('end_up', JSON.stringify(this.theEnd));
    this.end = false;
  }

  public update(): void {
    this.changeLang();
    const cursors = this.input.keyboard.createCursorKeys();
    const keyboardKeys: {
      action?
    } = this.input.keyboard.addKeys({
      action: 'e',
    });

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
          if (!this.theEnd) {
            makeStatisticInfo();
            this.theEnd = true;
            localStorage.setItem('end_up', JSON.stringify(this.theEnd));
          }
        }
        this.doorClicked = true;
        setTimeout(() => {
          this.doorClicked = false;
        }, 500);
      }
    }
    if (this.player.player.x >= 650) { // player entered the house
      if (!this.atHome) {
        this.atHome = true;
        this.sound.stopAll();
        this.sound.play('home2', { loop: true, volume: 0.5 });
        this.friend.anims.play('friendWave', true);
      }
    } else if (this.atHome) {
      this.atHome = false;
      this.sound.stopAll();
      this.sound.play('wind2', { loop: true });
      this.friend.anims.play('friendSit', true);
    }
    if (Phaser.Geom.Intersects.RectangleToRectangle(
      this.player.player.getBounds(), this.friend.getBounds(),
    )) {
      this.dialogue.visible = true;
      this.text.visible = true;
      if (action) {
        this.dialogue.setTexture('dialogueLeg');
        this.text.setText(this.lang.scene6_greeting1);
        this.text.x = 560;
        if (!this.end) {
          this.end = true;
          setTimeout(() => this.scene.launch('PreloaderTheEnd', { key: 'Scene6', player: this.player }), 2500);
        }
      }
    }
  }

  private initDialogue() {
    this.dialogue.setTexture('dialogueArm');
    this.text.setText(this.lang.scene6_greeting);
    this.dialogue.visible = false;
    this.text.visible = false;
    this.clicksControl = 0;
  }

  private changeLang() {
    if (!this.pause) return;
    this.lang = this.registry.get('lang');
    this.pause = false;
  }
}
