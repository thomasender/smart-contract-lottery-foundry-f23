import { useEffect, useState } from 'react'
import { useRecentWinner } from './use-last-winner'
import { useSigner } from './use-signer';

export const useIsCurrentUserRecentWinner = () => {
    const recentWinner = useRecentWinner();
    const signer = useSigner();
    const [isCurrentUserRecentWinner, setIsCurrentUserRecentWinner] = useState(false);

    useEffect(() => {
        if (!recentWinner || !signer) {
            return;
        }
        const checkIfCurrentUserIsRecentWinner = async () => {
            setIsCurrentUserRecentWinner(signer.address === recentWinner);
        }
        checkIfCurrentUserIsRecentWinner();
    }, [recentWinner, signer])
  return isCurrentUserRecentWinner
}
