import React, { useContext, useEffect, useState } from 'react'
import { useAccount, useContract, useSigner } from 'wagmi'
import { useRouter } from 'next/router';
import { Navbar } from '../components/Navbar'
import {powersNftAddress} from '../web3'
import powersabi from '../artifacts/contracts/Powers.sol/Powers.json'
import { StoreContext } from '../store/storeProvider'
import { ethers } from 'ethers'
import { ModalLoading } from '../components/ModalLoading'
import { ModalSell } from '../components/ModalSell'
import Image from 'next/image'
import axios from 'axios';
import Link from "next/link";

const Mint = () => {
    const [, setOpenConnect] = useContext(StoreContext);
    const [{ data: signer }] = useSigner();
    const [{ data: account }] = useAccount();
    const router = useRouter();
    const [isTokenMinted, setIsTokenMinted] = useState(false);
    const [meta, setMeta] = useState({});
    const [strength, setStrength] = useState(0)

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

    useEffect(()=>{
        if(!isTokenMinted) {
            setMeta({});
            setStrength(0);
        }
    }, [isTokenMinted])

    const fetchTokenData = async(tokenId) => {
        const tokenUri = await powerInstance.tokenURI(tokenId)
        const {data} = await axios.get(`https://ipfs.io/ipfs/${tokenUri}`)
        setMeta(data)
        const strengthRaw = await powerInstance.tokenIdToPowerAmount(tokenId);
        setStrength(strengthRaw.toNumber());
    }

    const handleMint = async(e) => {
        e.preventDefault();
            if( account ) {
                const mintFee = ethers.utils.parseEther('0.0001');
                try {
                    setLoadingGamble(true)
                    const tx = await powerInstance.requestNft( {value: mintFee})
                    const transaction = await tx.wait()
                    console.log(transaction)

                    setTransactionStatus({
                        status: 200,
                        errorMessage: ''
                    })
                    router.replace(`/mint`)
                    const filter = powerInstance.filters.Transfer(null, account.address);
                    powerInstance.once(filter, async(from, minter, tokenId) => {
                        if(minter == account.address) {
                            await fetchTokenData(tokenId);
                            setLoadingGamble(false);
                            setIsTokenMinted(true);   
                        }
                    });
                } catch (err) {
                    console.log(err)
                    setTransactionStatus({
                        status: 400,
                        errorMessage: err.message
                    })
                }
                // setLoadingGamble(false)
            } else {
                setOpenConnect(true)
            }
    }

    return (
        <>
        <Navbar />
        <main>
            <div className='sm:container mx-auto'>
                <button className='h-9 text-white font-medium bg-green-500 hover:brightness-110 active:brightness-95 px-5 py-1 rounded mt-2' onClick={handleMint}>Mint NFT</button>
            </div>
            {
                loadingGamble &&
                <ModalLoading
                    setLoadingGamble={setLoadingGamble}
                />
            }
            {
                isTokenMinted &&
                <ModalSell
                    setOpenSellModal={setIsTokenMinted}
                >
                    <div>
                        <p className='mb-12 font-semibold text-green-600 text-center text-3xl'>Congratulations!</p>
                        <p className='mb-4 font-semibold text-black-600 text-center text-xl'>Power minted:</p> 
                    </div>
                    <div className='h-full border-t border-neutral-500'>
                        <div className='text-center text-lg border-b border-x border-neutral-500 py-1'>
                            <p className='font-semibold'>{meta.name}</p>  
                        </div>
                        <div className='w-full h-1/2 relative border-b border-x border-neutral-500'>
                            {meta.image && <Image src={`https://ipfs.io/ipfs/${meta.image}`} alt="image of the NFT" layout={'fill'} objectFit="contain"/>}
                        </div>
                        <div className='w-auto text-center py-2 border-b border-x border-neutral-500'>
                            <p className='text-medium'>Strength: {strength}</p>    
                            <p className='text-medium'>{meta.description}</p>
                        </div>
                    </div>
                    <Link href={'/my-nfts'}>
                            <a className='mx-auto mt-auto mb-8 w-1/4 mt-2 px-5 py-1.5 font-medium text-center  bg-green-500 text-white hover:brightness-110 active:brightness-95'>Go to MyNFTs</a>
                    </Link>
                </ModalSell>
            }
        </main>
        </>
    )
}

export default Mint