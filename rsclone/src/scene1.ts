import * as Phaser from 'phaser';
import { textSpanIntersectsWithTextSpan } from 'typescript';
import Player from './player';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Scene1',
};

export default class Scene1 extends Phaser.Scene {
		private groundLayer: Phaser.Tilemaps.TilemapLayer;

		private player: Player;
		private spikes1: any;
		private spikes2: any;

    constructor() {
        super(sceneConfig);
    }

    public create(): void {
        const map = this.make.tilemap({ key: 'map1' });
        const tileset = map.addTilesetImage('bg1', 'bg1');
        this.groundLayer = map.createLayer('Background', tileset);
        this.groundLayer.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(this.groundLayer);
				this.matter.world.setBounds(0, 0, 1680, 1040);
        this.player = new Player(this, 'Scene2', 350, 640);
				this.sound.add('wind').play({ loop: true });
				this.spikes1 = this.add.image(1048, 810, 'spikes1') as any;
				this.spikes2 = this.add.image(1420, 620, 'spikes2') as any;
		}
		
		public update(): void {
			this.killOnSpikes(this.spikes1);
			this.killOnSpikes(this.spikes2);			
		}

		private killOnSpikes(spikeid): void {
			if (Phaser.Geom.Intersects.RectangleToRectangle(spikeid.getBounds(), this.player.player.getBounds(),)) {
				if (this.player.isAlive) {
					this.player.player.y += 25;
				}
					this.player.die();
			}
		}
}
