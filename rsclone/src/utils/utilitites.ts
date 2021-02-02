import en from '../languages/en';
import ru from '../languages/ru';
import chTr from '../languages/chTr';

export type List = {
  label?;
  name?: string;
  handler?: () => void;
  btn?: Phaser.GameObjects.Text;
  style?;
}[];

export const setLang = (lang: string): Record<string, string> => {
  let language = {};
  switch (lang) {
    case 'ru':
      language = ru;
      break;
    case 'ch_tr':
      language = chTr;
      break;
    default:
      language = en;
  }

  return language;
};

export const switchLang = (lang: string): Record<string, string> => {
  const listOfLangs = ['en', 'ru', 'ch_tr'];
  const currentLangIndex = listOfLangs.indexOf(lang);
  const nextLangIndex = currentLangIndex !== -1 ? currentLangIndex + 1 : 1;
  const nextLang = listOfLangs[nextLangIndex % listOfLangs.length];

  localStorage.setItem('lang', nextLang);

  return setLang(nextLang);
};

export const setStatistic = ():void => {
  localStorage.setItem('statistic', JSON.stringify([]));
};

export function setBtnActive(btn: Phaser.GameObjects.Text): void {
  if ('setTint' in btn) {
    btn.setTint(0xffa300);
  }
}

export function disableBtnActive(btn: Phaser.GameObjects.Text): void {
  if ('setTint' in btn) {
    btn.clearTint();
  }
}

export const changeCurretIndex = (listLength: number, index: number, direction: number): number => (
  index + direction > -1 ? (index + direction) % listLength : listLength - 1
);

export function keyboardControl(
  e: KeyboardEvent,
  tab: number,
  btnList: Phaser.GameObjects.Text[],
): number {
  let tabIndex = tab;
  const btnListLength = btnList.length;
  disableBtnActive(btnList[tabIndex]);
  if (e.key === 'ArrowDown') {
    tabIndex = changeCurretIndex(btnListLength, tabIndex, 1);
  } else if (e.key === 'ArrowUp') {
    tabIndex = changeCurretIndex(btnListLength, tabIndex, -1);
  }
  setBtnActive(btnList[tabIndex]);
  return tabIndex;
}

export function createList(): void {
  this.list.forEach((item, index) => {
    this.list[index].btn = this.add
      .text(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 - 80 + index * 80,
        item.name,
        this.btn,
      )
      .setOrigin(0.5)
      .setInteractive();
  });
}

export function backToMenu(): void {
  if (!this.pause) {
    if (this.scene.key === 'PauseMenu') {
      this.scene.stop();
      this.scene.start(this.lastScene, { test: 'test' });
    } else {
      this.scene.start('Menu');
    }
  } else {
    this.scene.start('PauseMenu', { key: this.lastScene, player: this.player });
  }
  this.sound.play('click');
}

export function countDeath():void {
  let deathsCount = JSON.parse(localStorage.getItem('deaths_count'));
  deathsCount += 1;
  localStorage.setItem('deaths_count', JSON.stringify(deathsCount));
}

export function correctTime(time:number):string {
  if (time < 0) throw new Error('invalid time >:(');
  let resultTime: string;

  if (time < 59) {
    let seconds: string | number = time;
    if (time < 10) {
      seconds = `0${seconds}`;
    }
    resultTime = `00:${seconds}`;
  } else {
    let seconds: string | number = time % 60;
    let minutes: string | number = Math.floor(time / 60);

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    resultTime = `${minutes}:${seconds}`;
  }

  return resultTime;
}

export function makeDecor():void {
  this.flag = this.add.sprite(1500, 65, 'flag').setScale(0.1);
  this.clock = this.add.sprite(1200, 65, 'clock').setScale(0.08);

  const deathsCount = JSON.parse(localStorage.getItem('deaths_count'));
  this.count = JSON.parse(localStorage.getItem('gaming_time'));

  const result = (deaths: string, time: string) => {
    this.deaths = this.add.text(1550, 30, deaths, {
      font: '70px monospace',
    });
    this.timeGame = this.add.text(1250, 30, time, {
      font: '70px monospace',
    });
  };

  if (typeof deathsCount !== 'number') {
    const resultInfo = JSON.parse(localStorage.getItem('game_result'));
    result(`${resultInfo[2]}`, resultInfo[1]);
  } else {
    result(`${deathsCount}`, correctTime(this.count));
  }
}

export function changeTime():void {
  let time = JSON.parse(localStorage.getItem('gaming_time'));
  time += 1;
  localStorage.setItem('gaming_time', JSON.stringify(time));
}

export function makeStatisticInfo():void {
  const finalTime = JSON.parse(localStorage.getItem('gaming_time'));

  let finalDeaths = JSON.parse(localStorage.getItem('deaths_count'));
  if (!finalDeaths) finalDeaths = 0;

  const prevStatistic = JSON.parse(localStorage.getItem('statistic'));
  const gameResult = ['0', correctTime(finalTime), finalDeaths];
  prevStatistic.push(gameResult);
  const nextStatistic = prevStatistic.sort((a, b) => (a[1] > b[1] ? 1 : -1));
  nextStatistic.forEach((el, i) => {
    const gameInfo = el;
    gameInfo[0] = `${i + 1}`;
    return gameInfo;
  });

  if (nextStatistic.length > 7) {
    nextStatistic.pop();
  }

  localStorage.setItem('game_result', JSON.stringify(gameResult));
  localStorage.setItem('statistic', JSON.stringify(nextStatistic));
  localStorage.removeItem('gaming_time');
  localStorage.removeItem('deaths_count');
}

export function makeSavedGamesInfo(time: number, deaths: number, scene: string):void {
  const gameInfo = [correctTime(time), deaths, scene.slice(5)];
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const date = new Date().getDate();
  const normalMonth = month + 1;
  const gameDate = `${date}:${normalMonth < 10 ? `0${normalMonth}` : normalMonth}:${year}`;
  gameInfo.push(gameDate);
  gameInfo.push(time);
  const nextInfo = JSON.parse(localStorage.getItem('saved_games'));
  nextInfo.push(gameInfo);
  if (nextInfo.length > 7) {
    nextInfo.shift();
  }
  localStorage.setItem('saved_games', JSON.stringify(nextInfo));
}

export function statisticInGame():void {
  this.deathStatus = false;

  this.events.on('resume', () => {
    this.time.paused = false;
  });

  function callback():void {
    changeTime();
  }

  this.time.addEvent({ delay: 1000, loop: true, callback });
  this.time.paused = false;
}

function createMessage():void {
  return this.rexUI.add.toast({
    x: this.game.renderer.width / 2,
    y: 50,

    background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0x000000),
    text: this.add.text(0, 0, '', {
      font: '24px monospace',
    }),
    space: {
      left: 15,
      right: 15,
      top: 10,
      bottom: 10,
    },
  });
}

export function notificationSave(): void {
  createMessage.call(this)
    .show(this.lang.save);
}

export function notificationDontSave(): void {
  createMessage.call(this)
    .show(this.lang.dontSave);
}

export function clearActive(arr: number[], table:{children}):void {
  for (let i = 0; i < arr.length; i += 1) {
    table.children[arr[i]].getElement('background')
      .setStrokeStyle(2, 0xffffff)
      .setDepth(0);
  }
}

export function setActiveItem(arr: number[], index: number, table:{children}):void {
  table.children[arr[index]].getElement('background')
    .setStrokeStyle(5, 0xFFA300)
    .setDepth(200);
}

export function saveGame():void {
  notificationSave.call(this);
  const time = JSON.parse(localStorage.getItem('gaming_time'));
  const deaths = JSON.parse(localStorage.getItem('deaths_count'));
  const scene = this.lastScene;
  makeSavedGamesInfo(time, deaths, scene);
}

export function moveCloud(
  cloudX: number, speed: number,
): number {
  return cloudX > window.innerWidth + 400
    ? -500 : cloudX + speed;
}
