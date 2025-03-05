import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import {initReactI18next} from 'react-i18next'
// utils
import localStorageAvailable from '../utils/localStorageAvailable'
//
import {defaultLang} from './config-lang'
//
import defaultLocaleEn from './langs/en'
import defaultLocaleRu from './langs/ru'
import apps from "../configs/apps"
// ----------------------------------------------------------------------

let lng = defaultLang.value

const storageAvailable = localStorageAvailable()

if (storageAvailable) {
  lng = localStorage.getItem('i18nextLng') || defaultLang.value
}
let enLocales = {...defaultLocaleEn}
let ruLocales = {...defaultLocaleRu}
apps.filter(app => !!app.locale).forEach(app => {
  // routeConfig.push(app.locale.en)
  if (app.locale.en) {
    enLocales = {...enLocales, [app.name]: {...app.locale.en}}
  }
  if (app.locale.ru) {
    ruLocales = {...ruLocales, [app.name]: {...app.locale.ru}}
  }
})

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {translations: enLocales},
      ru: {translations: ruLocales},
    },
    lng,
    fallbackLng: defaultLang.value,
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
