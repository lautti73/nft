// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const powersUri = require("../public/powers/powersUri");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const [deployer] = await hre.ethers.getSigners();

  const NFTMarket = await hre.ethers.getContractFactory("NftMarketplace");
  const nftmarket = await NFTMarket.deploy();

  await nftmarket.deployed();
  console.log("NFTMarket deployed to: ", nftmarket.address);

  const subscriptionId = 431;
  const mintFee = hre.ethers.utils.parseEther('0.0001');
  console.log(typeof mintFee, mintFee);
  const nftMarketplaceAddress = nftmarket.address;
  const powerTokenUris = powersUri;

  const Powers = await hre.ethers.getContractFactory("Powers");
  const powers = await Powers.deploy(subscriptionId, mintFee, nftMarketplaceAddress, powerTokenUris);

  await powers.deployed();

  console.log("PowersNFT deployed to:", powers.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
