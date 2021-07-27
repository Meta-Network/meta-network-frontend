import React, { useEffect } from 'react';

import '../styles/globals.scss'
import 'tippy.js/dist/tippy.css'; // optional for styling
import type { AppProps } from 'next/app'

import Stats from 'stats.js'

function MyApp({ Component, pageProps }: AppProps) {

  useEffect(() => {
    var stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );

    function animate() {

      stats.begin();

      // monitored code goes here

      stats.end();

      requestAnimationFrame( animate );

    }

    requestAnimationFrame( animate );
  }, [])

  return <Component {...pageProps} />
}
export default MyApp
