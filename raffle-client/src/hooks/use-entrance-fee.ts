import { useState, useEffect } from 'react'
import { useContract } from './use-contract';
import { BigNumberish, formatEther } from 'ethers';
import { CONTRACT_ABI, RAFFLE_ADDRESS } from '../constants';

export const useEntranceFee = () => {
    const contract = useContract(RAFFLE_ADDRESS, CONTRACT_ABI);
    const [price, setPrice] = useState("");

    useEffect(() => {
        if(!contract) {
            return;
        }
        const getEntranceFee = async () => {
            const entranceFee: BigNumberish = await contract.getEntranceFee();
            setPrice(formatEther(entranceFee));
        }

        getEntranceFee();
    }, [contract]);
  return parseFloat(price);
}
