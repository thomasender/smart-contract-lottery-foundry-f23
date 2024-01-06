import { useEffect, useState } from 'react'
import { usePlayers } from './use-players'
import { useSigner } from './use-signer';

export const useTicketsForCurrentUser = () => {
    const players = usePlayers();
    const signer = useSigner();
    const currentPlayerAddress = signer?.address;
    const [ticketsForCurrentPlayer, setTicketsForCurrentPlayer] = useState<number>(0);

    useEffect(() => {
        if (!players || !currentPlayerAddress) {
            return
        }
        let tickets = 0;
        // Every time the currentPlayerAddress is present in the players array, increment tickets by 1
        players.forEach((player) => {
            if (player === currentPlayerAddress) {
                tickets++;
            }
        })

        setTicketsForCurrentPlayer(tickets);
    }, [players, currentPlayerAddress])
  return ticketsForCurrentPlayer
}
