import styled from 'styled-components'
import { P } from './styles';
import RaffleHowToPDF from '../assets/RaffleMumbai.pdf'

const StyledWelcomeInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px;
`;

export const WelcomeInfo = () => {
  return (
    <StyledWelcomeInfo>
         <P>Welcome to the provably fair Raffle!</P>
         <P><a href={RaffleHowToPDF} target="_blank">Learn how the Raffle works and why it is 100% proovably fair here!</a></P>
    </StyledWelcomeInfo>
  )
}
