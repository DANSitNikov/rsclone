import * as Phaser from 'phaser';
import Player from './player';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Scene4',
};

export default class Scene4 extends Phaser.Scene {
  private groundLayer: Phaser.Tilemaps.TilemapLayer;

	private player: Player;
	private demonHand: any;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const map = this.make.tilemap({ key: 'map4' });
    const tileset = map.addTilesetImage('bg4', 'bg4');
    this.groundLayer = map.createLayer('Background', tileset);
    this.groundLayer.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(this.groundLayer);
    this.matter.world.setBounds(0, 0, 1680, 1040);
    this.player = new Player(this, 'Scene5', 0, 300);
    this.sound.removeByKey('wind');
		this.sound.add('wind2').play({ loop: true });
		this.demonHand = this.add.sprite(450, 850, 'demonHand').setScale(2);
		
		this.anims.create({
			key: 'demonHand',
			frames: this.anims.generateFrameNumbers('demonHand', { start: 0, end: 15 }),
			frameRate: 6,
			repeat: -1,
		})
	}

	public update(): void {
		//this.animateHand();
		this.demonHand.anims.play('demonHand', true);
	}
	
	private animateHand(): void {
		if (this.player.player.x === this.demonHand.x) {
			this.demonHand.anims.play('demonHand', true);
		}
	}
}
