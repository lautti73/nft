import '../styles/globals.css'

import { Provider, chain, defaultChains } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import StoreProvider from '../store/storeProvider';

// API key for Ethereum node
const infuraId = process.env.INFURA_ID

// Chains for connectors to support
const chains = defaultChains

// Set up connectors
const connectors = ({ chainId }) => {
  const rpcUrl =
    chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
    chain.mainnet.rpcUrls[0]
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
    }),
    new WalletConnectConnector({
      options: {
        infuraId,
        qrcode: true,
      },
    }),
    // new WalletLinkConnector({
    //   options: {
    //     appName: 'GamblEarn',
    //     jsonRpcUrl: `${rpcUrl}/${infuraId}`,
    //   },
    // }),
  ]
}

function MyApp({ Component, pageProps }) {
	return (
		<Provider autoconnect connectors={connectors}>
			<StoreProvider>
				<Component {...pageProps} />
			</StoreProvider>
		 </Provider>
	)
		
}

export default MyApp
