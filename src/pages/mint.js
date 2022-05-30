import React, { useContext, useState } from 'react'
import { useAccount, useContract, useSigner } from 'wagmi'
import { useRouter } from 'next/router';
import { Navbar } from '../components/Navbar'
import {powersNftAddress} from '../web3'
import powersabi from '../artifacts/contracts/Powers.sol/Powers.json'
import { StoreContext } from '../store/storeProvider'
import { ethers } from 'ethers'
import { ModalLoading } from '../components/ModalLoading'

const Mint = () => {
    const [, setOpenConnect] = useContext(StoreContext);
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

    const handleMint = async(e) => {
        e.preventDefault();
            if( account ) {
                const mintFee = ethers.utils.parseEther('0.0001');;
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
        <>
        <Navbar />
        <div>
            <button className='h-9 text-white font-medium bg-green-500 hover:brightness-110 active:brightness-95 px-5 py-1 rounded mt-2' onClick={handleMint}>Mint NFT</button>
        {
            loadingGamble &&
            <ModalLoading
                setLoadingGamble={setLoadingGamble}
            />
        }
        </div>
        </>
    )
}

export default Mint