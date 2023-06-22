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
        uint256 idDev;
        uint256 tokenRate;
        address recipient;
        bool engage;
    }
    mapping(address => Provide[]) public providers;
    mapping(uint256 => Provide[]) public deviceDetails;
    uint256 public deviceID;

    string[] allDevices;

    struct Stake {
        uint256 stakeId;
        uint256 amt;
        uint256 timeStake;
    }

    uint256 stake_id;
    mapping(address => uint256) private stakes_count;
    mapping(address => uint256) private rewards_earned;
    mapping(address => mapping(uint256 => Stake)) private stakes_pool;

  event DeviceAdded (
        uint256 indexed idOfDevice,
        uint256 indexed idOfStake
    );

    function addDevice(
        string memory _description,
        uint256 _space,
        uint256 _hrs,
        uint256 _tokenrate
    ) public {
        Provide memory newProvide = Provide(
            _description,
            _space,
            _hrs,
            deviceID,
            _tokenrate,
            msg.sender,
            false
        );
        providers[msg.sender].push(newProvide);

        allDevices.push(_description);

        Provide memory newDevice = Provide(
            _description,
            _space,
            _hrs,
            deviceID,
            _tokenrate,
            msg.sender,
            false
        );
        deviceDetails[deviceID].push(newDevice);

        stake_id = ++stakes_count[msg.sender];

        stakes_pool[msg.sender][stake_id] = Stake(
            stake_id,
            FIXED_STAKE,
            block.timestamp
        );

        emit DeviceAdded(deviceID, stake_id);
        deviceID++;

    }

    function getAllDevices() public view returns (string[] memory devices) {
        devices = allDevices;
    }

    function getDeviceByProvider() public view returns (string memory desp) {
        Provide[] storage thisProvide = providers[msg.sender];
        for (uint256 i = 0; i < thisProvide.length; i++) {
            if (thisProvide[i].recipient == msg.sender) {
                desp = thisProvide[i].description;
            }
        }
    }

    function getDeviceByDeviceID(
        uint256 _deviceID
    )
        public
        view
        returns (
            string memory desp,
            uint256 hr,
            uint256 sp,
            uint256 tr,
            bool eng
        )
    {
        Provide[] storage thisDevice = deviceDetails[_deviceID];
        for (uint256 i = 0; i < thisDevice.length; i++) {
            if (thisDevice[i].recipient == msg.sender) {
                desp = thisDevice[i].description;
                hr = thisDevice[i].hrs;
                sp = thisDevice[i].space;
                tr = thisDevice[i].tokenRate;
                eng = thisDevice[i].engage;
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

    function removeDevice(uint256 _deviceID, uint256 _stakeId) public {
        require(stakes_count[msg.sender] > 0, "No stake found");
        require(
            block.timestamp > stakes_pool[msg.sender][_stakeId].timeStake,
            "Time period has not elapsed."
        );
        require(
            stakes_pool[msg.sender][_stakeId].amt > 0,
            "Reward alredy withdrawn"
        );

        Provide[] storage thisDevice = deviceDetails[_deviceID];

        for (uint256 i = 0; i < thisDevice.length; i++) {
            if (thisDevice[i].recipient == msg.sender) {
                for (uint256 j = 0; j < allDevices.length; j++) {
                    bool same = compare(
                        thisDevice[i].description,
                        allDevices[j]
                    );
                    if (same == true) {
                        delete allDevices[j];
                    }
                }
            }
        }
        for (uint256 i = 0; i < thisDevice.length; i++) {
            if (thisDevice[i].recipient == msg.sender) {
                require(
                    msg.sender == thisDevice[i].recipient,
                    "Not the owner of this device"
                );
                delete thisDevice[i];
            }
        }

        stakes_pool[msg.sender][_stakeId] = Stake(_stakeId, 0, block.timestamp);
        require(
            token.transferFrom(address(this), msg.sender, FIXED_STAKE),
            "Stake transfer failed"
        );
    }

    struct Request {
        uint256 devID;
        uint256 hrsToStake;
    }
    mapping(uint256 => Request[]) public requesters;
    uint256 reqCount;
}

//     struct Provide {
//         string description;
//         uint256 space;
//         uint256 hrs;
//         uint256 tokenRate;
//         uint256 id;
//     }
//     mapping(address => Provide) public providers;
//     mapping(uint256 => Provide) public deviceDetails;
//     uint256 public deviceID;

//     string[] allDevices;

//     function addDevice(
//         string memory _description,
//         uint256 _space,
//         uint256 _hrs,
//         uint256 _tokenrate
//     ) public {
//         Provide storage newProvide = providers[msg.sender];
//         newProvide.description = _description;
//         newProvide.space = _space;
//         newProvide.hrs = _hrs;
//         newProvide.tokenRate = _tokenrate;

//         allDevices.push(_description);

//         Provide storage newDevice = deviceDetails[deviceID];
//         deviceID++;
//         newDevice.description = _description;
//         newDevice.space = _space;
//         newDevice.hrs = _hrs;
//         newDevice.tokenRate = _tokenrate;
//     }

//     function getAllDevices() public view returns (string[] memory) {
//         return (allDevices);
//     }

//     function getDeviceByProvider() public view returns (string memory) {
//         Provide storage thisProvide = providers[msg.sender];
//         return (thisProvide.description);
//     }

//     function getDeviceByDeviceID(
//         uint256 _deviceID
//     ) public view returns (string memory, uint256, uint256, uint256) {
//         Provide storage thisDevice = deviceDetails[_deviceID];
//         return (
//             thisDevice.description,
//             thisDevice.hrs,
//             thisDevice.space,
//             thisDevice.tokenRate
//         );
//     }
// }
