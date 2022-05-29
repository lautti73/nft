import { ethers } from 'ethers';
import { INFURA_ID } from '../../.env';

export const NftMarketplaceAddress = '0xe96ee7109a989b9f8c5ef1da6795a9f1cb5f7a8c';
export const powersNftAddress = '0x2daa299e1f5de880e16ac89a8454f33172e78619';

export default (() => {
    const projectId = INFURA_ID;
    let provider;
    if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
    // We are on the server *OR* the user is not running metamask 
    provider = new ethers.providers.InfuraProvider('rinkeby', projectId)
    }
    return provider
}) ()
