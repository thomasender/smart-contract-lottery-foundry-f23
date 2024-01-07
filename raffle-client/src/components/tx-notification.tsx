import { H1, NotificationContainer, P } from './styles'
import { LoadingSpinner } from './loading-spinner'
import styled from 'styled-components'
import { useCallback, useEffect } from 'react'
import { Polygon } from '../icons/polygon'
import { ETHERSCAN_POLYGON_TX_BASE_URL } from '../constants'

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


export const TransactionNotification = ({txHash}: {txHash: string}) => {
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

  if (!txHash) return null
  return (
    <BlurBackground onClick={handleClick}>
      <NotificationContainer>
          <Polygon />
          <H1>Your transaction is processing!</H1>
          <LoadingSpinner />
          <P>It may take a few minutes to complete.</P>
          <P>Do not close this window.</P>
          <P>See your transaction on Polyscan:</P>
          <a href={`${ETHERSCAN_POLYGON_TX_BASE_URL}${txHash}`} target="_blank" rel="noreferrer">{txHash}</a>
      </NotificationContainer>
    </BlurBackground>
  )
}
