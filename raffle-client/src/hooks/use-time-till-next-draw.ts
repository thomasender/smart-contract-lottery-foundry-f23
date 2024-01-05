import { useEffect, useState } from 'react';
import { NEXT_DRAW_INTERVAL_IN_MS } from '../constants';
import { useLastDrawTimestamp } from './use-last-draw-timestamp';

/**
 * @returns timestampTillNextDraw in milliseconds
 */
export const useTimestampTillNextDraw = () => {
    const lastDrawTimestamp = useLastDrawTimestamp();
    const [timestampTillNextDraw, setTimestampTillNextDraw] = useState<number>(0);

    useEffect(() => {
        if (!lastDrawTimestamp) {
            setTimestampTillNextDraw(0)
            return
        } else {
            setTimestampTillNextDraw(lastDrawTimestamp + NEXT_DRAW_INTERVAL_IN_MS)
        }
    }, [lastDrawTimestamp])

  return timestampTillNextDraw
}
