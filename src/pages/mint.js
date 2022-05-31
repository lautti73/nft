import React, { useContext, useEffect, useState } from 'react'
import { useAccount, useContract, useSigner } from 'wagmi'
import { useRouter } from 'next/router';
import { Navbar } from '../components/Navbar'
import provider, {powersNftAddress} from '../web3'
import powersabi from '../artifacts/contracts/Powers.sol/Powers.json'
import { StoreContext } from '../store/storeProvider'
import { ethers } from 'ethers'
import { ModalLoading } from '../components/ModalLoading'
import { ModalSell } from '../components/ModalSell'
import Image from 'next/image'
import axios from 'axios';
import Link from "next/link";
import airImg from '../../public/powers/images/air1.jpg'
import airImg2 from '../../public/powers/images/air2.jpg'
import airImg3 from '../../public/powers/images/air3.jpg'
import fireImg from '../../public/powers/images/fire1.jpg'
import waterImg from '../../public/powers/images/water1.jpg'
import earthImg from '../../public/powers/images/earth1.jpg'
import Head from 'next/head';

const Mint = ({mintFee}) => {
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
        <Head>
            <title>Mint</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel="shortcut icon" href="/superpower.png" />
        </Head>
        <Navbar />
        <main>
            <div className='pt-8 sm:container mx-auto'>
                <h1 className='mb-20 text-center text-3xl font-semibold'>Become a superhero!</h1>
                <div className='flex justify-center mb-12'>
                    <div className='w-36 h-28 relative'><Image src={airImg} layout='fill' alt='air1'/></div>
                    <div className='w-36 h-28 relative'><Image src={fireImg} layout='fill' alt='air1'/></div>
                    <div className='w-36 h-28 relative'><Image src={earthImg} layout='fill' alt='air1'/></div>
                    <div className='w-36 h-28 relative'><Image src={waterImg} layout='fill' alt='air1'/></div>
                </div>
                <div className='mb-6'>
                    <p className='font-semibold text-center'>Are you ready to achieve the most powerfull superpower?</p>
                </div>
                <div className='mb-16 flex flex-col justify-center'>
                    <button 
                        className='mb-2 mx-auto h-9 text-white font-medium bg-green-500 hover:brightness-110 active:brightness-95 px-5 py-1 rounded mt-2' 
                        onClick={handleMint}>Mint NFT
                    </button>
                    <p className='text-center text-sm font-semibold text-gray-600'>{mintFee} MATIC</p>
                </div>
               <div className='mb-20'>
                    <h2 className='mb-12 text-center text-2xl font-semibold'>Rareness:</h2>
                    <div className='flex justify-center items-center'>
                        <div className='mr-20'>
                            <div className='mb-3 w-28 h-20 relative'>
                                <Image src={airImg} layout='fill' alt='air tier 3'/>
                            </div>
                            <div>
                                <p className='text-center font-semibold'>Tier 3</p>
                                <p className='text-center'>60%</p>
                            </div>
                        </div>
                        <div className='mr-20'>
                            <div className='w-24 h-24 relative'>
                                <Image src={airImg2} layout='fill' alt='air tier 2'/>
                            </div>
                            <div>
                                <p className='text-center font-semibold'>Tier 2</p>
                                <p className='text-center'>30%</p>  
                            </div>
                        </div>
                        <div>
                            <div className='w-28 h-28 relative'>
                                <Image src={airImg3} layout='fill' alt='air tier 1'/>
                            </div>
                            <div>
                                <p className='text-center font-semibold'>Tier 1</p>
                                <p className='text-center'>10%</p>
                            </div>
                        </div>
                    </div>
               </div>
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

export async function getServerSideProps() {
    const powerInstance = new ethers.Contract(powersNftAddress, powersabi.abi, provider);
    const mintFeeRaw = await powerInstance.getMintFee();
    const mintFee = ethers.utils.formatEther(mintFeeRaw)

    return {
      props: {
        mintFee
      }, // will be passed to the page component as props
    }
  }