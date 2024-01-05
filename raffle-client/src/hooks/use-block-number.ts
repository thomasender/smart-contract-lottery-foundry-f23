import { useEffect, useState } from 'react'
import { useProvider } from './use-provider'
import { POLL_INTERVAL_IN_MS } from '../constants';

export const useBlockNumber = () => {
    const [blockNumber, setBlockNumber] = useState<number>(0)
    const provider = useProvider();

    useEffect(() => {
        if (!provider) {
            return
        }
        const getBlockNumber = async () => {
            const blockNumber = await provider.getBlockNumber();
            setBlockNumber(blockNumber);
        }
        getBlockNumber()

        const timer = setInterval(() => {
            getBlockNumber()
        }, POLL_INTERVAL_IN_MS)

        return () => clearInterval(timer)
    }, [provider])

  return blockNumber
}
