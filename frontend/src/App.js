// i18n
import './locales/i18n'

// scroll bar
import 'simplebar/src/simplebar.css'
import 'assets/css/style.scss'

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css'
// lightbox
/* eslint-disable import/no-unresolved */
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

// ----------------------------------------------------------------------

import {BrowserRouter} from 'react-router-dom'
import {HelmetProvider} from 'react-helmet-async'
// routes
import Router from './routes'
// theme
import ThemeProvider from './theme'
// locales
import ThemeLocalization, {useLocales} from './locales'
// components
import SnackbarProvider from './components/snackbar'
import {ThemeSettings, SettingsProvider} from './components/settings'
import {MotionLazyContainer} from './components/animate'
import ScrollToTop from './components/scroll-to-top'


import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers'
// redux
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from './redux/store'

// Check our docs
// https://docs.minimals.cc/authentication/js-version

import {AuthProvider} from './auth/JwtContext'

// ----------------------------------------------------------------------

export default function App() {
  const { currentLang } = useLocales()
  return (
    <AuthProvider>
      <HelmetProvider>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={currentLang.dateLocale}>
              <SettingsProvider>
                <BrowserRouter>
                  <ScrollToTop/>
                  <MotionLazyContainer>
                    <ThemeProvider>
                      <ThemeSettings>
                        <ThemeLocalization>
                          <SnackbarProvider>
                            <Router/>
                          </SnackbarProvider>
                        </ThemeLocalization>
                      </ThemeSettings>
                    </ThemeProvider>
                  </MotionLazyContainer>
                </BrowserRouter>
              </SettingsProvider>
            </LocalizationProvider>
          </PersistGate>
        </ReduxProvider>
      </HelmetProvider>
    </AuthProvider>
  )
}
