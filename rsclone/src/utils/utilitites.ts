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

export function createBtnHandlers(): void {
  this.list.forEach((item, index) => {
    if ('label' in item) {
      if (item.handler) {
        item.label.on('pointerup', item.handler, this);
      }
      item.label.on(
        'pointerover',
        () => {
          disableBtnActive(this.list[this.tabIndex].label);
          this.tabIndex = index;
          setBtnActive(item.label);
        },
        this,
      );
      item.label.on('pointerout', () => disableBtnActive(item.label), this);

      if (item.handler) {
        item.btn.on('pointerup', item.handler, this);
      }
      item.btn.on(
        'pointerover',
        () => {
          disableBtnActive(this.list[this.tabIndex].label);
          this.tabIndex = index;
          setBtnActive(item.label);
        },
        this,
      );
      item.btn.on('pointerout', () => disableBtnActive(item.label), this);
    } else if ('btn' in item) {
      if (item.handler) {
        item.btn.on('pointerup', item.handler, this);
      }
      item.btn.on(
        'pointerover',
        () => {
          disableBtnActive(this.list[this.tabIndex].btn);
          this.tabIndex = index;
          setBtnActive(item.btn);
        },
        this,
      );
      item.btn.on('pointerout', () => disableBtnActive(item.btn), this);
    }
  });
}

export function backToMenu(): void {
  if (!this.pause) {
    this.sound.play('click');
    if (this.scene.key === 'PauseMenu') {
      this.scene.stop();
      this.scene.start(this.lastScene, { test: 'test' });
    } else {
      this.scene.start('Menu');
    }
  } else {
    this.scene.start('PauseMenu', { key: this.lastScene, player: this.player });
  }
}

export function countDeath():void {
  let deathsCount = JSON.parse(localStorage.getItem('deaths_count'));
  deathsCount += 1;
  localStorage.setItem('deaths_count', JSON.stringify(deathsCount));
}

function correctTime(time:number):string {
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

export function makeDecor(scene):void {
  const thisScene = scene;

  thisScene.flag = thisScene.add.sprite(1500, 70, 'flag').setScale(0.1);

  const deathsCount = JSON.parse(localStorage.getItem('deaths_count'));
  thisScene.deaths = thisScene.add.text(1600, 30, `${deathsCount}`, {
    font: '90px monospace',
  });

  thisScene.count = JSON.parse(localStorage.getItem('gaming_time'));
  thisScene.timeGame = thisScene.add.text(1150, 30, correctTime(thisScene.count), {
    font: '90px monospace',
  });
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

export function statisticInGame(scene):void {
  const currentScene = scene;

  currentScene.deathStatus = false;

  currentScene.events.on('resume', () => {
    currentScene.time.paused = false;
  });

  function callback():void {
    changeTime();
  }

  currentScene.time.addEvent({ delay: 1000, loop: true, callback });
  currentScene.time.paused = false;
}

export function notification(scene, UI): void {
  const toast = UI.add.toast({
    x: scene.game.renderer.width / 2,
    y: 50,

    background: UI.add.roundRectangle(0, 0, 2, 2, 20, 0x000000),
    text: scene.add.text(0, 0, '', {
      font: '24px monospace',
    }),
    space: {
      left: 15,
      right: 15,
      top: 10,
      bottom: 10,
    },
  })
    .show(scene.lang.save);
}

export function clearActive(arr: number[], table):void {
  for (let i = 0; i < arr.length; i += 1) {
    table.children[arr[i]].getElement('background')
      .setStrokeStyle(2, 0xffffff)
      .setDepth(0);
  }
}

export function setActiveItem(arr: number[], index: number, table):void {
  table.children[arr[index]].getElement('background')
    .setStrokeStyle(5, 0xFFA300)
    .setDepth(200);
}

export function moveCloud(
  cloudX: number, speed: number,
): number {
  return cloudX > window.innerWidth + 400
    ? -500 : cloudX + speed;
}
