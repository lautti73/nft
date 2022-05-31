import { ethers } from 'ethers';
import { INFURA_ID } from '../../.env';

export const NftMarketplaceAddress = '0xD9BD126605FfBa109fAB4236bf04959aBb32f806';
export const powersNftAddress = '0x81f9315556B19F3018175392496fD2126983DeDA';

export default (() => {
    const projectId = INFURA_ID;
    let provider;
    if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
    // We are on the server *OR* the user is not running metamask 
        provider = new ethers.providers.InfuraProvider('maticmum', projectId)
        
    
    } else {
        function reloadPage() {
            window.location.reload();
        }
        
        ethereum.on('chainChanged', reloadPage);
        
    }
    return provider
}) ()
