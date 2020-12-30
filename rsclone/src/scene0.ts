import * as Phaser from 'phaser';
import { Engine, Render, World, Bodies, Body, Events } from "matter-js";
import { checkPropertyChange } from 'json-schema';


const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Scene0',
};

export default class Scene0 extends Phaser.Scene {
  private groundLayer: Phaser.Tilemaps.TilemapLayer;
  private player: Phaser.Physics.Matter.Sprite;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private soundWalk: boolean;
  private soundQueue: object;
  private playerIsTouching: { left: boolean; ground: boolean; right: boolean };



  constructor() {
    super(sceneConfig);
  }

  public preload() {}

  public create() {
    //creation collide blocks
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('bg', 'bg');
    this.groundLayer = map.createLayer('BackGround', tileset);
    this.groundLayer.setCollisionByProperty({ collides: true });

    this.player = this.matter.add.sprite(30, 100, "playerIdle", 0);
    this.player.setScale(0.8);

    const { width: w, height: h } = this.player;

    // @ts-ignore
    const Bodies = Phaser.Physics.Matter.Matter.Bodies;
    const rect = Bodies.rectangle(25, 76, 50, 140);
    const bottomSensor = Bodies.rectangle(25, h * 0.5 + 55, w * 0.25, 12, { isSensor: true, label: 'bottom' });
    const rightSensor = Bodies.rectangle(w * 0.35 + 25, 55, 12, h * 0.5, { isSensor: true, label: 'right' });
    const leftSensor = Bodies.rectangle(-w * 0.35 + 25, 55, 12, h * 0.5, { isSensor: true, label: 'left' });


    // @ts-ignore
    const compoundBody = Phaser.Physics.Matter.Matter.Body.create({
      parts: [ rect, bottomSensor, rightSensor, leftSensor ],
      inertia: Infinity
    });

    this.player.setFixedRotation()
        .setExistingBody(compoundBody);

    this.playerIsTouching = { left: false, right: false, ground: false };

    // Before matter's update, reset our record of what surfaces the player is touching.
    this.matter.world.on("beforeupdate", this.resetTouching, this);

    this.matter.world.on('collisionactive',  (event) => {
      event.pairs.forEach(pair => {
        let bodyA = pair.bodyA;
        let bodyB = pair.bodyB;
        if (pair.isSensor) {
          let playerBody = bodyA.isSensor ? bodyA : bodyB;
          if (playerBody.label === 'left') {
            this.playerIsTouching.left = true;
          } else if (playerBody.label === 'right') {
            this.playerIsTouching.right = true;
          } else if (playerBody.label === 'bottom') {
            this.playerIsTouching.ground = true;
          }
        }
      });

    });


    this.matter.world.convertTilemapLayer(this.groundLayer);

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames('playerWalk', {
        start: 2,
        end: 8,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 11,
      repeat: -1,
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNames('playerIdle', {
        start: 1,
        end: 8,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNames('playerJump', {
        start: 1,
        end: 3,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.soundWalk = true;
    this.soundQueue = {
      ladder: 0,
      walk: 0
    }

    this.matter.world.setBounds(0, 0, 1680, 1040);
    this.sound.add('wind').play({ loop: true })

  }

  public update() {
    const cursors = this.input.keyboard.createCursorKeys();
    const isOnGround = this.playerIsTouching.ground;
    const speed = 8;

    if (cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      if (isOnGround) {
        this.player.anims.play('walk', true);
        if (this.soundWalk === true) {
          this.makeSound(`walk${this.soundQueue["walk"]}`);
          this.soundQueue["walk"] = (this.soundQueue["walk"] + 1) % 4;
        }
      }
      this.player.flipX = true;
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(speed);
      if (!this.player.body.velocity.y) {
        this.player.anims.play('walk', true);
        if (this.soundWalk === true) {
          this.makeSound(`walk${this.soundQueue["walk"]}`);
          this.soundQueue["walk"] = (this.soundQueue["walk"] + 1) % 4;
        }
      }
      this.player.flipX = false;
    } else {
      if (isOnGround) this.player.anims.play('idle', true);
      this.player.setVelocityX(0);
    }

    // jump
    if (cursors.up.isDown && isOnGround) {
      this.player.setVelocityY(-22);
    }

    if(!isOnGround) {
      this.player.anims.play('jump', true);
    }

    // speed regulation
    const velocity = this.player.body.velocity;
    if (velocity.x > speed) this.player.setVelocityX(speed);
    else if (velocity.x < -speed) this.player.setVelocityX(-speed);

    if (this.player.getBottomCenter().x >= 1640) {
      this.scene.start('Scene1');
    }


  }
  public makeSound(key) {
    this.sound.add(key).play({ loop: false });
    this.soundWalk = false;
    setTimeout(() => {
      this.soundWalk = true;
    }, 350);
  }
  public resetTouching() {
    this.playerIsTouching.left = false;
    this.playerIsTouching.right = false;
    this.playerIsTouching.ground = false;
  }

}
