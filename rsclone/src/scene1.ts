import * as Phaser from 'phaser';
import { checkPropertyChange } from 'json-schema';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Scene1',
};

export default class Scene1 extends Phaser.Scene {
    public player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private objects: Phaser.Physics.Arcade.StaticGroup;
    private soundWalk: boolean;
    private soundQueue: object;
    private groundLayer: Phaser.Tilemaps.TilemapLayer;

    constructor() {
        super(sceneConfig);
    }

    public create() {
        const centerX = 840;
        const centerY = 520;

        const map = this.make.tilemap({ key: 'map1' });
        const tileset = map.addTilesetImage('bg1', 'bg1');
        this.groundLayer = map.createLayer('BackGround', tileset);
        this.groundLayer.setCollisionByProperty({ collides: true });

        /*// coloring the colliding tiles
        const debugGraphics = this.add.graphics().setAlpha(0.5);
        this.groundLayer.renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });
*/
        this.player = this.physics.add.sprite(0, 320, 'playerIdle').setScale(0.8);
        this.player.setCollideWorldBounds(true);

        // ground layer
        this.objects = this.physics.add.staticGroup();
        this.objects.create(centerX, 900, 'ground', '', false).refreshBody();

        this.physics.add.collider(this.player, this.objects);
        this.physics.add.collider(this.player, this.groundLayer);

        this.soundWalk = true;
        this.soundQueue = {
            ladder: 0,
            walk: 0
        }

        this.sound.add('wind2').play({ loop: true })
    }

    public update() {
        const cursors = this.input.keyboard.createCursorKeys();
        const speed = 400;

        // walk
        if (cursors.left.isDown) {
            this.player.body.setVelocityX(-speed);
            if (this.player.body.blocked.down) this.player.anims.play('walk', true);
            this.player.flipX = true;
            if (this.soundWalk === true && this.player.body.onFloor()) {
                this.makeSound(`walk${this.soundQueue["walk"]}`);
                this.soundQueue["walk"] = (this.soundQueue["walk"] + 1) % 4;
            }
            if ((this.player.body.blocked.left) ) { // slopes handle
                this.player.body.y -= 4
            }
        } else if (cursors.right.isDown) {
            this.player.body.setVelocityX(speed);
            if (this.player.body.blocked.down) this.player.anims.play('walk', true);
            this.player.flipX = false;
            if (this.soundWalk === true && this.player.body.onFloor()) {
                this.makeSound(`walk${this.soundQueue["walk"]}`);
                this.soundQueue["walk"] = (this.soundQueue["walk"] + 1) % 4;
            }
            if (this.player.body.blocked.right) { // slopes handle
                this.player.body.y -= 4
            }
        } else {
            if (this.player.body.blocked.down) this.player.anims.play('idle', true);
            this.player.body.setVelocityX(0);
        }

        // jump
        if (cursors.up.isDown && this.player.body.blocked.down) {
            this.player.body.setVelocityY(-810);
            this.player.anims.play('jump', true);
        }

    }

    public makeSound(key) {
        this.sound.add(key).play({ loop: false });
        this.soundWalk = false;
        setTimeout(() => {
            this.soundWalk = true;
        }, 350);
    }
}
