import { useState, useEffect } from 'react'
import { BigNumberish, formatEther } from 'ethers';
import { CONTRACT_ABI, RAFFLE_ADDRESS } from '../constants';
import { useContract } from './use-contract';

export const usePricePool = () => {
    const [pricePool, setPricePool] = useState("");
    const contract = useContract(RAFFLE_ADDRESS, CONTRACT_ABI);

    useEffect(() => {
        if(!contract) {
            return;
        }
        const getPricePool = async () => {
            const balance: BigNumberish = await contract.getPricePool();
            setPricePool(formatEther(balance));
        }
        getPricePool();
        const timer = setInterval(() => getPricePool(), 1000);

        return () => clearInterval(timer);

    }, [contract]);
  return pricePool;
}
