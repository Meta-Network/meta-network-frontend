import React, { useEffect } from 'react';

import 'antd/dist/antd.css'
import 'tippy.js/dist/tippy.css'; // optional for styling
import '../styles/globals.scss'
import '../styles/custom.scss'

import type { AppProps } from 'next/app'

import Stats from 'stats.js'
import CustomModal from '../components/CustomModal/Index'
import DeploySite from "../components/DeploySite/Index";
import InviteCode from "../components/InviteCode/Index";

import { useToken } from '../hooks/useToken'

function MyApp({ Component, pageProps }: AppProps) {

  // refresh token
  useToken()

  useEffect(() => {
    var stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    stats.dom.style.top = 'auto'
    stats.dom.style.bottom = '0'
    document.body.appendChild( stats.dom );

    function animate() {

      stats.begin();

      // monitored code goes here

      stats.end();

      requestAnimationFrame( animate );

    }

    requestAnimationFrame( animate );
  }, [])

  return (
    <>
      <Component {...pageProps} />
      <CustomModal>
        <DeploySite></DeploySite>
      </CustomModal>
      <CustomModal>
        <InviteCode></InviteCode>
      </CustomModal>
    </>
  )
}
export default MyApp
