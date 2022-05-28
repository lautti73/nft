const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Scenario: We have a VRF which creates NFT tokens 'Powers' ERC721", function () {
	let Powers;
	let NFTMarket;
	let powers;
	let nftmarket;
	let deployer;
	let vrf;
	let addr2;
  	beforeEach(async()=> {
		[deployer, vrf, addr2] = await hre.ethers.getSigners();
		Powers = await hre.ethers.getContractFactory("Powers");
		powers = await Powers.deploy();
		await powers.deployed();

		NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
		nftmarket = await NFTMarket.deploy(powers.address);
		await nftmarket.deployed();
		await powers.setMarketContractAddress(nftmarket.address);
  	});
	describe("Only the VRFContract can create a token", async() => {
		it("reverts: is called by an address that is NOT VRF", async function () {
			await powers.setVrfContractAddress(vrf.address)
		 	return expect(powers._createToken(10056, "Controlar el fuego", deployer.address)).to.be.reverted
		});
		it("is called by an address that is VRF", async function () {
			await powers.setVrfContractAddress(deployer.address)
			const tx = await powers._createToken(10056, "Controlar el fuego", deployer.address)
			return expect(tx).
				to.emit(powers, 'Transfer')
		});
	})
});
