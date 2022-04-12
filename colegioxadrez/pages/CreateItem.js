import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
const { create } =  require('ipfs-http-client');
import { useRouter } from 'next/router';
import NFT from '../artifacts/contracts/nft.sol/gatoXadrezNFT.json';
import Market from '../artifacts/contracts/MarketXadrez.sol/gatoXadrezMarket.json';
import Web3Modal from 'web3modal';
import { ifs , Project , projectSecret, nftaddress, nftmarketaddres } from '../config/configWallet';
const client = create('https://ipfs.infura.io:5001/api/v0');
import { Grid,Box,Button, Input, Textarea  ,SimpleGrid, Flex, Text } from '@chakra-ui/react';
import pkg from 'multiaddr';
import Image from 'next/image';



const { Multiaddr } = pkg;

export function CreateItem() {
   
    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, updateFormInput] = useState({price: '', description: ''});
    const router =  useRouter();

    async function onChange(e) {
        const file = e.target.files[0]
        try {
                const added = await client.add(
                    file,
                    {
                        progress: (prog) => console.log(`received: ${prog}`)
                    }

                    );
                    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
                    setFileUrl(url);
                } catch (err) {
                    console.log(err)
                }
        }

      async function createItem() {
          const { name, description, price } = formInput;

          console.log(formInput)

          if(!name || !description || !price || !fileUrl) {
              alert('error');
            return     
          }
            const data = JSON.stringify({
                    name,
                    description,
                    image: fileUrl
                });

                console.log(data)
            
                try {
                    const added = await client.add(data);

                    console.log(added)

                    const url = `https://ipfs.infura.io:5001/${added.path}`;
                    console.log(url)
                    createSale(url)
                } catch (err) {
                    console.log("Error: ", err)
                    }
                }

        async function createSale() {
            const web3 = new Web3Modal()
            const connection = await web3.connect()
            const provider = new ethers.providers.Web3Provider(connection)
            const signer = provider.getSigner()
            let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
            let transaction = await contract.createToken(fileUrl);
            let tx = await transaction.wait();
            console.log('Transaction', tx)
            let event = tx.events[0];
            let value = event.args[2];
            let tokenId = value.toNumber();

            const price =  ethers.utils.parseUnits(formInput.price, 'ether');
          
            contract = new ethers.Contract(nftmarketaddres, Market.abi, signer);

            let listingPrice = await contract.getListingPrice();
            listingPrice = listingPrice.toString();
            console.log('listingPrice', listingPrice)
            transaction = await contract.createMarketItem(nftaddress, tokenId, price, {value: listingPrice})

            await transaction.wait();
            router.push('/');
    }
        return  (
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
                    mt={7}
               >
                </Input>
                <Textarea
                    placeholder='Description'
                    onChange={e => updateFormInput({...formInput, description: e.target.value})}
                    mt={7}
                >

                </Textarea>
                <Input
                    placeholder='Price'
                    onChange={e => updateFormInput({...formInput, price: e.target.value})}
                    mt={7}
                >
                </Input>
                <Input 
                    type='file'
                    name='Asset'
                    onChange={onChange}
                    mt={7}
                                    >
                </Input>
                {
                    fileUrl && (<Image 
                    src={fileUrl} 
                    width='450px'
                    height='450px'

                    
                    />
                    )
                }
                <Button 
                    onClick= {createItem}
                    bg='blue.500'
                    width='100%'
                    mt={7}
            
                    >
                        Create NFT
                    </Button>
            </Box>
            </Flex>
            </>
        )
}

export default CreateItem;

