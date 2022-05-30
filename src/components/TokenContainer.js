import React, { useContext, useEffect, useState } from 'react'
import {create as ipfsHttpClient} from 'ipfs-http-client';
import { useAccount, useContract, useSigner } from 'wagmi';
import powersabi from '../artifacts/contracts/Powers.sol/Powers.json'
import marketabi from '../artifacts/contracts/NFTMarket.sol/NftMarketplace.json'
import axios from 'axios';
import {powersNftAddress, NftMarketplaceAddress} from '../web3'
import { StoreContext } from '../store/storeProvider';
import Image from 'next/image'
import {ModalSell} from './ModalSell'
import { ModalLoading } from './ModalLoading';
import { ethers} from 'ethers';
import { useRouter } from 'next/router';


export const TokenContainer = ({tokenId}) => {
    const router = useRouter();
    const [meta, setMeta] = useState({});
    const [strength, setStrength] = useState(0)
    const [{logged}, setOpenConnect] = useContext(StoreContext);
    const [openSellModal, setOpenSellModal] = useState(false);
    const [sellPrice, setSellPrice] = useState(0);
    const [sellError, setSellError] = useState("");
    const [tokensApproved, setTokensApproved] = useState(false);
    const [isListed, setIsListed] = useState(false);
    const [listedPrice, setListedPrice] = useState(0);

    // const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
    const [{ data: signer }] = useSigner();
    const [{ data: account }] = useAccount();

    const powerInstance = useContract({
        addressOrName: powersNftAddress,
        contractInterface: powersabi.abi,
        signerOrProvider: signer
    });

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

    useEffect( () => {
        if(signer) {
            fetchTokenData()
        } 
    }, [signer])

    const fetchTokenData = async() => {
        const tokenUri = await powerInstance.tokenURI(tokenId)
        const {data} = await axios.get(`https://ipfs.io/ipfs/${tokenUri}`)
        setMeta(data)
        const strengthRaw = await powerInstance.tokenIdToPowerAmount(tokenId);
        setStrength(strengthRaw.toNumber());
        const approvedAddress = await powerInstance.getApproved(tokenId);
        if(approvedAddress == NftMarketplaceAddress) {
            setTokensApproved(true)
        }
        const getListing = await marketInstance.getListing(powersNftAddress, tokenId);
        if(getListing.price > 0) {
            setIsListed(true);
            setListedPrice(ethers.utils.formatEther(getListing.price))
        } 
    }

    const sellItem = async() => {
        if(sellPrice <= 0) {
            setSellError("The price must be greater than 0")
            return;
        }
        if( account ) {
            try {
                setLoadingGamble(true)
                const price = ethers.utils.parseEther(sellPrice.toString())
                const tx = await marketInstance.listItem(powersNftAddress, tokenId, price)
                const transaction = await tx.wait()
                console.log(transaction)
                router.replace('/my-nfts')
                setTransactionStatus({
                    status: 200,
                    errorMessage: ''
                })
                setIsListed(true);
                setOpenSellModal(false);
                setSellPrice(0);
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

    const handleChange = (e) => {
        const { value } = e.target;
        setSellPrice(value)     
    }

    const approve = async() => {
        if(tokensApproved) {
            return
        }
        if( account ) {
            try {
                setLoadingGamble(true)
                const tx = await powerInstance.approve(NftMarketplaceAddress, tokenId)
                const transaction = await tx.wait()
                console.log(transaction)
                router.replace('/my-nfts')
                setTransactionStatus({
                    status: 200,
                    errorMessage: ''
                })
                setTokensApproved(true)
                setOpenSellModal(false);
                // router.replace(`/my-nfts`)
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

    const cancelListing = async() => {
        if(!isListed) {
            return;
        }
        if( account ) {
            try {
                setLoadingGamble(true)
                const tx = await marketInstance.cancelListing(powersNftAddress, tokenId)
                const transaction = await tx.wait()
                console.log(transaction)
                router.replace('/my-nfts')
                setTransactionStatus({
                    status: 200,
                    errorMessage: ''
                })
                setIsListed(false);
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

    const updatePrice = async() => {
        if(!isListed) {
            return;
        }
        if( account ) {
            try {
                setLoadingGamble(true)
                const newPrice = ethers.utils.parseEther(sellPrice.toString())
                const tx = await marketInstance.updateListing(powersNftAddress, tokenId, newPrice)
                const transaction = await tx.wait()
                console.log(transaction)
                router.replace('/my-nfts')
                setTransactionStatus({
                    status: 200,
                    errorMessage: ''
                })
                setOpenSellModal(false);
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
            {   !isListed &&
                <button className='mt-2 px-5 py-1.5 font-medium bg-green-500 text-white hover:brightness-110 active:brightness-95' onClick={ () => setOpenSellModal(true)}>
                    Sell
                </button>
            }
            {   
                isListed &&
                <>
                    <button className='mt-2 px-5 py-1.5 font-medium bg-green-500 text-white hover:brightness-110 active:brightness-95' onClick={ () => setOpenSellModal(true) }>
                        Edit price
                    </button>
                    <button className='mt-2 px-5 py-1.5 font-medium bg-red-500 text-white hover:brightness-110 active:brightness-95 ' onClick={cancelListing}>
                        Cancel listing
                    </button>
                </>
            }
            {
                (openSellModal && !isListed) &&
                <ModalSell setOpenSellModal={setOpenSellModal}>
                        <div className='h-1/2 border-t border-neutral-500'>
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
                        <div className=''>
                            <label className='flex flex-col items-center sm:blocksm:mb-3 mb-8'>
                                <span className='mb-2 block font-bold'>Price:</span>
                                <input className='w-24 px-2 py-1 border border-solid border-gray-300 rounded text-sm mt-3 sm:mt-0' type='number' value={sellPrice} name={ 'sellPrice' } onChange={ handleChange }/>
                            </label>
                        </div>
                    {
                        !tokensApproved &&
                        <button className='mx-auto mt-auto mb-8 w-1/4 mt-2 px-5 py-1.5 font-medium bg-green-500 text-white hover:brightness-110 active:brightness-95' onClick={approve}>
                            Approve
                        </button>
                    }
                    <button className={`mx-auto mt-auto w-1/4 mt-2 px-5 py-1.5 font-medium bg-green-500 text-white hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:bg-gray-400 disabled: hover:brightness-100 ${!tokensApproved && 'mt-0'}`} disabled={!tokensApproved} onClick={sellItem}>
                        Confirm
                    </button>
                    
                </ModalSell>
            }
            {
                (openSellModal && isListed) &&
                <ModalSell setOpenSellModal={setOpenSellModal}>
                        <div className='h-1/2 border-t border-neutral-500'>
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
                        <div className='mb-12 text-center'>
                            <p className=''>Current price: <span className='font-semibold'>{listedPrice}</span> MATIC</p>
                        </div>
                        <div className=''>
                            <label className='flex flex-col items-center sm:blocksm:mb-3 mb-8'>
                                <span className='mb-2 block font-semibold'>New price:</span>
                                <input className='w-24 px-2 py-1 border border-solid border-gray-300 rounded text-sm mt-3 sm:mt-0' type='number' value={sellPrice} name={ 'sellPrice' } onChange={ handleChange }/>
                            </label>
                        </div>
                    {
                        !tokensApproved &&
                        <button className='mx-auto mt-auto mb-8 w-1/4 mt-2 px-5 py-1.5 font-medium bg-green-500 text-white hover:brightness-110 active:brightness-95' onClick={approve}>
                            Approve
                        </button>
                    }
                    <button className={`mx-auto mt-auto w-1/4 mt-2 px-5 py-1.5 font-medium bg-green-500 text-white hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:bg-gray-400 disabled: hover:brightness-100 ${!tokensApproved && 'mt-0'}`} disabled={!tokensApproved} onClick={updatePrice}>
                        Confirm
                    </button>
                    
                </ModalSell>
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
