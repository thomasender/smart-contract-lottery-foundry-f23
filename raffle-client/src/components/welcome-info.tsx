import styled from 'styled-components'
import { P } from './styles';

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
         {/* <P>Learn how the Raffle works and why it is 100% proovably fair here!</P> */}
    </StyledWelcomeInfo>
  )
}
