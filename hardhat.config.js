require("hardhat/config");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require('hardhat-deploy');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
// eslint-disable-next-line import/no-anonymous-default-export
module.exports =  {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/971744bb115946f59bb8767d2d6bea02',
      accounts: ['4a775e9e34c3faad848e7d85bfab1492ef1f4e71459e8e06d2a734a9657fa842'],
      chainId: 4,
    }
  },
  paths: {
    artifacts: './src/artifacts'
  }
};
