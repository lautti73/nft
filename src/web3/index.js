import { ethers } from 'ethers';
import { INFURA_ID } from '../../.env';

export const NftMarketplaceAddress = '0x842b04bEFCfaB49691a0E22E7e0f6C61C20da52B';
export const powersNftAddress = '0x177d6f0B5A4c320cFd196bCE2Be6B1766365e3c3';

export default (() => {
    const projectId = INFURA_ID;
    let provider;
    if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
    // We are on the server *OR* the user is not running metamask 
    provider = new ethers.providers.InfuraProvider('maticmum', projectId)
    }
    return provider
}) ()
