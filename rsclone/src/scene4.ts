import * as Phaser from 'phaser';
import initScene from './initScene';
import { statisticInGame } from './utils/utilitites';
import Player from './player';
import { createNote, showNote } from './utils/notes';

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

  private ladder: Phaser.GameObjects.Zone[];

  private texts: Phaser.GameObjects.Text[];

  private lang: Record<string, string>;

  private pause: boolean;

  private dialogue: Phaser.GameObjects.Sprite;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    initScene.call(this, 4, 0, 500);
    this.sound.play('mourn', { loop: true });
    this.lang = this.registry.get('lang');

    this.ladder = [
      this.add.zone(840, 790, 77, 520),
      this.add.zone(380, 780, 77, 520),
    ];
    this.player.player.setDepth(12);

    this.dialogue = this.add.sprite(800, 200, 'dialogueNote')
      .setDepth(999)
      .setVisible(false);

    createNote.call(this, 635, 224, 530, 100, this.lang.note1);
    createNote.call(this, 145, 804, 530, 100, this.lang.note2);
    createNote.call(this, 545, 924, 530, 100, this.lang.note3);
    createNote.call(this, 1530, 710, 530, 100, this.lang.note4);
    createNote.call(this, 945, 400, 450, 100, this.lang.note5);
    createNote.call(this, 1345, 324, 480, 100, this.lang.note6);

    statisticInGame.call(this);
  }

  public update(): void {
    this.changeLang();

    const cursors = this.input.keyboard.createCursorKeys();
    const keyboardKeys: {
      action?
    } = this.input.keyboard.addKeys({
      action: 'e',
    });

    const action = cursors.space.isDown || keyboardKeys.action.isDown;

    showNote.call(this, action);
  }

  private changeLang() {
    if (!this.pause) return;
    this.lang = this.registry.get('lang');
    this.texts = this.texts.map((text, index) => text.setText(this.lang[`note${index + 1}`]));
    this.pause = false;
  }
}
