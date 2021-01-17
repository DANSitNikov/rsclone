import en from './languages/en';
import ru from './languages/ru';
import chTr from './languages/chTr';
import {runInThisContext} from "vm";

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
  if (localStorage.getItem('deaths_count')) {
    let deathsCount = JSON.parse(localStorage.getItem('deaths_count'));
    deathsCount += 1;
    localStorage.setItem('deaths_count', JSON.stringify(deathsCount));
  } else {
    localStorage.setItem('deaths_count', JSON.stringify(1));
  }
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

  if (localStorage.getItem('deaths_count')) {
    const deathsCount = JSON.parse(localStorage.getItem('deaths_count'));
    thisScene.deaths = thisScene.add.text(1600, 30, `${deathsCount}`, {
      font: '90px monospace',
    });
  } else {
    thisScene.deaths = thisScene.add.text(1600, 30, `${0}`, {
      font: '90px monospace',
    });
  }

  if (localStorage.getItem('gaming_time')) {
    thisScene.count = JSON.parse(localStorage.getItem('gaming_time'));
    thisScene.timeGame = thisScene.add.text(1150, 30,correctTime(thisScene.count), {
      font: '90px monospace',
    });
  } else {
    thisScene.count = 0;
    thisScene.timeGame = thisScene.add.text(1150, 30, '00:00', {
      font: '90px monospace',
    });
  }
}

function changeTime(scene):void {
  const thisScene = scene;
  thisScene.count += 1;
  localStorage.setItem('gaming_time', JSON.stringify(thisScene.count));
  thisScene.timeGame.setText(correctTime(thisScene.count));
}

function makeStatisticInfo():void {
  const finalTime = JSON.parse(localStorage.getItem('gaming_time'));

  let finalDeaths = JSON.parse(localStorage.getItem('deaths_count'));
  if (!finalDeaths) finalDeaths = 0;

  const prevStatistic = JSON.parse(localStorage.getItem('statistic'));
  const gameResult = ['0', correctTime(finalTime), finalDeaths];
  prevStatistic.push(gameResult);
  const nextStatistic = prevStatistic.sort((a, b) => a[2] > b[2] ? 1 : -1);
  nextStatistic.forEach((el, i) => {
    el[0] = `${i + 1})`;
  });
  // nextStatistic.unshift(['Top', 'Deaths', 'Time']);
  localStorage.setItem('statistic', JSON.stringify(nextStatistic));
  localStorage.removeItem('gaming_time');
  localStorage.removeItem('deaths_count');
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
};
