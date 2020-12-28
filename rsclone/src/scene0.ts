import * as Phaser from 'phaser';
import {checkPropertyChange} from "json-schema";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'game',
};


export default class Scene0 extends Phaser.Scene {
  public player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private groundLayer: Phaser.Tilemaps.TilemapLayer;
  private objects: Phaser.Physics.Arcade.StaticGroup;
  private cloudOne: Phaser.GameObjects.Image;
  private cloudTwo: Phaser.GameObjects.Image;
  private soundWalk: boolean;
  private switch: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
  private switchStatus: boolean;


  constructor() {
    super(sceneConfig);
  }

  public preload ()
  {
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
    this.load.image('ground', 'assets/world/ground.png');
    this.load.tilemapTiledJSON('map', 'assets/world/bg.json', null)
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

    this.load.image('cloud1', 'assets/world/cloud1.png');
    this.load.image('cloud2', 'assets/world/cloud2.png');

    this.load.audio('walk', ['assets/sounds/walk/walk.mp3', 'assets/sounds/walk/walk.ogg']);

    this.load.image('switchOff', 'assets/objects/switchRed.png');
    this.load.image('switchOn', 'assets/objects/switchGreen.png');

    this.load.audio('switch', ['assets/sounds/switch/switch.mp3', 'assets/sounds/switch/switch.ogg'])
  }

  public create() {
    const centerX = 840;
    const centerY = 520;

    //creation collide blocks
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("bg", "bg");
    this.groundLayer = map.createLayer('BackGround', tileset);
    this.groundLayer.setCollisionByProperty({ collides: true });

    // coloring the colliding tiles
    /*const debugGraphics = this.add.graphics().setAlpha(0.5);
    this.groundLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });*/
    this.cloudOne = this.add.image(centerX + 300, centerY / 4, 'cloud1').setAlpha(0.6);
    this.cloudTwo = this.add.image(centerX / 5, centerY / 8, 'cloud2').setAlpha(0.6);

    this.player = this.physics.add.sprite(400, 300, 'playerIdle').setScale(0.8);
    this.player.setCollideWorldBounds(true);

    // additional ground layer
    this.objects = this.physics.add.staticGroup();
    this.objects.create(centerX, 900, 'ground', '', false).refreshBody();


    this.physics.add.collider(this.player, this.groundLayer);
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

    this.soundWalk = true;

    this.switch = this.physics.add.staticSprite(1450, 300, 'switchOff').setScale(0.3);
    this.switch.angle += 10;
    this.switchStatus = false;

    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.player.x >= 1400 && this.player.y < 1470 && this.player.y === 328) {
        if (!this.switchStatus) {
          this.switch.setTexture('switchOn');
          this.switchStatus = true;
        } else {
          this.switch.setTexture('switchOff');
          this.switchStatus = false;
        }
        this.sound.add('switch').play({loop: false});
      }
    })
  }

  public update() {
    const cursors = this.input.keyboard.createCursorKeys();
    const speed = 400;

    if (cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);

      if(this.player.body.blocked.down) this.player.anims.play('walk', true);

      this.player.flipX = true;

      if (this.soundWalk === true && this.player.body.onFloor()) {
        this.makeSound();
      }
    } else if (cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
      if(this.player.body.blocked.down) this.player.anims.play('walk', true);
      this.player.flipX = false;

      if (this.soundWalk === true && this.player.body.onFloor()) {
        this.makeSound();
      }
    } else {
      if(this.player.body.blocked.down) this.player.anims.play('idle', true);
      this.player.body.setVelocityX(0);
    }

    if (cursors.up.isDown && this.player.body.blocked.down) {
      this.player.body.setVelocityY(-810);
      this.player.anims.play('jump', true);
    }

    this.moveCloud(this.cloudOne, 0.7);
    this.moveCloud(this.cloudTwo, 0.3);
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
    }, 350)

  }
}
