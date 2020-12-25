import * as Phaser from 'phaser';
import {Scene0} from './scene0';


const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Long Legs journey',

  type: Phaser.AUTO,

  scale: {
    mode: Phaser.Scale.FIT,
    width: window.innerWidth,
    height: window.innerHeight,
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 3000 },
      debug: true,
    },
  },

  scene:  [Scene0],

  parent: 'game',
  backgroundColor: '#000000',
};

export const main = new Phaser.Game(gameConfig);
