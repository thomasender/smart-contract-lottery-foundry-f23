import { useState, useEffect } from 'react'
import { CONTRACT_ABI, RAFFLE_ADDRESS } from '../constants';
import { useContract } from './use-contract';

export const useRecentWinner = () => {
    const [recentWinner, setRecentWinner] = useState("");
    const contract = useContract(RAFFLE_ADDRESS, CONTRACT_ABI);

    useEffect(() => {
        if(!contract) {
            return;
        }
        const getLastWinner = async () => {
            const recentWinner = await contract.getRecentWinner();
            setRecentWinner(recentWinner);
        }
        getLastWinner();
        const timer = setInterval(() => getLastWinner(), 5000);

        return () => clearInterval(timer);

    }, [contract]);
  return recentWinner;
}
