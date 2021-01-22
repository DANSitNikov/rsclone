import * as Phaser from 'phaser';
import { setBtnActive, disableBtnActive } from './utilitites';

export default class SavedGames extends Phaser.Scene {
  private lang: Record<string, string>;

  private backButton: Phaser.GameObjects.Text;

  private emptySavedGames: string;

  private pause: boolean;

  private lastScene: string;

  private player;

  private rexUI;

  private table;

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
    this.add
      .text(this.game.renderer.width / 2, this.game.renderer.height / 2 - 400,
        this.lang.savedGames, styleTitle)
      .setOrigin(0.5);

    this.backButton = this.add
      .text(this.game.renderer.width / 2, this.game.renderer.height - 100,
        this.lang.backToMenu, styleTitle)
      .setOrigin(0.5)
      .setInteractive({ cursor: 'pointer' });

    const CreateItems = () => {
      const arr = JSON.parse(localStorage.getItem('saved_games'));
      arr.push([this.lang.time, this.lang.deaths, this.lang.scene, this.lang.date, '']);
      arr.reverse();
      const data = [];

      for (let i = 0; i < arr.length; i += 1) {
        for (let j = 0; j < arr[i].length; j += 1) {
          if (j !== 5) {
            data.push({
              id: arr[i][j],
              data: [arr[i][5], arr[i][1], arr[i][2]],
              color: Phaser.Math.Between(50, 0xffffff),
            });
          }
        }
      }
      return data;
    };

    if (JSON.parse(localStorage.getItem('saved_games')).length === 0) {
      this.emptySavedGames = 'There is no saved games yet...';
      this.add.text(this.game.renderer.width / 2, 400, this.emptySavedGames, styleTitle)
        .setOrigin(0.5)
        .setInteractive();
    } else {
      this.table = this.rexUI.add.gridTable({
        x: this.game.renderer.width / 2,
        y: this.game.renderer.height / 2,
        width: 1125,
        height: 700,

        table: {
          cellWidth: 215,
          cellHeight: 82,

          columns: 5,

          mask: {
            padding: 10,
          },

          reuseCellContainer: false,
        },

        space: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,

          table: 10,
        },

        createCellContainerCallback(cell, cellContainer) {
          const {
            scene, width, height, item,
          } = cell;

          if (cellContainer === null) {
            let container = cellContainer;
            container = scene.rexUI.add.label({
              width,
              height,

              background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0)
                .setStrokeStyle(20, 0xffffff),
              text: scene.add.text(0, 0, ''),

              space: {
                icon: 10,
                left: 10,
              },
            });
          }
          // Set properties from item value
          cellContainer.setMinSize(width, height); // Size might changed in this demo
          cellContainer.getElement('text').setText(item.id).setStyle({ font: '25px monospace' }); // Set text of text object
          cellContainer.getElement('background').setStrokeStyle(2, 0xffffff).setDepth(0);
          return cellContainer;
        },

        items: CreateItems(),
      }).layout();

      this.table.on('cell.down', (a, index) => {
        const item = this.table.items[index];
        if (item.id === 'play') {
          this.scene.start(`Scene${item.data[2]}`);
          localStorage.setItem('deaths_count', JSON.stringify(item.data[1]));
          localStorage.setItem('gaming_time', JSON.stringify(item.data[0]));
        }
      });

      this.table.on('cell.over', (cellContainer) => {
        cellContainer.getElement('background')
          .setStrokeStyle(2, 0xff0000)
          .setDepth(200);
      });

      this.table.on('cell.out', (cellContainer) => {
        cellContainer.getElement('background')
          .setStrokeStyle(2, 0xffffff)
          .setDepth(0);
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
