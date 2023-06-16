// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FileShare is ERC20, Ownable {
    constructor() ERC20("shareToken", "STK") {
        _mint(msg.sender, 50 * 10 ** decimals());
    }

    struct Request {
        string description;
        address payable reqProvider;
        uint256 needIdDevice;
    }
    mapping(uint => Request) public requests;
    uint256 public ReqId;

    struct Provide {
        string[] description;
        string[] deviceName;
        address payable recipient;
        uint256[] space;
        uint256 timestamp;
        bool[] engage;
    }
    mapping(uint256 => Provide) public providers;
    uint256 public ProId;

    uint256 public count;

    function createProvide(
        string memory _description,
        string memory _deviceName,
        uint256 _space
    ) public payable {
        Provide storage newProvide = providers[ProId];
        ProId++;
        count = 0;
        newProvide.description.push(_description);
        newProvide.deviceName.push(_deviceName);
        newProvide.recipient = payable(msg.sender);
        newProvide.space.push(_space);
        newProvide.engage.push(false);
    }

    function addDevicesByProvider(
        uint256 _proId,
        string memory _newDeviceName,
        uint256 _newspace,
        string memory _newDescription
    ) public {
        Provide storage thisProvide = providers[_proId];
        ++count;
        thisProvide.description.push(_newDescription);
        thisProvide.deviceName.push(_newDeviceName);
        thisProvide.space.push(_newspace);
        thisProvide.engage.push(false);
    }

    function makeRequestToProvider(
        uint256 _proId,
        uint256 _spaceReq,
        string calldata _deviceNameReq
    ) public {
        // require(raisedAmt>=targetprice);
        Provide storage thisProvide = providers[_proId];
        uint256 i;
        string storage str = (thisProvide.deviceName)[i];
        for (i = 0; i < (thisProvide.deviceName).length; i++) {
            if (compare(str, _deviceNameReq)) {
                require(
                    thisProvide.space[i] >= _spaceReq,
                    "The provider does not have enoungh space left."
                );
                require(
                    thisProvide.engage[i] == false,
                    "The provider is already busy, no resources available."
                );
                //transferToken()
                thisProvide.engage[i] = true;
                thisProvide.timestamp = block.timestamp;
                Request storage newRequest = requests[ReqId];
                ReqId++;
                newRequest.description = _deviceNameReq;
                newRequest.reqProvider = thisProvide.recipient;
                newRequest.needIdDevice = _proId;
            }
        }
    }

    function getAllAvailableDevices(
        uint256 _proIdAvailable
    ) public view returns (string[] memory availableDevices) {
        Provide storage thisProvide = providers[_proIdAvailable];
        uint index;
        for (uint256 i = 0; i < (thisProvide.deviceName).length; i++) {
            if (thisProvide.engage[i]) {
                availableDevices[index] = (thisProvide.deviceName[i]);
            }
        }
    }

    function compare(
        string memory str1,
        string memory str2
    ) public pure returns (bool) {
        if (bytes(str1).length != bytes(str2).length) {
            return false;
        }
        return
            keccak256(abi.encodePacked(str1)) ==
            keccak256(abi.encodePacked(str2));
    }

    // function finishUse();
    // function approveRequestorUse();
    // function proStop();
}
