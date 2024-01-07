import styled from 'styled-components'
import { InfoBoxBordered, P } from './styles';
import { useRaffleState } from '../hooks/use-raffle-state';
import Countdown from './countdown-to-next-draw';
import { usePlayers } from '../hooks/use-players';
import { usePricePool } from '../hooks/use-prize-pool';
import { useSigner } from '../hooks/use-signer';

const StyledRaffleStateInfo = styled(InfoBoxBordered)`
    border: 2px solid ${({ theme }) => theme.colors.purple};
    box-shadow: 0 0 12px ${({ theme }) => theme.colors.purple};
`;

const calcPlayersSignedUpLabel = (players: number, currentUserIsOnlyPlayer: boolean) => {
    if (players === 0) {
      return '0 players signed up for the next draw!'
    } else if (currentUserIsOnlyPlayer) {
      return 'You are the only player signed up for the next draw!'
    } else if(players === 1) {
        return '1 player has signed up for the next draw!'
    } else {
        return `${players} players have signed up for the next draw!`
    }
}

export const RaffleStateInfo = () => {
  const raffleState = useRaffleState();
  const players = usePlayers({removeDuplicates: true});
  const signer = useSigner();
  const currentUserIsOnlyPlayer = players.length === 1 && players[0] === signer?.address ;
  const pricePool = usePricePool();
  const playersSignedUpLabel = calcPlayersSignedUpLabel(players.length, currentUserIsOnlyPlayer);
  const totalTicketsSold = usePlayers({removeDuplicates: false}).length;

  if(!signer) {
      return null;
  }

  return (
    <StyledRaffleStateInfo>
      <P>The Raffle is currently {raffleState.toUpperCase()}</P>
      <Countdown />
      <P>{playersSignedUpLabel}</P>
      <P>Total Tickets sold: {totalTicketsSold}</P>
      <P>Price Pool: {pricePool} Matic</P>
    </StyledRaffleStateInfo>
  )
}
