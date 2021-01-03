import * as Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    key: 'Player'
};
export default class Player {
    public player: Phaser.Physics.Matter.Sprite;
    private soundWalk: boolean;
    private soundQueue: object;
    public playerIsTouching: { left: boolean; ground: boolean; right: boolean };
    scene: any;
    private nextScene: any;

    constructor(scene, nextScene, x, y) {
        this.scene = scene
        this.nextScene = nextScene
        this.player = scene.matter.add.sprite(x, y, "playerIdle", 0);

        this.player.setScale(0.8);

        const {width: w, height: h} = this.player;
        // @ts-ignore
        const Bodies = Phaser.Physics.Matter.Matter.Bodies;
        const rect = Bodies.rectangle(25, 76, 50, 140);
        const bottomSensor = Bodies.rectangle(25, h * 0.5 + 55, w * 0.75, 15, {isSensor: true, label: 'bottom'});
        const rightSensor = Bodies.rectangle(w * 0.35 + 25, 55, 12, h * 0.5, {isSensor: true, label: 'right'});
        const leftSensor = Bodies.rectangle(-w * 0.35 + 25, 55, 12, h * 0.5, {isSensor: true, label: 'left'});
        this.playerIsTouching = { left: false, ground: false, right: false };
        scene.matter.world.on("beforeupdate", this.resetTouching, this);
        scene.matter.world.on('collisionactive', (event) => {
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

        // @ts-ignore
        const compoundBody = Phaser.Physics.Matter.Matter.Body.create({
            parts: [rect, bottomSensor, rightSensor, leftSensor],
            inertia: Infinity
        });

        this.player.setFixedRotation()
            .setExistingBody(compoundBody);

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

        this.soundWalk = true;
        this.soundQueue = {
            ladder: 0,
            walk: 0
        }
        this.scene.events.on("update", this.update, this);
    }

    update() {
        const cursors = this.scene.input.keyboard.createCursorKeys();
        const isOnGround = this.playerIsTouching.ground;
        const speed = 8;
        const PlayerVerticalCenter = new Phaser.Geom.Line(
            this.player.getBottomCenter().x,
            this.player.getCenter().y,
            this.player.getTopCenter().x,
            this.player.getTopCenter().y
        );
        // ladder
        if (this.scene.ladder) {
            if (Phaser.Geom.Intersects.LineToRectangle(PlayerVerticalCenter, this.scene.ladder.getBounds())) {
                if (cursors.up.isDown) {
                    this.player.setVelocityY(-speed / 1.5);
                    this.player.anims.play('idle', true);  // there will be ladder animation
                    if (this.soundWalk) {
                        this.makeSound(`ladder${this.soundQueue["ladder"]}`);
                        this.soundQueue["ladder"] = (this.soundQueue["ladder"] + 1) % 4;
                    }
                }
            }
        }

        // gravity bug fix
        if (isOnGround) this.player.setIgnoreGravity(true)
        else this.player.setIgnoreGravity(false)

        // walk
        if (cursors.left.isDown || cursors.right.isDown) {
                // walking right
            if (cursors.right.isDown) {
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
                    this.makeSound(`walk${this.soundQueue["walk"]}`);
                    this.soundQueue["walk"] = (this.soundQueue["walk"] + 1) % 4;
                }
            }
        }  else {
            if (isOnGround) this.player.anims.play('idle', true);
            this.player.setVelocityX(0);
        }

        // jump
        if (cursors.up.isDown && isOnGround) {
            this.player.setVelocityY(-22);
            this.player.anims.play('jump', true);
        }

        // speed regulation
        const velocity = this.player.body.velocity;
        if (velocity.x > speed) this.player.setVelocityX(speed);
        else if (velocity.x < -speed) this.player.setVelocityX(-speed);

        // end level
         if (this.player.getBottomCenter().x >= 1640) {
           if (this.nextScene) this.scene.scene.start(this.nextScene);
          }

    }

    public makeSound(key) {
        this.scene.sound.add(key).play({loop: false});
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
