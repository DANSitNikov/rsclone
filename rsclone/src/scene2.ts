import * as Phaser from 'phaser';
import initScene from './initScene';
import { countDeath, statisticInGame, moveCloud } from './utils/utilitites';
import { createNote, showNote } from './utils/notes';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Scene2',
};

export default class Scene2 extends Phaser.Scene {
  private boat;

  private boatSprite;

  private boatActive: boolean;

  private player;

  private waterHands: Phaser.GameObjects.Sprite;

  private water: Phaser.GameObjects.Sprite;

  private activeFish: boolean;

  private pauseFish: boolean;

  private follower;

  private path;

  private fish;

  private deathStatus: boolean;

  private cloudOne: Phaser.GameObjects.Image;

  private cloudTwo: Phaser.GameObjects.Image;

  private notes: Phaser.GameObjects.Sprite[];

  private dialogue: Phaser.GameObjects.Sprite;

  private texts: Phaser.GameObjects.Text[];

  private pause: boolean;

  private lang: Record<string, string>;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.lang = this.registry.get('lang');
    const x = 0; // player position
    const y = 350;
    initScene.call(this, 2, x, y);
    this.sound.play('sea', { loop: true });

    this.boat = this.matter.add.sprite(740, 700, 'boatCollides');
    this.boat.visible = false;
    this.boat.setIgnoreGravity(true).setFixedRotation();
    this.boatSprite = this.add.sprite(0, 0, 'boat');
    this.boatActive = false;

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
      key: 'water',
      frames: this.anims.generateFrameNames('water', {
        start: 1,
        end: 2,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: 'cuttlefish',
      frames: this.anims.generateFrameNames('cuttlefish', {
        start: 1,
        end: 6,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 7,
      repeat: -1,
    });

    this.waterHands = this.add.sprite(800, 900, 'waterHands', 2);
    this.waterHands.anims.play('waterHands', true);
    this.waterHands = this.add.sprite(1100, 910, 'waterHands').setScale(-0.9, 1);
    this.waterHands.anims.play('waterHands', true);
    this.waterHands = this.add.sprite(1400, 899, 'waterHands', 3).setScale(0.99);
    this.waterHands.anims.play('waterHands', true);

    this.activeFish = true;
    const points = [
      590, 800, 720, 780, 800, 750, 850, 745,
      900, 740, 1060, 740, 1200, 740, 1300, 750,
      1400, 740, 1500, 750, 1600, 750, 1700, 760,
      1800, 760,
    ];

    const curve = new Phaser.Curves.Spline(points);

    this.follower = {
      t: 0,
      vec: new Phaser.Math.Vector2(),
    };

    this.path = new Phaser.Curves.Path();

    this.path.add(curve);

    this.fish = this.add.follower(this.path, 0, 0, 'cuttlefish');

    this.fish.startFollow({
      ease: 'Linear',
      repeat: 0,
      duration: 9000,
      rotateToPath: true,
      rotationOffset: 30,
    });

    this.pauseFish = true;

    this.water = this.add.sprite(1060, 835, 'water', 1).setAlpha(0.6);
    this.water.anims.play('water', true);

    statisticInGame.call(this);
    this.player.player.setDepth(2);

    this.cloudOne = this.add.image(300, 160, 'cloud2').setAlpha(0.6).setScale(0.9);
    this.cloudTwo = this.add.image(1200, 85, 'cloud1').setAlpha(0.6).setScale(0.8);
    this.dialogue = this.add.sprite(800, 200, 'dialogueNote')
      .setDepth(999)
      .setVisible(false);
    this.dialogue.visible = false;
    createNote.call(this, 505, 579, 530, 100, this.lang.shoppingList);
  }

  public update(): void {
    const boatSpeed = 1.8;
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
      if (this.activeFishFunc) {
        this.activeFishFunc();
      }
      if (this.boat.x >= 1460) {
        this.player.stop();
        this.scene.start('Scene3');
      }
    }

    if (this.pauseFish) {
      this.fish.pauseFollow();
    }

    this.boatSprite.x = this.boat.x;
    this.boatSprite.y = this.boat.y - 70;
    if (this.boat.y > 700) this.boat.y = 700;

    if (boatVelocity.x > boatSpeed) this.boat.setVelocityX(boatSpeed - 2);
    if (boatVelocity.x > boatSpeed) this.boat.setVelocityX(boatSpeed - 2);
    if (boatVelocity.y > 3) this.boat.setVelocityY(2);
    // Kill the character in water
    if (this.player.player.y > 769 && this.player.isAlive) {
      this.player.die();
      this.time.paused = true;
      if (!this.deathStatus) {
        countDeath();
        this.deathStatus = true;
      }
    }
    this.cloudOne.x = moveCloud(this.cloudOne.x, 0.8);
    this.cloudTwo.x = moveCloud(this.cloudTwo.x, 0.45);
    const cursors = this.input.keyboard.createCursorKeys();
    const keyboardKeys: {
      action?
    } = this.input.keyboard.addKeys({
      action: 'e',
    });
    const action = cursors.space.isDown || keyboardKeys.action.isDown;
    showNote.call(this, action);
    this.changeLang();
  }

  public activeFishFunc():void {
    this.activeFish = false;
    this.fish.resumeFollow();
    this.pauseFish = false;
    this.fish.anims.play('cuttlefish', true);
  }

  private changeLang() {
    if (!this.pause) return;
    this.lang = this.registry.get('lang');
    this.texts[0].setText(this.lang.scene1_note);
    this.pause = false;
  }
}
