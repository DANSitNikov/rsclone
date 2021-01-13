import * as Phaser from 'phaser';

export default class GameOverMenu extends Phaser.Scene {
    playButton: Phaser.GameObjects.Text;

    menu: string[] | Phaser.GameObjects.Text[];

    lang: Record<string, string>;

    btn = {
      font: '32px monospace',
    };

    private lastScene: string;

    constructor() {
      super({ key: 'GameOverMenu', active: false });
    }

    init(data :Record<string, string>): void {
      this.lastScene = data.key;
    }

    create(): void {
      this.lang = this.registry.get('lang');
      this.menu = [this.lang.restart, this.lang.newGame, this.lang.mainMenu];
      this.add
        .text(
          this.game.renderer.width / 2,
          this.game.renderer.height / 2 - 400,
          this.lang.gameOverHeading,
          {
            font: '42px monospace',
          },
        )
        .setOrigin(0.5).setDepth(1000);

      this.menu = this.menu.map((button, index) => this.add
        .text(
          this.game.renderer.width / 2,
          this.game.renderer.height / 2 - 80 + index * 80,
          button,
          this.btn,
        )
        .setOrigin(0.5)
        .setInteractive({ cursor: 'pointer' }));
      this.menu.forEach((button, index) => {
        button.on('pointerup', this.onClick[index], this);
      });
    }

    onClick = [
      (): void => {
          this.sound.stopAll();
        this.scene.start(this.lastScene);
      },
      (): void => {
          this.sound.stopAll();
        this.scene.start('Scene1');
      },
      (): void => {
          this.sound.stopAll();
        this.scene.start('Menu');
      },
    ];
}
