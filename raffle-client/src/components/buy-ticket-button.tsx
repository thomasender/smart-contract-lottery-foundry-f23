import { parseEther } from 'ethers';
import { CONTRACT_ABI, RAFFLE_ADDRESS } from '../constants';
import { useContract } from '../hooks/use-contract';
import { useSigner } from '../hooks/use-signer'
import { Button } from './styles';
import { useEntranceFee } from '../hooks/use-entrance-fee';

export const BuyTicketButton = ({setTxHash, setShowTicketBoughtNotification}: {

    setTxHash: (txHash: string) => void;
    setShowTicketBoughtNotification: (show: boolean) => void;
}) => {
    const signer = useSigner();
    const contract = useContract(RAFFLE_ADDRESS, CONTRACT_ABI);
    const entranceFee = useEntranceFee();

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

  return (
   <Button onClick={onBuyTicket}>Buy Ticket!</Button>
  )
}
