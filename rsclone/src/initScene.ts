import Player from './player';

export default function init(number: number, x: number, y: number): void {
  const map = this.make.tilemap({ key: `map${number}` });
  const tileset = map.addTilesetImage(`bg${number}`, `bg${number}`);
  this.groundLayer = map.createLayer('Background', tileset);
  this.groundLayer.setCollisionByProperty({ collides: true });
  this.matter.world.convertTilemapLayer(this.groundLayer);
  this.matter.world.setBounds(0, 0, 1680, 1040);
  this.player = new Player(this, `Scene${number + 1}`, x, y);
  this.sound.stopAll();
  this.texts = [];
  this.notes = [];

  this.input.keyboard.on('keydown-ESC', () => {
    this.time.paused = true;
    this.pause = true;
    this.scene.pause();
    this.scene.launch('PauseMenu', { key: `Scene${number}`, player: this.player });
  });
}
