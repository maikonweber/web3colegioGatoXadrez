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


export default function MyAssets() {
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
  
    useEffect(() => {
      loadNFTs()
    }, [])
  
    async function loadNFTs() {
      // const web3Modal = new Web3Modal({
      //   network: "mainnet",
      //   cacheProvider: true,
      // })
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
        
      const marketContract = new ethers.Contract(nftmarketaddres, Market.abi, signer)
      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
      const data = await marketContract.fetchMyNFTs()
      
      const items = await Promise.all(data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
        }
        return item
      }))
      setNfts(items)
      setLoadingState('loaded') 
    }
    if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets owned</h1>)
    return (
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
            {
              nfts.map((nft, i) => (
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
                             src={nft.image}
                              // blurDataURL="data:..." automatically provided
                              // placeholder="blur" // Optional blur-up while loading
                            />
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
                    </Box>
              ))
            }
            </Grid>
        </Flex>
    )
  }

  