import { useIsCurrentUserRecentWinner } from "../hooks/use-is-current-user-recent-winner"
import { useLastDrawTimestamp } from "../hooks/use-last-draw-timestamp";
import { useRecentWinner } from "../hooks/use-last-winner";
import { Paragraph } from "./styles";
import styled from "styled-components";

const StyledLastDrawInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .last-winner {
        color: ${({ theme }) => theme.colors.lightgreen};
    }
`;

export const LastDrawInfo = () => {
    const recentWinner = useRecentWinner();
    const isCurrentUserRecentWinner = useIsCurrentUserRecentWinner();
    const lastDrawTimestamp = useLastDrawTimestamp();
    const lastDrawDate = lastDrawTimestamp ? new Date(lastDrawTimestamp) : null;

  return (
    <StyledLastDrawInfo>
        {lastDrawDate ? <Paragraph>Last Draw: {lastDrawDate.toLocaleString()} </Paragraph> : null}
        {recentWinner ? <Paragraph className="last-winner">Last Winner: {recentWinner} </Paragraph> : null}
        {isCurrentUserRecentWinner ? <Paragraph>You won the last Raffle! Congratulations!</Paragraph> : null}
    </StyledLastDrawInfo>
  )
}
