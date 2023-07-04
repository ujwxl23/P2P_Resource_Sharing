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
  const [Price_per_hour, setPrice] = useState("");
  const [totalRequests, setTotalRequests] = useState("");
  const [allDevices,setAllDevices]=useState("");
  const [deviceDetail,setDeviceDetail] = useState();
  const [stakeId, setStakeId] = useState("");
  const [engage, setEngage] = useState("");
  const [popup, setPopup] = useState(false);
  async function addDevice() {
    try {
      const signer = await getProviderOrSigner(true);
      const contract = new Contract(CONTRACT_ADDRESS, abi, signer);
      const tokenContract = new Contract(token_Contract_Address, tokenABI, signer);
      let tx = await tokenContract.approve(contract.address, (utils.parseEther("5")).toString());
      await tx.wait();
       tx=await contract.addDevice(des,Number(memory),Number(duration),Number(Price_per_hour));
      await tx.wait();
    } catch (e) {
      console.error(e);
    }
  }
  const getAllDevices = async () => {
    try {
      const provider = await getProviderOrSigner();
      const contract = new Contract(CONTRACT_ADDRESS, abi, provider);
      const data = await contract.getAllDevices();
      let devices="";
      for (let i = 0; i < data.length; i++){
        if (data[i] === "")
          continue;
        devices = devices +"\""+ data[i] +"\""+ "  " ;
      }
      setAllDevices(devices);
    } catch (e) {
      console.log(e);
    }
  }

  const getDevicesByProvider = async () => {
    console.log("Hiii");
    try {
      const signer = await getProviderOrSigner(true);
      const contract = new Contract(CONTRACT_ADDRESS, abi, signer);
      const data = await contract.getDeviceByProvider();
      // setDeviceDetail(data);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  }
    
    const getDevicesByDeviceId = async () => {
    try {
      const provider = await getProviderOrSigner();
      const contract = new Contract(CONTRACT_ADDRESS, abi, provider);
      const data = await contract.getDeviceByDeviceID(deviceId);
      console.log(data);
      setDes(data[0]);
      setDuration((data[1]).toString() + " hrs")
      setMemory((data[2]).toString() + " GB")
      setPrice((data[3]).toString()+" token Rate per hour");
      setEngage(data[4]?"Device In Use":"Device Not in use");
      setPopup(true);
    } catch (e) {
      console.log(e);
    }
    }
  
  
  const removeDevice = async () => {
   try{ const signer = await getProviderOrSigner(true);
    const contract = new Contract(CONTRACT_ADDRESS, abi, signer);
    const tx =await contract.removeDevice(Number(deviceId));
     await tx.wait();
   } catch (e) {
     console.error(e);
    }
  }
  const requestProvider = async () => {
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
     tx = await contract.RequestDeviceUse(Number(deviceId),Number(requiredDuration));
    await tx.wait();
    }
    catch (e) {
      console.log(e);
    }
    
  }
  const ViewDeviceRequestByRequestor = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const contract = new Contract(CONTRACT_ADDRESS, abi, signer);
      const data =await contract.ViewDeviceRequestByRequestor();
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  }

  const AcceptDeviceRequestByProvider= async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const contract = new Contract(CONTRACT_ADDRESS, abi, signer);
      console.log(contract.address);
      setLoading(true);
    const tx = await contract.AcceptDeviceRequestByProvider(Number(deviceId));
      await tx.wait();
      setLoading(false);
      window.alert("Request Approved");
    }
    catch (e) {
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
  
  
  
  const CardDevice = () => {
    return (<>
      <div>
        <p>
          {des}
        </p>
        <p>
          {duration}
        </p>
         <p>
          {memory}
        </p>
        <p>
          {Price_per_hour} 
        </p>
         <p>
          {engage}
        </p>
      </div>
    </>);
  }

    const CardRequest = () => {
    return (<>
      <div>
        <p>
          {des}
        </p>
        <p>
          {duration}
        </p>
         <p>
          {memory}
        </p>
        <p>
          {Price_per_hour} 
        </p>
         <p>
          {engage}
        </p>
      </div>
    </>);
  }
    return (
      <div className="container">
     
        <div class="left-side">
    
          <div class="details">
             <div class="detail-item">
        <button class="get-button" onClick={getAllDevices}>Get All devices</button>
        <div class="detail">{allDevices}</div>
      </div>
          <div class="detail-item">
              <button class="get-button" onClick={getDevicesByProvider}>Get Device by Provider</button>
        <div class="detail">{}</div>
            </div>
             <div class="detail-item">
              <button class="get-button" onClick={getDevicesByDeviceId}>Get Device Details Id</button>
                          <input placeholder="Stake ID" onChange={(e)=>{setDeviceId(e.target.value)}}></input>
              <div class="detail">{deviceDetail}</div>

              
            </div>
                          <CardDevice></CardDevice>

              <div class="detail-item">
              <button class="get-button" onClick={ViewDeviceRequestByRequestor}>Get Request Details</button>
        {/* <div class="detail">{deviceDetail}</div> */}
            </div>
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
              <input type="text" placeholder="Device Description EG: Device name " className="clear" onChange={(e) => setDes(e.target.value)} />
              <input type="text" placeholder="memory of system in GB" className="clear" onChange={(e) => setMemory(e.target.value)} />
              <input type="text" placeholder="No. of hours to engage your device Eg: 2 hrs" className="clear" onChange={(e) => setDuration(e.target.value)} />
              <input type="text" placeholder="Rate Per hour Eg: 1 token" className="clear" onChange={(e) => setPrice(e.target.value)} />
              
              <button type="submit" onClick={addDevice}>CreateProvider</button>
            </div>
             <div class="input-bar">
              <label>Remove Device</label>
              <input type="text" placeholder="Device Id" className="clear" onChange={(e) => setDeviceId(e.target.value)} />
              <input type="text" placeholder="Stake Id" className="clear" onChange={(e) => setStakeId(e.target.value)} />
              <button type="submit" onClick={removeDevice}>Remove Device</button>
            </div>
            
                 <div class="input-bar">
              <label>Request Provider</label>
              <input type="text" placeholder="Device ID" className="clear" onChange={(e) => setDeviceId(e.target.value)} />
              <input type="text" placeholder="time required in hrs" className="clear" onChange={(e) => setRequiredDuration(e.target.value)} />
              <button type="submit" onClick={requestProvider}>Request Provider</button>
            </div>
               <div class="input-bar">
              <label>Accept Request</label>
              <input type="text" placeholder="Device ID" className="clear" onChange={(e) => setDeviceId(e.target.value)} />
              <button type="submit" onClick={AcceptDeviceRequestByProvider}>Accept Request</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default App;
