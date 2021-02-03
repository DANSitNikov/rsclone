import * as Phaser from 'phaser';
import initScene from './initScene';
import Player from './player';
import { countDeath, statisticInGame, moveCloud } from './utils/utilitites';
import { createNote, showNote } from './utils/notes';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Scene1',
};

export default class Scene1 extends Phaser.Scene {
  private lantern: Phaser.GameObjects.Sprite;

  private spikes1: Phaser.GameObjects.Zone;

  private spikes2: Phaser.GameObjects.Zone;

  private player: Player;

  private deathStatus: boolean;

  private cloudOne;

  private notes: Phaser.GameObjects.Sprite[];

  private dialogue: Phaser.GameObjects.Sprite;

  private texts: Phaser.GameObjects.Text[];

  private clickable: boolean;

  private lang: Record<string, string>;

  private pause: boolean;

  private atHome: boolean;

  private homeZone: Phaser.GameObjects.Zone;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const x = 350; // player position
    const y = 640;

    initScene.call(this, 1, x, y);

    this.lang = this.registry.get('lang');

    this.anims.create({
      key: 'lantern',
      frames: this.anims.generateFrameNames('lantern', {
        start: 1,
        end: 4,
        prefix: '',
        suffix: '.png',
      }),
      frameRate: 11,
      repeat: -1,
    });
    this.lantern = this.add.sprite(300, 525, 'lantern', 1).setScale(0.8);
    this.lantern.anims.play('lantern', true);
    this.spikes1 = this.add.zone(1048, 940, 200, 150);
    this.spikes2 = this.add.zone(1420, 670, 160, 20);

    if (!JSON.parse(localStorage.getItem('showControl'))) {
      this.scene.pause();
      this.scene.launch('GameControl', { key: 'GameControl', player: this.player });
    }

    statisticInGame.call(this);
    this.player.player.setDepth(2);

    this.cloudOne = this.add.image(300, 110, 'cloud2').setAlpha(0.6).setScale(0.9);

    this.dialogue = this.add.sprite(800, 200, 'dialogueNote')
      .setDepth(999)
      .setVisible(false);
    this.dialogue.visible = false;
    createNote.call(this, 545, 824, 480, 115, this.lang.scene1_note);

    this.sound.play('home', { loop: true });
    this.atHome = true;
    this.homeZone = this.add.zone(280, 500, 440, 150);
  }

  public update(): void {
    this.changeLang();
    const intersects = Phaser.Geom.Intersects.RectangleToRectangle;

    const cursors = this.input.keyboard.createCursorKeys();
    const keyboardKeys: {
      action?
    } = this.input.keyboard.addKeys({
      action: 'e',
    });

    const action = cursors.space.isDown || keyboardKeys.action.isDown;

    this.killOnSpikes(intersects, this.spikes1);
    this.killOnSpikes(intersects, this.spikes2);
    this.cloudOne.x = moveCloud(this.cloudOne.x, 0.7);

    if (!intersects(this.homeZone.getBounds(), this.player.player.getBounds())) {
      if (this.atHome) {
        this.atHome = false;
        this.sound.stopAll();
        this.sound.play('wind', { loop: true });
      }
    } else if (!this.atHome) {
      this.atHome = true;
      this.sound.stopAll();
      this.sound.play('home', { loop: true });
    }

    showNote.call(this, action);
  }

  private killOnSpikes(intersects, spikeid): void {
    if (intersects(spikeid.getBounds(), this.player.player.getBounds())) {
      this.player.die();
      this.time.paused = true;
      if (!this.deathStatus) {
        countDeath();
        this.deathStatus = true;
      }
    }
  }

  private changeLang() {
    if (!this.pause) return;
    this.lang = this.registry.get('lang');
    this.texts[0].setText(this.lang.scene1_note);
    this.pause = false;
  }
}
