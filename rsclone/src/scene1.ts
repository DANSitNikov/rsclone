import * as Phaser from 'phaser';
import { textSpanIntersectsWithTextSpan } from 'typescript';
import initScene from './initScene';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Scene1',
};

export default class Scene1 extends Phaser.Scene {
  isPaused: boolean;

  private lantern: Phaser.GameObjects.Sprite;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const x = 350; // player position
    const y = 640;

    initScene(this, 1, x, y);

    this.sound.add('wind').play({ loop: true });

    this.anims.create({
      key: 'lantern',
      frames: this.anims.generateFrameNames('lantern', {
        start: 1,
        end: 3,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 11,
      repeat: -1,
    });
    this.lantern = this.add.sprite(300, 525, 'lantern', 1).setScale(0.8);
    this.lantern.anims.play('lantern', true);
    this.spikes1 = this.add.image(1048, 810, 'spikes1') as any;
    this.spikes2 = this.add.image(1420, 620, 'spikes2') as any;
  }

  public update(): void {
    this.killOnSpikes(this.spikes1);
    this.killOnSpikes(this.spikes2);
  }

  private killOnSpikes(spikeid): void {
    if (Phaser.Geom.Intersects.RectangleToRectangle(
      spikeid.getBounds(), this.player.player.getBounds(),
    )) {
      if (this.player.isAlive) {
        this.player.player.y += 25;
      }
      this.player.die();
    }
  }
}
