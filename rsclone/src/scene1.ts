import * as Phaser from 'phaser';
import { Engine, Render, World, Bodies, Body, Events } from "matter-js";
import { checkPropertyChange } from 'json-schema';
import Player from "./player";


const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Scene1',
};

export default class Scene1 extends Phaser.Scene {
    private groundLayer: Phaser.Tilemaps.TilemapLayer;
    private player: Player;

    constructor() {
        super(sceneConfig);
    }

    public create() {
        const map = this.make.tilemap({ key: 'map2' });
        const tileset = map.addTilesetImage('bg1', 'bg1');
        this.groundLayer = map.createLayer('Background', tileset);
        this.groundLayer.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(this.groundLayer);
        this.matter.world.setBounds(0, 0, 1680, 1040);
        this.player = new Player(this, '')
        this.sound.add('wind2').play({ loop: true });
    }

    public update() {

    }

}
