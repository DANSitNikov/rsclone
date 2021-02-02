import * as Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  key: 'EndGame',
};

export default class EndGame extends Phaser.Scene {
  private lang: Record<string, string>;

  private teamTitle;

  private team;

  private heroesTitle;

  private mainHeroes;

  private enemiesTitle;

  private enemies;

  private gratitudeTitle;

  private gratitude;

  private theEnd;

  private lastScene: string;

  private player;

  private pause: boolean;

  constructor() {
    super(sceneConfig);
  }

  init(data :{ key: string; pause: boolean; player }): void {
    this.lastScene = data.key;
    this.pause = data.pause;
    this.player = data.player;
  }

  public create(): void {
    this.lang = this.registry.get('lang');

    this.teamTitle = this.add.text(this.game.renderer.width / 2, 1100, this.lang.teamTitle, {
      font: '42px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.team = this.add.text(this.game.renderer.width / 2, 1300, this.lang.team, {
      font: '28px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.heroesTitle = this.add.text(this.game.renderer.width / 2, 1600, this.lang.heroesTitle, {
      font: '42px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.mainHeroes = this.add.text(this.game.renderer.width / 2, 1700, this.lang.heroes, {
      font: '28px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.enemiesTitle = this.add.text(this.game.renderer.width / 2, 1900, this.lang.enemiesTitle, {
      font: '42px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.enemies = this.add.text(this.game.renderer.width / 2, 2100, this.lang.enemies, {
      font: '28px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.gratitudeTitle = this.add.text(this.game.renderer.width / 2, 2400,
      this.lang.gratitudeTitle, {
        font: '42px monospace',
        align: 'center',
      }).setOrigin(0.5);

    this.gratitude = this.add.text(this.game.renderer.width / 2, 2550, this.lang.gratitude, {
      font: '28px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.theEnd = this.add.text(this.game.renderer.width / 2, 3100, this.lang.theEnd, {
      font: '50px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.sound.play('theEnd');
    console.log('end')
    this.input.keyboard.on('keydown-ESC', () => {
      this.backToMenu();
    });
  }

  public update():void {
    this.teamTitle.y -= 0.9;
    this.team.y -= 0.9;
    this.heroesTitle.y -= 0.9;
    this.mainHeroes.y -= 0.9;
    this.enemiesTitle.y -= 0.9;
    this.enemies.y -= 0.9;
    this.gratitudeTitle.y -= 0.9;
    this.gratitude.y -= 0.9;
    this.theEnd.y -= 0.9;
    if (this.theEnd.y <= 440) {
      this.backToMenu();
    }
  }

  private backToMenu() {
    this.game.sound.stopAll();
    this.player.stop();
    this.scene.stop('Scene6');
    this.scene.start('Menu');
  }
}
