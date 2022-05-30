import { ethers } from 'ethers';
import { INFURA_ID } from '../../.env';

export const NftMarketplaceAddress = '0xc6a1C0170f2E6e9D81066773593b2172aaE4BBb0';
export const powersNftAddress = '0xCCC2E05591322f87B01D86c7744795C3ebA1a3c5';

export default (() => {
    const projectId = INFURA_ID;
    let provider;
    if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
    // We are on the server *OR* the user is not running metamask 
    provider = new ethers.providers.InfuraProvider('maticmum', projectId)
    }
    return provider
}) ()
