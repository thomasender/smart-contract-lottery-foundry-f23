import { useState } from "react";

import { AppFrame, Button} from "./components/styles";
import { TransactionNotification } from "./components/tx-notification";
import { TicketBoughtNotification } from "./components/ticket-bought-notification";
import { IsDrawingWinnerNotification } from "./components/is-drawing-winner-notification";
import { LastDrawInfo } from "./components/last-draw-info";
import { Header } from "./components/header";
import { WelcomeInfo } from "./components/welcome-info";
import { RaffleStateInfo } from "./components/raffle-state-info";
import { PlayerInfo } from "./components/player-info";
import { BuyTicketButton } from "./components/buy-ticket-button";
import { ConnectButton } from "./components/connect-button";
import {  POLYGON_MUMBAI_CHAIN_ID } from "./constants";
import { useChainId } from "./hooks/use-chain-id";
import { useCheckWindowEthereum } from "./hooks/use-check-window-ethereum";
import { useOnAccountsChanged } from "./hooks/use-on-accounts-changed";
import { useOnChainChanged } from "./hooks/use-on-chain-changed";
import { Polygon } from "./icons/polygon";

function App() {
    const [txHash, setTxHash] = useState<string | null>(null);
    const [showTicketBoughtNotification, setShowTicketBoughtNotification] = useState(false);
    const chainId = useChainId();
    const hasWindowEthereum = useCheckWindowEthereum();

    useOnAccountsChanged();
    useOnChainChanged();

  if (!hasWindowEthereum) {
    return <>
    <h1>Ooops!</h1>
    <h2>Looks like there is no Web3 Provider available!</h2>
    <p>Please <a href="https://metamask.io" target="_blank">install MetaMask</a> to interact with this DApp!</p>
    </>
  }

    const switchToPolygonMainnet = async () => {
    try {
        await window.ethereum?.request({
          method: 'wallet_switchEthereumChain',
          params: [{
            chainId: '0x89', // Chain ID for Polygon Mainnet
          }],
        });
    } catch {
      try {
        await window.ethereum?.request({
          "method": "wallet_addEthereumChain",
          "params": [
            {
              "chainId": "0x89",
              "chainName": "Polygon LlamaNodes",
              "rpcUrls": [
                "https://polygon.llamarpc.com"
              ],
              "iconUrls": [
                "https://xdaichain.com/fake/example/url/xdai.svg",
                "https://xdaichain.com/fake/example/url/xdai.png"
              ],
              "nativeCurrency": {
                "name": "MATIC",
                "symbol": "MATIC",
                "decimals": 18
              },
              "blockExplorerUrls": [
                "https://polygonscan.com"
              ]
            }
          ]
        })
      } catch {
        console.log('User did not want to switch to Polygon Mainnet!')
      }
    }
  };

  if (chainId !== POLYGON_MUMBAI_CHAIN_ID) {
    return (
      <>
        <h1>Ooops!</h1>
        <h2>Looks like you are not connected to the Polygon Mainnet!</h2>
        <Polygon />
        <p>Please switch to the Polygon Mainnet to interact with this DApp!</p>
        <Button onClick={switchToPolygonMainnet}>Switch to Polygon Now!</Button>
      </>
    )
  }

  return (
    <AppFrame>
      <Header />
      <WelcomeInfo />
      <RaffleStateInfo />
      <PlayerInfo />
      <ConnectButton />
      <BuyTicketButton setTxHash={setTxHash} setShowTicketBoughtNotification={setShowTicketBoughtNotification} />
      <LastDrawInfo />
      {txHash ? <TransactionNotification txHash={txHash} /> : null}
      {showTicketBoughtNotification ? <TicketBoughtNotification closeMe={() => setShowTicketBoughtNotification(false)}/> : null}
      <IsDrawingWinnerNotification />
    </AppFrame>
  )
}

export default App
