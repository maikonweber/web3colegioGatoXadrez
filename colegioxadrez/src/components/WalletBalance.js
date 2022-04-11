import { useState } from 'react'
import { ethers } from 'ethers'
import { useEffect } from 'react';
import {
    Button,
    Box,
    Flex,
    Image,
    Badge,
    Avatar,
    Text
} from '@chakra-ui/react';



function WalletBalance() {
    const [balance, setBalance] = useState('')

 
    const getBalance = async () => {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        const balance = await provider.getBalance(account)

        setBalance(ethers.utils.formatEther(balance))

    };

    useEffect(() => {

    }, [balance])



    return (
        <>
        <Flex >
        <Flex 
        bg='red.700'
        width='100%'
        height={['50px', '50px', '50px', '50px', '50px']}
        alignItems='right'

        >
  <Image src='/Matic.png.png' 
    width='30px'
    height='30px'
    marginLeft='10px'
    marginTop='8px'
  />
  <Box ml='3'>
    <Text fontSize='xm'
    fontWeight='bold'
    color='white'
    marginTop='11px'
    >
       {balance}</Text>
  </Box>
</Flex>
                <Button 
                bg={'orange.200'}
                position='relative'
                top={'5px'}
                left={'-10px'}
                onClick={() => getBalance()}>
                    <Image
                    src='/Metamask-logo.png'
                    width={'120px'}
                    alt='Metamask'


                />  
                   </Button>
                   </Flex>

        </>
    )

};

export default WalletBalance;