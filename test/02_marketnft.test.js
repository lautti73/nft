const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Scenario: We have a Marketplace to trade Power", function () {
	let Powers;
	let NFTMarket;
	let powers;
	let nftmarket;
	let deployer;
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
	describe("Listing a NFT to the market", async() => {
		it("lists an owned nft", async() => {
			await powers.setVrfContractAddress(deployer.address)
			await powers._createToken(10056, "Controlar el fuego", deployer.address)
			const tx = await nftmarket.listItem(1, 10);
			return expect(tx)
				.to.emit(nftmarket, 'MarketItemCreated');
		})
		it("reverts: lists not owned nft", async() => {
			await powers.setVrfContractAddress(deployer.address)
			await powers._createToken(10056, "Controlar el fuego", addr2.address);
			return expect(nftmarket.listItem(1, 10)).to.be.reverted;
		})
		it("lists an item that is already listed", async() => {
			await powers.setVrfContractAddress(deployer.address)
			await powers._createToken(10056, "Controlar el fuego", deployer.address);
			await nftmarket.listItem(1, 20);
			const tx = nftmarket.listItem(1, 20);
			return expect(tx).to.be.revertedWith('You are not the owner of the NFT');
		})
	})
	describe("Buying an NFT from the market", async() => {
		beforeEach(async() => {
			await powers.setVrfContractAddress(deployer.address)
			await powers._createToken(10056, "Controlar el fuego", deployer.address) // Crear token
			await powers._createToken(10057, "Controlar el aire", deployer.address) // Crear token
			await nftmarket.listItem(1, 100); // Listarlo
			await nftmarket.listItem(2, 100); // Listarlo
			
		})
		it("it buys an item with same amount of eth than the price", async() => {
			const tx = await nftmarket.buyItem(1, {value: 100});
			return expect(tx)
				.to.emit(nftmarket, 'ItemSold');
		})
		it("it buys an item with less amount of eth than the price", async() => {
			const tx = nftmarket.buyItem(1, {value: 99});
			return expect(tx).to.be.revertedWith('Please send the solicited amount');
		})
		it("it buys an item with more amount of eth than the price", async() => {
			const tx = nftmarket.buyItem(1, {value: 101});
			return expect(tx).to.be.revertedWith('Please send the solicited amount');
		})
		it("it buys an item that doesn't exist", async() => {
			const tx = nftmarket.buyItem(20, {value: 100});
				return expect(tx).to.be.revertedWith('Please send the solicited amount');
		})
		it("it buys an item that is already sold", async() => {
			await nftmarket.buyItem(1, {value: 100});
			const tx = nftmarket.buyItem(1, {value: 100});
				return expect(tx).to.be.revertedWith('The item is already sold');
		})
	})
});
