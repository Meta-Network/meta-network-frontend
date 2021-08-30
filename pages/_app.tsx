import React, { useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components'
import type { AppProps } from 'next/app'
import { useMount } from 'ahooks'

import HeadInfo from '../components/HeadInfo/Index'
import { StoreGet, StoreSet, StoreRemove } from '../utils/store'

import 'antd/dist/antd.css'
import 'tippy.js/dist/tippy.css'; // optional for styling

import '../styles/hexagon.scss'
import '../styles/custom.scss'
import '../styles/globals.scss'

import { useToken } from '../hooks/useToken'
import { theme } from '../theme/index'

let VConsole: any = null
if (process.browser) {
  VConsole = require('vconsole')
}

function MyApp({ Component, pageProps }: AppProps) {

  useMount(() => {
    const dev = StoreGet('MetaNetworkDEV')
    if ( process.browser && VConsole && dev ) {
      new VConsole()
    }
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
export default MyApp
