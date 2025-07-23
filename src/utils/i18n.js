import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import es from '../locales/es.json';
import ar from '../locales/ar.json';
import zh from '../locales/zh.json';
import ha from '../locales/ha.json';
import pt from '../locales/pt.json';
import ru from '../locales/ru.json';
import hi from '../locales/hi.json';
import sw from '../locales/sw.json';
import de from '../locales/de.json';
import it from '../locales/it.json';
import tr from '../locales/tr.json';
import ja from '../locales/ja.json';
import ko from '../locales/ko.json';
import nl from '../locales/nl.json';
import yo from '../locales/yo.json';
import ig from '../locales/ig.json';
import bn from '../locales/bn.json';
import vi from '../locales/vi.json';
import tw from '../locales/tw.json';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
      ar: { translation: ar },
      zh: { translation: zh },
      ha: { translation: ha },
      pt: { translation: pt },
      ru: { translation: ru },
      hi: { translation: hi },
      sw: { translation: sw },
      de: { translation: de },
      it: { translation: it },
      tr: { translation: tr },
      ja: { translation: ja },
      ko: { translation: ko },
      nl: { translation: nl },
      yo: { translation: yo },
      ig: { translation: ig },
      bn: { translation: bn },
      vi: { translation: vi },
      tw: { translation: tw },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 
 
 