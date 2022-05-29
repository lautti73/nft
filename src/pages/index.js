import { create } from 'ipfs-http-client';
import { useEffect, useRef, useState } from 'react';
import web3 from '../web3';
import { ethers } from 'ethers';
import axios from 'axios';
import { Navbar } from '../components/Navbar'


const Home = () => {

    return(
        <>
            <Navbar />
            <div>Hola mundo</div>
        </>
    )
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