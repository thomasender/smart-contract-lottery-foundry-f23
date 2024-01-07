import { useTicketsForCurrentUser } from "../hooks/use-tickets-for-current-user";
import { InfoBox, P } from "./styles";
import { useSigner } from "../hooks/use-signer";
import { sliceAddress } from "../utils";
import { BuyTicketButton } from "./buy-ticket-button";

export const PlayerInfo = ({setTxHash, setShowTicketBoughtNotification}: {
    setTxHash: (txHash: string) => void;
    setShowTicketBoughtNotification: (show: boolean) => void;
}) => {
    const ticketsForPlayer = useTicketsForCurrentUser();
    const signer = useSigner();

    const calcPlayerTicketsInfoLabel = () => {
      if (ticketsForPlayer === 0) {
        return 'You have no tickets for the next draw!'
      } else if (ticketsForPlayer === 1) {
        return 'You have 1 ticket for the next draw!'
      } else {
        return `You have ${ticketsForPlayer} tickets for the next draw!`
      }
    }

    const calcBuyMoreTicketsLabel = () => {
      if (ticketsForPlayer > 0) {
         return 'Buy more tickets now!'
      } else {
        return 'Buy tickets now!'
      }
    }

    if (!signer) {
      return null
    }
  return (
    <InfoBox>
      <P>Connected with {sliceAddress(signer.address)}</P>
        <P>{calcPlayerTicketsInfoLabel()}</P>
        <BuyTicketButton setTxHash={setTxHash} setShowTicketBoughtNotification={setShowTicketBoughtNotification} label={calcBuyMoreTicketsLabel()}/>
    </InfoBox>
  )
}
