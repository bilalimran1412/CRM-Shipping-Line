// @mui
import {enUS, ruRU} from '@mui/material/locale'
import {enUS as pickerEN, ruRU as pickerRU} from '@mui/x-date-pickers/locales'
import _ from 'lodash'
import {default as dateRu} from 'date-fns/locale/ru';
import {default as dateEn} from 'date-fns/locale/en-GB';
// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.
// ----------------------------------------------------------------------
export const allLangs = [
  {
    label: 'Русский',
    value: 'ru',
    systemValue: _.merge(ruRU, pickerRU),
    dateLocale: dateRu,
    icon: '/assets/icons/flags/ru.svg',
  },
  {
    label: 'English',
    value: 'en',
    systemValue: _.merge(enUS, pickerEN),
    dateLocale: dateEn,
    icon: '/assets/icons/flags/en.svg',
  },
]

export const defaultLang = allLangs[0] // Русский
