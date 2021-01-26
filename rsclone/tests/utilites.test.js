import { setLang, switchLang, changeCurretIndex } from '../src/utilitites';
import en from '../src/languages/en';
import ru from '../src/languages/ru';
import chTr from '../src/languages/chTr';

describe('changeCurretIndex check', () => {
  test('basic tests', () => {
    expect(changeCurretIndex(10, 5, 1)).toBe(6);
    expect(changeCurretIndex(10, 5, -1)).toBe(4);
  })
  test('more then list length -1 return 0', () => {
    expect(changeCurretIndex(10, 9, 1)).toBe(0);
  })
  test('less then list length return maxlength - 1', () => {
    expect(changeCurretIndex(10, 0, -1)).toBe(9);
  })
});

describe('setLang check', () => {
  test('en to en', () => {
    expect(setLang('en')).toBe(en);
  })
  test('ru to ru', () => {
    expect(setLang('ru')).toBe(ru);
  })
  test('ch_tr to ch_tr', () => {
    expect(setLang('ch_tr')).toBe(chTr);
  })
  test('not match to en', () => {
    expect(setLang('(╯ ° □ °) ╯ (┻━┻)')).toBe(en);
  })
});

describe('switchLang check', () => {
  test('en to en', () => {
    expect(switchLang('en')).toBe(ru);
  })
  test('ru to ru', () => {
    expect(switchLang('ru')).toBe(chTr);
  })
  test('ch_tr to ch_tr', () => {
    expect(switchLang('ch_tr')).toBe(en);
  })
  test('not match to en', () => {
    expect(switchLang('(╯ ° □ °) ╯ (┻━┻)')).toBe(ru);
  })
});
