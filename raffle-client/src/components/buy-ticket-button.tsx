import { parseEther } from 'ethers';
import { CONTRACT_ABI, RAFFLE_ADDRESS } from '../constants';
import { useContract } from '../hooks/use-contract';
import { useSigner } from '../hooks/use-signer'
import { Button, P, PSmall } from './styles';
import { useEntranceFee } from '../hooks/use-entrance-fee';
import { useTimeLeftTillNextDraw } from '../hooks/use-time-left-till-next-draw';

export const BuyTicketButton = ({setTxHash, setShowTicketBoughtNotification, label}: {
    setTxHash: (txHash: string) => void;
    setShowTicketBoughtNotification: (show: boolean) => void;
    label: string
}) => {
    const signer = useSigner();
    const contract = useContract(RAFFLE_ADDRESS, CONTRACT_ABI);
    const entranceFee = useEntranceFee();
    const { stopTicketSale } = useTimeLeftTillNextDraw();

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

  if (!signer) {
    return null
  }

  if (stopTicketSale) {
    return (
      <>
        <Button disabled={true}>Ticket Sale stopped</Button>
        <P>The winner will be drawn soon!</P>
      </>
    )
  }

  return (
    <>
        <Button onClick={onBuyTicket}>{label}</Button>
        <P>Price: {entranceFee} Matic</P>
        <PSmall>10% are kept for maintenance</PSmall>
    </>
  )
}
