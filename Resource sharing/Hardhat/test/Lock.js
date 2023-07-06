const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { utils } = require("ethers");

describe("FileShare", function () {
  it("should add device", async () => {
     const [owner,acc1,acc2]=await ethers.getSigners();
 const token=await ethers.getContractFactory("FileShareToken");
    const tokenContract = await token.deploy();
    const file = await ethers.getContractFactory("FileShare");
    const fixedStake = utils.parseUnits("1");
    const fileContract = await file.deploy(await tokenContract.address,fixedStake);
    const contractAddress = fileContract.address;
    await tokenContract.transfer(await acc1.getAddress(), utils.parseUnits("5"));
    await tokenContract.transfer(await acc2.getAddress(), utils.parseUnits("5"));
    await tokenContract.approve(contractAddress, (utils.parseUnits("5")).toString());
    await tokenContract.connect(acc1).approve(contractAddress,(utils.parseUnits("5")).toString());
     await tokenContract.connect(acc2).approve(contractAddress,(utils.parseUnits("5")).toString());
    await fileContract.addDevice("Intel", 30, 10, 1);
    await fileContract.connect(acc1).addDevice("AMD Ryzen 9", 30, 10, 1);
    await fileContract.connect(acc2).addDevice("AMD Ryzen GPU", 30, 10, 1);
    const tx = await fileContract.addDevice("Intel i9", 30, 10, 1);
     let allDevices = await fileContract.getAllDevices();
    console.log(allDevices);
  });
     it("should get All device", async () => {
     const [owner,acc1,acc2]=await ethers.getSigners();
 const token=await ethers.getContractFactory("FileShareToken");
    const tokenContract = await token.deploy();
    const file = await ethers.getContractFactory("FileShare");
    const fixedStake = utils.parseUnits("1");
    const fileContract = await file.deploy(await tokenContract.address,fixedStake);
    const contractAddress = fileContract.address;

    await tokenContract.transfer(await acc1.getAddress(), utils.parseUnits("5"));
    await tokenContract.transfer(await acc2.getAddress(), utils.parseUnits("5"));
    await tokenContract.approve(contractAddress, (utils.parseUnits("5")).toString());
    await tokenContract.connect(acc1).approve(contractAddress,(utils.parseUnits("5")).toString());
     await tokenContract.connect(acc2).approve(contractAddress,(utils.parseUnits("5")).toString());
    await fileContract.addDevice("Intel", 30, 10, 1);
    await fileContract.connect(acc1).addDevice("AMD Ryzen 9", 30, 10, 1);
    await fileContract.connect(acc2).addDevice("AMD Ryzen GPU", 30, 10, 1);
    const tx = await fileContract.addDevice("Intel i9", 30, 10, 1);
     let allDevices = await fileContract.getAllDevices();
    console.log(allDevices);
  });
    it("should get device by ID", async () => {
     const [owner,acc1,acc2]=await ethers.getSigners();
 const token=await ethers.getContractFactory("FileShareToken");
    const tokenContract = await token.deploy();
    const file = await ethers.getContractFactory("FileShare");
    const fixedStake = utils.parseUnits("1");
    const fileContract = await file.deploy(await tokenContract.address,fixedStake);
    const contractAddress = fileContract.address;
    await tokenContract.transfer(await acc1.getAddress(), utils.parseUnits("5"));
    await tokenContract.transfer(await acc2.getAddress(), utils.parseUnits("5"));
    await tokenContract.approve(contractAddress, (utils.parseUnits("5")).toString());
    await tokenContract.connect(acc1).approve(contractAddress,(utils.parseUnits("5")).toString());
     await tokenContract.connect(acc2).approve(contractAddress,(utils.parseUnits("5")).toString());
    await fileContract.addDevice("Intel", 30, 10, 1);
    await fileContract.connect(acc1).addDevice("AMD Ryzen 9", 30, 10, 1);
    await fileContract.connect(acc2).addDevice("AMD Ryzen GPU", 30, 10, 1);
    const device1 = await fileContract.getDeviceByDeviceID(1);
    const device2 = await fileContract.getDeviceByDeviceID(2);
    const device3 = await fileContract.getDeviceByDeviceID(3);
    console.log("For 1",device1);
    console.log("For 2", device2);
    console.log("For 3", device3);

    });
    it("should get device by Provider", async () => {
     const [owner,acc1,acc2]=await ethers.getSigners();
 const token=await ethers.getContractFactory("FileShareToken");
    const tokenContract = await token.deploy();
    const file = await ethers.getContractFactory("FileShare");
    const fixedStake = utils.parseUnits("1");
    const fileContract = await file.deploy(await tokenContract.address,fixedStake);
    const contractAddress = fileContract.address;
    await tokenContract.transfer(await acc1.getAddress(), utils.parseUnits("5"));
    await tokenContract.transfer(await acc2.getAddress(), utils.parseUnits("5"));
    await tokenContract.approve(contractAddress, (utils.parseUnits("5")).toString());
    await tokenContract.connect(acc1).approve(contractAddress,(utils.parseUnits("5")).toString());
     await tokenContract.connect(acc2).approve(contractAddress,(utils.parseUnits("5")).toString());
    await fileContract.addDevice("Intel", 30, 10, 1);
    await fileContract.connect(acc1).addDevice("AMD Ryzen 9", 30, 10, 1);
    await fileContract.connect(acc2).addDevice("AMD Ryzen GPU", 30, 10, 1);
    const getDeviceByProvider1 = await fileContract.getDeviceByProvider();
    const getDeviceByProvider2 = await fileContract.connect(acc1).getDeviceByProvider();
    const getDeviceByProvider3 = await fileContract.connect(acc2).getDeviceByProvider();
    console.log("Provider 1",getDeviceByProvider1);
    console.log("Provider 2",getDeviceByProvider2);
    console.log("Provider 3",getDeviceByProvider3);
    });
    it("should remove device", async () => {
     const [owner,acc1,acc2]=await ethers.getSigners();
 const token=await ethers.getContractFactory("FileShareToken");
    const tokenContract = await token.deploy();
    const file = await ethers.getContractFactory("FileShare");
    const fixedStake = utils.parseUnits("1");
    const fileContract = await file.deploy(await tokenContract.address,fixedStake);
    const contractAddress = fileContract.address;
    await tokenContract.transfer(await acc1.getAddress(), utils.parseUnits("5"));
    await tokenContract.transfer(await acc2.getAddress(), utils.parseUnits("5"));
    await tokenContract.approve(contractAddress, (utils.parseUnits("5")).toString());
    await tokenContract.connect(acc1).approve(contractAddress,(utils.parseUnits("5")).toString());
     await tokenContract.connect(acc2).approve(contractAddress,(utils.parseUnits("5")).toString());
    await fileContract.addDevice("Intel", 30, 10, 1);
    await fileContract.connect(acc1).addDevice("AMD Ryzen 9", 30, 10, 1);
    await fileContract.connect(acc2).addDevice("AMD Ryzen GPU", 30, 10, 1);
    const tx = await fileContract.addDevice("Intel i9", 30, 10, 1);
     let getDeviceByProvider1 = await fileContract.getDeviceByProvider();
    console.log(getDeviceByProvider1);
    await fileContract.removeDevice(1);
      getDeviceByProvider1 = await fileContract.getDeviceByProvider();
    console.log(getDeviceByProvider1);
    });
    it("should request for the device", async () => {
     const [owner,acc1,acc2]=await ethers.getSigners();
 const token=await ethers.getContractFactory("FileShareToken");
    const tokenContract = await token.deploy();
    const file = await ethers.getContractFactory("FileShare");
    const fixedStake = utils.parseUnits("1");
    const fileContract = await file.deploy(await tokenContract.address,fixedStake);
      const contractAddress = fileContract.address;
    await tokenContract.transfer(await acc1.getAddress(), utils.parseUnits("5"));
    await tokenContract.transfer(await acc2.getAddress(), utils.parseUnits("5"));
    await tokenContract.approve(contractAddress, (utils.parseUnits("5")).toString());
    await tokenContract.connect(acc1).approve(contractAddress,(utils.parseUnits("5")).toString());
     await tokenContract.connect(acc2).approve(contractAddress,(utils.parseUnits("5")).toString());
    await fileContract.addDevice("Intel", 30, 10, 1);
    await fileContract.connect(acc1).addDevice("AMD Ryzen 9", 30, 10, 1);
    await fileContract.connect(acc2).addDevice("AMD Ryzen GPU", 30, 10, 1);
    const tx = await fileContract.addDevice("Intel i9", 30, 10, 1);
    
    await tokenContract.approve(contractAddress,(utils.parseUnits("3")).toString())
    await fileContract.RequestDeviceUse(2, 5);
    await tokenContract.connect(acc2).approve(contractAddress,(utils.parseUnits("3")).toString())
    await fileContract.connect(acc2).RequestDeviceUse(2,3);
    let Request = await fileContract.connect(acc1).ViewDeviceRequestByRequestor();
      console.log("Request:",Request);
    //      Request = await fileContract.ViewDeviceRequestByRequestor(await acc1.getAddress(), 2);
    // console.log(Request);
    });
  it("should Accept the device request", async () => {
     const [owner,acc1,acc2]=await ethers.getSigners();
 const token=await ethers.getContractFactory("FileShareToken");
    const tokenContract = await token.deploy();
    const file = await ethers.getContractFactory("FileShare");
    const fixedStake = utils.parseUnits("1");
    const fileContract = await file.deploy(await tokenContract.address,fixedStake);
      const contractAddress = fileContract.address;
    await tokenContract.transfer(await acc1.getAddress(), utils.parseUnits("5"));
    await tokenContract.transfer(await acc2.getAddress(), utils.parseUnits("5"));
    await tokenContract.approve(contractAddress, (utils.parseUnits("5")).toString());
    await tokenContract.connect(acc1).approve(contractAddress,(utils.parseUnits("5")).toString());
     await tokenContract.connect(acc2).approve(contractAddress,(utils.parseUnits("5")).toString());
    await fileContract.addDevice("Intel", 30, 10, 1);
    await fileContract.connect(acc1).addDevice("AMD Ryzen 9", 30, 10, 1);
    await fileContract.connect(acc2).addDevice("AMD Ryzen GPU", 30, 10, 1);
    const tx = await fileContract.addDevice("Intel i9", 30, 10, 1);
    
    await tokenContract.approve(contractAddress,(utils.parseUnits("3")).toString())
    await fileContract.RequestDeviceUse(2, 5);
    await tokenContract.connect(acc2).approve(contractAddress,(utils.parseUnits("3")).toString())
    await fileContract.connect(acc2).RequestDeviceUse(2,3);
    let Request = await fileContract.connect(acc1).ViewDeviceRequestByRequestor();
    console.log("Request:", Request);
    // await fileContract.connect(acc1).
    });
    it("should Withdraw the device request", async () => {
     const [owner,acc1,acc2]=await ethers.getSigners();
 const token=await ethers.getContractFactory("FileShareToken");
    const tokenContract = await token.deploy();
    const file = await ethers.getContractFactory("FileShare");
    const fixedStake = utils.parseUnits("1");
    const fileContract = await file.deploy(await tokenContract.address,fixedStake);
      const contractAddress = fileContract.address;
    await tokenContract.transfer(await acc1.getAddress(), utils.parseUnits("5"));
    await tokenContract.transfer(await acc2.getAddress(), utils.parseUnits("5"));
    await tokenContract.approve(contractAddress, (utils.parseUnits("5")).toString());
    await tokenContract.connect(acc1).approve(contractAddress,(utils.parseUnits("5")).toString());
     await tokenContract.connect(acc2).approve(contractAddress,(utils.parseUnits("5")).toString());
    await fileContract.addDevice("Intel", 30, 10, 1);
    await fileContract.connect(acc1).addDevice("AMD Ryzen 9", 30, 10, 1);
    // await fileContract.connect(acc2).addDevice("AMD Ryzen GPU", 30, 10, 1);
    // const tx = await fileContract.addDevice("Intel i9", 30, 10, 1);
    await tokenContract.approve(contractAddress,(utils.parseUnits("3")).toString())
    await fileContract.RequestDeviceUse(2, 5);
      // await tokenContract.connect(acc2).approve(contractAddress, (utils.parseUnits("3")).toString())
      // await fileContract.connect(acc2).RequestDeviceUse(2, 3);
      await fileContract.connect(acc1).AcceptDeviceRequestByProvider(1);
      let Request = await fileContract.getDeviceByDeviceID(2);
      console.log(Request);
      await fileContract.WithdrawDeviceUsebyRequestor(2, 1);
      Request = await fileContract.getDeviceByDeviceID(2);
      console.log(Request);
    });
      it("should Withdraw token to Provider", async () => {
     const [owner,acc1,acc2]=await ethers.getSigners();
 const token=await ethers.getContractFactory("FileShareToken");
    const tokenContract = await token.deploy();
    const file = await ethers.getContractFactory("FileShare");
    const fixedStake = utils.parseUnits("1");
    const fileContract = await file.deploy(await tokenContract.address,fixedStake);
      const contractAddress = fileContract.address;
    await tokenContract.transfer(await acc1.getAddress(), utils.parseUnits("5"));
    await tokenContract.transfer(await acc2.getAddress(), utils.parseUnits("5"));
    await tokenContract.approve(contractAddress, (utils.parseUnits("5")).toString());
    await tokenContract.connect(acc1).approve(contractAddress,(utils.parseUnits("5")).toString());
     await tokenContract.connect(acc2).approve(contractAddress,(utils.parseUnits("5")).toString());
    await fileContract.addDevice("Intel", 30, 10, 1);
    await fileContract.connect(acc1).addDevice("AMD Ryzen 9", 30, 10, 1);
    // await fileContract.connect(acc2).addDevice("AMD Ryzen GPU", 30, 10, 1);
    // const tx = await fileContract.addDevice("Intel i9", 30, 10, 1);
    await tokenContract.approve(contractAddress,(utils.parseUnits("3")).toString())
    await fileContract.RequestDeviceUse(2, 5);
      // await tokenContract.connect(acc2).approve(contractAddress, (utils.parseUnits("3")).toString())
      // await fileContract.connect(acc2).RequestDeviceUse(2, 3);
        await fileContract.connect(acc1).AcceptDeviceRequestByProvider(1);
        await fileContract.WithdrawDeviceUsebyRequestor(2, 1);
        let amt = await tokenContract.balanceOf(await acc1.getAddress());
        console.log(amt);
        await fileContract.TransferEarnedTokenToProvider(2, 1);
        amt = await tokenContract.balanceOf(await acc1.getAddress());
        console.log(amt);
    });


//   

  
 
  
 
});
