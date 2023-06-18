import logo from './logo.svg';
import './App.css';
import { Contract, providers, utils } from "ethers";
import React, { useEffect, useRef, useState } from "react";
import { CONTRACT_ADDRESS, abi, token_Contract_Address, tokenABI } from "./constants";

import Web3Modal from "web3modal";
function App() {
  const [des, setDes] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [providerId, setProviderId] = useState("");
  const [memory, setMemory] = useState("");
  const [duration, setDuration] = useState("");
  const [deviceRequestId, setDeviceRequestId] = useState("");
  const [requiredMemory, setRequiredMemory] = useState("");
  const [requiredDuration, setRequiredDuration] = useState("");
  const web3ModalRef = useRef();
  const [walletConnected, setWalletConnected] = useState(false);
  const [amountStake, setAmountStake] = useState(5);
  const [loading, setLoading] = useState("false");


  async function createProvider() {
    try {
      const signer = await getProviderOrSigner(true);
      const contract = new Contract(CONTRACT_ADDRESS, abi, signer);
      const tokenContract = new Contract(token_Contract_Address, tokenABI, signer);
      const amountWei = utils.parseEther(amountStake.toString());
      console.log(amountWei);
      let tx = await tokenContract.approve(
        CONTRACT_ADDRESS,
        amountWei.toString()
      );
      setLoading(true);
      await tx.wait();
      tx = await contract.createProvide(des, Number(deviceId), Number(memory), Number(duration));
      await tx.wait();
      setLoading(false);
      window.alert("Transaction successful");

    } catch (e) {
      console.log(e);
    }
  }


  const addNewDevice = async () => {
     const signer = await getProviderOrSigner(true);
    const contract = new Contract(CONTRACT_ADDRESS, abi, signer);
    
  }
  const requestProvider = async () => {
          console.log("proId");

    try{const signer = await getProviderOrSigner(true);
      const contract = new Contract(CONTRACT_ADDRESS, abi, signer);
      console.log('------------------------------------');
      console.log(contract);
      console.log('------------------------------------');
      // const proId = await contract.ProId();
      console.log(contract.address);
    // const tx = await contract.makeRequestToProvider(proId, Number(requiredMemory), des, Number(deviceRequestId), Number(requiredDuration));
    // await tx.wait();
    //         const reqId = Number((await contract.ReqId()).toString()) - 1;
    // const request = await contract.requests(reqId);
    // console.log('------------------------------------');
    // console.log(request);
    //   console.log('------------------------------------');
    }
    catch (e) {
      console.log(e);
    }
    
  }
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    try {
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);

      // If user is not connected to the Goerli network, let them know and throw an error
      const { chainId } = await web3Provider.getNetwork();
      if (chainId !== 97) {
        window.alert("Change the network to Binance");
        throw new Error("Change network to Binance");
      }
  

      if (needSigner) {
        const signer = web3Provider.getSigner();
        return signer;
      }
      return web3Provider;
    } catch (e) {
      console.log('------------------------------------');
      console.log(e);
      console.log('------------------------------------');
    }
  };
  

  
    useEffect(() => {
      if (!walletConnected) {
        web3ModalRef.current = new Web3Modal({
          network: "goerli",
          providerOptions: {},
          disableInjectedProvider: false,
        });
        connectWallet();
      }
    
    }, [walletConnected]);
    return (
      <div className="container">
     
        <div class="left-side">
    
          <div class="details">
             <div class="detail-item">
        <button class="get-button" >Get All Available devices of a Provider</button>
        <div class="detail">All available devices of a provider</div>
        <input placeholder="Provider ID"></input>
      </div>
          {/*<div class="detail-item">
        <button class="get-button" onClick={getRewards}>Get Rewards</button>
        <div class="detail">{rewards==0?"":rewards+" Token"}</div>
      </div>
          <div class="detail-item">
        <button class="get-button">Instant Withdrawl</button>
        <div class="detail">{instantWithdrawl?"Allowed":` Minimum ${stakingTime} days`}</div>
          </div>
          <div class="detail-item">
        <button class="get-button" onClick={getFixedAPY}>Get Fixed APY</button>
        <div class="detail">{APY==0?"":APY+" %"}</div>
          </div>
          <div class="detail-item">

        <button class="get-button" onClick={getStakeCount}>Get Stake Count</button>
        <div class="detail">{stakeCount}</div>
          </div>
          <div class="detail-item">
            <button class="get-button" onClick={getStakeTimestamp}>Get Stake TimeStamp</button>
            <input placeholder="Stake ID" onChange={(e)=>{setStakeId(e.target.value)}}></input>
        <div class="detail">{stakeTimestamp}</div>
          </div>
          <div class="detail-item">
            <button class="get-button" onClick={getStakeAmount}>Get Stake Amount</button>
            <input placeholder="Stake ID" onChange={(e)=>{setStakeId(e.target.value)}}></input>
        <div class="detail">{stakedAmount} </div>Token
      </div> */}
          </div>
          <div className="details link">
            <h1>Verify your transaction on</h1>
            <a href="#"><h5></h5></a>
          </div>
        </div>
        <div class="right-side">
          <h2></h2>
          <div>
            <div class="input-bar">
              <label>Create/Register Provider</label>
              <input type="text" placeholder="Device Description" className="clear" onChange={(e) => setDes(e.target.value)} />
              <input type="text" placeholder="Device ID" className="clear" onChange={(e) => setDeviceId(e.target.value)} />
              <input type="text" placeholder="memory of system" className="clear" onChange={(e) => setMemory(e.target.value)} />
              <input type="text" placeholder="No. of hours to engage your device" className="clear" onChange={(e) => setDuration(e.target.value)} />
              <button type="submit" onClick={createProvider}>CreateProvider</button>
            </div>
                 <div class="input-bar">
              <label>Add New Device </label>
              <input type="text" placeholder="Provider ID" className="clear" onChange={(e) => setProviderId(e.target.value)} />
              <input type="text" placeholder="New Device ID" className="clear" onChange={(e) => setDeviceId(e.target.value)} />
              <input type="text" placeholder="memory of system" className="clear" onChange={(e) => setMemory(e.target.value)} />
              <input type="text" placeholder="Device Description" className="clear" onChange={(e) => setDes(e.target.value)} />
              <input type="text" placeholder="No. of hours to engage your device" className="clear" onChange={(e) => setDuration(e.target.value)} />
              <button type="submit" onClick={createProvider}>Add New Device</button>
            </div>
                 <div class="input-bar">
              <label>Request Provider</label>
              <input type="text" placeholder="Required Provider ID" className="clear" onChange={(e) => setDeviceId(e.target.value)} />
              <input type="text" placeholder="Description" className="clear" onChange={(e) => setDes(e.target.value)} />
              <input type="text" placeholder="Your Device ID" className="clear" onChange={(e) => setDeviceRequestId(e.target.value)} />
              <input type="text" placeholder="memory Required" className="clear" onChange={(e) => setRequiredMemory(e.target.value)} />
              <input type="text" placeholder="time required" className="clear" onChange={(e) => setRequiredDuration(e.target.value)} />
              <button type="submit" onClick={requestProvider}>CreateProvider</button>
            </div>
            {/*<div class="input-bar">
          string memory _description,
        uint256 _deviceId,
        uint256 _space,
        uint256 _hours
             <label>withdraw Stake</label>
            <input type="email" placeholder="Stake Id or Transaction Id Eg. 1" onChange={(e) =>setStakeId(e.target.value) } className="clear"/>
            <input type="email" placeholder="Amount to be Withdrawn in APY tokens Eg.20" onChange={(e) => setAmountWithdraw(e.target.value)} className="clear"/>
        <button type="submit" onClick={withdraw} disabled={loading}>withdraw Stake</button>
      </div>
          <div class="input-bar">
            <label>Withdraw Reward</label>
        <input type="text" placeholder="Reward Amount to be Withdrawn In Token Eg 20" onChange={(e) => { setRewardWithdraw(e.target.value) }} className="clear"/>
            <button type="submit" onClick={() => { withdrawRewards(); }} disabled={loading}>Withdraw Reward</button>
          </div>
          {change_Minimum_StakeTime_Button()}
          {toogleInstantWithdrawl_Button()}
          {change_APY_Button()}
          {change_OWNER_Button()}
          <div class="input-bar">
            <label>set_STAKING_TIME</label>
            <input type="text" placeholder="Stake Id Transaction Id Eg. 1" onChange={(e) =>setStakeId(e.target.value) } className="clear"/>
            <input type="date" placeholder="New Staking Time New time of previous Transactions" onChange={(e) => setNewDate(e.target.value)} className="clear"/>
        <button type="submit" onClick={update_Staking_Time} disabled={loading}>set_STAKING_TIME</button>
      </div>
        </div> */}
         
          </div>



  
     
        </div>
      </div>
    );
  }

export default App;
