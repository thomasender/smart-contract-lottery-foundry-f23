import styled from "styled-components";
import { useTicketsForCurrentUser } from "../hooks/use-tickets-for-current-user";
import { P } from "./styles";
import { useSigner } from "../hooks/use-signer";
import { useEntranceFee } from "../hooks/use-entrance-fee";

const StyledPlayerInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.colors.lightgreen};
    box-shadow: 0 0 12px ${({ theme }) => theme.colors.lightgreen};
`;

export const PlayerInfo = () => {
    const ticketsForPlayer = useTicketsForCurrentUser();
    const signer = useSigner();
    const entranceFee = useEntranceFee();

    if (!signer) {
      return null
    }
  return (
    <StyledPlayerInfo>
        {ticketsForPlayer > 0 ? <P>You have {ticketsForPlayer} ticket(s) for the next draw!</P> : <P>You have no tickets for the next draw!</P>}
        <P>Buy {ticketsForPlayer > 0 ? 'more' : null} ticket(s) now for {entranceFee} Matic</P>
    </StyledPlayerInfo>
  )
}
