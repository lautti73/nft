import React, { useContext, useEffect, useState } from 'react'
import { useAccount, useContract, useSigner } from 'wagmi'
import { useRouter } from 'next/router';
import { Navbar } from '../components/Navbar'
import {powersNftAddress} from '../web3'
import powersabi from '../artifacts/contracts/Powers.sol/Powers.json'
import { StoreContext } from '../store/storeProvider'
import { ethers } from 'ethers'
import { ModalLoading } from '../components/ModalLoading'
import { TokenContainer } from '../components/TokenContainer';

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
            <Navbar />
            <main>
                <div className='flex sm:container mx-auto'>
                    {
                        myNfts?.map( tokenId => 
                            <TokenContainer
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