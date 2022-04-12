import { ethers } from 'ethers';
import WalletBalance  from '../src/components/WalletBalance';
import { useState, useEffect } from 'react';
import NFT from '../artifacts/contracts/nft.sol/gatoXadrezNFT.json';
import Market from '../artifacts/contracts/MarketXadrez.sol/gatoXadrezMarket.json';
import Web3Modal  from 'web3modal';
import { nftaddress, nftmarketaddres } from '../config/configWallet';
import axios from 'axios';
import { Grid,Box, Flex, Text, Button, GridItem } from '@chakra-ui/react';
import Image from 'next/image'


function Dashboard() {
  const [nfts, setNfts] = useState([])
  const [sold, setSold] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
    console.log(nfts)
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal(
    //     {
    //   network: "mainnet",
    //   cacheProvider: true,
    // }
    )
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const marketContract = new ethers.Contract(nftmarketaddres, Market.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchmyNFTs()
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.config.image,
      }
      return item
    }))
    /* create a filtered array of items that have been sold */
    const soldItems = items.filter(i => i.sold)
    setSold(soldItems)
    setNfts(items)
    setLoadingState('loaded')
  }

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets created</h1>)
  
  return (
  <>
   <Flex 
     width='100vw'
     height={['100vh', '100vh', '100vh', '100vh', '100vh']}
     alignItems='center'
     justifyContent='center'
     bg='red.100'
   >
    <Text> NFT Created  </Text>
            <Grid 
               templateColumns={['1fr', '1fr', '1fr', '1fr', '1fr']}
               templeteRow={['1fr', '1fr', '1fr', '1fr', '1fr']}
               gap={['1rem', '1rem', '1rem', '1rem', '1rem']}
            >
                {nfts.map(nft => (
                   
                    <>
                    <Box 
                    key={nft.tokenId}
                    >
                        <Image src={nft.image || ''} alt={nft.name}
                            width="200px"
                            height="200px">
                            </Image>
                        <Box>
                        <Text>Price - {nft.price} ETH </Text>
                        </Box>
                    </Box>
                    </>
                ))}
                </Grid>            
             
         {Boolean(sold.length) && (

            <>
            <Text> NFT Sold  </Text>
            <Grid
                templateColumns={['1fr', '1fr', '1fr', '1fr', '1fr']}
                templeteRow={['1fr', '1fr', '1fr', '1fr', '1fr']}
                gap={['1rem', '1rem', '1rem', '1rem', '1rem']}
            >
                {
              sold.map((nft, i) => (
                <Box
                key={nft.tokenId}>
                    <Image src={nft.image} alt={nft.name}
                        width="200px"
                        height="200px"></Image>
                    <Box>
                        <Text>Price - {nft.price} ETH </Text>
                    </Box>
                </Box>
                ))
            }
             </Grid>
                </> 
         )}
        </Flex>
        </>
  )
}

export default Dashboard;