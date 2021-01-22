import * as Phaser from 'phaser';
import initScene from './initScene';
import { changeTime, countDeath, statisticInGame } from './utilitites';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Scene3',
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
};

export default class Scene3 extends Phaser.Scene {
  private boat;

  private boatSprite: Phaser.GameObjects.Sprite;

  private player;

  private waterHands: Phaser.GameObjects.Sprite;

  private water: Phaser.GameObjects.Sprite;

  private follower;

  private path;

  private fish;

  private interval;

  private deathStatus: boolean;

  private timeReload: boolean;

  constructor() {
    super(sceneConfig);
  }

  public create():void {
    const x = 130; // player position
    const y = 560;
    initScene(this, 3, x, y);
    this.boat = this.matter.add.sprite(100, 670, 'boatCollides');
    this.boat.setIgnoreGravity(true).setFixedRotation();
    this.boat.visible = false;
    this.boatSprite = this.add.sprite(100, 0, 'boat');

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
      key: 'water2',
      frames: this.anims.generateFrameNames('water2', {
        start: 1,
        end: 2,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 3,
      repeat: -1,
    });
    this.waterHands = this.add.sprite(0, 900, 'waterHands', 2);
    this.waterHands.anims.play('waterHands', true);
    this.waterHands = this.add.sprite(300, 910, 'waterHands').setScale(-0.9, 1);
    this.waterHands.anims.play('waterHands', true);
    this.waterHands = this.add.sprite(600, 899, 'waterHands', 3).setScale(0.99);
    this.waterHands.anims.play('waterHands', true);
    this.waterHands = this.add.sprite(900, 899, 'waterHands', 1).setScale(-0.9, 1);
    this.waterHands.anims.play('waterHands', true);

    this.activeFish();

    this.water = this.add.sprite(617, 824, 'water2', 1);
    this.water.anims.play('water2', true);

    statisticInGame(this);
  }

  public update():void {
    const boatSpeed = 1.8;
    const boatVelocity = this.boat.body.velocity;
    const PlayerVerticalCenter = new Phaser.Geom.Line(
      this.player.player.getBottomCenter().x,
      this.player.player.getCenter().y,
      this.player.player.getTopCenter().x,
      this.player.player.getTopCenter().y,
    );

    if (this.boat.x < 1000) {
      this.boat.setVelocityX(boatSpeed);
    }

    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.boatSprite.getBounds(),
        this.player.player.getBounds(),
      )
    ) {
      if (this.player.isAlive) {
        this.player.player.setVelocityX(this.player.player.body.velocity.x + boatVelocity.x);
      }
    }

    if (Phaser.Geom.Intersects.LineToRectangle(PlayerVerticalCenter, this.fish.getBounds())) {
      clearInterval(this.interval);
      this.player.die();
      if (!this.deathStatus) {
        countDeath();
        this.deathStatus = true;
      }
    }

    this.boatSprite.x = this.boat.x;
    this.boatSprite.y = this.boat.y - 50;

    // Kill the character in water
    if (this.player.player.y > 869 && this.player.isAlive) {
      this.player.die();
      clearInterval(this.interval);
      if (!this.deathStatus) {
        countDeath();
        this.deathStatus = true;
      }
    }

    this.boatSprite.y = this.boat.y - 70;
    if (this.boat.y > 670) this.boat.y = 670;
    if (boatVelocity.y > 3) this.boat.setVelocityY(2);

    if (boatVelocity.x > boatSpeed) this.boat.setVelocityX(boatSpeed - 2);

    if (this.player.player.getBottomCenter().x >= 1640) {
      clearInterval(this.interval);
    }

    if (this.scene.isActive()) {
      if (this.timeReload) {
        changeTime(this);
        this.timeReload = false;
        this.interval = setTimeout(() => {
          this.timeReload = true;
        }, 1000);
      }
    }
  }

  public activeFish():void {
    const points = [
      0, 760, 100, 765, 150, 750, 200, 745,
      250, 740, 300, 750, 400, 760, 500, 750,
      550, 720, 600, 690, 630, 670, 640, 650,
      640, 610, 620, 570, 590, 560, 560, 560,
      530, 560, 480, 560, 440, 565, 410, 580,
      400, 600, 405, 620, 420, 640, 430, 680,
      420, 700, 400, 730, 350, 740, 300, 750,
      250, 760, 200, 780, 150, 800, 100, 820,
      0, 830, -150, 900,
    ];

    const curve = new Phaser.Curves.Spline(points);

    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };

    this.path = new Phaser.Curves.Path();

    this.path.add(curve);

    this.fish = this.add.follower(this.path, 0, 0, 'angry-fish').setScale(0.5);

    this.fish.startFollow({
      ease: 'Linear',
      repeat: 0,
      duration: 7300,
      rotateToPath: true,
      rotationOffset: 30,
    });

    this.water = this.add.sprite(617, 824, 'water2', 1);
    this.water.anims.play('water2', true);
  }
}
