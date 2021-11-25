import React from 'react'
import { ThemeProvider } from 'styled-components'
import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import HeadInfo from '../components/HeadInfo/Index'

import 'antd/dist/antd.css'

import '../styles/hexagon.scss'
import '../styles/custom.scss'
import '../styles/animation.scss'
import '../styles/globals.scss'

import { useToken } from '../hooks/useToken'
import { theme } from '../theme/index'

function MyApp({ Component, pageProps }: AppProps) {
  // refresh token
  useToken()

  return (
    <>
      <HeadInfo></HeadInfo>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
export default appWithTranslation(MyApp)
