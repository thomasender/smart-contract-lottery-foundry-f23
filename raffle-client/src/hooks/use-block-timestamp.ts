import { useEffect, useState } from 'react'
import { useBlock } from './use-block';

export const useBlockTimestamp = () => {
    const [blockTimestamp, setBlockTimestamp] = useState<number>()
    const block = useBlock();

    useEffect(() => {
        if (!block) {
            return
        }
            setBlockTimestamp(block.timestamp);
   
    }, [block])

  return blockTimestamp
}
