import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from "next/router";
import { ModalMenu } from './ModalMenu';
import discordWhite from '../../public/discord-white.svg';
import discordBlack from '../../public/discord-black.svg';
import { Login } from './Login';
import { StoreContext } from '../store/storeProvider';
import {ModalChain} from '../components/ModalChain'

export const Navbar = () => {
    
    const [openMenu, setOpenMenu] = useState(false);
    const router = useRouter();
    const [{logged}] = useContext(StoreContext);
    const [incorrectChain, setIncorrectChain] = useState(false);
    const [chainId, setChainId] = useState(0)

    useEffect(() => {
        ethereum.on('connect', (chainIdInfo) => setChainId(parseInt(chainIdInfo.chainId, 16)));
        if(logged) {
            if(chainId != 80001) {
                setIncorrectChain(true)
            }  
        }
    }, [logged, chainId])
    

    return (
        <nav className='h-16 border-b border-neutral-200 border-solid shadow bg-blackbg'>
            <ul className='flex items-center h-full sm:container sm:mx-auto mx-5  text-whitefont'>
            
                <li className='lg:mr-16 font-bold text-2xl'>Powers</li>
                <li className={`mr-12 hidden lg:list-item hover:text-amber-400 ${router.pathname == "/" && "active"}`}>
                    <Link href={'/'}>
                        <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>Marketplace</a>
                    </Link>
                </li>
                <li className={`mr-12 hidden lg:list-item hover:text-amber-400 ${router.pathname == "/mint" && "active"}`}>
                    <Link href={'/mint'}>
                        <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>Mint NFT</a>
                    </Link>
                </li>
                <li className={`ml-auto mr-12 hidden lg:list-item hover:text-amber-400 ${router.pathname == "/my-nfts" && "active"} ${!logged && 'lg:hidden'}`}>
                    <Link href={'/my-nfts'}>
                        <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>My NFTs</a>
                    </Link>
                </li >
                <li className={`mr-8 2xl:mr-16 mt-2 hidden lg:list-item hover:text-amber-400 ${!logged && 'ml-auto'}`}>
                    <a href='https://discord.gg/rtnFwG96rX' target='_blank' rel='noreferrer'><Image src={ discordBlack } alt="discord-icon" width={25}/></a>
                </li >
                <li className='ml-auto lg:hidden cursor-pointer' onClick={ () => { setOpenMenu(true) }}>
                    <span className='block w-7 h-1 bg-black mb-1'></span>
                    <span className='block w-7 h-1 bg-black mb-1' ></span>
                    <span className='block w-7 h-1 bg-black'></span>
                </li>
                <Login lg/>
                
                { openMenu && 
                    <ModalMenu
                        setOpenMenu={ setOpenMenu  }   
                    >
                        <ul className='text-2xl font-medium flex flex-col items-center h-full'>
                            <li className={`mt-8 md:mt-8 mb-14 hover:text-amber-400 ${router.pathname == "/" && "active"}`}>
                                <Link href={'/'}>
                                    <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>Marketplace</a>
                                </Link>
                            </li>
                            <li className={`mb-14 hover:text-amber-400 ${router.pathname == "/mint" && "active"}`}>
                                <Link href={'/how-to-play'}>
                                    <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>Mint NFT</a>
                                </Link>
                            </li>
                            <li className={`mb-14 hover:text-amber-400 ${router.pathname == "/my-nfts" && "active"} ${!logged && 'hidden'}`}>
                                <Link href={'/my-nfts'}>
                                    <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>My NFTs</a>
                                </Link>
                            </li >
                            <li className='hover:text-amber-400'>
                                <a href='https://discord.gg/rtnFwG96rX' target='_blank' rel='noreferrer'><Image src={ discordBlack } alt="discord-icon" width={40}/></a>
                            </li >
                            <Login/>
                        </ul>
                    </ModalMenu>
                }
                {
                    incorrectChain &&
                    <ModalChain />
                }
            </ul>
        </nav>
    )
}
