// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract FileShare {
    uint256 public FIXED_STAKE;
    uint256 private constant SECONDS_IN_YEAR = 31536000; // Number of seconds in a year (365 days)
    address private owner;

    IERC20 private token;

    constructor(address tokenAddress, uint256 _FIXED_STAKE) {
        token = IERC20(tokenAddress);
        owner = msg.sender;
        FIXED_STAKE = _FIXED_STAKE;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    struct Provide {
        string description;
        uint256 space;
        uint256 hrs;
        uint256 tokenRate;
        uint256 id;
    }
    mapping(address => Provide) public providers;
    mapping(uint256 => Provide) public deviceDetails;
    uint256 public deviceID;

    string[] allDevices;

    function addDevice(
        string memory _description,
        uint256 _space,
        uint256 _hrs,
        uint256 _tokenrate
    ) public {
        Provide memory newProvide = Provide(_description,_space,_hrs,_tokenrate,deviceID);
        providers[msg.sender]=newProvide;

        allDevices.push(_description);

        deviceDetails[deviceID]=newProvide;
        deviceID++;
    }

    function getAllDevices() public view returns (string[] memory) {
        return (allDevices);
    }

    function getDeviceByProvider() public view returns (string memory) {
        Provide memory thisProvide = providers[msg.sender];
        return thisProvide.description;
    }

    function getDeviceByDeviceID(
        uint256 _deviceID
    ) public view returns (string memory, uint256, uint256, uint256) {
        Provide storage thisDevice = deviceDetails[_deviceID];
        return (
            thisDevice.description,
            thisDevice.hrs,
            thisDevice.space,
            thisDevice.tokenRate
        );
    }
}