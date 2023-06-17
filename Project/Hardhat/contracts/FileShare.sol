// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract FileShare {
    uint256 public FIXED_STAKE;
    uint256 public REWARD_PER_HOUR;
    uint256 private constant SECONDS_IN_YEAR = 31536000; // Number of seconds in a year (365 days)
    address private owner;

    IERC20 private token;

    constructor(
        address tokenAddress,
        uint256 _FIXED_STAKE,
        uint256 _REWARD_PER_HOUR
    ) {
        token = IERC20(tokenAddress);
        owner = msg.sender;
        FIXED_STAKE = _FIXED_STAKE;
        REWARD_PER_HOUR = _REWARD_PER_HOUR;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    //New request format
    struct Request {
        string devName;
        address providerAddress;
        uint256 needIdDevice;
        uint256 deviceProId;
        uint256 timeReq;
    }
    mapping(uint => Request) public requests;
    uint256 public ReqId;

    struct Provide {
        string[] description;
        uint256[] deviceId;
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
        uint256 _deviceId,
        uint256 _space,
        uint256 _hours
    ) public payable returns (uint256) {
        Provide storage newProvide = providers[ProId];
        ProId++;
        require(
            token.transferFrom(msg.sender, address(this), FIXED_STAKE),
            "Stake transfer failed"
        );
        newProvide.description.push(_description);
        newProvide.deviceId.push(_deviceId);
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
        uint256 _newDeviceId,
        uint256 _newspace,
        string memory _newDescription
    ) public {
        Provide storage thisProvide = providers[_proId];
        ++count;
        thisProvide.description.push(_newDescription);
        thisProvide.deviceId.push(_newDeviceId);
        thisProvide.space.push(_newspace);
        thisProvide.engage.push(false);

        uint256 stake_id = ++stakes_count[msg.sender];
        stakes_pool[msg.sender][stake_id] = Stake(
            stake_id,
            FIXED_STAKE,
            block.timestamp
        );
    }

    function makeRequestToProvider(
        uint256 _proId,
        uint256 _spaceReq,
        string calldata _deviceDespReq,
        uint256 _deviceIdReq,
        uint256 _timeReq
    ) public {
        Provide storage thisProvide = providers[_proId];
        uint256 i;
        string storage str = (thisProvide.description)[i];
        for (i = 0; i < (thisProvide.description).length; i++) {
            if (compare(str, _deviceDespReq)) {
                require(
                    thisProvide.space[i] >= _spaceReq,
                    "The provider does not have enoungh space left."
                );
                require(
                    thisProvide.hrs >= _timeReq,
                    "Excedding time limit set by provider"
                );
                require(
                    thisProvide.deviceId[i] >= _deviceIdReq,
                    "The device Id does not match"
                );
                require(
                    thisProvide.engage[i] == false,
                    "The provider is already busy, no resources available."
                );
                bool approved = approval(msg.sender, _deviceIdReq, _timeReq);
                if (approved == true) {
                    thisProvide.engage[i] = true;
                    thisProvide.timestamp = block.timestamp;
                    Request storage newRequest = requests[ReqId];
                    ReqId++;
                    newRequest.devName = _deviceDespReq;
                    newRequest.providerAddress = thisProvide.recipient;
                    newRequest.needIdDevice = _deviceIdReq;
                    newRequest.deviceProId = _proId;
                    newRequest.timeReq = _timeReq; //New time variable in stuct requester
                }
            }
        }
    }

    function approval(
        address requester,
        uint256 devId,
        uint256 timeRequest
    ) public returns (bool) {
        return true;
    }

    function getAllAvailableDevices(
        uint256 _proIdAvailable
    ) public view returns (string[] memory availableDevices) {
        Provide storage thisProvide = providers[_proIdAvailable];
        uint index;
        for (uint256 i = 0; i < (thisProvide.description).length; i++) {
            if (thisProvide.engage[i]) {
                availableDevices[index] = (thisProvide.description[i]);
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
