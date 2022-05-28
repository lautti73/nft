import { ethers } from 'ethers';
import providerOrSigner from './index';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';

const contractAddress = '0xa94632A7EE7dC058C8129659c6dB2f4F2D94981C';


export const getNFT = async() =>
    new ethers.Contract(
        contractAddress,
        NFT.abi,
        await providerOrSigner
    )