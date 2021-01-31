import * as Phaser from 'phaser';

export default class Player {
  public player: Phaser.Physics.Matter.Sprite;

  private soundWalk: boolean;

  private soundQueue: Record<string, unknown>;

  public playerIsTouching: { left: boolean; ground: boolean; right: boolean };

  private scene;

  private nextScene;

  private active: boolean;

  public isAlive = true;

  constructor(scene: Phaser.Scene, nextScene: string, x:number, y:number) {
    this.scene = scene;
    this.nextScene = nextScene;
    this.player = scene.matter.add.sprite(x, y, 'playerIdle', 0);

    this.player.setScale(0.8);

    const { width: w, height: h } = this.player;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Property 'Matter' does not exist on type 'typeof Matter'.
    const { Bodies } = Phaser.Physics.Matter.Matter;
    const rect = Bodies.rectangle(25, 76, 50, 140);
    const bottomSensor = Bodies.rectangle(25, h * 0.5 + 55, w * 0.75, 15, {
      isSensor: true,
      label: 'bottom',
    });
    const rightSensor = Bodies.rectangle(w * 0.35 + 25, 55, 12, h * 0.5, {
      isSensor: true,
      label: 'right',
    });
    const leftSensor = Bodies.rectangle(-w * 0.35 + 25, 55, 12, h * 0.5, {
      isSensor: true,
      label: 'left',
    });
    this.playerIsTouching = { left: false, ground: false, right: false };
    scene.matter.world.on('beforeupdate', this.resetTouching, this);
    scene.matter.world.on('collisionactive', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA } = pair;
        const { bodyB } = pair;
        if (pair.isSensor) {
          const playerBody = bodyA.isSensor ? bodyA : bodyB;
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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Property 'Matter' does not exist on type 'typeof Matter'.
    const compoundBody = Phaser.Physics.Matter.Matter.Body.create({
      parts: [rect, bottomSensor, rightSensor, leftSensor],
      inertia: Infinity,
    });

    this.player.setFixedRotation().setExistingBody(compoundBody);

    this.player.x = x;
    this.player.y = y;

    scene.anims.create({
      key: 'walk',
      frames: scene.anims.generateFrameNames('playerWalk', {
        start: 2,
        end: 8,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 11,
      repeat: -1,
    });

    scene.anims.create({
      key: 'idle',
      frames: scene.anims.generateFrameNames('playerIdle', {
        start: 1,
        end: 8,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 6,
      repeat: -1,
    });

    scene.anims.create({
      key: 'jump',
      frames: scene.anims.generateFrameNames('playerJump', {
        start: 1,
        end: 3,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 6,
      repeat: -1,
    });

    scene.anims.create({
      key: 'climb',
      frames: scene.anims.generateFrameNames('playerClimb', {
        start: 1,
        end: 8,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 13,
      repeat: -1,
    });

    scene.anims.create({
      key: 'die',
      frames: scene.anims.generateFrameNames('playerDie', {
        start: 1,
        end: 9,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 9,
      repeat: 0,
    });

    this.soundWalk = true;
    this.soundQueue = {
      ladder: 0,
      walk: 0,
    };
    this.scene.events.on('update', this.update, this);

    this.active = true;
  }

  stop():void {
    this.active = false;
  }

  update():void {
    if (!this.active) return;
    const cursors = this.scene.input.keyboard.createCursorKeys();
    const keyboardKeys = this.scene.input.keyboard.addKeys({
      w: 'w',
      left: 'a',
      right: 'd',
    });
    const keys = {
      up: cursors.up.isDown || keyboardKeys.w.isDown,
      left: cursors.left.isDown || keyboardKeys.left.isDown,
      right: cursors.right.isDown || keyboardKeys.right.isDown,
      jump: cursors.up.isDown || keyboardKeys.w.isDown || cursors.space.isDown,
    };
    const isOnGround = this.playerIsTouching.ground;
    const speed = 8;
    const PlayerVerticalCenter = new Phaser.Geom.Line(
      this.player.getBottomCenter().x,
      this.player.getCenter().y,
      this.player.getTopCenter().x,
      this.player.getTopCenter().y,
    );
    // ladder
    if (this.scene.ladder) {
      const isPlayerTouchingLadder = (ladder) => {
        if (Phaser.Geom.Intersects.LineToRectangle(PlayerVerticalCenter, ladder)) {
          if (keys.up) {
            this.player.setVelocityY(-speed / 1.5);
            this.player.anims.play('climb', true); // there will be ladder animation
            if (this.soundWalk) {
              this.makeSound(`ladder${this.soundQueue.ladder}`);
              this.soundQueue.ladder = (Number(this.soundQueue.ladder) + 1) % 4;
            }
          }
        }
      };
      if (Array.isArray(this.scene.ladder)) {
        this.scene.ladder.forEach((ladder) => isPlayerTouchingLadder(ladder.getBounds()));
      } else {
        isPlayerTouchingLadder(this.scene.ladder.getBounds());
      }
    }

    // gravity bug fix
    if (isOnGround) this.player.setIgnoreGravity(true);
    else this.player.setIgnoreGravity(false);

    // walk
    if (keys.right || keys.left) {
      // walking right
      if (keys.right) {
        if (!this.playerIsTouching.right) this.player.setVelocityX(speed);
        this.player.flipX = false;
      } else {
        // walking left
        if (!this.playerIsTouching.left) this.player.setVelocityX(-speed);
        this.player.flipX = true;
      }
      if (isOnGround) {
        this.player.anims.play('walk', true);
        if (this.soundWalk === true) {
          this.makeSound(`walk${this.soundQueue.walk}`);
          this.soundQueue.walk = (Number(this.soundQueue.walk) + 1) % 4;
        }
      }
    } else {
      if (isOnGround) this.player.anims.play('idle', true);
      this.player.setVelocityX(0);
    }

    // jump
    if (keys.up && isOnGround) {
      this.player.setVelocityY(-18);
      this.player.anims.play('jump', true);
    }

    // speed regulation
    const { velocity } = this.player.body;
    if (velocity.x > speed) this.player.setVelocityX(speed);
    else if (velocity.x < -speed) this.player.setVelocityX(-speed);

    // end level
    if (this.player.getBottomCenter().x >= 1640) {
      if (this.nextScene) {
        this.stop();
        this.scene.scene.start(this.nextScene);
      }
    }
  }

  public makeSound(key: string):void {
    this.scene.sound.play(key, { loop: false });
    this.soundWalk = false;
    setTimeout(() => {
      this.soundWalk = true;
    }, 350);
  }

  public resetTouching(): void {
    this.playerIsTouching.left = false;
    this.playerIsTouching.right = false;
    this.playerIsTouching.ground = false;
  }

  public die(): void {
    if (this.isAlive) {
      this.player.anims.play('die', true);
      this.makeSound('die');
      this.isAlive = false;
      this.stop();
      setTimeout(() => this.gameOver(), 1500);
    }
  }

  public gameOver(): void {
    this.scene.scene.stop();
    this.scene.scene.launch('GameOverMenu', { key: this.scene.scene.key });
  }
}
