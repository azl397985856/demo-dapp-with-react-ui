import './App.scss'
import { THEME, TonConnectUIProvider } from "@tonconnect/ui-react";
import { Header } from "./components/Header/Header";
import { TxForm } from "./components/TxForm/TxForm";
import { Footer } from "./components/Footer/Footer";
import { TonProofDemo } from "./components/TonProofDemo/TonProofDemo";
import { CreateJettonDemo } from "./components/CreateJettonDemo/CreateJettonDemo";
import { useState } from 'react';

function App() {
  const [deeplink, setDeepLink] = useState('')
  return (
    <TonConnectUIProvider
      manifestUrl="https://frogs.digital/assets/manifest.json"
      uiPreferences={{ theme: THEME.DARK }}
      walletsListConfiguration={{
        // includeWallets: [
        //   {
        //     appName: "nora",
        //     name: "nora",
        //     imageUrl: "https://s.pvcliping.com/web/public_image/SafePal_x288.png",
        //     tondns: "",
        //     jsBridgeKey: "binancew3w",
        //     aboutUrl: "https://www.safepal.com",
        //     universalLink: "https://app.binance.com/cedefi/ton-connect",
        //     // universalLink: 'bnc://app.binance.com/cedefi/ton-connect',
        //     deepLink: 'bnc://app.binance.com/cedefi/ton-connect',
        //     bridgeUrl: "https://bridge.tonapi.io/bridge",
        //     platforms: ["chrome", "safari", "ios", "android"]
        //   },
        // ]
      }}
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/DemoDappWithTonConnectBot/demo'
      }}
    >
      <div className="app">
        <input value={deeplink} onChange={e => {
          setDeepLink(e.target.value)
        }}></input>
        <button onClick={() => {
          window.open(deeplink)
        }}>
          open deeplink
        </button>
        <Header />
        <TxForm />
        <CreateJettonDemo />
        <TonProofDemo />
        <Footer />
      </div>
    </TonConnectUIProvider>
  )
}

export default App
