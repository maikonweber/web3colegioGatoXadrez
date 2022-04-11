import { useState } from 'react';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import NFT from '../artifacts/contracts/nft.sol/gatoXadrezNFT.json';
import Market from '../artifacts/contracts/MarketXadrez.sol/gatoXadrezMarket.json';
import Web3Modal from 'web3modal';
import { ifs , Project , projectSecret } from '../config/configWallet';
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');
import { Grid,Box, Input, Textarea  ,SimpleGrid, Flex, Text, Image } from '@chakra-ui/react';
import {
    nftaddress, nftmarketaddres,
} from '../config/configWallet';

export default function Create-GridItem () {
    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, updateFormInput] = useState({price: '', description: ''});
    const router =  useRouter();

    async function onChange(e) {
        const file = e.target.file[0]
        try {
                const added = await client.add(
                    file,
                    {
                        progress: (prog) => console.log(`received: ${prog}`)
                    }

                    );
                    const url = `https://ipfs.infure.io/ipfs/${added.path}`;
                    setFileUrl(url);
                } catch (err) {
                    console.log(err)
                }
        }

      async function createItem() {
          const { name, description, price } = formInput;

          if(!name || !description || !price || fileUrl) {
            return     
          }
            const data = JSON.stringify({
                    name,
                    description,
                    image: fileUrl
                });

                try {
                    const added = await client.add(data);
                    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
                    createSale(url)
                } catch (err) {
                    console.log("Error: ", err)
                    }
                }

        async function createSale() {
            const web3 = new Web3Modal()
            const connection = await web3.connect()
            const provider = connection.providers.Web3Provider(connection)
            const signer = provider.getSigner()
            let marketContract = new ethers.Contract(nftmarketaddres, NFT.abi, provider)
            let transaction = await marketContract.createSale(url);
            let tx = await transaction.wait();
            let event = tx.events[0];
            let values = tx.events[0];
            let tokenId = value.toNumber();

            const price =  ethers.utils.parseUnits(formInput.price, 'ether');
          
            contract = ethers.Contract(nftmarketaddres, Market.abi, signer);

            let listingPrice = await contract.getListingPrice();
            listingPrice = listingPrice.toString();
            transaction = await contract.creteMarketItem()(nftaddress, tokenId, price, {
                value : listingPrice})

            await transaction.wait();
            router.push('/');
    }
        return (
            <>
            <Flex
            width='100vw'
            height={['100vh', '100vh', '100vh', '100vh', '100vh']}
            alignItems='center'
            justifyContent='center'
            >
            <Box
            width={['100%', '100%', '100%', '100%', '100%']}
            maxWidth={['400px', '400px', '400px', '400px', '400px']}
            bg='white'
            borderRadius='lg'
            boxShadow='lg'
            p={4}
            >
                <Input 
                    placeholder='Asset Name'
                    onChange={e => updateFormInput({...formInput, name: e.target.value})}
                >
                </Input>
                <Textarea
                    placeholder='Description'
                    onChange={e => updateFormInput({...formInput, description: e.target.value})}
                >

                </Textarea>
                <Input
                    placeholder='Price'
                    onChange={e => updateFormInput({...formInput, price: e.target.value})}
                >
                </Input>
                <Input 
                    type='file'
                    name='Asset'
                    onChange={onChange}

                >
                
                </Input>
                {
                    fileUrl && (<Image 
                    src={fileUrl} 
                    width={350}
                    height={500} />
                    )
                }
                
                <Button 
                    onClick={createItem}
                    variantColor='blue'
                    isLoading={isLoading}
                    isDisabled={isLoading}

                    >
                        Create NFT
                    </Button>
            </Box>
            </Flex>
            </>
        )
}

