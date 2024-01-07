import { ETHERSCAN_POLYGON_ADDRESS_BASE_URL } from "../constants";
import { useIsCurrentUserRecentWinner } from "../hooks/use-is-current-user-recent-winner"
import { useLastDrawTimestamp } from "../hooks/use-last-draw-timestamp";
import { useRecentWinner } from "../hooks/use-last-winner";
import { sliceAddress } from "../utils";
import { P } from "./styles";
import styled from "styled-components";

const StyledLastDrawInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.colors.lightgreen};
    box-shadow: 0 0 12px ${({ theme }) => theme.colors.lightgreen};

    .last-winner {
        color: ${({ theme }) => theme.colors.lightgreen};
    }
`;

export const LastDrawInfo = () => {
    const recentWinner = useRecentWinner();
    const isCurrentUserRecentWinner = useIsCurrentUserRecentWinner();
    const lastDrawTimestamp = useLastDrawTimestamp();
    const lastDrawDate = lastDrawTimestamp ? new Date(lastDrawTimestamp) : null;

    if(!lastDrawTimestamp || !lastDrawDate || !recentWinner) {
        return null;
    }
  return (
    <StyledLastDrawInfo>
        {lastDrawDate ? <>
        <P>Last Draw:</P>
        <P>{lastDrawDate.toLocaleString()}</P> 
        </>
        : null}
        {isCurrentUserRecentWinner ? <P className="last-winner">You won the last Raffle! Congratulations!</P> : null}
        {recentWinner ? <>
          <P className="last-winner">See Last Winner on Polyscan</P> 
          <a href={ETHERSCAN_POLYGON_ADDRESS_BASE_URL + recentWinner}><P className="last-winner">{sliceAddress(recentWinner)}</P></a>
        </>
        : null}
    </StyledLastDrawInfo>
  )
}
