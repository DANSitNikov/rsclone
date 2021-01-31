import * as Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
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

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.lang = this.registry.get('lang');

    this.teamTitle = this.add.text(this.game.renderer.width / 2, 800, this.lang.teamTitle, {
      font: '42px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.team = this.add.text(this.game.renderer.width / 2, 1000, this.lang.team, {
      font: '28px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.heroesTitle = this.add.text(this.game.renderer.width / 2, 1300, this.lang.heroesTitle, {
      font: '42px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.mainHeroes = this.add.text(this.game.renderer.width / 2, 1400, this.lang.heroes, {
      font: '28px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.enemiesTitle = this.add.text(this.game.renderer.width / 2, 1600, this.lang.enemiesTitle, {
      font: '42px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.enemies = this.add.text(this.game.renderer.width / 2, 1800, this.lang.enemies, {
      font: '28px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.gratitudeTitle = this.add.text(this.game.renderer.width / 2, 2100,
      this.lang.gratitudeTitle, {
        font: '42px monospace',
        align: 'center',
      }).setOrigin(0.5);

    this.gratitude = this.add.text(this.game.renderer.width / 2, 2250, this.lang.gratitude, {
      font: '28px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.theEnd = this.add.text(this.game.renderer.width / 2, 2800, this.lang.theEnd, {
      font: '50px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.sound.add('theEnd').play({ loop: false });
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('Menu');
      this.game.sound.stopAll();
    });
  }

  public update():void {
    this.teamTitle.y -= 1;
    this.team.y -= 1;
    this.heroesTitle.y -= 1;
    this.mainHeroes.y -= 1;
    this.enemiesTitle.y -= 1;
    this.enemies.y -= 1;
    this.gratitudeTitle.y -= 1;
    this.gratitude.y -= 1;
    this.theEnd.y -= 1;
    if (this.theEnd.y <= 440) {
      this.scene.start('Menu');
      this.game.sound.stopAll();
    }
  }
}
