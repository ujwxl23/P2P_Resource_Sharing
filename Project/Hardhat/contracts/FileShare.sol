// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract FileShare {
    uint256 public FIXED_STAKE;
    string public fixedStake;
    uint256 public REWARD_PER_HOUR;
    uint256 private constant SECONDS_IN_YEAR = 31536000; // Number of seconds in a year (365 days)
    address private owner;

    IERC20 private token;

    constructor(
        address tokenAddress,
        uint256 _FIXED_STAKE,
        string memory _fixedStake,
        uint256 _REWARD_PER_HOUR
    ) {
        token = IERC20(tokenAddress);
        owner = msg.sender;
        FIXED_STAKE = _FIXED_STAKE;
        REWARD_PER_HOUR = _REWARD_PER_HOUR;
        fixedStake=_fixedStake;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
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
        uint256[] hrs;
        uint256 timestamp;
        bool[] engage;
    }
    mapping(uint256 => Provide) public providers;
    uint256 public ProId;

    uint256 public count;

    struct Stake {
        uint256 stakeId;
        uint256 amt;
        uint256 timeStake;
    }
    mapping(address => uint256) private stakes_count;
    mapping(address => uint256) private rewards_earned;
    mapping(address => mapping(uint256 => Stake)) private stakes_pool;

    function createProvide(
        string memory _description,
        string memory _deviceName,
        uint256 _space,
        uint256 _hours
    ) public returns (uint256) {
        Provide storage newProvide = providers[ProId];
        ProId++;
        count = 0;
        token.approve(address(this),FIXED_STAKE);
        require(
            token.transferFrom(msg.sender, address(this), FIXED_STAKE),
            "Stake transfer failed"
        );
        newProvide.description.push(_description);
        newProvide.deviceName.push(_deviceName);
        newProvide.recipient = payable(msg.sender);
        newProvide.space.push(_space);
        newProvide.hrs.push(_hours);
        newProvide.engage.push(false);
        uint256 stake_id = ++stakes_count[msg.sender];

        stakes_pool[msg.sender][stake_id] = Stake(
            stake_id,
            FIXED_STAKE,
            block.timestamp
        );

        return ProId;
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
