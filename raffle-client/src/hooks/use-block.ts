import { useEffect, useState } from 'react'
import { useProvider } from './use-provider'
import { POLL_INTERVAL_IN_MS } from '../constants';
import { useBlockNumber } from './use-block-number';
import { Block } from 'ethers';

export const useBlock = () => {
    const [block, setBlock] = useState<Block | null>()
    const provider = useProvider();
    const blockNumber = useBlockNumber();

    useEffect(() => {
        if (!provider) {
            return
        }
        const getBlock = async () => {
            const block = await provider.getBlock(blockNumber);
            setBlock(block);
        }
        getBlock()

        const timer = setInterval(() => {
            getBlock()
        }, POLL_INTERVAL_IN_MS)

        return () => clearInterval(timer)
    }, [blockNumber, provider])

  return block
}
