import en from './languages/en';
import ru from './languages/ru';
import chTr from './languages/chTr';

const setLang = (lang: string):Record<string, string> => {
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

const switchLang = (lang: string):Record<string, string> => {
  const listOfLangs = ['en', 'ru', 'ch_tr'];
  const currentLangIndex = listOfLangs.indexOf(lang);
  const nextLangIndex = currentLangIndex !== -1 ? currentLangIndex + 1 : 1;
  const nextLang = listOfLangs[(nextLangIndex) % listOfLangs.length];

  localStorage.setItem('lang', nextLang);

  return setLang(nextLang);
};

const setStatistic = ():void => {
  localStorage.setItem('statistic', JSON.stringify([]));
};

function setBtnActive(btn: Phaser.GameObjects.Text):void {
  btn.setTint(0xFFA300);
}

function disableBtnActive(btn: Phaser.GameObjects.Text): void {
  btn.clearTint();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setSliderActive(slider: { children: any[]; }):void {
  slider.children.forEach((el, i) => {
    if (i === 0) return;
    const element = el;
    element.fillColor = 0xFFA300;
  });
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function disableSliderActive(slider: { children: any[]; }):void {
  slider.children.forEach((el, i) => {
    if (i === 0) return;
    const element = el;
    element.fillColor = 0xffffff;
  });
}

const changeCurretIndex = (
  listLength:number, index:number, direction:number,
):number => (index + direction > -1 ? (index + direction) % listLength : listLength - 1);

function keyboardControl(e:KeyboardEvent, tab:number, btnList:Phaser.GameObjects.Text[]):number {
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

function countDeath():void {
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

function makeDecor(scene):void {
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

function changeTime():void {
  let time = JSON.parse(localStorage.getItem('gaming_time'));
  time += 1;
  localStorage.setItem('gaming_time', JSON.stringify(time));
}

function makeStatisticInfo():void {
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

function makeSavedGamesInfo(time: number, deaths: number, scene: string):void {
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

function statisticInGame(scene):void {
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

function notification(scene, UI): void {
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

function clearActive(arr: number[], table):void {
  for (let i = 0; i < arr.length; i += 1) {
    table.children[arr[i]].getElement('background')
      .setStrokeStyle(2, 0xffffff)
      .setDepth(0);
  }
}

function setActiveItem(arr: number[], index: number, table):void {
  table.children[arr[index]].getElement('background')
    .setStrokeStyle(5, 0xFFA300)
    .setDepth(200);
}

export {
  setLang,
  switchLang,
  setBtnActive,
  disableBtnActive,
  setSliderActive,
  disableSliderActive,
  keyboardControl,
  changeCurretIndex,
  setStatistic,
  countDeath,
  makeDecor,
  changeTime,
  makeStatisticInfo,
  makeSavedGamesInfo,
  statisticInGame,
  notification,
  clearActive,
  setActiveItem,
};
