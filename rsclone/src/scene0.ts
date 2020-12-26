import * as Phaser from 'phaser';
const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'game',
};

export default class Scene0 extends Phaser.Scene {
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private objects: Phaser.Physics.Arcade.StaticGroup;
  private cloudOne: Phaser.GameObjects.Image;
  private cloudTwo: Phaser.GameObjects.Image;
  private soundWalk: boolean;

  constructor() {
    super(sceneConfig);
  }
  public preload() {
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(670, 515, 320, 50);
    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
      },
    });
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
      },
    });
    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
      },
    });
    assetText.setOrigin(0.5, 0.3);
    loadingText.setOrigin(0.5, 0.5);
    percentText.setOrigin(0.5, -0.5);
    this.load.on('progress', function(value) {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(680, 525, 300 * value, 30);
      percentText.setText(`${parseInt((value * 100).toString())}%`);
    });
    this.load.on('fileprogress', function(file) {
      assetText.setText('Loading asset: ' + file.key);
    });
    this.load.on('complete', function() {
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    this.load.image('bg', 'assets/world/bg.png');
    this.load.atlas(
      'playerWalk',
      'assets/character/walk/playerWalk.png',
      'assets/character/walk/playerWalk.json',
    );
    this.load.atlas(
      'playerIdle',
      'assets/character/idle/playerIdle.png',
      'assets/character/idle/playerIdle.json',
    );
    this.load.atlas(
      'playerJump',
      'assets/character/jump/playerJump.png',
      'assets/character/jump/playerJump.json',
    );
    this.load.image('tree', 'assets/world/tree.png');
    this.load.image('house', 'assets/world/house.png');
    this.load.image('ground', 'assets/world/ground.png');
    this.load.image('cloud1', 'assets/world/cloud1.png');
    this.load.image('cloud2', 'assets/world/cloud2.png');

    this.load.audio('walk', ['assets/sounds/walk.mp3', 'assets/sounds/walk.ogg']);
  }

  public create() {
    const centerX = 840;
    const centerY = 525;
    this.add.image(centerX, centerY, 'bg');

    this.player = this.physics.add.sprite(400, 300, 'playerIdle');

    this.player.setBounce(0.02);
    this.player.setCollideWorldBounds(true);

    this.objects = this.physics.add.staticGroup();

    this.objects.create(centerX + 200, centerY + 150, 'house').refreshBody();

    this.objects.create(centerX, centerY + 410, 'ground');

    this.physics.add.collider(this.player, this.objects);

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

    this.cloudOne = this.add.image(window.innerWidth / 2 + 300, window.innerHeight / 3, 'cloud1');
    this.cloudTwo = this.add.image(window.innerWidth / 5, window.innerHeight / 8, 'cloud2');

    this.soundWalk = true;
  }

  public update() {
    const cursors = this.input.keyboard.createCursorKeys();
    const speed = 400;

    if (cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
      if (this.player.body.touching.down) this.player.anims.play('walk', true);
      this.player.flipX = true;

      if (this.soundWalk === true && this.player.body.onFloor()) {
        this.makeSound();
      }
    } else if (cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
      if (this.player.body.touching.down) this.player.anims.play('walk', true);
      this.player.flipX = false;

      if (this.soundWalk === true && this.player.body.onFloor()) {
        this.makeSound();
      }
    } else {
      if (this.player.body.touching.down) {
        this.player.anims.play('idle', true);
      }
      this.player.body.setVelocityX(0);
    }

    if (cursors.up.isDown && this.player.body.touching.down) {
      this.player.body.setVelocityY(-speed * 3);
      this.player.anims.play('jump', true);
    }

    this.moveCloud(this.cloudOne, 1);
    this.moveCloud(this.cloudTwo, 0.7);
  }

  public moveCloud(cloud, speed) {
    cloud.x += speed;
    if (cloud.x > window.innerWidth + 400) {
      this.resetCloudPosition(cloud);
    }
  }

  public resetCloudPosition(cloud) {
    cloud.x = -400;
  }

  public makeSound() {
    this.sound.add('walk').play({loop: false});
    this.soundWalk = false;
    setTimeout(() => {
      this.soundWalk = true;
    }, 250)
  }
}
