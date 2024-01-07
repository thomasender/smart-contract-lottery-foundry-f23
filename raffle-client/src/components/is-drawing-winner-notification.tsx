import { H1, NotificationContainer, P } from './styles'
import { LoadingSpinner } from './loading-spinner'
import styled from 'styled-components'
import { useCallback, useEffect } from 'react'
import { Polygon } from '../icons/polygon'
import { RAFFLESTATE, useRaffleState } from '../hooks/use-raffle-state'

const BlurBackground = styled.div`
  position: fixed;
  z-index: 1000;
  background-color: rgba(0,0,0,0.8);
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items:center;
  justify-content: center;
`


export const IsDrawingWinnerNotification = () => {
    const raffleState = useRaffleState();
    const isDrawing = raffleState === RAFFLESTATE[1];
    const handleClick = useCallback((event: { stopPropagation: () => void }) => {
      event.stopPropagation();
    }, []);
  
  useEffect(() => {
    // Disable scrolling on the body element
    document.body.style.overflow = 'hidden';

    // Re-enable scrolling when the component is unmounted
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!isDrawing) return null
  return (
    <BlurBackground onClick={handleClick}>
      <NotificationContainer>
          <Polygon />
          <H1>The Winner is being drawn!</H1>
          <LoadingSpinner />
          <P>It may take a few minutes to complete.</P>
          <P>Hold on to your seat!</P>
      </NotificationContainer>
    </BlurBackground>
  )
}
