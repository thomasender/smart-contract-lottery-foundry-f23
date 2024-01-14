import styled, {keyframes} from 'styled-components'
import { Polygon } from '../icons/polygon'
import { H1 } from './styles'
import Chainlink from '../assets/chainlink.png'

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  gap: 24px;
`

const rotateKeyframes = keyframes`
    from {
        transform: rotateY(0deg);
    }
    to {
        transform: rotateY(359deg);
    }
`

const RotateAnimation = styled.div`
    animation: ${rotateKeyframes} 10s linear infinite;
`;

export const Header = () => {
  return (
    <HeaderContainer>
        <RotateAnimation>
          <img src={Chainlink} alt="clover" width="60px" height="60px" />
        </RotateAnimation>
        <H1>Welcome to the fair Raffle!</H1>
        <RotateAnimation>
            <Polygon />
        </RotateAnimation>
    </HeaderContainer>
  )
}
