// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

  // const APYContract=await hre.ethers.getContractFactory("StakingPoolContract");
  // initial 10% monthly interest

  const tokenAddress = "0x5Af814cB328B79f11b5dBCe13Ec8325288b86ac7";
  const fixedAPY = 12;
  const minDays = 30;
  // const contract=await APYContract.deploy(tokenAddress,fixedAPY,minDays);
  // await contract.deployed();

  // console.log("Contract Address", contract.address);//0x32b7f650f855c4DEB407Cfb8A218025c2ef64F50
  
  //  console.log("Sleeping.....");
  // // Wait for etherscan to notice that the contract has been deployed
  // await sleep(40000);

  // Verify the contract after deploying
  await hre.run("verify:verify", {
    address: "0x32b7f650f855c4DEB407Cfb8A218025c2ef64F50",
      constructorArguments: [tokenAddress,fixedAPY,minDays],
    contract: "contracts/StakingPoolContract.sol:StakingPoolContract"
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