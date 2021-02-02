import * as Phaser from 'phaser';
import {
  setBtnActive, disableBtnActive, clearActive, setActiveItem,
} from '../utils/utilitites';

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
        this.lang.savedGames, {
          font: '42px monospace',
        })
      .setOrigin(0.5);

    this.backButton = this.add
      .text(this.game.renderer.width / 2, this.game.renderer.height - 100,
        this.lang.backToMenu, {
          font: '32px monospace',
        })
      .setOrigin(0.5)
      .setInteractive();

    const CreateItems = () => {
      const arr = JSON.parse(localStorage.getItem('saved_games'));
      arr.push([this.lang.time, this.lang.deaths, this.lang.scene, this.lang.date, '']);
      arr.reverse();
      const data = [];

      arr.forEach((el, i) => {
        if (i !== 0) {
          el.splice(4, 0, this.lang.load);
        }
      });

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
      this.emptySavedGames = this.lang.emptySavedGames;
      this.add.text(this.game.renderer.width / 2, 400, this.emptySavedGames, styleTitle)
        .setOrigin(0.5);

      setBtnActive(this.backButton);
      this.backButton.on('pointerup', this.backToMenu, this);
      this.backButton.on('pointerover', () => setBtnActive(this.backButton), this);
      this.backButton.on('pointerout', () => disableBtnActive(this.backButton), this);
      this.input.keyboard.on('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          setBtnActive(this.backButton);
        } else if (e.key === 'ArrowUp') {
          setBtnActive(this.backButton);
        }
      }, this);
      this.input.keyboard.on('keydown-ENTER', () => this.backToMenu(), this);
    } else {
      this.table = this.rexUI.add.gridTable({
        x: this.game.renderer.width / 2,
        y: this.game.renderer.height / 2,
        width: 840,
        height: 700,
        scrollMode: 0,

        table: {
          cellWidth: 160,
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

          let container = cellContainer;

          if (cellContainer === null) {
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

          container.setMinSize(cell.width, height);
          container.getElement('text').setText(item.id).setStyle({ font: '25px monospace', background: '' }); // Set text of text object
          container.getElement('background').setStrokeStyle(2, 0xffffff).setDepth(0);

          if (cell.index === 9) {
            container.getElement('background')
              .setStrokeStyle(5, 0xFFA300)
              .setDepth(200);
          }

          return container;
        },

        items: CreateItems(),
      }).layout();

      this.table.on('cell.out', (cellContainer, indexLocal) => {
        const item = this.table.items[indexLocal];
        if (item.id === this.lang.load) {
          cellContainer.getElement('background')
            .setStrokeStyle(2, 0xffffff)
            .setDepth(0);
        }
      });

      const countOfItems = this.table.items.length / 5 - 1;
      const numbers = [];
      let index = 0;

      for (let i = 0; i < countOfItems; i += 1) {
        const num = 10;
        numbers.push(num + (5 * i));
      }

      this.table.on('cell.over', (cellContainer, indexLocal) => {
        const item = this.table.items[indexLocal];
        const table = this.table.getElement('table');

        if (item.id === this.lang.load) {
          disableBtnActive(this.backButton);
          clearActive(numbers, table);
          index = (indexLocal + 1) / 5 - 2;
          cellContainer.getElement('background')
            .setStrokeStyle(5, 0xFFA300)
            .setDepth(200);
        }
      });

      const keyObjUp = this.input.keyboard.addKey('UP');
      const keyObjDown = this.input.keyboard.addKey('DOWN');
      const keyObjEnter = this.input.keyboard.addKey('ENTER');

      keyObjUp.on('down', () => {
        const table = this.table.getElement('table');
        index -= 1;
        disableBtnActive(this.backButton);
        if (index === -1) {
          clearActive(numbers, table);
          setBtnActive(this.backButton);
        } else {
          if (index === -2) {
            index = numbers.length - 1;
          }
          clearActive(numbers, table);
          setActiveItem(numbers, index, table);
        }
      });

      keyObjDown.on('down', () => {
        const table = this.table.getElement('table');
        index += 1;
        disableBtnActive(this.backButton);
        if (index === numbers.length) {
          clearActive(numbers, table);
          setBtnActive(this.backButton);
        } else {
          if (index > numbers.length) {
            index = 0;
          }
          clearActive(numbers, table);
          setActiveItem(numbers, index, table);
        }
      });

      keyObjEnter.on('down', () => {
        this.sound.play('click');
        if (index === numbers.length || index === -1) {
          this.backToMenu();
        } else {
          const item = this.table.items[numbers[index] - 1];
          setTimeout(() => {
            this.scene.start(`Scene${item.data[2]}`);
          }, 50);
          localStorage.setItem('deaths_count', JSON.stringify(item.data[1]));
          localStorage.setItem('gaming_time', JSON.stringify(item.data[0]));
        }
        keyObjEnter.destroy();
      });

      this.table.on('cell.down', (cellContainer, indexLocal) => {
        const item = this.table.items[indexLocal];
        if (item.id === this.lang.load) {
          this.scene.start(`Scene${item.data[2]}`);
          localStorage.setItem('deaths_count', JSON.stringify(item.data[1]));
          localStorage.setItem('gaming_time', JSON.stringify(item.data[0]));
          this.sound.play('click');
          keyObjEnter.destroy();
        }
      });

      this.backButton.on('pointerup', () => {
        this.backToMenu();
        this.sound.play('click');
      }, this);
      this.backButton.on('pointerover', () => {
        setBtnActive(this.backButton);
        const table = this.table.getElement('table');
        index = numbers.length;
        clearActive(numbers, table);
      }, this);
      this.backButton.on('pointerout', () => disableBtnActive(this.backButton), this);
    }
    this.input.keyboard.on('keydown-ESC', this.backToMenu, this);
  }

  backToMenu(): void {
    this.scene.start('Menu');
  }
}
