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
  const [requestId, setRequestId] = useState("");
  const [totalProvider, setTotalProvider] = useState("");
    const [totalRequests, setTotalRequests] = useState("");

  


  async function createProvider() {
    try {
      const signer = await getProviderOrSigner(true);
      const contract = new Contract(CONTRACT_ADDRESS, abi, signer);
      const tokenContract = new Contract(token_Contract_Address, tokenABI, signer);
      const amountWei = utils.parseEther(amountStake.toString());
      console.log(amountWei);
      const tx = await tokenContract.approve(
        CONTRACT_ADDRESS,
        amountWei.toString()
      );
      console.log(contract.address);
      setLoading(true);
      await tx.wait();
      console.log("des:", des, typeof (des));
      console.log("id:", Number(deviceId), typeof (Number(deviceId)));
      console.log("memory:", Number(memory), typeof (Number(memory)));
      console.log("durstion:", Number(duration), typeof (Number(duration)));
      const tr = await contract.createProvide(des, Number(deviceId), Number(memory), Number(duration));
      console.log(tr);  
      await tr.wait();
      setLoading(false);
      window.alert("Transaction successful");

    } catch (e) {
      console.log(e);
    }
  }


  const addNewDevice = async () => {
    //  uint256 _proId,
    //     uint256 _newDeviceId,
    //     uint256 _newspace,
    //     uint256 _newTime,
    //     string memory _newDescription
     try{const signer = await getProviderOrSigner(true);
       const contract = new Contract(CONTRACT_ADDRESS, abi, signer);
       const tx=await contract.addDevicesByProvider(Number(providerId), Number(deviceId), Number(memory),Number(duration), des);
       await tx.wait();
     } catch (e) {
       console.log(e);
    }
    
  }

  const requestProvider = async () => {
          console.log("proId");

    try {
      const signer = await getProviderOrSigner(true);
      const contract = new Contract(CONTRACT_ADDRESS, abi, signer);
      console.log(contract.address);
       const tokenContract = new Contract(token_Contract_Address, tokenABI, signer);
      const amountWei = utils.parseEther("5");
       console.log(amountWei);
      let tx = await tokenContract.approve(
        CONTRACT_ADDRESS,
        amountWei.toString()
      );
      setLoading(true);
      await tx.wait();
      console.log("ID", providerId);
      console.log("memory", requiredMemory);
      console.log("des", des);
      console.log("ID", deviceRequestId);
      console.log("ID", requiredDuration);
     tx = await contract.makeRequestToProvider(Number(providerId), Number(requiredMemory), des, Number(deviceRequestId), Number(requiredDuration));
    await tx.wait();
    // const request = await contract.getRequestDetails(requestId);
    // console.log(request);
    }
    catch (e) {
      console.log(e);
    }
    
  }
  const getRequestDetails = async () => {
    try {
      const provider = await getProviderOrSigner();
      const contract = new Contract(CONTRACT_ADDRESS, abi, provider);
      const data =await contract.getRequesterDetails(Number(requestId));
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  }
    const getTotalProvider = async () => {
    try {
      const provider = await getProviderOrSigner();
      const contract = new Contract(CONTRACT_ADDRESS, abi, provider);
      const data =(await contract.ProId()).toString();
      setTotalProvider(data);
    } catch (e) {
      console.log(e);
    }
    }
    const getTotalRequests = async () => {
    try {
      const provider = await getProviderOrSigner();
      const contract = new Contract(CONTRACT_ADDRESS, abi, provider);
      const data =(await contract.ReqId()).toString();
      setTotalRequests(data);
    } catch (e) {
      console.log(e);
    }
    }
  const approveRequest = async () => {
    try {
       const signer = await getProviderOrSigner(true);
      const contract = new Contract(CONTRACT_ADDRESS, abi, signer);
      console.log(contract.address);
      const tx = await contract.approve(Number(deviceRequestId), Number(providerId), Number(requestId));
      await tx.wait();
    } catch (e) {
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
          <div class="detail-item">
              <button class="get-button" onClick={getRequestDetails}>Get Request Detail</button>
              <input placeholder="Request ID" onChange={(e)=> setRequestId(e.target.value)}></input>
        <div class="detail">Console</div>
            </div>
              <div class="detail-item">
              <button class="get-button" onClick={getTotalRequests}>Get Total request</button>
        <div class="detail">{totalRequests}</div>
            </div>
              <div class="detail-item">
              <button class="get-button" onClick={getTotalProvider}>Get Total Provider</button>
        <div class="detail">{totalProvider}</div>
      </div>
          {/*<div class="detail-item">
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
              <input type="text" placeholder="No. of hours to engage your device" className="clear" onChange={(e) => setDuration(e.target.value)} />
              <input type="text" placeholder="Device Description" className="clear" onChange={(e) => setDes(e.target.value)} />
              <button type="submit" onClick={addNewDevice}>Add New Device</button>
            </div>
                 <div class="input-bar">
              <label>Request Provider</label>
              <input type="text" placeholder="Provider ID" className="clear" onChange={(e) => setProviderId(e.target.value)} />
              <input type="text" placeholder="Description" className="clear" onChange={(e) => setDes(e.target.value)} />
              <input type="text" placeholder="Provider Device ID" className="clear" onChange={(e) => setDeviceRequestId(e.target.value)} />
              <input type="text" placeholder="memory Required" className="clear" onChange={(e) => setRequiredMemory(e.target.value)} />
              <input type="text" placeholder="time required" className="clear" onChange={(e) => setRequiredDuration(e.target.value)} />
              <button type="submit" onClick={requestProvider}>Request Provider</button>
            </div>
              <div class="input-bar">
              <label>Approve Request</label>
              <input type="text" placeholder="Provider ID" className="clear" onChange={(e) => setProviderId(e.target.value)} />
              <input type="text" placeholder="Provider Device ID" className="clear" onChange={(e) => setDeviceRequestId(e.target.value)} />
              <input type="text" placeholder="Request Id" className="clear" onChange={(e) => setRequestId(e.target.value)} />
              <button type="submit" onClick={approveRequest}>Approve Request</button>
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
