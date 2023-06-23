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
    // // console.log(contractAddress);
    // await fileContract.addDevice("Intel", 30, 10, 1);
    //     // await fileContract.addDevice("AMD Ryzen", 30, 10, 1);
    // await fileContract.connect(acc1).addDevice("AMD Ryzen 9", 30, 10, 1);
    //     await fileContract.connect(acc2).addDevice("AMD Ryzen GPU", 30, 10, 1);


    // const data = await fileContract.getAllDevices();
    // // console.log(data)
    // const device = await fileContract.connect(acc1).getDeviceByProvider();
    // // console.log(device)
    // //  await fileContract.addDevice("AMD Ryzen", 30, 10, 1);
    await tokenContract.transfer(await acc1.getAddress(), utils.parseUnits("5"));
    await tokenContract.transfer(await acc2.getAddress(), utils.parseUnits("5"));
    await tokenContract.approve(contractAddress, (utils.parseUnits("5")).toString());
    await tokenContract.connect(acc1).approve(contractAddress,(utils.parseUnits("5")).toString());
     await tokenContract.connect(acc2).approve(contractAddress,(utils.parseUnits("5")).toString());
    await fileContract.addDevice("Intel", 30, 10, 1);
    await fileContract.connect(acc1).addDevice("AMD Ryzen 9", 30, 10, 1);
    await fileContract.connect(acc2).addDevice("AMD Ryzen GPU", 30, 10, 1);
    //  const alldevices = await fileContract.getAllDevices();
    // console.log(alldevices);


    // const getDeviceByProvider1 = await fileContract.getDeviceByProvider();
    // const getDeviceByProvider2 = await fileContract.connect(acc1).getDeviceByProvider();
    // const getDeviceByProvider3 = await fileContract.connect(acc2).getDeviceByProvider();
    // console.log(getDeviceByProvider1);
    // console.log(getDeviceByProvider2);
    // console.log(getDeviceByProvider3);

    // const device1 = await fileContract.getDeviceByDeviceID(0);
    // const device2 = await fileContract.getDeviceByDeviceID(1);
    // const device3 = await fileContract.getDeviceByDeviceID(2);
    // console.log("For 0",device1);
    // console.log("For 1", device2);
    // console.log("For 2", device3);

    const tx = await fileContract.addDevice("Intel i9", 30, 10, 1);
    console.log('------------------------------------');
    console.log(utils.formatUnits(await tokenContract.balanceOf(await owner.getAddress())));
    console.log('------------------------------------');
     let getDeviceByProvider1 = await fileContract.getDeviceByProvider();
    console.log(getDeviceByProvider1);
    await fileContract.removeDevice(3, 2);
        await fileContract.removeDevice(0,1);

    console.log(utils.formatUnits(await tokenContract.balanceOf(await owner.getAddress())));
     getDeviceByProvider1 = await fileContract.getDeviceByProvider();
    console.log(getDeviceByProvider1);
      const alldevices = await fileContract.getAllDevices();
    console.log(alldevices);


  });
//     it("should  Remove device", async () => {
//      const [owner,acc1,acc2]=await ethers.getSigners();
//  const token=await ethers.getContractFactory("FileShareToken");
//     const tokenContract = await token.deploy();
//     const file = await ethers.getContractFactory("FileShare");
//     const fixedStake = utils.parseUnits("5");
//     const fileContract = await file.deploy(await tokenContract.address,fixedStake);
//     const contractAddress = fileContract.address;
//     // // console.log(contractAddress);
//     // await fileContract.addDevice("Intel", 30, 10, 1);
//     //     // await fileContract.addDevice("AMD Ryzen", 30, 10, 1);
//     // await fileContract.connect(acc1).addDevice("AMD Ryzen 9", 30, 10, 1);
//     //     await fileContract.connect(acc2).addDevice("AMD Ryzen GPU", 30, 10, 1);


//     // const data = await fileContract.getAllDevices();
//     // // console.log(data)
//     // const device = await fileContract.connect(acc1).getDeviceByProvider();
//     // // console.log(device)
//     // //  await fileContract.addDevice("AMD Ryzen", 30, 10, 1);
//     await fileContract.addDevice("Intel", 30, 10, 1);
//     await fileContract.connect(acc1).addDevice("AMD Ryzen 9", 30, 10, 1);
//     await fileContract.connect(acc2).addDevice("AMD Ryzen GPU", 30, 10, 1);
//     const device1 = await fileContract.getDeviceByDeviceID(0);
//     const device2 = await fileContract.connect(acc1).getDeviceByDeviceID(1);
//     const device3 = await fileContract.connect(acc2).getDeviceByDeviceID(2);
//     // console.log("For 0", device1);
//     // console.log("For 1", device2);
//       // console.log("For 2", device3);
//       let device = await fileContract.getDeviceByProvider();
//       const data = await fileContract.removeDevice(0, 1);
//        device = await fileContract.getDeviceByProvider();
//       console.log(device);
//   });

  
 
  
 
});
