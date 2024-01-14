import { useState } from "react";

import { AppFrame, Button, H1, InfoBoxBordered} from "./components/styles";
import { TransactionNotification } from "./components/tx-notification";
import { TicketBoughtNotification } from "./components/ticket-bought-notification";
import { IsDrawingWinnerNotification } from "./components/is-drawing-winner-notification";
import { LastDrawInfo } from "./components/last-draw-info";
import { Header } from "./components/header";
import { WelcomeInfo } from "./components/welcome-info";
import { RaffleStateInfo } from "./components/raffle-state-info";
import { PlayerInfo } from "./components/player-info";
import { ConnectButton } from "./components/connect-button";
import {  POLYGON_MUMBAI_CHAIN_ID } from "./constants";
import { useChainId } from "./hooks/use-chain-id";
import { useCheckWindowEthereum } from "./hooks/use-check-window-ethereum";
import { useOnAccountsChanged } from "./hooks/use-on-accounts-changed";
import { useOnChainChanged } from "./hooks/use-on-chain-changed";
import { Polygon } from "./icons/polygon";
import { switchToPolygonMumbai } from "./utils";

function App() {
    const [txHash, setTxHash] = useState<string | null>(null);
    const [showTicketBoughtNotification, setShowTicketBoughtNotification] = useState(false);
    const chainId = useChainId();
    const hasWindowEthereum = useCheckWindowEthereum();

    useOnAccountsChanged();
    useOnChainChanged();

  if (!hasWindowEthereum) {
    return <>
    <H1>Ooops!</H1>
    <h2>Looks like there is no Web3 Provider available!</h2>
    <p>Please <a href="https://metamask.io" target="_blank">install MetaMask</a> to interact with this DApp!</p>
    </>
  }

  if (chainId !== POLYGON_MUMBAI_CHAIN_ID) {
    return (
      <>
        <H1>Ooops!</H1>
        <h2>Looks like you are not connected to Polygon Mumbai!</h2>
        <Polygon />
        <p>Please switch to the Polygon Mumbai to interact with this DApp!</p>
        <Button onClick={switchToPolygonMumbai}>Switch to Mumbai Now!</Button>
      </>
    )
  }

  return (
    <AppFrame>
      <Header />
      <WelcomeInfo />
      <InfoBoxBordered>
        <PlayerInfo setTxHash={setTxHash} setShowTicketBoughtNotification={setShowTicketBoughtNotification}/>
        <ConnectButton />
      </InfoBoxBordered>
      <RaffleStateInfo />
      <LastDrawInfo />
      {txHash ? <TransactionNotification txHash={txHash} /> : null}
      {showTicketBoughtNotification ? <TicketBoughtNotification closeMe={() => setShowTicketBoughtNotification(false)}/> : null}
      <IsDrawingWinnerNotification />
    </AppFrame>
  )
}

export default App
