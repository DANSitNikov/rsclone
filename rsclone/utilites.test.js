import { setLang, switchLang } from './src/utilitites';
import en from './src/languages/en';
import ru from './src/languages/ru';
import chTr from './src/languages/chTr';


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
