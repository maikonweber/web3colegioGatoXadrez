import { useState } from 'react'
import { ethers } from 'ethers'
import { useEffect } from 'react';
import {
    Button,
    Box,
    Flex,
} from '@chakra-ui/react';

function WalletBalance() {
    const [balance, setBalance] = useState('')

    useEffect(() => {
        
    }, [balance])

    const getBalance = async () => {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        const balance = await provider.getBalance(account)

        setBalance(ethers.utils.formatEther(balance))

        useEffect(() => {
            console.log(balance)
        }, [balance])
    };

    return (
        <div className='card'>
            <div>
                <h3> Wallet Balance {balance} </h3>
                <Button onClick={() => getBalance()}> Get Balance </Button>
            </div>
        </div>
    )

};

export default WalletBalance;