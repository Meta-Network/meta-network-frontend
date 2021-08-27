import React, { useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import HeadInfo from '../components/HeadInfo/Index'

import 'antd/dist/antd.css'
import 'tippy.js/dist/tippy.css'; // optional for styling

import '../styles/hexagon.scss'
import '../styles/custom.scss'
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
export default MyApp
