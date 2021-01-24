import Player from './player';

export default function initScene(sc, number: number, x: number, y: number): void {
  const scene = sc;
  const map = scene.make.tilemap({ key: `map${number}` });
  const tileset = map.addTilesetImage(`bg${number}`, `bg${number}`);
  scene.groundLayer = map.createLayer('Background', tileset);
  scene.groundLayer.setCollisionByProperty({ collides: true });
  scene.matter.world.convertTilemapLayer(scene.groundLayer);
  scene.matter.world.setBounds(0, 0, 1680, 1040);
  scene.player = new Player(scene, `Scene${number + 1}`, x, y);

  scene.input.keyboard.on('keydown-ESC', () => {
    scene.scene.pause();
    scene.time.paused = true;
    scene.scene.launch('PauseMenu', { key: `Scene${number}`, player: scene.player });
  });
}
