import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';
import as from './locales/as.json';
import bn from './locales/bn.json';
import mr from './locales/mr.json';
import kn from './locales/kn.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  as: { translation: as },
  bn: { translation: bn },
  mr: { translation: mr },
  kn: { translation: kn },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
