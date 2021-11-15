import React, { useEffect } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import type { AppProps } from 'next/app'
import { useMount } from 'ahooks'
import { appWithTranslation } from 'next-i18next'
import HeadInfo from '../components/HeadInfo/Index'
import { StoreGet } from '../utils/store'

import 'antd/dist/antd.css'

import '../styles/hexagon.scss'
import '../styles/custom.scss'
import '../styles/animation.scss'
import '../styles/globals.scss'

import { useToken } from '../hooks/useToken'
import { theme } from '../theme/index'

import useToast from '../hooks/useToast'

let VConsole: any = null
if (process.browser) {
  VConsole = require('vconsole')
}

function MyApp({ Component, pageProps }: AppProps) {

  const { Toast } = useToast()

  useMount(() => {
    const dev = StoreGet('MetaNetworkDEV')
    if ( process.browser && VConsole && dev ) {
      new VConsole()
    }

    // Toast({ content: '默认', duration: 0 })
    // Toast({ content: '默认', type: 'warning', duration: 0 })
    // Toast({ content: '默认111', type: 'warning', duration: 0 })
  })

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
