import * as Phaser from 'phaser';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import LoadScreen from './loadScreen';
import Menu from './menu';
import Credits from './credits';
import Settings from './settings';
import Scene0 from './scene0';
import Scene1 from './scene1';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Long Legs journey',

  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    //width: window.innerWidth,
    width: 1680,
    //height: window.innerHeight,
    height: 1040,
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1500 },
      debug: true,
    },
  },
  plugins: {
    scene: [
      {
        key: 'rexUI',
        plugin: UIPlugin,
        mapping: 'rexUI',
      },
      // ...
    ],
  },
  scene: [LoadScreen, Menu, Settings, Credits, Scene0, Scene1],

  backgroundColor: '#000000',
};

const main = new Phaser.Game(gameConfig);
export default main;
