import * as Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class GameScene extends Phaser.Scene {
  private player: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };

  constructor() {
    super(sceneConfig);
  }

  public create() {
    this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'bg');
// @ts-ignore
    this.player = this.physics.add.sprite(400, 900, 'player');
// @ts-ignore
    this.player.setBounce(0.02);// @ts-ignore
    this.player.setCollideWorldBounds(true);
// @ts-ignore
    this.objects = this.physics.add.staticGroup();
    // @ts-ignore
    this.objects.create(window.innerWidth / 2, window.innerHeight / 2 + 100, 'tree').refreshBody();
// @ts-ignore
    this.physics.add.collider(this.player, this.objects);

  }
  public preload ()
  {
    this.load.image('bg', 'assets/world/bg.png');
    this.load.spritesheet('player', 'assets/character/chill/1.png', { frameWidth: 300, frameHeight: 370 });
    this.load.image('tree', 'assets/world/tree.png');
    this.load.image('house', 'assets/world/house.png');
  }

  public update() {
    const cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown)
    {
      this.player.body.setVelocityX(-600);

      //player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
      this.player.body.setVelocityX(600);

      //player.anims.play('right', true);
    }
    else
    {
      this.player.body.setVelocityX(0);

      //player.anims.play('turn');
    }

    if (cursors.up.isDown) //  && this.player.body.touching.down
    {
      this.player.body.setVelocityY(-1000);
    }
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Long Legs journey',

  type: Phaser.AUTO,

  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: true,
    },
  },

  scene:  GameScene,

  parent: 'game',
  backgroundColor: '#000000',
};

export const main = new Phaser.Game(gameConfig);
