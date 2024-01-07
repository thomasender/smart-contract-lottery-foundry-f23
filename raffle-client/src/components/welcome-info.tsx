import styled from 'styled-components'
import { P } from './styles';

const StyledWelcomeInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.colors.purple};
    box-shadow: 0 0 12px ${({ theme }) => theme.colors.purple};
`;

export const WelcomeInfo = () => {
  return (
    <StyledWelcomeInfo>
         <P>Welcome to the proovably fair Raffle!</P>
         <P>Learn how the Raffle works and why it is 100% proovably fair here!</P>
    </StyledWelcomeInfo>
  )
}
