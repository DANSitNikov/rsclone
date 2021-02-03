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

  private storyTitle;

  private story;

  private soundVolume;

  constructor() {
    super(sceneConfig);
  }

  init(data :{ key: string; pause: boolean; player, soundVolume }): void {
    this.lastScene = data.key;
    this.pause = data.pause;
    this.player = data.player;
    this.soundVolume = data.soundVolume;
  }

  public create(): void {
    this.lang = this.registry.get('lang');

    this.storyTitle = this.add.text(this.game.renderer.width / 2, 1100, this.lang.storyTitle, {
      font: '42px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.story = this.add.text(this.game.renderer.width / 2, 1300, this.lang.story, {
      font: '28px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.teamTitle = this.add.text(this.game.renderer.width / 2, 1650, this.lang.teamTitle, {
      font: '42px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.team = this.add.text(this.game.renderer.width / 2, 1850, this.lang.team, {
      font: '28px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.heroesTitle = this.add.text(this.game.renderer.width / 2, 2100, this.lang.heroesTitle, {
      font: '42px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.mainHeroes = this.add.text(this.game.renderer.width / 2, 2200, this.lang.heroes, {
      font: '28px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.enemiesTitle = this.add.text(this.game.renderer.width / 2, 2400, this.lang.enemiesTitle, {
      font: '42px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.enemies = this.add.text(this.game.renderer.width / 2, 2600, this.lang.enemies, {
      font: '28px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.gratitudeTitle = this.add.text(this.game.renderer.width / 2, 2950,
      this.lang.gratitudeTitle, {
        font: '42px monospace',
        align: 'center',
      }).setOrigin(0.5);

    this.gratitude = this.add.text(this.game.renderer.width / 2, 3100, this.lang.gratitude, {
      font: '28px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.theEnd = this.add.text(this.game.renderer.width / 2, 3650, this.lang.theEnd, {
      font: '50px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.sound.play('theEnd');
    this.sound.volume = 0;
    this.input.keyboard.on('keydown-ESC', () => {
      this.backToMenu();
    });
  }

  public update():void {
    if (this.sound.volume < this.soundVolume) {
      this.sound.volume += 0.001;
    }
    this.storyTitle.y -= 0.85;
    this.story.y -= 0.85;
    this.teamTitle.y -= 0.85;
    this.team.y -= 0.85;
    this.heroesTitle.y -= 0.85;
    this.mainHeroes.y -= 0.85;
    this.enemiesTitle.y -= 0.85;
    this.enemies.y -= 0.85;
    this.gratitudeTitle.y -= 0.85;
    this.gratitude.y -= 0.85;
    this.theEnd.y -= 0.85;
    if (this.theEnd.y <= 440) {
      this.backToMenu();
    }
  }

  private backToMenu() {
    this.game.sound.stopAll();
    this.player.stop();
    this.scene.stop('Scene6');
    this.scene.start('Menu');
    localStorage.setItem('gaming_time', JSON.stringify(0));
    localStorage.setItem('deaths_count', JSON.stringify(0));
  }
}
