import React, { useContext, useEffect, useState } from 'react'
import { ModalLoading } from './ModalLoading'
import { ModalSell } from './ModalSell'
import Image from 'next/image'
import { useAccount, useContract, useProvider, useSigner } from 'wagmi'
import powersabi from '../artifacts/contracts/Powers.sol/Powers.json'
import marketabi from '../artifacts/contracts/NFTMarket.sol/NftMarketplace.json'
import provider, {powersNftAddress, NftMarketplaceAddress} from '../web3'
import { ethers } from 'ethers'
import { StoreContext } from '../store/storeProvider'

export const TokenContainerMarket = ({nftData}) => {
    const [{logged}, setOpenConnect] = useContext(StoreContext);
    const [{ data: signer }] = useSigner();
    const [{ data: account }] = useAccount();

    const {meta, tokenId, strength, seller, price} = nftData;
    
    const marketInstance = useContract({
        addressOrName: NftMarketplaceAddress,
        contractInterface: marketabi.abi,
        signerOrProvider: signer
    });

    const [loadingGamble, setLoadingGamble] = useState(false)

    const [transactionStatus, setTransactionStatus] = useState({
        status: 0,
        errorMessage: ''
    })
    
    const buyItem = async() => {
        if( account ) {
            if(seller == account?.address) {
                console.log("You are the owner")
                return
            }
            try {
                setLoadingGamble(true)
                const value = ethers.utils.parseEther(price);
                const tx = await marketInstance.buyItem(powersNftAddress, tokenId, {value})
                const transaction = await tx.wait()
                console.log(transaction)
                
                setTransactionStatus({
                    status: 200,
                    errorMessage: ''
                })
                router.replace('/')
            } catch (err) {
                console.log(err)
                setTransactionStatus({
                    status: 400,
                    errorMessage: err.message
                })
            }
            setLoadingGamble(false)
            
        } else {
            setOpenConnect(true)
        }
    }
    
    return (
        <div className='flex mr-12 mb-8 flex-col'>
            <div className='border border-neutral-500'>
                <div className='text-center border-b border-neutral-500 py-1 relative'>
                    <p className='font-semibold'>{meta.name}</p>
                    <p className='text-xs text-gray-500'>#{tokenId}</p>
                </div>
                <div className='w-40 h-36 relative border-b border-neutral-500'>
                    {meta.image && <Image src={`https://ipfs.io/ipfs/${meta.image}`} alt="image of the NFT" layout={'fill'} objectFit="contain"/>}
                </div>
                <div className='text-center py-1'>
                    <p className='text-sm'>Strength: {strength}</p>    
                    <p className='text-sm'>{meta.description}</p>
                </div>
            </div>
            {
                <button className='mt-2 px-5 py-1.5 font-medium bg-green-500 text-white hover:brightness-110 active:brightness-95' onClick={ buyItem }>
                    {price} <span className='text-xs'>MATIC</span>
                </button>
            }
            {
                loadingGamble &&
                <ModalLoading
                    setLoadingGamble={setLoadingGamble}
                />
            }
        </div>
    )
}
