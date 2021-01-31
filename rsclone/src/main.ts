import * as Phaser from 'phaser';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

import Statistic from './menu-scenes/statistic';
import SavedGames from './menu-scenes/savedGames';
import LoadScreen from './menu-scenes/loadScreen';
import Menu from './menu-scenes/menu';
import Credits from './menu-scenes/credits';
import Settings from './menu-scenes/settings';
import PauseMenu from './menu-scenes/pauseMenu';

import Scene1 from './scene1';
import Scene2 from './scene2';
import Scene3 from './scene3';
import Scene4 from './scene4';
import Scene5 from './scene5';
import Scene6 from './scene6';
import EndGame from './endGame';
import PreloaderTheEnd from './preloaderTheEnd';
import GameControl from './gameControlWindow';
import GameOverMenu from './menu-scenes/gameOverMenu';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Long Legs journey',

  type: Phaser.AUTO,

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1680,
    height: 1040,
  },

  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 3 },
    // debug: true
    },
  },
  plugins: {
    scene: [
      {
        key: 'rexUI',
        plugin: UIPlugin,
        mapping: 'rexUI',

      },
    ],
  },
  fps: {
    target: 60,
    forceSetTimeOut: true,
  },
  scene: [LoadScreen, Menu, Settings, Credits, Statistic, SavedGames, Scene1, Scene2,
    Scene3, Scene4, Scene5, Scene6, PauseMenu, GameOverMenu, GameControl, EndGame, PreloaderTheEnd],

  backgroundColor: '#000000',
};

const main = new Phaser.Game(gameConfig);
export default main;
