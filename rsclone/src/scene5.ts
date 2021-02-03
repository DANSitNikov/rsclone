import * as Phaser from 'phaser';
import initScene from './initScene';
import Player from './player';
import { countDeath, statisticInGame, moveCloud } from './utils/utilitites';
import { createNote, showNote } from './utils/notes';

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

  private pause: boolean;

  private switchStatus: boolean;

  private switchClicked: boolean;

  private switch: Phaser.GameObjects.Sprite;

  private player: Player;

  private deathStatus;

  resetCloudPosition: () => number;

  private plort: Phaser.GameObjects.Sprite;

  private wall: Phaser.Physics.Matter.Sprite;

  private spidey: Phaser.GameObjects.Sprite;

  private spideySpeed: number;

  private hands1: Phaser.GameObjects.Sprite;

  private hands2: Phaser.GameObjects.Sprite;

  private hands3: Phaser.GameObjects.Sprite;

  private handZone1: Phaser.GameObjects.Sprite;

  private handZone2: Phaser.GameObjects.Sprite;

  private handZone3: Phaser.GameObjects.Sprite;

  private handsActive: boolean;

  private hand1Speed: number;

  private hand2Speed: number;

  private hand3Speed: number;

  private getDirection;

  private notes: Phaser.GameObjects.Sprite[];

  private dialogue: Phaser.GameObjects.Sprite;

  private texts: Phaser.GameObjects.Text[];

  private clickable: boolean;

  private lang: Record<string, string>;

  constructor() {
    super(sceneConfig);
    this.getDirection = (hand: Phaser.GameObjects.Sprite):number => {
      if (hand.y >= 770 || hand.y <= 430) return -1;
      return 1;
    };
  }

  public create():void {
    const x = 0; // player position
    const y = 552;
    initScene.call(this, 5, x, y);
    this.dialogue = this.add.sprite(800, 200, 'dialogueNote')
      .setDepth(999)
      .setVisible(false);
    this.sound.play('danger', { loop: true });
    this.ladder = this.add.zone(1540, 630, 77, 513);
    this.switch = this.add.sprite(590, 230, 'switchRed').setDepth(1);
    this.player.player.setDepth(2);

    this.switchClicked = false;
    this.switchStatus = false;

    statisticInGame.call(this);

    this.plort = this.add.sprite(1505, 490, 'plort1');
    this.wall = this.matter.add.sprite(1665, 490, 'plort1').setScale(0.1, 1);
    this.wall.setStatic(true);
    this.wall.setVisible(false);

    this.lang = this.registry.get('lang');

    this.anims.create({
      key: 'spidey',
      frames: this.anims.generateFrameNames('spidey', {
        start: 1,
        end: 8,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 11,
      repeat: -1,
    });
    this.anims.create({
      key: 'spideyDie',
      frames: this.anims.generateFrameNames('spideyDie', {
        start: 1,
        end: 12,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 11,
      repeat: 0,
    });
    this.anims.create({
      key: 'handRise',
      frames: this.anims.generateFrameNames('hand', {
        start: 1,
        end: 10,
        prefix: 'hand',
        suffix: '.png',
      }),
      frameRate: 8,
      repeat: 0,
    });
    this.anims.create({
      key: 'handMove',
      frames: this.anims.generateFrameNames('hand', {
        start: 10,
        end: 21,
        prefix: 'hand',
        suffix: '.png',
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.spidey = this.add.sprite(1000, 782, 'spidey').setScale(0.6);
    this.spidey.anims.play('spidey');
    this.spideySpeed = -6;
    this.handsActive = false;
    createNote.call(this, 145, 710, 480, 100, this.lang.scene5_tip);

    this.cloudOne = this.add.image(300, 180, 'cloud2').setAlpha(0.6).setDepth(990);
    this.cloudTwo = this.add.image(1200, 105, 'cloud1').setAlpha(0.6).setDepth(990);
    this.light = this.add.image(842, 522, 'bgLight').setDepth(991);
    this.light.visible = false;
    this.sound.play('spidey', { loop: true, volume: 0.3 });
  }

  public update():void {
    const cursors = this.input.keyboard.createCursorKeys();
    const keyboardKeys: {
      action?
    } = this.input.keyboard.addKeys({
      action: 'e',
    });

    const action = cursors.space.isDown || keyboardKeys.action.isDown;

    this.cloudOne.x = moveCloud(this.cloudOne.x, 0.7);
    this.cloudTwo.x = moveCloud(this.cloudTwo.x, 0.3);

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
          this.plort.setTexture('plort2');
          if (this.wall.scale) this.sound.play('mud');
          this.wall.setScale(0);
        } else {
          this.switch.setTexture('switchRed');
        }
        this.light.visible = !this.light.visible;
        this.switchStatus = !this.switchStatus;
        this.sound.play('switch');
        this.switchClicked = true;

        setTimeout(() => {
          this.switchClicked = false;
        }, 200);
      }
    }

    this.spidey.x += this.spideySpeed;
    if (this.spidey.x <= 600) {
      this.spidey.flipX = true;
      this.spideySpeed *= -1;
    }
    if (this.spidey.x >= 1600) {
      this.spidey.flipX = false;
      this.spideySpeed *= -1;
    }

    const checkDie = (rect) => {
      if (Phaser.Geom.Intersects.LineToRectangle(PlayerVerticalCenter, rect)) {
        this.player.die();
        this.time.paused = true;
        if (!this.deathStatus) {
          countDeath();
          this.deathStatus = true;
        }
      }
    };
    if (this.spideySpeed) checkDie(this.spidey.getBounds());
    if (this.handZone1 && this.handsActive) {
      checkDie(this.handZone1.getBounds());
      checkDie(this.handZone2.getBounds());
      checkDie(this.handZone3.getBounds());
    }

    if (
      this.player.player.y <= 380
      && this.spideySpeed
      && this.player.player.x > 1200
    ) this.startHands();

    if (this.handsActive) {
      this.hand1Speed *= this.getDirection(this.handZone1);
      this.hand2Speed *= this.getDirection(this.handZone2);
      this.hand3Speed *= this.getDirection(this.handZone3);

      this.handZone1.y += this.hand1Speed;
      this.handZone2.y += this.hand2Speed;
      this.handZone3.y += this.hand3Speed;
    }

    showNote.call(this, action);
    this.changeLang();
  }

  private startHands() {
    this.spidey.anims.play('spideyDie');
    this.spideySpeed = 0;
    this.sound.stopByKey('spidey');
    setTimeout(() => this.handRise(), 1000);
  }

  private handRise() {
    this.hands1 = this.add.sprite(760, 540, 'hand');
    this.hands1.anims.play('handRise');
    setTimeout(() => {
      this.hands2 = this.add.sprite(1000, 535, 'hand').setScale(-1, 1);
      this.hands2.anims.play('handRise');
    }, 300);
    setTimeout(() => {
      this.hands3 = this.add.sprite(1250, 525, 'hand').setScale(-1, 1);
      this.hands3.anims.play('handRise');
    }, 100);
    setTimeout(() => this.handsMove(), 1100);
  }

  private handsMove() {
    this.handsActive = true;
    this.handZone1 = this.add.sprite(760, 740, 'hand');
    this.handZone2 = this.add.sprite(1000, 710, 'hand');
    this.handZone3 = this.add.sprite(1250, 750, 'hand');
    this.handZone1.visible = false;
    this.handZone2.visible = false;
    this.handZone3.visible = false;
    this.hand1Speed = 7.7;
    this.hand2Speed = 7.7;
    this.hand3Speed = 7.7;
    this.hands1.anims.play('handMove');
    setTimeout(() => {
      this.hands2.anims.play('handMove');
    }, 200);
    setTimeout(() => {
      this.hands3.anims.play('handMove');
    }, 150);
  }

  private changeLang() {
    if (!this.pause) return;
    this.lang = this.registry.get('lang');
    this.texts[0].setText(this.lang.scene1_note);
    this.pause = false;
  }
}
