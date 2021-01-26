import en from '../src/languages/en';
import ru from '../src/languages/ru';
import chTr from '../src/languages/chTr';

describe('language files check', () => {
  const ruRegexp = /[а-яА-ЯЁё]/gm;
  const chRegexp = /[\u3400-\u9FBF]/gm;
  test('language files are same length', () => {
    const bool =
      Object.keys(en).length === Object.keys(ru).length &&
      Object.keys(ru).length === Object.keys(chTr).length;
    expect(bool).toBeTruthy();
  });
  test('Same keys in lang files', () => {
    const bool = compareArrays(Object.keys(en), Object.keys(ru), Object.keys(chTr));
    expect(bool).toBeTruthy();
  });
  test('no ru in en', () => {
    expect(findLetters(en, ruRegexp)).toBeFalsy();
  });
  test('no ru in ch_tr', () => {
    expect(findLetters(chTr, ruRegexp)).toBeFalsy();
  });
  test('no ch in en', () => {
    expect(findLetters(en, chRegexp)).toBeFalsy();
  });
  test('no ch in ru', () => {
    expect(findLetters(ru, chRegexp)).toBeFalsy();
  });
});

function findLetters(langObj, regexp) {
  return Object.values(langObj).some((element) => regexp.test(element));
}

function compareArrays(a, b, c) {
  return a.every((e, i) => e === b[i] && e === c[i]);
}
