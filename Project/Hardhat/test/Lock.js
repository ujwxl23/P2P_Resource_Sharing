const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("FileShare", function () {
 it("should register the Provider",async ()=>{
 const contract=await ethers.getContractFactory("FileShare");
  const fileShareContract=await contract.deploy();
  const [owner,acc1]=await ethers.getSigners();
  await fileShareContract.createProvide("Big Intel Device","Windows I9","20");
  const data=await fileShareContract.providers(0);
  console.log(data)
 });
 
});
