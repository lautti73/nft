import { ethers } from 'ethers';
import { INFURA_ID } from '../../.env';

export const NftMarketplaceAddress = '0x79EC4cEDea1820bc0dd23cf5b74A181c602c58E1';
export const powersNftAddress = '0xfB6b168B5e08C21258BBa89b21c76efB27A721b2';

export default (() => {
    const projectId = INFURA_ID;
    let provider;
    if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
    // We are on the server *OR* the user is not running metamask 
    provider = new ethers.providers.InfuraProvider('maticmum', projectId)
    }
    return provider
}) ()
