import * as Phaser from 'phaser';
import { setLang } from './utilitites';

export default class LoadScreen extends Phaser.Scene {
  playButton: Phaser.GameObjects.Text;

  lang: Record<string, string>;

  constructor() {
    super({ key: 'LoadScreen', active: false });
  }

  preload(): void {
    this.lang = setLang(localStorage.getItem('lang'));
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    const { width } = this.cameras.main;
    const { height } = this.cameras.main;
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(
      this.game.renderer.width / 2 - 160,
      this.game.renderer.height / 2 - 5,
      320,
      50,
    );
    const percentText = this.make.text({
      x: width / 2,
      y: height / 2,
      text: '0%',
      style: {
        font: '18px monospace',
      },
    });
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: this.lang.loading,
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

    this.registry.set('lang', this.lang);

    assetText.setOrigin(0.5, -0.5);
    loadingText.setOrigin(0.5, 0);
    percentText.setOrigin(0.5, -0.5);
    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(
        this.game.renderer.width / 2 - 150,
        this.game.renderer.height / 2 + 5,
        300 * value,
        30,
      );
      percentText.setText(`${parseInt((value * 100).toString(), 10)}%`);
    });
    this.load.on('fileprogress', (file) => {
      assetText.setText(`${this.lang.loadingAsset} ${file.key}`);
    });
    this.load.on('complete', () => {
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    this.load.spritesheet('demonHand',
      'assets/enemies/demonhand.png',
      { frameWidth: 100, frameHeight: 88 });
    this.load.image('boat', 'assets/objects/boat.png');
    this.load.image('boatCollides', 'assets/objects/boatCollides.png');
    this.load.image('bgLight', 'assets/objects/bgLight.png');
    this.load.image('plort1', 'assets/enemies/plort.png');
    this.load.image('plort2', 'assets/enemies/plort2.png');

    this.load.image('bg6', 'assets/world/bg6.png');
    this.load.image('bg5', 'assets/world/bg5.png');
    this.load.image('bg4', 'assets/world/bg4.png');
    this.load.image('bg3', 'assets/world/bg3.png');
    this.load.image('bg2', 'assets/world/bg2.png');
    this.load.image('bg1', 'assets/world/bg1.png');
    this.load.tilemapTiledJSON('map6', 'assets/world/bg6.json', null);
    this.load.tilemapTiledJSON('map5', 'assets/world/bg5.json', null);
    this.load.tilemapTiledJSON('map4', 'assets/world/bg4.json', null);
    this.load.tilemapTiledJSON('map3', 'assets/world/bg3.json', null);
    this.load.tilemapTiledJSON('map2', 'assets/world/bg2.json', null);
    this.load.tilemapTiledJSON('map1', 'assets/world/bg1.json', null);
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
    this.load.atlas(
      'playerDie',
      'assets/character/die/playerDie.png',
      'assets/character/die/playerDie.json',
    );
    this.load.atlas(
      'waterHands',
      'assets/enemies/waterHands.png',
      'assets/enemies/waterHands.json',
    );
    this.load.atlas(
      'lantern',
      'assets/objects/lantern.png',
      'assets/objects/lantern.json',
    );
    this.load.atlas(
      'water',
      'assets/objects/water.png',
      'assets/objects/water.json',
    );
    this.load.atlas(
      'water2',
      'assets/objects/water2.png',
      'assets/objects/water2.json',
    );
    this.load.atlas(
      'door',
      'assets/objects/door.png',
      'assets/objects/door.json',
    );


    this.load.image('switchRed', 'assets/objects/switchRed.png');
    this.load.image('switchGreen', 'assets/objects/switchGreen.png');
    this.load.audio('switch', [
      'assets/sounds/switch/switch.mp3',
      'assets/sounds/switch/switch.ogg',
    ]);

    this.load.image('cloud1', 'assets/world/cloud1.png');
    this.load.image('cloud2', 'assets/world/cloud2.png');

    this.load.image('angry-fish', 'assets/enemies/fish.svg');

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

    this.load.audio('die', 'assets/sounds/die/playerDie.mp3');
    this.load.audio('door', 'assets/sounds/door.mp3');
  }

  create(): void {
    this.loadVolume();
    this.scene.start('Menu');
  }

  private loadVolume(): void {
    const volume = 'volume' in localStorage ? Number(localStorage.getItem('volume')) : 0.5;

    this.game.sound.volume = volume;
    localStorage.setItem('volume', String(volume));
  }
}
