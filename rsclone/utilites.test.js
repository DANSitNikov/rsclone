import { setLang, switchLang } from './src/utilitites';
import en from './src/languages/en';
import ru from './src/languages/ru';
import chTr from './src/languages/chTr';

test('setLang check', () => {
  expect(setLang('en')).toBe(en);
  expect(setLang('ru')).toBe(ru);
  expect(setLang('ch_tr')).toBe(chTr);
  expect(setLang('(╯ ° □ °) ╯ (┻━┻)')).toBe(en);
})

test('switchLang check', () => {
  expect(switchLang('en')).toBe(ru);
  expect(switchLang('ru')).toBe(chTr);
  expect(switchLang('ch_tr')).toBe(en);
  expect(switchLang('(╯ ° □ °) ╯ (┻━┻)')).toBe(ru);
})