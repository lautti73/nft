import React, { useContext, useEffect, useState } from 'react'
import { useAccount, useContract, useSigner } from 'wagmi'
import { useRouter } from 'next/router';
import { Navbar } from '../components/Navbar'
import {powersNftAddress} from '../web3'
import powersabi from '../artifacts/contracts/Powers.sol/Powers.json'
import { StoreContext } from '../store/storeProvider'
import { ethers } from 'ethers'
import { ModalLoading } from '../components/ModalLoading'
import { TokenContainerMyNfts } from '../components/TokenContainerMyNfts';
import Head from 'next/head';

const MyNfts = () => {
    // const [totalNfts, setTotalNfts] = useState(0);
    const [myNfts, setMyNfts] = useState([]);

    const [{logged}, setOpenConnect] = useContext(StoreContext);
    const [{ data: signer }] = useSigner();
    const [{ data: account }] = useAccount();
    const router = useRouter();

    const powerInstance = useContract({
        addressOrName: powersNftAddress,
        contractInterface: powersabi.abi,
        signerOrProvider: signer
    });

    const [loadingGamble, setLoadingGamble] = useState(false)

    const [transactionStatus, setTransactionStatus] = useState({
        status: 0,
        errorMessage: ''
    })

    useEffect(() => {
        if(signer) {
            fetchMyTokens()
        }
    }, [signer])

    const fetchMyTokens = async() => {
        const totalTokensRaw = await powerInstance.getTokenCounter();
        const totalTokens = totalTokensRaw.toNumber()
        for(let i = 0; i < totalTokens; i++ ) {
            const owner = await powerInstance.ownerOf(i);
            if(owner == account.address) {
                setMyNfts(oldArray => [...oldArray, i])
            }
        }
    }
    
    return (
        <>
            <Head>
                <title>My NFTs</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link rel="shortcut icon" href="/superpower.png" />
            </Head>
            <Navbar />
            
            <main className='py-8'>
                <div className='flex flex-wrap sm:container mx-auto'>
                    {
                        !signer && <p className='text-center font-semibold'>Please login to see your NFTs</p>
                    }
                    {
                        (myNfts.length == 0 && signer) && <p className='text-center font-semibold'>There is not NFTs to show</p>
                    }
                    {
                        myNfts?.map( tokenId => 
                            <TokenContainerMyNfts
                                key={tokenId}
                                tokenId={tokenId}
                            /> 
                        )
                    }
                </div>
            </main>
        </>
    )
}

export default MyNfts