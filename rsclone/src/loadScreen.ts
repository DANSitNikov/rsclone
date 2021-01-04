import * as Phaser from 'phaser';

export default class LoadScreen extends Phaser.Scene {
  playButton: Phaser.GameObjects.Text;
  constructor() {
    super({ key: 'LoadScreen', active: false });
  }

  preload(): void {
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(840 - 320 / 2, 515, 320, 50);
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

    assetText.setOrigin(0.5, -0.5);
    loadingText.setOrigin(0.5, 0);
    percentText.setOrigin(0.5, -0.5);
    this.load.on('progress', function(value) {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(840 - 300 / 2, 525, 300 * value, 30);
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

    this.load.image('ground', 'assets/world/ground.png');
    this.load.image('ladder', 'assets/objects/ladder.png');
    this.load.image('boat', 'assets/objects/boat.png');
    this.load.image('boatCollides', 'assets/objects/boatCollides.png');

    this.load.image('bg', 'assets/world/bg.png');
    this.load.image('bg1', 'assets/world/bg1.png');
    this.load.image('bg2', 'assets/world/bg2.png');
    this.load.image('bg3', 'assets/world/bg3.png');
    this.load.tilemapTiledJSON('map', 'assets/world/bg.json', null);
    this.load.tilemapTiledJSON('map1', 'assets/world/bg1.json', null);
    this.load.tilemapTiledJSON('map2', 'assets/world/bg2.json', null);
    this.load.tilemapTiledJSON('map3', 'assets/world/bg3.json', null);
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

    this.load.image('switchRed', 'assets/objects/switchRed.png');
    this.load.image('switchGreen', 'assets/objects/switchGreen.png');
    this.load.audio('switch', ['assets/sounds/switch/switch.mp3', 'assets/sounds/switch/switch.ogg']);

    this.load.image('cloud1', 'assets/world/cloud1.png');
    this.load.image('cloud2', 'assets/world/cloud2.png');

    this.load.audio('wind', 'assets/sounds/wind.mp3');
    this.load.audio('wind2', 'assets/sounds/wind2.mp3');

    this.load.audio('ladder1', 'assets/sounds/ladder/1.mp3');
    this.load.audio('ladder2', 'assets/sounds/ladder/2.mp3');
    this.load.audio('ladder3', 'assets/sounds/ladder/3.mp3');
    this.load.audio('ladder0', 'assets/sounds/ladder/0.mp3');

    this.load.audio('walk0', 'assets/sounds/walk/0.mp3');
    this.load.audio('walk1', 'assets/sounds/walk/1.mp3');
    this.load.audio('walk2', 'assets/sounds/walk/2.mp3');
    this.load.audio('walk3', 'assets/sounds/walk/3.mp3');
  }

  create(): void {
    this.loadVolume();
    this.scene.start('Menu');
  }

  private loadVolume(): void {
    console.log(this, 'volume' in localStorage);
    const volume = 'volume' in localStorage ? Number(localStorage.getItem('volume')) : 0.5;

    this.sound.volume = volume;
    localStorage.setItem('volume', String(volume));
  }
}
