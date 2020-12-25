import * as Phaser from 'phaser';
const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class Scene0 extends Phaser.Scene {
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private objects: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super(sceneConfig);
  }

  public create() {
    this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'bg');

    this.player = this.physics.add.sprite(400, 900, 'player');

    this.player.setBounce(0.02);
    this.player.setCollideWorldBounds(true);

    this.objects = this.physics.add.staticGroup();

    this.objects.create(window.innerWidth / 2, window.innerHeight / 2 + 100, 'tree').refreshBody();

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