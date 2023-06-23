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
        string[] description;
        uint256[] space;
        uint256[] hrs;
        uint256[] tokenRate;
        uint256[] devid;
        bool[] engage;
        address payable recipient;
    }

    struct DeviceDetails {
        string description;
        uint256 space;
        uint256 hrs;
        uint256 tokenRate;
        uint256 devid;
        bool engage;
        address payable recipient;
    }
    mapping(address => Provide) public providers;
    mapping(uint256 => DeviceDetails) public deviceDetails;

    uint256 public deviceID;

    uint256 stake_id;

    struct Stake {
        uint256 stakeId;
        uint256 amt;
        uint256 timeStake;
    }
    mapping(address => uint256) private stakes_count;
    mapping(address => uint256) private rewards_earned;
    mapping(address => mapping(uint256 => Stake)) private stakes_pool;

    string[] allDevices;

    event DeviceAdded(uint256 indexed idOfDevice, uint256 indexed idOfStake);

    function addDevice(
        string memory _description,
        uint256 _space,
        uint256 _hrs,
        uint256 _tokenrate
    ) public {
        Provide storage newProvide = providers[msg.sender];
        newProvide.description.push(_description);
        newProvide.space.push(_space);
        newProvide.hrs.push(_hrs);
        newProvide.engage.push(false);
        newProvide.recipient = payable(msg.sender);
        newProvide.tokenRate.push(_tokenrate);

        allDevices.push(_description);

        DeviceDetails storage newDevice = deviceDetails[deviceID];
        newDevice.description = _description;
        newDevice.space = _space;
        newDevice.hrs = _hrs;
        newDevice.engage = false;
        newDevice.recipient = payable(msg.sender);
        newDevice.devid = deviceID;
        newDevice.tokenRate = _tokenrate;

        require(
            token.transferFrom(msg.sender, address(this), FIXED_STAKE),
            "Stake transfer failed"
        );

        stake_id = ++stakes_count[msg.sender];

        stakes_pool[msg.sender][stake_id] = Stake(
            stake_id,
            FIXED_STAKE,
            block.timestamp
        );

        emit DeviceAdded(deviceID, stake_id);
         ++deviceID;
    }

    function getAllDevices() public view returns (string[] memory) {
        return (allDevices);
    }

    function getDeviceByProvider() public view returns (string[] memory) {
        Provide storage thisProvide = providers[msg.sender];
        return (thisProvide.description);
    }

    function getDeviceByDeviceID(
        uint256 _deviceID
    ) public view returns (string memory, uint256, uint256, uint256) {
        DeviceDetails storage thisDevice = deviceDetails[_deviceID];
        return (
            thisDevice.description,
            thisDevice.hrs,
            thisDevice.space,
            thisDevice.tokenRate
        );
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

        DeviceDetails storage thisDevice = deviceDetails[_deviceID];

        for (uint256 j = 0; j < allDevices.length; j++) {
            bool same = compare(thisDevice.description, allDevices[j]);
            if (same == true) {
                delete allDevices[j];
            }
        }

        Provide storage thisProvide = providers[thisDevice.recipient];

        for (uint256 i = 0; i < (thisProvide.description).length; i++) {
            bool sameName = compare(
                thisDevice.description,
                thisProvide.description[i]
            );
            if (sameName == true) {
                thisProvide.description[i] = " ";
                thisProvide.hrs[i] = 0;
                thisProvide.recipient = payable(address(0));
                thisProvide.space[i] = 0;
                thisProvide.tokenRate[i] = 0;
            }
        }

        thisDevice.description = " ";
        thisDevice.hrs = 0;
        thisDevice.recipient = payable(address(0));
        thisDevice.space = 0;
        thisDevice.tokenRate = 0;

    //   token.transfer(msg.sender,FIXED_STAKE);
        require(
            token.transferFrom(address(this), msg.sender, FIXED_STAKE),
            "Stake transfer failed"
        );
        

        stakes_pool[msg.sender][_stakeId] = Stake(_stakeId, 0, block.timestamp);
    }

    struct Requestor {
        uint256 reqID;
        uint256 devID;
        address deviceOwner;
        uint256 hrsStake;
    }
    mapping(uint256 => Requestor) public requestors;
    uint256 public requestorID;

    event RequestAdded(uint256 indexed idOfRequestor);

    // function RequestDeviceUse(uint256 _deviceID, uint256 _hrsToStake) public {
    //     DeviceDetails storage thisDevice = deviceDetails[_deviceID];
    //     ++requestorID;
    //     Requestor storage newRequestor = requestors[requestorID];
    //     newRequestor.reqID = requestorID;
    //     newRequestor.devID = _deviceID;
    //     newRequestor.deviceOwner = thisDevice.recipient;
    //     newRequestor.hrsStake = _hrsToStake;

    //     (thisDevice.requestorsID).push(requestorID);

    //     require(
    //         token.transferFrom(msg.sender, address(this), _hrsToStake),
    //         "Transfer failed"
    //     );

    //     emit RequestAdded(requestorID);
    // }

    function ViewDeviceRequestByRequestor(
        address _deviceOwner,
        uint256 _reqID
    ) public view returns (string memory, uint256, address) {
        Requestor storage thisRequestor = requestors[_reqID];
        DeviceDetails storage thisDevice = deviceDetails[thisRequestor.devID];
        return (thisDevice.description, thisRequestor.hrsStake, _deviceOwner);
    }
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