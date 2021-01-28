import { setLang, switchLang, changeCurretIndex, correctTime } from '../src/utils/utilitites';
import en from '../src/languages/en';
import ru from '../src/languages/ru';
import chTr from '../src/languages/chTr';

describe('correctTime check', () => {
  test('seconds', () => {
    expect(correctTime(15)).toBe('00:15');
    expect(correctTime(59)).toBe('00:59');
  });
  test('minutes', () => {
    expect(correctTime(60)).toBe('01:00');
    expect(correctTime(100501)).toBe('1675:01');
  });
  test('handle strings', () => {
    expect(correctTime('15')).toBe('00:15');
  });
  test('handle negative numbers', () => {
    expect(() => correctTime(-1)).toThrow('invalid time >:(');
  });
});

describe('changeCurretIndex check', () => {
  test('basic tests', () => {
    expect(changeCurretIndex(10, 5, 1)).toBe(6);
    expect(changeCurretIndex(10, 5, -1)).toBe(4);
  });
  test('more then list length -1 return 0', () => {
    expect(changeCurretIndex(10, 9, 1)).toBe(0);
  });
  test('less then list length return maxlength - 1', () => {
    expect(changeCurretIndex(10, 0, -1)).toBe(9);
  });
});

describe('setLang check', () => {
  test('en to en', () => {
    expect(setLang('en')).toBe(en);
  });
  test('ru to ru', () => {
    expect(setLang('ru')).toBe(ru);
  });
  test('ch_tr to ch_tr', () => {
    expect(setLang('ch_tr')).toBe(chTr);
  });
  test('not match to en', () => {
    expect(setLang('(╯ ° □ °) ╯ (┻━┻)')).toBe(en);
  });
});

describe('switchLang check', () => {
  test('en to en', () => {
    expect(switchLang('en')).toBe(ru);
  });
  test('ru to ru', () => {
    expect(switchLang('ru')).toBe(chTr);
  });
  test('ch_tr to ch_tr', () => {
    expect(switchLang('ch_tr')).toBe(en);
  });
  test('not match to en', () => {
    expect(switchLang('(╯ ° □ °) ╯ (┻━┻)')).toBe(ru);
  });
});
