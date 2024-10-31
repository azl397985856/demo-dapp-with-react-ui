import './App.scss'
import { THEME, TonConnectUIProvider, useTonConnectModal } from "@tonconnect/ui-react";
import { Header } from "./components/Header/Header";
import { TxForm } from "./components/TxForm/TxForm";
import { Footer } from "./components/Footer/Footer";
import { TonProofDemo } from "./components/TonProofDemo/TonProofDemo";
import { CreateJettonDemo } from "./components/CreateJettonDemo/CreateJettonDemo";

function App() {

  return (
    <TonConnectUIProvider
      manifestUrl="https://ton-connect.github1.io/demo-dapp-with-react-ui/tonconnect-manifest.json"
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
