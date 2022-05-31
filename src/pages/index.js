import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { Navbar } from '../components/Navbar'
import powersabi from '../artifacts/contracts/Powers.sol/Powers.json'
import marketabi from '../artifacts/contracts/NFTMarket.sol/NftMarketplace.json'
import provider, {powersNftAddress, NftMarketplaceAddress} from '../web3'
import {TokenContainerMarket} from '../components/TokenContainerMarket'
import Head from 'next/head';



const Home = ({nftsData}) => {
    
    return(
        <>
            <Head>
                <title>Marketplace</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="shortcut icon" href="/superpower.png" />
            </Head>
            <Navbar />
            <main className='py-8'>
                <div className='flex flex-wrap sm:container mx-auto'>
                    {nftsData?.map((nftData) => 
                        <TokenContainerMarket 
                            key={nftData.tokenId}
                            nftData={nftData}
                        />
                    )}
                </div>
            </main>
        </>
    )
}

export default Home

export async function getServerSideProps() {
    const powerInstance = new ethers.Contract(powersNftAddress, powersabi.abi, provider);
    const marketInstance = new ethers.Contract(NftMarketplaceAddress, marketabi.abi, provider)
    const totalNfts = await powerInstance.getTokenCounter();
    let listedTokens = [];
    for (let i = 0; i < totalNfts.toNumber(); i++) {
        const getListedData = await marketInstance.getListing(powersNftAddress, i);
        if (getListedData.price > 0) {
            listedTokens.push(i);
        }
    }

    const nftsData = await Promise.all(listedTokens.map( async( tokenId ) => {
        const tokenUri = await powerInstance.tokenURI(tokenId);
        const response = await fetch(`https://ipfs.io/ipfs/${tokenUri}`)
        const meta = await response.json()
        const strengthRaw = await powerInstance.tokenIdToPowerAmount(tokenId);
        const getListing = await marketInstance.getListing(powersNftAddress, tokenId);
        const price = ethers.utils.formatEther(getListing.price)
        
        const object = {
            tokenId,
            meta,
            strength: strengthRaw.toNumber(),
            seller: getListing.seller,
            price: price
        }
        return (JSON.parse(JSON.stringify(object)))
    }))

    return {
      props: {
        nftsData
      }, // will be passed to the page component as props
    }
  }