import * as Phaser from 'phaser';
import Player from './player';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Scene1',
};

export default class Scene1 extends Phaser.Scene {
  private groundLayer: Phaser.Tilemaps.TilemapLayer;

  private player: Player;

  isPaused: boolean;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const map = this.make.tilemap({ key: 'map1' });
    const tileset = map.addTilesetImage('bg1', 'bg1');
    this.groundLayer = map.createLayer('Background', tileset);
    this.groundLayer.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(this.groundLayer);
    this.matter.world.setBounds(0, 0, 1680, 1040);
    this.player = new Player(this, 'Scene2', 350, 640);
    this.sound.add('wind').play({ loop: true });

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.pause();
      this.scene.launch('PauseMenu', { key: sceneConfig.key });
    });
  }
}
