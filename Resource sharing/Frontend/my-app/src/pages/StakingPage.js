import './StakingPage.css';
import { Contract, providers, utils } from "ethers";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { APYCONTRACT_ADDRESS,abiAPY,tokenABI,token_Contract_Address } from "../constants";
function App() {
  const [walletConnected, setWalletConnected] = useState(false);  
  const [amountStake, setAmountStake] = useState(0);
  const [amountWithdraw, setAmountWithdraw] = useState(0);
  const [stakeId, setStakeId] = useState(0);
  const [rewardWithdraw, setRewardWithdraw] = useState("0");
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [owner, setOwner] = useState("");
  const [instantWithdrawl, setInstantWithdrawl] = useState(false);
  const [stakingTime,setStakingTime] = useState("0");
  const [rewards, setRewards] = useState("0");
  const [minimumStakingTime, setMinimumStakingTime] = useState(undefined);
  const [APY, setAPY] = useState("0");
  const [fixedAPY, setFixedAPY] = useState(0);
  const [stakeCount, setStakeCount] = useState("");
    const [stakeTimestamp, setStakeTimeStamp] = useState("");
  const [stakedAmount, setStakedAmount] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [newDate, setNewDate] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [totalStakedAmount, setTotalStakeAmount] = useState("");
    const [deviceShare, setDeviceShare] = useState("");

  const web3ModalRef = useRef();

  const setDeviceShareContract = async () => {
    try {
     const signer = await getProviderOrSigner(true);
      const contract = new Contract(APYCONTRACT_ADDRESS, abiAPY, signer);
      const tx = await contract.setDeviceShareContract(deviceShare);
      await tx.wait();
    }
    catch (e) {
      console.log(e);
        const message = e.message.toString();
      const reason = message.slice(message.indexOf("\""),message.indexOf(","));
      window.alert(reason);
      }
  }
    const getTotalStakeAmount = async () => {
      try {
        const provider = await getProviderOrSigner();
        const signer = provider.getSigner();
    const APYcontract = new Contract(APYCONTRACT_ADDRESS, abiAPY, signer);
        const tx = await APYcontract.getTotalStakeByProvider(await signer.getAddress());
      setTotalStakeAmount((utils.formatEther(tx.toString())).toString()); 
      console.log(tx.toString());
    } catch (e) {
      console.log(e);
    }

  }
  const update_Staking_Time = async() => {
    try {
      const signer = await getProviderOrSigner(true);
      const APYcontract = new Contract(APYCONTRACT_ADDRESS, abiAPY, signer);
      console.log(newDate);
      const time = (new Date(newDate)).getTime();
      console.log(time,"id:",stakeId);
      const tx = await APYcontract.set_STAKING_TIME(time / 1000, stakeId);
      setTransactionHash(tx.hash)
      console.log(transactionHash)
      setLoading(true);
      await tx.wait();
      setLoading(false);
      clearInput();
    } catch (e) {
      console.log(e)
    }
  }
  const changeOwner = async () => {

try{   const signer = await getProviderOrSigner(true);
  const APYcontract = new Contract(APYCONTRACT_ADDRESS, abiAPY, signer);
  const tx = await APYcontract.changeOwner(newOwner);
   setTransactionHash(("https://testnet.bscscan.com/tx/"+tx.hash))
  setLoading(true);
  await tx.wait();
  setLoading(false);
  setOwner(newOwner);
  clearInput();
} catch (e) {
  console.log(e.message);
}
}
    const getStakeAmount = async () => {
      try {
        const provider = await getProviderOrSigner();
        const signer = provider.getSigner();
        const address=await signer.getAddress();
    const APYcontract = new Contract(APYCONTRACT_ADDRESS, abiAPY, provider);
        const tx = await APYcontract.getStakeAmount(address, stakeId);
        console.log(tx);
      setStakedAmount((utils.formatEther(tx.toString())).toString()); 
      console.log(tx.toString());
    } catch (e) {
      console.log(e);
    }
  }
  const getStakeTimestamp = async () => {
      try {
        const provider = await getProviderOrSigner();
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log(address);
    const APYcontract = new Contract(APYCONTRACT_ADDRESS, abiAPY, provider);
        const tx = await APYcontract.getStakeTimestamp(address, stakeId);
        const date = new Date(Number(tx.toString()) * 1000);
        console.log(Number(tx.toString()) * 1000)
        setStakeTimeStamp(date.toLocaleString()); 
        console.log(date.toLocaleString())
      console.log(date);
    } catch (e) {
      console.log(e);
    }

  }
    const getStakeCount = async () => {
      try {
        const provider = await getProviderOrSigner();
        const signer = provider.getSigner();
        const address=await signer.getAddress();
    const APYcontract = new Contract(APYCONTRACT_ADDRESS, abiAPY, provider);
    const tx = await APYcontract.getTotalStakesCount(address);
      setStakeCount((tx.toString())); 
      console.log(tx.toString());
    } catch (e) {
      console.log(e);
    }

  }
  const getFixedAPY = async () => {
    try{const provider = await getProviderOrSigner();
    const APYcontract = new Contract(APYCONTRACT_ADDRESS, abiAPY, provider);
    const tx = await APYcontract.get_FIXED_APY();
      setAPY((tx.toString())); 
      console.log(tx.toString());
    } catch (e) {
      console.log(e);
    }

  }
  

   const updateAPY = async () => {
    try {
      if (Number(fixedAPY) > 0)
       { 
      const signer = await getProviderOrSigner(true);
        const APYcontract = new Contract(APYCONTRACT_ADDRESS, abiAPY, signer);
        console.log(Number(APY))
        const tx = await APYcontract.set_FIXED_APY(Number(fixedAPY));
         setTransactionHash(tx.hash)
        await tx.wait();
    setLoading(true);
    await tx.wait();
        setLoading(false);
        setAPY(fixedAPY);
        window.alert("changed APY time Successfully")
        clearInput();
      }
      else {
        window.alert("Enter valid number")
      }
    } catch (e) {
      console.log(e)
    }

  }

  const updateMinimumStakingTime = async () => {
    try {
      if (Number(minimumStakingTime) > 0)
       { 
      const signer = await getProviderOrSigner(true);
    const APYcontract = new Contract(APYCONTRACT_ADDRESS, abiAPY, signer);
        const tx = await APYcontract.updateMinimumStakingTime(minimumStakingTime);
         setTransactionHash(tx.hash)
    setLoading(true);
    await tx.wait();
    setLoading(false);
        window.alert("changed Staking time Successfully")
        clearInput();
      }
      else {
        window.alert("Enter valid number")
      }
    } catch (e) {
      console.log(e)
    }

  }
  const withdrawRewards = async () => {
     const signer = await getProviderOrSigner(true);
    const APYcontract = new Contract(APYCONTRACT_ADDRESS, abiAPY, signer);
    const amt=utils.parseEther(rewardWithdraw);
    const tx = await APYcontract.withdrawReward(amt);
     setTransactionHash(tx.hash)
    setLoading(true);
    await tx.wait();
    setLoading(false);
    clearInput();
  }
  const getRewards = async () => {
    try {
      const provider = await getProviderOrSigner();
    const signer = provider.getSigner();
    const address=await signer.getAddress();
    const APYcontract = new Contract(APYCONTRACT_ADDRESS, abiAPY, provider);
    const tx = await APYcontract.getRewardsWithdrawable(address);
    const reward = utils.formatEther(tx.toString());
    console.log(reward);
      setRewards(reward.toString());
      console.log(reward)
    } catch (e) {
      console.log(e)
    }
    
  }

  async function getWithdrawlTime() {
    try {
       const provider = await getProviderOrSigner();
    const APYcontract = new Contract(APYCONTRACT_ADDRESS, abiAPY, provider);
    let tx = await APYcontract.instant_withdrawl_allowed();
    setInstantWithdrawl(tx);
    tx = await APYcontract.MINIMUM_STAKING_TIME();
    setStakingTime(Number(tx)/(60*60*24));
    } catch (e) {
      console.log(e)
    }
   
}


  const getOwner = async () => {
  try{  const provider = await getProviderOrSigner();
    const signer = provider.getSigner();
    const address=await signer.getAddress();
    const APYcontract = new Contract(APYCONTRACT_ADDRESS, abiAPY, provider);
    const Owner = await APYcontract.getOwner();
     setOwner(Owner);
    if (Owner == address) {
      setIsOwner(true);
     
    }
  } catch (e) {
    console.error(e);
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
  try{  const provider = await web3ModalRef.current.connect();
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
  
  
    async function depositeStake() {
    if (amountStake <= 0) {
      window.alert("Enter a valid amount");
    }
    else {
      try {
        const signer = await getProviderOrSigner(true);
        const APYcontract = new Contract(APYCONTRACT_ADDRESS, abiAPY, signer);
        const tokenContract = new Contract(token_Contract_Address, tokenABI, signer);
        const amountWei = utils.parseEther(amountStake.toString());
          console.log(amountWei);
          console.log(APYCONTRACT_ADDRESS   );
        let tx = await tokenContract.approve(
          APYCONTRACT_ADDRESS,
          amountWei.toString()
        );
      setLoading(true);
      await tx.wait();
        tx = await APYcontract.depositStake(amountWei);
             setTransactionHash(tx.hash)
        await tx.wait();
        setLoading(false);
        window.alert("Transaction successful");
        clearInput();
        
      } catch (e) {
        console.log(e);
      }
    
      
    }

  }
  
  async function withdraw() {
    if (Number(stakeId) > 0 && Number(amountWithdraw) > 0) {
      try {
        const signer = await getProviderOrSigner(true);
        const APYcontract = new Contract(APYCONTRACT_ADDRESS, abiAPY, signer);
        console.log(amountWithdraw);
        const amountWei = utils.parseEther(amountWithdraw.toString());
        console.log(amountWei,"id:",stakeId);
        const tx = await APYcontract.withdrawStake(amountWei, stakeId);
             setTransactionHash(tx.hash)

        setLoading(true);
        await tx.wait();
        setLoading(false);
        clearInput();
        window.alert("Transaction successful");
        
      } catch (e) {
        console.log(e);
      }
    }
    else {
      window.alert("Enter valid Amount");
    }
  }

  async function toggleInstantWithdrawl() {
    try{const signer = await getProviderOrSigner(true);
    const APYcontract = new Contract(APYCONTRACT_ADDRESS, abiAPY, signer);
      const tx = await APYcontract.toggleWithdrawlInstantOrMonthly();
           setTransactionHash(tx.hash)

    await tx.wait();
      window.alert("Instant Withdrawl changed");
      clearInput();
    } catch (e) {
      console.error(e);
    }
  }
  
  const clearInput = () => {
    var tags = document.getElementsByClassName('clear');
    for(var i=0; i< tags.length; i++){
    tags[i].value = "";
}

  }
  useEffect(() => {
    if (!walletConnected) {
            web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      getOwner();
      getWithdrawlTime();
      // getRewards();
      // getFixedAPY();

    }
    
  },[walletConnected]);
  
  const toogleInstantWithdrawl_Button = () => {
    if (isOwner) {
      return (<>
        <div class="input-bar">
          <input type="text" value={instantWithdrawl ? "Instant Withdrawl Allowed" : `Minimum ${stakingTime} days`} disabled={ true} />
        <button type="submit" onClick={toggleInstantWithdrawl} disabled={loading}>toggleWithdrawlInstantOrMonthly</button>
          </div>
      </>);
    }
  }

  const change_Minimum_StakeTime_Button = () => {
    if (isOwner) {
      return (
          <div class="input-bar">
          <input type="text" placeholder="Update Minimum Stake time In days Eg: 30 " onChange={(e) => { setMinimumStakingTime(e.target.value) }} className="clear"/>
        <button type="submit" onClick={updateMinimumStakingTime} disabled={loading}>updateMinimumStakingTime</button>
      </div>
      );
     
    }
  }
  const change_APY_Button = () => {
    if (isOwner) {
      return (
      <div class="input-bar">
          <input type="text" placeholder="Update APY in percent Eg. 12" onChange={(e) =>{setFixedAPY(e.target.value)} } className="clear"/>
        <button type="submit" onClick={updateAPY} disabled={loading}>set_FIXED_APY</button>
      </div>);
     
    }
  }
    const change_OWNER_Button = () => {
    if (isOwner) {
      return (
      <div class="input-bar">
          <input type="text" placeholder="Change Owner Eg. Address of owner" onChange={(e) => {setNewOwner(e.target.value) }} className="clear"/>
        <button type="submit" onClick={changeOwner} disabled={loading}>changeOwner</button>
      </div>);
     
    }
  }

  return (
    <div className="container">
     
       <div class="left-side">
    
    <div class="details">
          <div class="detail-item">
        <button class="get-button" onClick={getOwner}>Get Owner</button>
        <div class="detail"><b>{owner}</b>   Public Key Of Owner</div>
      </div>
          <div class="detail-item">
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
          </div>
          
           <div class="detail-item">
            <button class="get-button" onClick={getTotalStakeAmount}>Get Stake Amount</button>
        <div class="detail">{totalStakedAmount} </div>Token
      </div>
        </div>
         <div className="details link">
          <h1>Verify your transaction on</h1>
          <a href={`https://testnet.bscscan.com/tx/${transactionHash}`}><h5>{ transactionHash===""?"":" BSC Scan here"}</h5></a>
      </div>
      </div>
      
      <div class="right-side">
    <h2></h2>
    <div>
          <div class="input-bar">
               <label>depositStake</label>
              <input type="text" placeholder="Amount to be staked in token Eg. 20" onChange={(e) => {  setAmountStake(e.target.value)} } className="clear"/>
        <button type="submit" onClick={depositeStake} disabled={loading}>depositStake</button>
            
      </div>
          <div class="input-bar">
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
          
          {isOwner? <div class="input-bar">
              <label>Set Device Contract(OnlyOwner)</label>
              <input type="text" placeholder="Address" className="clear" onChange={(e) => setDeviceShare(e.target.value)} />
              <button type="submit" onClick={setDeviceShareContract}>Withdraw Provider Tokens</button>
            </div>:<></>}
        </div>
  </div>
    </div>
  );
}
export default App;
