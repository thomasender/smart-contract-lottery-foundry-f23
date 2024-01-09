import { ETHERSCAN_POLYGON_ADDRESS_BASE_URL } from "../constants";
import { useIsCurrentUserRecentWinner } from "../hooks/use-is-current-user-recent-winner"
import { useLastDrawTimestamp } from "../hooks/use-last-draw-timestamp";
import { useRecentWinner } from "../hooks/use-recent-winner";
import { Polygon } from "../icons/polygon";
import { sliceAddress } from "../utils";
import { InfoBoxBordered, P } from "./styles";
import styled from "styled-components";

const StyledLastDrawInfo = styled(InfoBoxBordered)`
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
          <P className="last-winner">See Last Winner on Polyscan <Polygon /></P> 
          <a href={ETHERSCAN_POLYGON_ADDRESS_BASE_URL + recentWinner}><P className="last-winner">{sliceAddress(recentWinner)}</P></a>
        </>
        : null}
    </StyledLastDrawInfo>
  )
}
