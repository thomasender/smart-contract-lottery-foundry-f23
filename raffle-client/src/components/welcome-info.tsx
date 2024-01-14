import styled from 'styled-components'
import { FlexColCenter, FlexRowCenter, P } from './styles';
import RaffleHowToPDF from '../assets/RaffleMumbai.pdf'
import Heart from '../assets/heart.png'
import CloverPNG from '../assets/clover.png'

const StyledWelcomeInfo = styled(FlexColCenter)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px;
    padding-top: 0;
    gap: 0;
`;

export const WelcomeInfo = () => {
  return (
    <StyledWelcomeInfo>
      <FlexRowCenter>
        <img src={Heart} alt="heart" width="60px" height="60px" />
         <P><a href={RaffleHowToPDF} target="_blank">Learn how the Raffle works and why it is 100% proovably fair here!</a></P>
        <img src={CloverPNG} alt="chainlink" width="60px" height="60px" />
      </FlexRowCenter>
        <a href="https://faucets.chain.link/mumbai" target="_blank">Get some Test Matic!</a>
    </StyledWelcomeInfo>
  )
}
