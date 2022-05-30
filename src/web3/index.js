import { ethers } from 'ethers';
import { INFURA_ID } from '../../.env';

export const NftMarketplaceAddress = '0x08bf580a748273a3c23B715359eafC76eF55d3CF';
export const powersNftAddress = '0xC43d3AdEd547d87AE6e3454312dBc9D641e27927';

export default (() => {
    const projectId = INFURA_ID;
    let provider;
    if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
    // We are on the server *OR* the user is not running metamask 
    provider = new ethers.providers.InfuraProvider('maticmum', projectId)
    }
    return provider
}) ()
