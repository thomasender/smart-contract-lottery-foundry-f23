import { useEffect, useState } from 'react'
import { useContract } from './use-contract'
import { CONTRACT_ABI, POLL_INTERVAL_IN_MS, RAFFLE_ADDRESS } from '../constants';
import { encodeBytes32String } from 'ethers';

export const useCheckUpkeep = () => {
    const contract = useContract(RAFFLE_ADDRESS, CONTRACT_ABI)
    const [upkeepNeeded, setUpkeepNeeded] = useState<boolean>(false);

    useEffect(() => {
        if (!contract) {
            return
        }
        const getCheckUpkeep = async () => {
            const upkeepNeeded = await contract.checkUpkeep(encodeBytes32String("0x0"));
            setUpkeepNeeded(upkeepNeeded.valueOf()[0]);
        }
        getCheckUpkeep()

        const timer = setInterval(() => {
            getCheckUpkeep()
        }, POLL_INTERVAL_IN_MS)

        return () => clearInterval(timer)

    }, [contract])

    return upkeepNeeded
}

