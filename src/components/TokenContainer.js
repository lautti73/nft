import React, { useContext, useEffect, useState } from 'react'
import {create as ipfsHttpClient} from 'ipfs-http-client';
import { useAccount, useContract, useSigner } from 'wagmi';
import powersabi from '../artifacts/contracts/Powers.sol/Powers.json'
import axios from 'axios';
import {powersNftAddress} from '../web3'
import { StoreContext } from '../store/storeProvider';
import Image from 'next/image'


export const TokenContainer = ({tokenId}) => {

    const [meta, setMeta] = useState({});
    const [strength, setStrength] = useState(0)
    const [{logged}, setOpenConnect] = useContext(StoreContext);

    // const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
    const [{ data: signer }] = useSigner();
    const [{ data: account }] = useAccount();

    const powerInstance = useContract({
        addressOrName: powersNftAddress,
        contractInterface: powersabi.abi,
        signerOrProvider: signer
    });

    useEffect( () => {
        if(signer) {
            fetchTokenUri()
        } 
    }, [signer])

    const fetchTokenUri = async() => {
        const tokenUri = await powerInstance.tokenURI(tokenId)
        console.log(tokenUri)
        const {data} = await axios.get(`https://ipfs.io/ipfs/${tokenUri}`)
        console.log(data)
        setMeta(data)
        const strengthRaw = await powerInstance.tokenIdToPowerAmount(tokenId);
        setStrength(strengthRaw.toNumber());
    }

    return (
        <div className='flex flex-col border border-neutral-500'>
            <div className='text-center border-b border-neutral-500 py-1'>
                <p className='font-semibold'>{meta.name}</p>  
            </div>
            <div className='w-40 h-36 relative border-b border-neutral-500'>
                {meta.image && <Image src={`https://ipfs.io/ipfs/${meta.image}`} alt="image of the NFT" layout={'fill'} objectFit="contain"/>}
            </div>
            <div className='text-center py-1'>
                <p className='text-sm'>Strength: {strength}</p>    
                <p className='text-sm'>{meta.description}</p>
            </div>
        </div>
    )
}
