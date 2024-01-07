import styled, {keyframes} from 'styled-components'
import { Polygon } from '../icons/polygon'

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  gap: 24px;

  h1 {
    font-size: 2rem;
  }
`

const rotate = keyframes`
    from {
        transform: rotateY(0deg);
    }
    to {
        transform: rotateY(359deg);
    }
`

const RotatingPolygon = styled.div`
    animation: ${rotate} 10s linear infinite;
`;

export const Header = () => {
  return (
    <HeaderContainer>
        <h1>Proovably FAIR Raffle!</h1>
        <RotatingPolygon>
            <Polygon />
        </RotatingPolygon>
    </HeaderContainer>
  )
}
