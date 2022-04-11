import { ethers } from 'ethers';
import WalletBalance  from '../src/components/WalletBalance';
import { useState, useEffect } from 'react';
import NFT from '../artifacts/contracts/nft.sol/gatoXadrezNFT.json';
import Market from '../artifacts/contracts/MarketXadrez.sol/gatoXadrezMarket.json';
import Web3Modal  from 'web3modal';
import { nftaddress, nftmarketaddres } from '../config/configWallet';
import axios from 'axios';



function Home () {

const [nfts, setNfts] = useState([])
const [loadingState, setLoadingState] = useState('no-loaded');

    async function loadNfts() {
        const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
        const marketContract = new ethers.Contract(nftmarketaddres, Market.abi, provider);
        // Get Signer
       
        // Get Contract

        const data = await marketContract.fetchMarketItems();
        const items = await Promise.all(data.map (async i => {
           const tokenUri = await tokenContract.tokenURI(i.tokenId);
        //    const meta = await axios.get(tokenUri);
        //    let price = ether.utils.formatUnits(i.price.toString(), 'ether');
        //     let item = {
        //         price,
        //         tokenId : i.tokenId.toNumber(),
        //         seller: i.seller,
        //         owner : i.owner,
        //         image : meta.data.image,
        //         name : meta.data.name,
        //         description : meta.data.description
        //     }
        //     return item;
        }));
        setNfts(items);
        setLoadingState('loaded');
        const tokenUri = await tokenContract.tokenURI(i.tokenId);

    // }
    }

    async function buyNFT(nft) {
        web3Modal = new Web3Modal();
        connection = await web3Modal.connect();
        provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = ethers.Contract(nftmarketaddres, Market.abi , signer);
        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
        transaction = await contract.createMarketSale(nftaddress, nft, tokenId, {
            value : price,

        });
        await transaction.wait();
        loadNfts();
    }


    useEffect(() => {
        loadNfts();
        
    }, [])

    if (loadingState === 'no-loaded' && !nfts.length) return (
        <div>
        
        </div>
    )


    return (
        <div>
            <h3> Welcome to the Home Page </h3>
            <WalletBalance />
            <h1> School NFT </h1>
        </div>
        )
    }


    

export default Home;