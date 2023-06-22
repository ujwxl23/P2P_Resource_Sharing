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

  const fileContract=await hre.ethers.getContractFactory("FileShare");
  const tokenAddress = "0xcD37327f6c4870D8fc319911eCe32370B1b9f319";
    const fixedStake = ethers.utils.parseUnits("0.5");
  const contract = await fileContract.deploy(tokenAddress,fixedStake);
  
  await contract.deployed();

    console.log("Contract Address", contract.address);//0xC46FC548AA6A90060D20d1868C93eCE440fe14C6
    

    console.log("Sleeping.....");
  // Wait for etherscan to notice that the contract has been deployed
  await sleep(40000);

  // Verify the contract after deploying
  await hre.run("verify:verify", {
    address: contract.address,
      constructorArguments: [tokenAddress,fixedStake],
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