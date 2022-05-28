import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

export default (async() => {
    let provider;
    let signer;
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {

        const detectedProvider: any = await detectEthereumProvider();
        provider = new ethers.providers.Web3Provider(detectedProvider);
        signer = provider.getSigner();

    return signer
    } else {
    // We are on the server *OR* the user is not running metamask 
    provider = ethers.getDefaultProvider('rinkeby', {
        infura: '971744bb115946f59bb8767d2d6bea02',
    })

    return provider
    }
}) ()