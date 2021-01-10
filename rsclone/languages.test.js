import en from './src/languages/en';
import ru from './src/languages/ru';
import chTr from './src/languages/chTr';

describe('language files check', () => {
  test('language files are same length', () => {
    const bool = Object.keys(en).length === Object.keys(ru).length && 
      Object.keys(ru).length === Object.keys(chTr).length;
    expect(bool).toBeTruthy();
  })
});
