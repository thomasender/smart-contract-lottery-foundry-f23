import { useEffect, useState } from 'react'
import { useContract } from './use-contract'
import { CONTRACT_ABI, POLL_INTERVAL_IN_MS, RAFFLE_ADDRESS } from '../constants';

/**
 * 
 * @returns timestampTillNextDraw in milliseconds
 */
export const useLastDrawTimestamp = () => {
    const contract = useContract(RAFFLE_ADDRESS, CONTRACT_ABI)
    const [lastDrawTimestamp, setLastDrawTimestamp] = useState<number>(0);

    useEffect(() => {
        if (!contract) {
            return
        }
        const getCheckUpkeep = async () => {
            const lastDrawTimestamp = await contract.getLastDrawTimestamp();
            setLastDrawTimestamp(Number(lastDrawTimestamp));
        }
        getCheckUpkeep()

        const timer = setInterval(() => {
            getCheckUpkeep()
        }, POLL_INTERVAL_IN_MS)

        return () => clearInterval(timer)

    }, [contract])

    return lastDrawTimestamp * 1000
}

