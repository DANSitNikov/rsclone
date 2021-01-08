import * as Phaser from 'phaser';
import Player from './player';
import initScene from "./initScene";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Scene4',
};

export default class Scene4 extends Phaser.Scene {
  private groundLayer: Phaser.Tilemaps.TilemapLayer;

  private player: Player;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const x = 0; // player position
    const y = 300;
    initScene(this, 4, x, y);
    this.sound.removeByKey('wind');
    this.sound.add('wind2').play({ loop: true });
  }
}
