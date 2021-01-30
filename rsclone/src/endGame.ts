import * as Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'EndGame',
};

export default class EndGame extends Phaser.Scene {
  private titleOne;

  private team;

  private titleTwo;

  private mainHeroes;

  private titleThree;

  private enemies;

  private titleFour;

  private gratitude;

  private theEnd;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const titleOne = 'Team';
    const team = 'Alisa Pavlova\n\nSaidazizkhon Akbarov\n\nDaniil Sitnikov\n\nGregory Moskalev\n\nSofya Ostrovskaya';
    this.titleOne = this.add.text(this.game.renderer.width / 2, 800, titleOne, {
      font: '42px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.team = this.add.text(this.game.renderer.width / 2, 1000, team, {
      font: '28px monospace',
      align: 'center',
    }).setOrigin(0.5);

    const titleTwo = 'Main heroes';
    const mainHeroes = 'Long Legs\n\nLong Hands';
    this.titleTwo = this.add.text(this.game.renderer.width / 2, 1300, titleTwo, {
      font: '42px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.mainHeroes = this.add.text(this.game.renderer.width / 2, 1400, mainHeroes, {
      font: '28px monospace',
      align: 'center',
    }).setOrigin(0.5);

    const titleThree = 'Enemies';
    const enemies = 'Spider: \'Andrew\'\n\nCuttlefish\n\nDemons hands\n\nWater hands\n\nSharp edges';
    this.titleThree = this.add.text(this.game.renderer.width / 2, 1600, titleThree, {
      font: '42px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.enemies = this.add.text(this.game.renderer.width / 2, 1800, enemies, {
      font: '28px monospace',
      align: 'center',
    }).setOrigin(0.5);

    const titleFour = 'Gratitude';
    const gratitude = 'Thanks to everyone in our team for their great contribution to the project\n\nThanks to to every character (good or bad) for being a part of the game\n\n\nAnd special thanks to everyone who has played the game. Really appreciate that!';
    this.titleFour = this.add.text(this.game.renderer.width / 2, 2100, titleFour, {
      font: '42px monospace',
      align: 'center',
    }).setOrigin(0.5);

    this.gratitude = this.add.text(this.game.renderer.width / 2, 2250, gratitude, {
      font: '28px monospace',
      align: 'center',
    }).setOrigin(0.5);

    const theEnd = 'The End';
    this.theEnd = this.add.text(this.game.renderer.width / 2, 2800, theEnd, {
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
    this.titleOne.y -= 1;
    this.team.y -= 1;
    this.titleTwo.y -= 1;
    this.mainHeroes.y -= 1;
    this.titleThree.y -= 1;
    this.enemies.y -= 1;
    this.titleFour.y -= 1;
    this.gratitude.y -= 1;
    this.theEnd.y -= 1;
    if (this.theEnd.y <= 440) {
      this.scene.start('Menu');
      this.game.sound.stopAll();
    }
  }
}
