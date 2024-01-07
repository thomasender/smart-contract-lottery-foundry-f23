import styled from 'styled-components'
import { P } from './styles';
import { useRaffleState } from '../hooks/use-raffle-state';
import Countdown from './countdown-to-next-draw';
import { useTimestampTillNextDraw } from '../hooks/use-time-till-next-draw';
import { usePlayers } from '../hooks/use-players';
import { usePricePool } from '../hooks/use-prize-pool';
import { useSigner } from '../hooks/use-signer';

const StyledRaffleStateInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.colors.purple};
    box-shadow: 0 0 12px ${({ theme }) => theme.colors.purple};
    gap: 12px;
`;

const calcPlayersSignedUpLabel = (players: number, currentUserIsOnlyPlayer: boolean) => {
    if (players === 0) {
      return 'Currently there are no players signed up for the next draw!'
    } else if (currentUserIsOnlyPlayer) {
      return 'You are the only player signed up for the next draw!'
    } else if(players === 1) {
        return 'Currently there is 1 player signed up for the next draw!'
    } else {
        return `Currently there are ${players} players are signed up for the next draw!`
    }
}

export const RaffleStateInfo = () => {
  const raffleState = useRaffleState();
  const timestampTillNextDraw = useTimestampTillNextDraw();
  const players = usePlayers();
  const signer = useSigner();
  const currentUserIsOnlyPlayer = players.length === 1 && players[0] === signer?.address ;
  const pricePool = usePricePool();
  const playersSignedUpLabel = calcPlayersSignedUpLabel(players.length, currentUserIsOnlyPlayer);
  
  if(!signer) {
      return null;
  }
  return (
    <StyledRaffleStateInfo>
      <P>The Raffle is currently {raffleState.toUpperCase()}</P>
      <Countdown timestampTillNextDraw={timestampTillNextDraw} />
      <P>{playersSignedUpLabel}</P>
      <P>Price Pool: {pricePool} Matic</P>
    </StyledRaffleStateInfo>
  )
}
