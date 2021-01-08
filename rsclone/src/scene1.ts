import * as Phaser from 'phaser';
import Player from './player';
import initScene from './initScene'

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
    const x = 350; // player position
    const y = 640;
    initScene(this, 1, x, y);
    this.sound.add('wind').play({ loop: true });
  }
}
