import { useEffect, useState } from 'react'
import { useContract } from './use-contract'
import { CONTRACT_ABI, POLL_INTERVAL_IN_MS, RAFFLE_ADDRESS } from '../constants';

export const usePlayers = () => {
    const contract = useContract(RAFFLE_ADDRESS, CONTRACT_ABI)
    const [players, setPlayers] = useState<string[]>([]);

    useEffect(() => {
        if (!contract) {
            return
        }
        const getPlayers = async () => {
            const players = await contract.getPlayers();
            // remove duplicates
            const fundersArray = Array.from(new Set(players)) as string[];
            setPlayers(fundersArray)
        }
        getPlayers()

        // Poll for new players
        const timer = setInterval(() => {
            getPlayers()
        }, POLL_INTERVAL_IN_MS)

        return () => clearInterval(timer)
    }, [contract])

    return players
}

