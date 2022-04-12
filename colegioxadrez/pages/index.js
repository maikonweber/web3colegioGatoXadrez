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
                name : meta.data.name,
                description : meta.data.description
            }
            console.log(item, "item")
            return item
            
        }));
            setNfts(items);
            setLoadingState('loaded');

    }

    // if(loadingState === 'no-loaded' && !nfts.length) return ( 
        // <>
        // {/* <Flex justifyContent="center" alignItems="center" height="30vh">
        // <Text fontSize="lg" fontWeight="bold"> Nenhum NFT Encontrado </Text>
        // </Flex> */}

        // </>
        // )
       

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
        console.log(nfts)
    }, [])

    

    return (
        <>
        <Flex
        width='100vw'
        height={['100vh', '100vh', '100vh', '100vh', '100vh']}
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
            key={nft.tokenId}
            display='flex'
            flexDirection='column'
            >
            <Image 
            width='350px'
            height='350px'
            src={nft.image}></Image>
            <Text fontSize='lg' fontWeight='bold'>{nft.name}</Text>
            <Text fontSize='lg' fontWeight='bold'>{nft.description}</Text>
            <Text fontSize='lg' fontWeight='bold'>{nft.price}</Text>
            <Button onClick={() => buyNFT(nft)}> Comprar </Button>
            </Box>
        ))}
         </Grid>
        </Flex>
        </>
        )
}
 

export default Home;