const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { utils } = require("ethers");

describe("FileShare", function () {
  it("should add device", async () => {
     const [owner,acc1]=await ethers.getSigners();
 const token=await ethers.getContractFactory("FileShareToken");
    const tokenContract = await token.deploy();
    const file = await ethers.getContractFactory("FileShare");
    const fixedStake = utils.parseUnits("5");
    const fileContract = await file.deploy(await tokenContract.address,fixedStake);
    const contractAddress = fileContract.address;
    console.log(contractAddress);

    await fileContract.addDevice("Intel", 30, 10, 1);
    const data = await fileContract.getAllDevices();
    console.log(data)
    const device = await fileContract.getDeviceByProvider();
    console.log(device)
     await fileContract.addDevice("AMD Ryzen", 30, 10, 1);
    const device2 = await fileContract.getDeviceByProvider();
    console.log(device2)
  });
  
 
  
 
});
