import { AppFrame, Button, Paragraph } from "./components/styles";
import { CONTRACT_ABI, POLYGON_MUMBAI_CHAIN_ID, RAFFLE_ADDRESS } from "./constants";
import { useChainId } from "./hooks/use-chain-id";
import { useCheckWindowEthereum } from "./hooks/use-check-window-ethereum";
import { useRaffleState } from "./hooks/use-raffle-state";
import { useSigner } from "./hooks/use-signer";
import { Polygon } from "./icons/polygon";
import { useOnAccountsChanged } from "./hooks/use-on-accounts-changed";
import { useOnChainChanged } from "./hooks/use-on-chain-changed";
import { usePlayers } from "./hooks/use-players";
import { useEntranceFee } from "./hooks/use-entrance-fee";
import { useContract } from "./hooks/use-contract";
import { useState } from "react";
import { parseEther } from "ethers";
import { TransactionNotification } from "./components/tx-notification";
import { TicketBoughtNotification } from "./components/ticket-bought-notification";
import { useLastDrawTimestamp } from "./hooks/use-last-draw-timestamp";
import { useTimestampTillNextDraw } from "./hooks/use-time-till-next-draw";
import { IsDrawingWinnerNotification } from "./components/is-drawing-winner-notification";
import Countdown from "./components/countdown-to-next-draw";

function App() {
    const [txHash, setTxHash] = useState<string | null>(null);
    const [showTicketBoughtNotification, setShowTicketBoughtNotification] = useState(false);
    const chainId = useChainId();
    const hasWindowEthereum = useCheckWindowEthereum();
    const signer = useSigner();
    const players = usePlayers();
    const entranceFee = useEntranceFee();
    const contract = useContract(RAFFLE_ADDRESS, CONTRACT_ABI);
    const lastDrawTimestamp = useLastDrawTimestamp();
    const lastDrawDate = lastDrawTimestamp ? new Date(lastDrawTimestamp) : null;
    const timestampTillNextDraw = useTimestampTillNextDraw();
  
    useOnAccountsChanged();
    useOnChainChanged();

    const raffleState = useRaffleState();

  const onConnect = async () => {
    if(hasWindowEthereum) {
      await window.ethereum?.request({ method: 'eth_requestAccounts' });
    }
  }

  const onBuyTicket = async () => {
    if(contract && signer) {
      try {
        const tx = await contract.buyTicket({ value: parseEther(entranceFee.toFixed(18)) });
        setTxHash(tx.hash);
        const receit = await tx.wait();
        if(receit && receit.status === 1) {
          setTxHash("")
          setShowTicketBoughtNotification(true);
          console.log({receit})
        }
      } catch (e) {
        console.error(e);
      }
    }
  }


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
      <h1>Raffle</h1>
      <Paragraph>Welcome to the proovably fair Raffle!</Paragraph>
      <Paragraph>Raffle State: {raffleState}</Paragraph>
      {!signer &&<>
        <Paragraph>Connect your wallet to participate!</Paragraph>
        <Button onClick={onConnect}>Connect Wallet</Button>
      </>
      }
      <Paragraph>Currently there are {players.length} players signed up for the next draw!</Paragraph>
      <Paragraph>Buy your ticket(s) now for {entranceFee} Matic</Paragraph>
      <Button onClick={onBuyTicket}>Buy Ticket!</Button>
      {txHash ? <TransactionNotification txHash={txHash} /> : null}
      {showTicketBoughtNotification ? <TicketBoughtNotification closeMe={() => setShowTicketBoughtNotification(false)}/> : null}
      {lastDrawDate ? <Paragraph>Last Draw: {lastDrawDate.toLocaleString()} </Paragraph> : null}
      <IsDrawingWinnerNotification />
      <Countdown timestampTillNextDraw={timestampTillNextDraw} />
    </AppFrame>
  )
}

export default App
