import en from './languages/en';
import ru from './languages/ru';
import chTr from './languages/chTr';

export const setLang = (lang: string):Record<string, string> => {
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

export const switchLang = (lang: string):Record<string, string> => {
  const listOfLangs = ['en', 'ru', 'ch_tr'];
  const currentLangIndex = listOfLangs.indexOf(lang);
  const nextLangIndex = currentLangIndex !== -1 ? currentLangIndex + 1 : 1;
  const nextLang = listOfLangs[(nextLangIndex) % listOfLangs.length];

  localStorage.setItem('lang', nextLang);

  return setLang(nextLang);
};

export function setBtnActive(btn: Phaser.GameObjects.Text):void {
  btn.setTint(0xFFA300);
}

export function disableBtnActive(btn: Phaser.GameObjects.Text): void {
  btn.clearTint();
}

export const changeCurretIndex = (
  listLength:number, index:number, direction:number,
):number => (index + direction > -1 ? (index + direction) % listLength : listLength - 1);

export function keyboardControl(
  e:KeyboardEvent, tab:number, btnList:Phaser.GameObjects.Text[],
):number {
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
