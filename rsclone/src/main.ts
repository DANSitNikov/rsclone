import * as Phaser from 'phaser';
import {Scene0} from './scene0';


const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Long Legs journey',

  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    //width: window.innerWidth,
    width: 1680,
    //height: window.innerHeight,
    height: 1050,
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 3000 },
      debug: true,
    },
  },
  plugins: {

  },
  scene:  [Scene0],
  backgroundColor: '#000000',
  parent: 'game'
};

export const main = new Phaser.Game(gameConfig);
