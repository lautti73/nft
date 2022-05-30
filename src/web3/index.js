import { ethers } from 'ethers';
import { INFURA_ID } from '../../.env';

export const NftMarketplaceAddress = '0x1F2E359AB18d16fF26DFc1906D718aCf22e4867F';
export const powersNftAddress = '0xe0c00D49A9863bc2A2862698395A0d54D6cA1F3f';

export default (() => {
    const projectId = INFURA_ID;
    let provider;
    if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
    // We are on the server *OR* the user is not running metamask 
    provider = new ethers.providers.InfuraProvider('maticmum', projectId)
    }
    return provider
}) ()
