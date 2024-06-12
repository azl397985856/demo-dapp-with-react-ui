import './App.scss'
import {THEME, TonConnectUIProvider} from "@tonconnect/ui-react";
import {Header} from "./components/Header/Header";
import {TxForm} from "./components/TxForm/TxForm";
import {Footer} from "./components/Footer/Footer";
import {TonProofDemo} from "./components/TonProofDemo/TonProofDemo";
import {CreateJettonDemo} from "./components/CreateJettonDemo/CreateJettonDemo";


type Feature =
  | { name: 'SendTransaction'; maxMessages: number } // `maxMessages` 是钱包支持的一次 `SendTransaction` 中的最大消息数
  | { name: 'SignData' }
interface TonConnectBridge {
  deviceInfo: DeviceInfo // 见请求/响应规范
  walletInfo?: any
  protocolVersion: number // 支持的最大 Ton Connect 版本（例如 2）
  isWalletBrowser: boolean // 如果页面打开在钱包的浏览器中
  connect(protocolVersion: number, message: ConnectRequest): Promise<ConnectEvent>
  restoreConnection(): Promise<ConnectEvent>
  send(message: AppRequest): Promise<WalletResponse>
  listen(callback: (event: WalletEvent) => void): () => void
}

type DeviceInfo = {
  platform: 'iphone' | 'ipad' | 'android' | 'windows' | 'mac' | 'linux'
  appName: string // 例如 "Tonkeeper"
  appVersion: string // 例如 "2.3.367"
  maxProtocolVersion: number
  features: Feature[] // RPC 中支持的特性和方法列表
  // 目前只有一个特性 -- 'SendTransaction';
}
type TonAddressItem = {
  name: 'ton_addr'
}
type TonProofItem = {
  name: 'ton_proof'
  payload: string // 任意载荷，例如 nonce + 过期时间戳。
}
type ConnectItem = TonAddressItem | TonProofItem
type ConnectRequest = {
  manifestUrl: string
  items: ConnectItem[] // 与应用共享的数据项
}

type ConnectEvent = ConnectEventSuccess | ConnectEventError
type ConnectItemReply = TonAddressItemReply | TonProofItemReply
// 由钱包返回的不受信任的数据。
// 如果您需要保证用户拥有此地址和公钥，您需要额外请求 ton_proof。
type TonAddressItemReply = {
  name: 'ton_addr'
  address: string // TON 地址原始 (`0:<hex>`)
  network: NETWORK // 网络 global_id
  publicKey: string // HEX 字符串，不带 0x
  walletStateInit: string // Base64（不安全 URL）编码的钱包合约的 stateinit cell
}

type TonProofItemReply = TonProofItemReplySuccess | TonProofItemReplyError

type TonProofItemReplySuccess = {
  name: 'ton_proof'
  proof: {
    timestamp: string // 签名操作的 64 位 unix epoch 时间（秒）
    domain: {
      lengthBytes: number // AppDomain 长度
      value: string // 应用域名（作为 url 部分，无编码）
    }
    signature: string // base64 编码的签名
    payload: string // 请求中的载荷
  }
}

type TonProofItemReplyError = {
  name: 'ton_addr'
  error: {
    code: 1 // TODO: ConnectItemErrorCode
    message?: string
  }
}

enum NETWORK {
  MAINNET = '-239',
  TESTNET = '-3',
}
type ConnectEventSuccess = {
  event: 'connect'
  id: number // 递增的事件计数器
  payload: {
    items: ConnectItemReply[]
    device: DeviceInfo
  }
}
type ConnectEventError = {
  event: 'connect_error'
  id: number // 递增的事件计数器
  payload: {
    code: number
    message: string
  }
}

interface AppRequest {
  method: string // 操作名称（'sendTransaction', 'signMessage', ...）
  params: string[]
  id: string
}

type WalletResponse = WalletResponseSuccess | WalletResponseError

interface WalletResponseSuccess {
  result: string
  id: string
}

interface WalletResponseError {
  error: { code: number; message: string; data?: unknown }
  id: string
}

interface WalletEvent {
  event: WalletEventName
  id: number // 递增的事件计数器
  payload: any
  // payload: <event-payload>; // 每个事件特定的载荷
}

type WalletEventName = 'connect' | 'connect_error' | 'disconnect'

const tonkeeper1234 = {
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
    async connect(protocolVersion: number, message: ConnectRequest): Promise<ConnectEvent> {
      console.log('connect with ton_proof', protocolVersion, message)
      // TODO: [TON] connect, connect_error 需要调用 notify 来触发用户注册的 handler
      return {
        event: 'connect',
        id: 1716908283733,
        payload: {
          items: [
            {
              name: 'ton_addr',
              address: '0:f6ec31912994229d903edc42e23475be311599e14856620a2629307ee08be8c9',
              network: '-239' as NETWORK,
              walletStateInit:
                'te6cckECFgEAAwQAAgE0AgEAUQAAAAApqaMXdgs06RoUlFDYAZyWDsCurtuEoQYYKXUSk5gwT4bK0fdAART/APSkE/S88sgLAwIBIAkEBPjygwjXGCDTH9Mf0x8C+CO78mTtRNDTH9Mf0//0BNFRQ7ryoVFRuvKiBfkBVBBk+RDyo/gAJKTIyx9SQMsfUjDL/1IQ9ADJ7VT4DwHTByHAAJ9sUZMg10qW0wfUAvsA6DDgIcAB4wAhwALjAAHAA5Ew4w0DpMjLHxLLH8v/CAcGBQAK9ADJ7VQAbIEBCNcY+gDTPzBSJIEBCPRZ8qeCEGRzdHJwdIAYyMsFywJQBc8WUAP6AhPLassfEss/yXP7AABwgQEI1xj6ANM/yFQgR4EBCPRR8qeCEG5vdGVwdIAYyMsFywJQBs8WUAT6AhTLahLLH8s/yXP7AAIAbtIH+gDU1CL5AAXIygcVy//J0Hd0gBjIywXLAiLPFlAF+gIUy2sSzMzJc/sAyEAUgQEI9FHypwICAUgTCgIBIAwLAFm9JCtvaiaECAoGuQ+gIYRw1AgIR6STfSmRDOaQPp/5g3gSgBt4EBSJhxWfMYQCASAODQARuMl+1E0NcLH4AgFYEg8CASAREAAZrx32omhAEGuQ64WPwAAZrc52omhAIGuQ64X/wAA9sp37UTQgQFA1yH0BDACyMoHy//J0AGBAQj0Cm+hMYALm0AHQ0wMhcbCSXwTgItdJwSCSXwTgAtMfIYIQcGx1Z70ighBkc3RyvbCSXwXgA/pAMCD6RAHIygfL/8nQ7UTQgQFA1yH0BDBcgQEI9ApvoTGzkl8H4AXTP8glghBwbHVnupI4MOMNA4IQZHN0crqSXwbjDRUUAIpQBIEBCPRZMO1E0IEBQNcgyAHPFvQAye1UAXKwjiOCEGRzdHKDHrFwgBhQBcsFUAPPFiP6AhPLassfyz/JgED7AJJfA+IAeAH6APQEMPgnbyIwUAqhIb7y4FCCEHBsdWeDHrFwgBhQBMsFJs8WWPoCGfQAy2kXyx9SYMs/IMmAQPsABntvxc8=',
              publicKey: '760b34e91a149450d8019c960ec0aeaedb84a106182975129398304f86cad1f7',
            },
            // {
            //   name: "ton_proof",
            //   // @ts-ignore
            //   error: {
            //       code: 400,
            //       message: "don't support ton_proof for now."
            //   }
       
            // }
            {
              name: 'ton_proof',
              proof: {
                // @ts-ignore
                timestamp: 1716908279,
                domain: {
                  lengthBytes: 11,
                  value: 'lucifer.ren',
                },
                signature:
                  'r6AD3SdhXKCNhdSzJGNwbO2SBpyQ5P7s9Rl81undX+aLVgQNasKX+JtG7xFgPAsR3oizE0rw1JsDhNf8ipSyAQ==',
                payload:
                  'eyJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjoiZWFhYjEwMDI5MzMxOTA2NmNhNjZjMzRkOWM5YmJhMjJjMjFmMzNkOGRkNWJhNzNiZTY5ZTgxNzQyZTRjYzlmZCIsImlhdCI6MTcxNjkwNzk4NiwiZXhwIjoxNzE2OTA4ODg2fQ.PW_SkU7GTsatpPsy0FGYzI4M_3NlSubyoILidektWO4',
              },
            },
          ],
          device: {
            platform: 'mac',
            appName: 'Tonkeeper',
            appVersion: '3.12.3',
            maxProtocolVersion: 2,
            features: [
              // @ts-ignore
              'SendTransaction',
              {
                name: 'SendTransaction',
                maxMessages: 4,
              },
            ],
          },
        },
      }
    },
    listen(...args: any[]) {
      // TODO: [TON] 添加到 set
      console.log('listen', ...args)
    },
    notify(...args: any[]) {
      console.log('notify', ...args)
    },
    restoreConnection(...args: any[]) {
      // TODO: [TON] connect 需要调用 notify 来触发用户注册的 handler
      console.log('restoreConnection', ...args)
    },
    async send(req: AppRequest): Promise<WalletResponse> {
      console.log('send', req)
       // TODO: [TON]  disconnect 需要调用 notify 来触发用户注册的 handler
      // req.method: signData, sendTransaction, disconnect, [signMessage???]
      return {
        result: 'mock singature',
        id: req.id
      }
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
      platform: 'mac' as const,
      appName: 'Tonkeeper',
      appVersion: '3.12.3',
      maxProtocolVersion: 2,
      features: [
        'SendTransaction' as const,
        {
          name: 'SendTransaction' as const,
          maxMessages: 4,
        } as const,
      ],
    },
    walletInfo: {
      name: 'tonkeeper1234',
      image: 'https://tonkeeper.com/assets/tonconnect-icon.png',
      tondns: 'tonkeeper.ton',
      about_url: 'https://tonkeeper.com',
    },
    protocolVersion: 2,
    isWalletBrowser: false,
  },
}

// @ts-ignore
window.tonkeeper1234 = tonkeeper1234

function App() {
  return (
      <TonConnectUIProvider
          manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json"
          uiPreferences={{ theme: THEME.DARK }}
          walletsListConfiguration={{
            includeWallets: [
              {
                appName: "tk",
                name: "tk",
                imageUrl: "https://s.pvcliping.com/web/public_image/SafePal_x288.png",
                tondns: "",
                aboutUrl: "https://www.safepal.com",
                jsBridgeKey: "tonkeeper1234",
                universalLink: "http://localhost:1234",
                bridgeUrl: "https://bridge.tonapi.io/bridge",
                platforms: ["chrome", "safari", "ios", "android"]
              },
              {
                appName: "new-wallet",
                name: "new-wallet",
                imageUrl: "https://s.pvcliping.com/web/public_image/SafePal_x288.png",
                tondns: "",
                aboutUrl: "https://www.safepal.com",
                jsBridgeKey: "tonkeeper123",
                universalLink: "https://app.binance.com/cedefi/wc",
                platforms: ["chrome", "safari", "ios", "android"]
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
