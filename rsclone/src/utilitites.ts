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

export { setLang, switchLang };
