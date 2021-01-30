import * as Phaser from 'phaser';
import initScene from './initScene';
import { countDeath, statisticInGame } from './utils/utilitites';
import Player from './player';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Scene4',
};

export default class Scene4 extends Phaser.Scene {
  private waterHands: Phaser.GameObjects.Sprite;

  private spikes: Phaser.GameObjects.Zone;

  private spikes2: Phaser.GameObjects.Zone;

  private player: Player;

  private deathStatus: boolean;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    initScene.call(this, 4, 0, 300);
    this.sound.play('mourn', { loop: true });

    this.waterHands = this.add.sprite(170, 710, 'demonHand').setScale(0.5, 0.6);
    this.anims.create({
      key: 'waterHands',
      frames: this.anims.generateFrameNames('waterHands', {
        start: 1,
        end: 6,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 7,
      repeat: -1,
    });

    statisticInGame.call(this);

    this.waterHands.anims.play('waterHands', true);
    this.spikes = this.add.zone(1500, 600, 700, 150);
    this.spikes2 = this.add.zone(170, 760, 100, 150);
  }

  public update(): void {
    this.killOnSpikes(this.spikes);
    this.killOnSpikes(this.spikes2);
  }

  private killOnSpikes(spikeid): void {
    if (Phaser.Geom.Intersects.RectangleToRectangle(
      spikeid.getBounds(), this.player.player.getBounds(),
    )) {
      this.player.die();
      this.time.paused = true;
      if (!this.deathStatus) {
        countDeath();
        this.deathStatus = true;
      }
    }
  }
}
