import type { NextPage } from 'next';
import { getNFT } from '../web3/NFT';
import { create } from 'ipfs-http-client';
import { useEffect, useRef, useState } from 'react';
import web3 from '../web3';
import { ethers } from 'ethers';
import axios from 'axios';


const Home: NextPage = () => {

    

    return(
        <div>Hola mundo</div>
    )
    // const [nftData, setNftData] = useState({
    //     name: '',
    // });

    // const [allNfts, setAllNfts] = useState([]);

    // useEffect(() => {
    //     getAllNfts()
    // }, [])
    

    // const client = create('https://ipfs.infura.io:5001');
    
    // const connectMetamask = async() => {
    //     await window.ethereum?.request({ method: 'eth_requestAccounts' })
    // }

    // const createNFT = async() => {
    //     connectMetamask();
    //     const path = await addIpfs();
    //     if (!path) return;
    //     const tokenURI = `https://ipfs.io/ipfs/${path}`;
    //     const NFT = await getNFT();
    //     const transaction = await NFT.createToken(tokenURI);
    //     const tx = await transaction.wait();
    //     console.log(tx);
    //     let event = tx.events[0];
    //     let value = event.args[2];
    //     let tokenId = value.toNumber()
    //     console.log(tokenId)
    // }

    // const addIpfs = async() => {
    //     if(!nftData) return;
    //     const {path} = await client.add(JSON.stringify(nftData));
    //     return path
    // }

    // const handleChange = (e) => {
    //     const {name, value} = e.target;
    //     setNftData({
    //         ...nftData,
    //         [name]: value,
    //     })
    // }

    // const getAllNfts = async() => {
    //     const allNfts = [];
    //     const token = await getNFT();
    //     for(let i = 1; i <= quantityNfts; i++) {
    //         const tokenId = i + 1;
    //         const metaUrl = await token.tokenURI(i);
    //         const { data } = await axios.get(metaUrl)
    //         allNfts.push(data.name);
    //     }
    //     setAllNfts(allNfts);
    // }

    // return (
    //     <div>
    //         <button onClick={createNFT}>
    //             Create new NFT
    //         </button>
    //         <input type='text' value={nftData.name} onChange={handleChange} name='name' autoComplete='off' />
    //         <div></div>
    //         <p>Quantity of NFTs: {quantityNfts}</p>
    //         <div>
    //             Tokens:
    //             {
    //                 allNfts?.map( (el, id)=>
    //                     <p key={id}>{el}</p>
    //                 )
    //             }
    //         </div>
    //     </div>
    // )
}

export default Home

// export async function getServerSideProps() {
//     const NFT = await getNFT();
//     const tokenIds = await NFT._tokenIds();
//     const quantityNfts = tokenIds.toNumber();
//     return {
//       props: {
//         quantityNfts
//       }, // will be passed to the page component as props
//     }
//   }