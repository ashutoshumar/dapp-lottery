import '../styles/globals.css'
import { MoralisProvider } from "react-moralis";
import { AppProvider } from '../context/context'
import { NotificationProvider } from "@web3uikit/core";
function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
       <NotificationProvider>
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
    </NotificationProvider>
    </MoralisProvider>
  )
}

export default MyApp
