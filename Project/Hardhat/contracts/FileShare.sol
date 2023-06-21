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
        address requesterAddress;
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
        uint256 id;
        address payable recipient;
        uint256[] space;
        uint256[] hrs;
        uint256 timestamp;
        bool[] engage;
    }
    mapping(uint256 => Provide) public providers;
    uint256 public ProId;

    uint256 stake_id;

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
    ) public  {
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
        newProvide.id = ProId;

        stake_id = ++stakes_count[msg.sender];

        stakes_pool[msg.sender][stake_id] = Stake(
            stake_id,
            FIXED_STAKE,
            block.timestamp
        );
    }

    function addDevicesByProvider(
        uint256 _proId,
        uint256 _newDeviceId,
        uint256 _newspace,
        uint256 _newTime,
        string memory _newDescription
    ) public {
        Provide storage thisProvide = providers[_proId];
        thisProvide.description.push(_newDescription);
        thisProvide.deviceId.push(_newDeviceId);
        thisProvide.space.push(_newspace);
        thisProvide.hrs.push(_newTime);
        thisProvide.engage.push(false);

        stake_id = ++stakes_count[msg.sender];
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
        for (i = 0; i < (thisProvide.deviceId).length; i++) {
            if (thisProvide.deviceId[i] == _deviceIdReq) {
                require(
                    thisProvide.space[i] >= _spaceReq,
                    "The provider does not have enoungh space left."
                );
                require(
                    thisProvide.hrs[i] >= _timeReq,
                    "Excedding time limit set by provider"
                );
                require(
                    thisProvide.deviceId[i] == _deviceIdReq,
                    "The device Id does not match"
                );
                require(
                    thisProvide.engage[i] == false,
                    "The provider is already busy, no resources available."
                );
                  require(
                    token.transferFrom(
                        msg.sender,
                        address(this),
                        FIXED_STAKE
                    ),
                    "Payemnt unsuccessful"
                );
                Request storage newRequest = requests[ReqId];
                ReqId++;
                newRequest.devName = _deviceDespReq;
                newRequest.requesterAddress = msg.sender;
                newRequest.providerAddress = thisProvide.recipient;
                newRequest.needIdDevice = _deviceIdReq;
                newRequest.deviceProId = _proId;
                newRequest.timeReq = _timeReq; //New time variable in stuct requester
            }
        }
    }

    function approve(
        uint256 _devId,
        uint256 _proId,
        uint256 _reqId
    ) public {
        Provide storage thisProvide = providers[_proId];
        uint256 i;
        for (i = 0; i < (thisProvide.deviceId).length; i++) {
            if (thisProvide.deviceId[i] == _devId) {
                require(
                    thisProvide.deviceId[i] == _devId,
                    "The device Id does not match"
                );
                require(
                    thisProvide.engage[i] == false,
                    "The provider is already busy, no resources available."
                );
                thisProvide.engage[i] = true;
                thisProvide.timestamp = block.timestamp;              
            }
        }
    }

    function unapprove(
        uint256 _devId,
        uint256 _proId,
        uint256 _reqId
    ) public {
        Provide storage thisProvide = providers[_proId];
        uint256 i;
        for (i = 0; i < (thisProvide.deviceId).length; i++) {
            if (thisProvide.deviceId[i] == _devId) {
                Request storage thisRequest = requests[_reqId];
                require(
                    token.transferFrom(
                        owner,
                        thisRequest.requesterAddress,
                        thisProvide.hrs[i]
                    ),
                    "Payemnt unsuccessful"
                );
            }
        }
    }

    string[] availableDevices;

    function storeAllAvailableDevices(uint256 _proIdAvailable) public {
        Provide storage thisProvide = providers[_proIdAvailable];
        for (uint256 j = 0; j < availableDevices.length; j++) {
            availableDevices.pop();
        }
        for (uint256 i = 0; i < (thisProvide.description).length; i++) {
            if (thisProvide.engage[i] == false) {
                availableDevices.push((thisProvide.description[i]));
            }
        }
    }

    function getAllAvailableDevices() public view returns (string[] memory) {
        return (availableDevices);
    }

    function getRequesterDetails(
        uint256 _reqId
    ) public view returns (string memory, address,address, uint256, uint256, uint256) {
        Request storage thisRequest = requests[_reqId];
        return (
            thisRequest.devName,
             thisRequest.requesterAddress,
            thisRequest.providerAddress,
            thisRequest.needIdDevice,
            thisRequest.deviceProId,
            thisRequest.timeReq
        );
    }

    function finishUseByProvider(
        uint256 _proId,
        uint256 _stakeId,
        uint256 amount,
        uint256 devId
    ) public {
        require(stakes_count[msg.sender] > 0, "No stake found");
        require(
            block.timestamp > stakes_pool[msg.sender][_stakeId].timeStake,
            "Time period has not elapsed."
        );
        Provide storage thisProvide = providers[_proId];
        uint256 i;
        for (i = 0; i < (thisProvide.deviceId).length; i++) {
            if (thisProvide.deviceId[i] == devId) {
                thisProvide.engage[i] = false;
            }
        }
        uint256 reward = calRewardPerDevice(msg.sender, _stakeId);

        rewards_earned[msg.sender] += reward;

        uint256 newAmount = stakes_pool[msg.sender][_stakeId].amt - amount;
        stakes_pool[msg.sender][_stakeId] = Stake(
            _stakeId,
            newAmount,
            block.timestamp
        );

        require(token.transfer(msg.sender, amount), "Stake withdrawal failed");
    }

    function calRewardPerDevice(
        address _provider,
        uint256 _stakeId
    ) public view returns (uint256) {
        uint256 amount = stakes_pool[_provider][_stakeId].amt;
        uint256 timestamp = stakes_pool[_provider][_stakeId].timeStake;
        uint256 timeElapsed = block.timestamp - timestamp;

        return (amount * timeElapsed) / (100 * SECONDS_IN_YEAR);
    }

    function getStakeAmount(
        address staker,
        uint256 stakeId
    ) public view returns (uint256) {
        return stakes_pool[staker][stakeId].amt;
    }

    function getStakeTimestamp(
        address staker,
        uint256 stakeId
    ) public view returns (uint256) {
        return stakes_pool[staker][stakeId].timeStake;
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

    // function finishUseByRequester(uint256 _deviceId, uint256 _providerId, uint256 _time, uint256 _requesterId) public {
    //     Request storage thisRequest = requests[_requesterId];
    //     require(
    //         thisRequest.timeReq >= _time,
    //         "Exceeded time limit"
    //     );

    // }

    // function finishUse();
    // function proStop();
}