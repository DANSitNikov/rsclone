import * as Phaser from 'phaser';
import { setBtnActive, disableBtnActive } from './utilitites';

export default class SavedGames extends Phaser.Scene {
  private lang: Record<string, string>;

  private backButton: Phaser.GameObjects.Text;

  private emptySavedGames: string;

  private openLink: (link: string) => void;

  private pause: boolean;

  private lastScene: string;

  private player;

  constructor() {
    super({ key: 'Saved_games', active: false });
  }

  init(data :{ key: string; pause: boolean; player }): void {
    this.lastScene = data.key;
    this.pause = data.pause;
    this.player = data.player;
  }

  create(): void {
    this.lang = this.registry.get('lang');
    const styleTitle = { font: '40px monospace' };
    const styleSaved = { font: '35px monospace' };
    this.add
      .text(this.game.renderer.width / 2, this.game.renderer.height / 2 - 400,
        this.lang.savedGames, styleTitle)
      .setOrigin(0.5);

    this.backButton = this.add
      .text(this.game.renderer.width / 2, this.game.renderer.height - 100,
        this.lang.backToMenu, styleTitle)
      .setOrigin(0.5)
      .setInteractive({ cursor: 'pointer' });

    if (JSON.parse(localStorage.getItem('saved_games')).length === 0) {
      this.emptySavedGames = 'There is no saved games yet...';
      this.add.text(this.game.renderer.width / 2, 400, this.emptySavedGames, styleTitle)
        .setOrigin(0.5)
        .setInteractive();
    } else {
      JSON.parse(localStorage.getItem('saved_games')).forEach((el, i) => {
        el.forEach((word, j) => {
          if (j !== 4) {
            const text = this.add.text(this.game.renderer.width / 2 - 200 + j * 200, 300 + i * 75,
              word, styleSaved)
              .setOrigin(0.5)
              .setInteractive();
            text.on('pointerup', () => {
              localStorage.setItem('gaming_time', JSON.stringify(el[4]));
              localStorage.setItem('deaths_count', JSON.stringify(el[1]));
              this.scene.start(el[2]);
            });
          }
        });
      });
    }

    this.backButton.on('pointerup', this.backToMenu, this);
    this.backButton.on('pointerover', () => setBtnActive(this.backButton), this);
    this.backButton.on('pointerout', () => disableBtnActive(this.backButton), this);
    this.input.keyboard.on('keydown-ESC', this.backToMenu, this);
  }

  backToMenu(): void {
    if (!this.pause) {
      this.scene.start('Menu');
    } else {
      this.scene.start('PauseMenu', { key: this.lastScene, player: this.player });
    }
  }
}
