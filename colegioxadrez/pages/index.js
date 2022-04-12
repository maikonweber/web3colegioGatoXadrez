import { ethers } from 'ethers';
import WalletBalance  from '../src/components/WalletBalance';
import { useState, useEffect } from 'react';
import NFT from '../artifacts/contracts/nft.sol/gatoXadrezNFT.json';
import Market from '../artifacts/contracts/MarketXadrez.sol/gatoXadrezMarket.json';
import Web3Modal  from 'web3modal';
import { nftaddress, nftmarketaddres } from '../config/configWallet';
import axios from 'axios';
import { Grid,Box ,SimpleGrid, Flex, Text, Button } from '@chakra-ui/react';
import Image from 'next/image'


function Home () {
const [nfts, setNfts] = useState([])
const [loadingState, setLoadingState] = useState('no-loaded');

    async function loadNfts() {
        const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
        const marketContract = new ethers.Contract(nftmarketaddres, Market.abi, provider);
        // Get Signer
       
        // Get Contract
        const data = await marketContract.fetchMarketItems();
       

        const items = await Promise.all(data.map (async i => {
           const tokenUri = await tokenContract.tokenURI(i.tokenId);
            const meta = await axios.get(tokenUri);

         
            // Convert data to JSON
            

           let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
           console.log(items);
            let item = {
                price,
                tokenId : i.tokenId.toNumber(),
                seller: i.seller,
                owner : i.owner,
                image : meta.config.url,
                name : meta.config.name,
                description : meta.data.description
            }
            console.log(item, "item")
            return item
            
        }));
            setNfts(items);
            setLoadingState('loaded');
    }

    

    async function buyNFT(nft) {
        let web3Modal = new Web3Modal();
        let connection = await web3Modal.connect();
        let provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(nftmarketaddres, Market.abi , signer);
        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
        let transaction = await contract.createMarketSale(nftaddress, nft.tokenId, { value : price});
        await transaction.wait();
        loadNfts();
    }


    useEffect(() => {
        loadNfts();
        
    }, [])

    

    return (
        <>
        {loadingState === 'no-loaded' ? (
                    <>
                    <Flex justifyContent="center" alignItems="center" height="30vh">
                    <Text fontSize="lg" fontWeight="bold"> Nenhum NFT Encontrado </Text>
                    </Flex>
                    </>
        ) : (
        <Flex
        width='100vw'
        alignItems='center'
        justifyContent='center'
        bg='red.100'
        >
        <Grid
            templateColumns={['1fr', '1fr', '1fr', '1fr', '1fr']}
            templeteRow={['1fr', '1fr', '1fr', '1fr', '1fr']}
            gap={['1rem', '1rem', '1rem', '1rem', '1rem']}
        >
        {nfts.map(nft => (
            <Box 
                bg='red.200'
                borderRadius='lg'
                boxShadow='lg'
                p={5}
            >
            <Box
            key={nft.tokenId}
            display='flex'
            flexDirection='column'
            >
            <Image 
            width='350px'
            height='350px'
            borderRadius='lg'
            border='1px solid'
            boxShadow='lg'
           ></Image>
            
            <Text fontSize='lg'
            fontWeight='bold'>{nft.name}</Text>
            <Text fontSize='lg'
             fontWeight='bold'>{nft.description}</Text>
             <Box 
             display='flex'
             flexDirection='row'
             p={2}
             marginLeft='auto'

            >
            <Image 
            width='30px'
            height='30px'
            src='/Matic.png.png'>
                  </Image>
            <Text fontSize='lg'
            marginLeft='1rem'
             color='purple.700'
            fontWeight='bold'>{nft.price}</Text>
            </Box>
            <Button onClick={() => buyNFT(nft)}> Comprar </Button>
            </Box>
            </Box>
        ))}
         </Grid>
        </Flex>
            )}
        </>
        )
}
 

export default Home;