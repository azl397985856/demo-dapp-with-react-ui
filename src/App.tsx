import './App.scss'
import {THEME, TonConnectUIProvider} from "@tonconnect/ui-react";
import {Header} from "./components/Header/Header";
import {TxForm} from "./components/TxForm/TxForm";
import {Footer} from "./components/Footer/Footer";
import {TonProofDemo} from "./components/TonProofDemo/TonProofDemo";
import {CreateJettonDemo} from "./components/CreateJettonDemo/CreateJettonDemo";

// @ts-ignore
window.tonkeeper123 = {
  provider: {
    callbacks: {
      chainChanged: [null],
    },
    isTonkeeper: true,
    targetOrigin: '*',
    nextJsonRpcId: 3,
    promises: {},
    onMessage: (...args: any[]) => console.log('onmessage', ...args),
  },
  tonconnect: {
    connect(...args: any[]) {
      console.log('connect', ...args)
    },
    listen(...args: any[]) {
      console.log('listen', ...args)
    },
    notify(...args: any[]) {
      console.log('notify', ...args)
    },
    restoreConnection(...args: any[]) {
      console.log('restoreConnection', ...args)
    },
    send(...args: any[]) {
      console.log('send', ...args)
    },
    provider: {
      callbacks: {
        chainChanged: [null],
      },
      isTonkeeper: true,
      targetOrigin: '*',
      nextJsonRpcId: 3,
      promises: {},
    },
    callbacks: [null],
    deviceInfo: {
      platform: 'mac',
      appName: 'Tonkeeper',
      appVersion: '3.12.3',
      maxProtocolVersion: 2,
      features: [
        'SendTransaction',
        {
          name: 'SendTransaction',
          maxMessages: 4,
        },
      ],
    },
    walletInfo: {
      "app_name": 'TonkeeperTestWallet123',
      name: 'tonkeeper123',
      image: 'https://tonkeeper.com/assets/tonconnect-icon.png',
      tondns: 'tonkeeper.ton',
      about_url: 'https://tonkeeper.com',
      platforms: ["ios", "android", "chrome", "firefox"]
    },
    protocolVersion: 2,
    isWalletBrowser: false,
  },
}

function App() {
  return (
      <TonConnectUIProvider
          manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json"
          uiPreferences={{ theme: THEME.DARK }}
          walletsListConfiguration={{
            includeWallets: [
              {
                appName: "TonkeeperTestWallet123",
                name: "tonkeeper123",
                imageUrl: "https://s.pvcliping.com/web/public_image/SafePal_x288.png",
                tondns: "",
                aboutUrl: "https://www.safepal.com",
                jsBridgeKey: "tonkeeper123",
                platforms: ["ios", "android", "chrome", "firefox"]
              }
            ]
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
