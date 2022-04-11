import { ethers } from 'ethers';
import WalletBalance  from './WalletBalance';
import { useState, useEffect } from 'react';
import NFT from '../../artifacts/contracts/nft.sol/gatoXadrezNFT.json';
import Market from '../../artifacts/contracts/MarketXadrez.sol/gatoXadrezMarket.json';
// import Web3Modal = require('web3modal');
import { nftaddress, nftmarketaddres } from '../../config.js';

function Home () {
const [totalMinted, setTotalMited] = useState(0)
const [nfts, setNfts] = useState([])
const [loadingState, setLoadingState] = useState('no-loaded');

if(typeof window != 'undefined'){
const provider = new ethers.providers.Web3Provider('http://172.24.19.158:8545');
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, schooNFT.abi, signer)

async function loadNfts() {
    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(nftmarketaddres, Market.abi, provider);
    const data = await marketContract.fetchMarketItems();
}

}

 


    useEffect(() => {
        getCount();
        
    }, [])

    const getCount = async () => {
        const count = await contract.totalSupply()
        setTotalMited(parseInt(count))
    }


    return (
        <div>
            <h3> Welcome to the Home Page </h3>
            <WalletBalance />
            <h1> School NFT </h1>
                {
                    Array(totalMinted + 1).fill(0).map((_, index) => {
                        <div key={index}>
                            <NFTimage tokenId={index} >
                            </NFTimage>
                            </div>

                    })}
        </div>
    )
}


function NFTimage ({ tokenId, getCount}) {
    const contentId = 'QmP3QHdVXvFTEX2rhNY2sTZaGGXGhtrQPfE8bFFdGiDU8Z';
    const metadataUri = `${contentId}/#{tokenId}.json`;
    const imageUri = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;

    const [isMinted, setIsMinted] = useState(false);
        
    useEffect(() => {
        getMintedStatus();

    }, [isMinted])


    const getMintedStatus = async () => {
        const isMinted = await contract.isContentOwned(metadataUri)
         console.log(isMinted)

    };

    const mintToken = async () => {
        const connection = contract.connect(signer);
        const addr = connection.address;
        const result = await contract.payToMint(addr, metadataUri, {
            value: ethers.utils.parseEther('0.05')
        });

        await result.wait()
        getMintedStatus();
        
    };

    async function getURI() {
        const uri = await contract.tokenURI(tokenId);
        console.log(uri);
    }

    return (
        <div>
            <img src={imageUri} alt={tokenId} />
            <button onClick={() => getURI()}> Get URI </button>
                <div>
                    <h5> ID #{tokenid} </h5>
                    {
                        isMinted ? (
                            <button onClick={() => getURI()}> Get URI </button>
                        ) : (
                            <button onClick={() => mintToken()}> Mint Token </button>
                        )
                    }
                </div>
        </div>

    )
}

export default Home;