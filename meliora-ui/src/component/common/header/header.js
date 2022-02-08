import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

import { truncate, setCurrChain, network } from "../../../utils";
import { ethers } from "ethers";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const { useState, useEffect } = React;


const Header = (props) => {

  const location = useLocation();
  const [menuIdx, setMenuIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(0);
  const [connectWallet, setConnectWallet] = useState("Connect");

  const connect = async () => {
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      if(connectWallet == "Connect"){
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      }

      const signer = await provider.getSigner();
      let userAddress = await signer.getAddress();
      setConnectWallet(truncate(userAddress));
      // window.location.reload();
    } catch (err) {
      alert("Please Unlock metamask wallet")
    }
  }
  const chainIdChange = async (_chainId) => {
    console.log(network.has(parseInt(_chainId)), localStorage.getItem("currChain"))
    if (network.has(parseInt(_chainId))) {
      if (localStorage.getItem("currChain") != _chainId)
        window.location.reload()
    } else {
      alert("This network is not allow....");
      if (localStorage.getItem("currChain") != _chainId ) {
        window.location.reload()
      }
    }
    localStorage.setItem("currChain", _chainId);
  }

  const setUpWeb3 = async () => {
    if (!window.ethereum) {
      alert("No crypto wallet found.");
      setConnectWallet("MetaMask not found")
    } else {

      connect();
      window.ethereum.on('accountsChanged', connect);
      window.ethereum.on('disconnect', () => { console.log("dkfkj") });
      window.ethereum.on('chainChanged', (_chainId) => {
        chainIdChange(_chainId)
      });

      let currChain = await window.ethereum.request({ method: 'eth_chainId' });

      chainIdChange(currChain)

    }

  }



  useEffect(() => {
    if (location.pathname === "/create") {
      setMenuIdx(2);
    } else if (location.pathname === "/token-contract") {
      setMenuIdx(1);
    } else if (location.pathname === "/create2") {
      setMenuIdx(3);
    } else if (location.pathname === "/token-contract2") {
      setMenuIdx(4);
    } else {
      setMenuIdx(0);
    }
    setUpWeb3();


  }, [])

  return (
    <div className="page-main-header">
      <div className="main-header-right">
        <div className="logo-wrapper">
          <Link to={`${process.env.PUBLIC_URL}/projects`}>
            <img
              src={require("../../../assets/images/logo/logo.png")}
              alt=""
            />
          </Link>
        </div>
        <div className={menuOpen ? 'mobile-menu-icon open' : 'mobile-menu-icon'} onClick={() => setMenuOpen(!menuOpen)}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className={menuOpen ? 'nav-menus open' : 'nav-menus'}>
          <Link onClick={() => setMenuIdx(0)} to={`${process.env.PUBLIC_URL}/projects`} className={menuIdx === 0 ? 'active' : ''}>Projects</Link>
          {/* <Link onClick={() => setMenuIdx(1)} to={`${process.env.PUBLIC_URL}/token-contract`} className={menuIdx === 1 ? 'active' : ''}>Token Wizard</Link> */}
          <Link onClick={() => setMenuIdx(2)} to={`${process.env.PUBLIC_URL}/create`} className={menuIdx === 2 ? 'active' : ''}>Create Sale</Link>
          {/* <Link onClick={() => setMenuIdx(3)} to={`${process.env.PUBLIC_URL}/create2`} className={menuIdx === 3 ? 'active' : ''}>Create2</Link>
          <Link onClick={() => setMenuIdx(4)} to={`${process.env.PUBLIC_URL}/token-contract2`} className={menuIdx === 4 ? 'active' : ''}>Token Wizard2</Link> */}
          <div style={{width:"400px"}} className="nav-right mobile">
            <ul>
            
              <FormGroup style={{margin: "0px"}}>
                <Input type="select" name="select" id="exampleSelect"
                  onChange={async (e) => {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const chainId = parseInt(e.target.value);
                    // console.log(await provider.getNetwork(chainId));
                    try{

                      await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: ethers.utils.hexValue(chainId)}], // chainId must be in hexadecimal numbers
                    })}catch(err){
                      console.log(err);
                    }
                  }}>
                  {
                    [...network.keys()].map((key) => {
                      return <option selected={key==parseInt(localStorage.getItem("currChain"))?"selected":""} value={key}>{network.get(key).name}</option>
                    })
                  }
                </Input>
              </FormGroup>
              
              <li onClick={connect}>{connectWallet}</li>
            </ul>
          </div>
        </div>

        <div style={{width:"400px"}} className="nav-right">
          <ul>
              <FormGroup style={{margin: "0px"}}>
              <Input type="select" name="select" id="exampleSelect"
                  onChange={async (e) => {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const chainId = parseInt(e.target.value);
                    // console.log(await provider.getNetwork(chainId));
                    try{
                      await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: ethers.utils.hexValue(chainId)}], // chainId must be in hexadecimal numbers
                    })}catch(err){
                      if(err.code == 4902){
                        alert("No Network found in metamask")
                        console.log(err);
                      }
                    }
                  }}>
                  {
                    [...network.keys()].map((key) => {
                      return <option selected={key==parseInt(localStorage.getItem("currChain"))?"selected":""} value={key}>{network.get(key).name}</option>
                    })
                  }
                </Input>
              </FormGroup>
            
            <li onClick={connect}>{connectWallet}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
