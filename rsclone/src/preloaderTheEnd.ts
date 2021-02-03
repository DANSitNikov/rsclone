import * as Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'PreloaderTheEnd',
};

export default class PreloaderTheEnd extends Phaser.Scene {
  private player;

  private lastScene: string;

  constructor() {
    super(sceneConfig);
  }

  init(data :Record<string, string>): void {
    this.lastScene = data.key;
    this.player = data.player;
  }

  public create():void {
    const graphics = this.add.graphics();
    let alpha = 0;
    const soundDelta = this.sound.volume / 50;
    const soundVolume = this.sound.volume;
    graphics.fillStyle(0x000000);
    graphics.fillRect(0, 0, this.game.renderer.width * 2, this.game.renderer.width * 2);

    graphics.setAlpha(alpha);

    const shadow = setInterval(() => {
      alpha += 0.02;
      graphics.setAlpha(alpha);
      this.sound.volume = this.sound.volume >= 0 ? this.sound.volume - soundDelta : 0;
      if (alpha >= 1) {
        clearInterval(shadow);
        this.scene.stop('Scene6');
        this.sound.stopAll();
        this.scene.start('EndGame', {
          key: 'Scene6', pause: true, player: this.player, soundVolume,
        });
      }
    }, 50);
  }
}
