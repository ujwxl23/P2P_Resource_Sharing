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
  const deviceContract=await hre.ethers.getContractFactory("DeviceShare");
  const tokenAddress = "0x5Af814cB328B79f11b5dBCe13Ec8325288b86ac7";
  const fixedStake = ethers.utils.parseUnits("0.5");
    const StakingContract_Address = "0x541d439F6C1988d2BE0d564A2360ab8e68E9D74a";
  const contract = await deviceContract.deploy(tokenAddress,fixedStake,StakingContract_Address);
  
  await contract.deployed();

    console.log("Contract Address", contract.address);//0x8D836A6C7A8648B60356A2560a99e41ed9cB148B
    console.log("Sleeping.....");
  // Wait for etherscan to notice that the contract has been deployed
  await sleep(40000);

  // Verify the contract after deploying
  await hre.run("verify:verify", {
    address: contract.address,
      constructorArguments: [tokenAddress,fixedStake,StakingContract_Address],
    contract: "contracts/DeviceShare.sol:DeviceShare"
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