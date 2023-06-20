// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
require("@nomiclabs/hardhat-etherscan");

async function main() {
  const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

  const fileContract=await hre.ethers.getContractFactory("FileShare");
  const tokenAddress = "0xeFC56F2CA2d8Cb20878a08c6Cc2D9942BEA9C58a";
    const fixedStake = ethers.utils.parseUnits("5");
  const reward = ethers.utils.parseUnits("0.01");
  const contract = await fileContract.deploy(tokenAddress,fixedStake,reward);
  
  await contract.deployed();

    console.log("Contract Address", contract.address);//0x535Da441Dd81Db80860CDf3E802eb590049439C9
    

    // console.log("Sleeping.....");
  // Wait for etherscan to notice that the contract has been deployed
  // await sleep(40000);

  // Verify the contract after deploying
  await hre.run("verify:verify", {
    address: contract.address,
      constructorArguments: [],
    contract: "contracts/FileShare.sol:FileShare"
  });
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});