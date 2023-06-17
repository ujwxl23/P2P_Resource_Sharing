const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { utils } = require("ethers");

describe("FileShare", function () {
  it("should register the Provider", async () => {
     const [owner,acc1]=await ethers.getSigners();
 const token=await ethers.getContractFactory("FileShareToken");
    const tokenContract = await token.deploy();
    const file = await ethers.getContractFactory("FileShare");
    const fixedStake = utils.parseUnits("5");
    const fileContract = await file.deploy(await tokenContract.address,fixedStake,utils.parseUnits("0.01"));
    const contractAddress = fileContract.address;
    console.log(contractAddress);

    await tokenContract.approve(contractAddress, (utils.parseUnits("5")).toString());
    console.log("Balance",await tokenContract.balanceOf(owner.getAddress()));
    await fileContract.createProvide("Helping",123 , 20, 1);
    const data = await fileContract.providers(0);
    console.log(data);
        console.log("Balance",await tokenContract.balanceOf(owner.getAddress()));
  });
  
    it("should make request to Provider", async () => {
     const [owner,acc1]=await ethers.getSigners();
 const token=await ethers.getContractFactory("FileShareToken");
    const tokenContract = await token.deploy();
    const file = await ethers.getContractFactory("FileShare");
    const fixedStake = utils.parseUnits("5");
    const fileContract = await file.deploy(await tokenContract.address,fixedStake,utils.parseUnits("0.01"));
    const contractAddress = fileContract.address;
    console.log(contractAddress);

    await tokenContract.approve(contractAddress, (utils.parseUnits("5")).toString());
    console.log("Balance",await tokenContract.balanceOf(owner.getAddress()));
      await fileContract.createProvide("Helping", 123, 20, 4);
      const proId = Number((await fileContract.ProId()).toString()) - 1;
            console.log("Provider ID: ",proId);

    // const data = await fileContract.providers(0);
    //   console.log(data);
    //   console.log("Balance", await tokenContract.balanceOf(owner.getAddress()));
      tokenContract.transfer(await acc1.getAddress(), utils.parseUnits("10"));
      console.log("Balance", await tokenContract.balanceOf(await acc1.getAddress()));
      await fileContract.connect(acc1).makeRequestToProvider(proId,10,"Helping",109,2);
      const request = await fileContract.requests(0);
      console.log(request);
    });
   
    it("should should Get all Provider", async () => {
     const [owner,acc1]=await ethers.getSigners();
 const token=await ethers.getContractFactory("FileShareToken");
    const tokenContract = await token.deploy();
    const file = await ethers.getContractFactory("FileShare");
    const fixedStake = utils.parseUnits("5");
    const fileContract = await file.deploy(await tokenContract.address,fixedStake,utils.parseUnits("0.01"));
    const contractAddress = fileContract.address;
    console.log(contractAddress);

    await tokenContract.approve(contractAddress, (utils.parseUnits("5")).toString());
    console.log("Balance",await tokenContract.balanceOf(owner.getAddress()));
      await fileContract.createProvide("Helping", 123, 20, 4);
          await tokenContract.approve(contractAddress, (utils.parseUnits("5")).toString());
      await fileContract.createProvide("Helping", 122, 20, 4);
      const data = await fileContract.getAllAvailableDevices();
      console.log(data);
    // const data = await fileContract.providers(0);
    //   console.log(data);
    //   console.log("Balance", await tokenContract.balanceOf(owner.getAddress()));
      
    });
  
 
});
