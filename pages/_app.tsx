import '../styles/globals.css'
import 'tippy.js/dist/tippy.css'; // optional for styling
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default MyApp
