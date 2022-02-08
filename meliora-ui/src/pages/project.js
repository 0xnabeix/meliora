import React, { Fragment, useEffect } from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useParams } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faSync } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

import { ethers, BigNumber } from "ethers";
import { truncate, unixTimeToUTC } from "../utils";
import MalioraLaunchpadABI from '../ABIs/MelioraLaunchpadABI.json';
import MelioraLiquidityLockABI from '../ABIs/MelioraLiquidityLockABI.json';

import ERC20ABI from "../ABIs/ERC20ABI.json";

import ErroMSG from '../component/ErrorMSG';
import { getCurrentNetwork } from '../utils';
import moment from 'moment'

import { ProgressBar } from "react-bootstrap";
import MelioraInfoABI from "../ABIs/MelioraInfoABI.json";
import Breadcrumb from "../component/common/breadcrumb/breadcrumb";
import {
  Container,
  Col,
  Row,
  Card,
  CardBody,
  Button,
  Input,
} from "reactstrap";
import { isCompositeComponent } from "react-dom/test-utils";
const getRevertReason = require('eth-revert-reason')

const { useState } = React;

const Projects = (props) => {
  const [copied, setCopied] = useState(0);

  const [projectTitle, setprojectTitle] = useState("");
  const [tokenPrice, setTokenPrice] = useState("");
  const [minInvest, setMinInvest] = useState("");
  const [maxInvest, setMaxInvest] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [openAt, setopenAt] = useState(0);
  const [closeAt, setcloseAt] = useState(0);
  const [hardCap, sethardCap] = useState("");
  const [softCap, setsoftCap] = useState("");
  const [saleContractAddress, setsaleContractAddress] = useState("")
  const [tokenSymbol, settokenSymbol] = useState("")
  const [totalSupply, settotalSupply] = useState("")
  const [totalToken, settotalToken] = useState("")
  const [listingAt, setlistingAt] = useState(0)
  const [amtBuy, setamtBuy] = useState(0);
  const [btnBuy, setbtnBuy] = useState("Buy");
  const [btnClaim, setbtnClaim] = useState("Claim Tokens");
  
  const [btnRefund, setbtnRefund] = useState("Get Refund");
  const [btncancel, setbtncancel] = useState("Cancel");
  const [btnUnlock, setbtnUnlock] = useState("Unlock");
  const [btnCollect, setbtnCollect] = useState("Collect");
  const [btnLockAndList, setbtnLockAndList] = useState("Lock and List");
  const  [melipadLockAddress, setMelipadLockAddress] = useState("");

  const [ethInvested, setethInvested] = useState(0);
  const [totalInvestorsCount, settotalInvestorsCount] = useState(0);
  const [tokensSold, settokensSold] = useState(0);
  const [totalTokens, settotalTokens] = useState(0);
  const [symbol, setSymbol] = useState(0);
  const [amtErrMSG, setamtErrMSG] = useState("");
  const [isCreator, setIsCreator] = useState(false);
  const [isContributor, setIsContributor] = useState(false);
  const currency=getCurrentNetwork().currency;
  const tokenTitle=getCurrentNetwork().tokenTitle;
  const exchange=getCurrentNetwork().exchange;
  let MalioraLaunchpad;





  let { id } = useParams();

  const Sync = async (MalioraLaunchpad, userAddress) => {
        const totalTokensLocal = await ethers.utils.formatEther(`${await MalioraLaunchpad.totalTokens()}`)
        settotalTokens(totalTokensLocal);
        settokensSold(totalTokensLocal - ethers.utils.formatEther(`${await MalioraLaunchpad.tokensLeft()}`));
        setethInvested(ethers.utils.formatEther(`${await MalioraLaunchpad.investments(`${userAddress}`)}`));
  }

  const invest = async () => {
    if (btnBuy != "Buy")
      return;
    const requiredTokenAmt = (totalTokens-tokensSold)*tokenPrice;
    if(amtBuy > requiredTokenAmt) {
      setamtErrMSG(`Ammount should be less than ${requiredTokenAmt}`);
      return;
    }

    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        
        let userAddress = await signer.getAddress();
        const MalioraLaunchpad = await new ethers.Contract(saleContractAddress, MalioraLaunchpadABI, signer);
        let tx = await MalioraLaunchpad.invest({ value: ethers.utils.parseEther(`${amtBuy}`), gasLimit: 253531 });
        setbtnBuy("Buying...")
        console.log(await tx.wait());
        await provider.waitForTransaction(tx.hash, 5)
        console.log("Done");
        Sync(MalioraLaunchpad, userAddress)
        
        setbtnBuy("Buy")
      } catch (err) {
        alert(JSON.stringify(err));
        setbtnBuy("Buy")
      }
    }
  }

  

  const getRefund = async () => {
    if (btnRefund != "Get Refund")
      return;
      setbtnRefund("Refundding..")
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        let userAddress = await signer.getAddress();
        const MalioraLaunchpad = await new ethers.Contract(saleContractAddress, MalioraLaunchpadABI, signer);
        let tx = await MalioraLaunchpad.getRefund({gasLimit: 153531 });
        await tx.wait();
        await provider.waitForTransaction(tx.hash, 5);
        Sync(MalioraLaunchpad, userAddress)
        setbtnRefund("Refunded")
      } catch (err) {
        alert("Err"+JSON.stringify(err));
        setbtnRefund("Get Refund");
      }
    }
  }

  const claimToken = async () => {

    if (btnClaim != "Claim Tokens")
      return;
      setbtnClaim("Claimming")
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        let userAddress = await signer.getAddress();
        const MalioraLaunchpad = await new ethers.Contract(saleContractAddress, MalioraLaunchpadABI, signer);
        let tx = await MalioraLaunchpad.claimTokens({gasLimit: 153531 });
        await tx.wait();
        await provider.waitForTransaction(tx.hash, 5);
        Sync(MalioraLaunchpad, userAddress)
        setbtnClaim("Claimed")
        console.log("Done");
      } catch (err) {
        alert("Err"+JSON.stringify(err));
        setbtnClaim("Claim Tokens");
      }
    }
  }

  const collect = async () => {
    if (btnCollect != "Collect")
     return;
     setbtnCollect("wait...")
     if (window.ethereum) {
       try {
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = await provider.getSigner();
         const MalioraLaunchpad = await new ethers.Contract(saleContractAddress, MalioraLaunchpadABI, signer);
         let tx = await MalioraLaunchpad.collectFundsRaised({gasLimit: 153531 });
         await tx.wait();
         await provider.waitForTransaction(tx.hash, 5);
         setbtnCollect("Collected")
         console.log("Done");
       } catch (err) {
         alert("Err"+JSON.stringify(err));
         setbtnCollect("Collect");
       }
     }
  }  

  const unlock = async () => {
    if (btnUnlock != "Unlock")
     return;
     setbtnUnlock("wait...")
     if (window.ethereum) {
       try {
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = await provider.getSigner();
         let userAddress = await signer.getAddress();
         console.log(melipadLockAddress);
         const MalioraLaunchpad = await new ethers.Contract(melipadLockAddress, MelioraLiquidityLockABI, signer);
         let tx = await MalioraLaunchpad.release({gasLimit: 153531 });
         await tx.wait();
         await provider.waitForTransaction(tx.hash, 5);
         Sync(MalioraLaunchpad, userAddress)
         setbtnUnlock("Unlocked")
         console.log("Done");
       } catch (err) {
         alert("Err"+JSON.stringify(err));
         setbtnUnlock("Unlock");
       }
     }
  }  

  const lockAndList = async () => {
    if (btnLockAndList != "Lock and List")
     return;
     setbtnLockAndList("wait...")
     if (window.ethereum) {
       try {
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = await provider.getSigner();
         let userAddress = await signer.getAddress();
         
         const MalioraLaunchpad = await new ethers.Contract(saleContractAddress, MalioraLaunchpadABI, signer);
         let tx = await MalioraLaunchpad.addLiquidityAndLockLPTokens();
         await tx.wait();
         await provider.waitForTransaction(tx.hash, 5);
         Sync(MalioraLaunchpad, userAddress)
         setbtnLockAndList("Locked and Listed")
         console.log("Done");
       } catch (err) {
         alert("Err"+JSON.stringify(err));
         setbtnLockAndList("Lock and List");
       }
     }
  }  

  const cancel = async () => {
     if (btncancel != "Cancel")
      return;
      setbtncancel("wait...")
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = await provider.getSigner();
          let userAddress = await signer.getAddress();
          const MalioraLaunchpad = await new ethers.Contract(saleContractAddress, MalioraLaunchpadABI, signer);
          let tx = await MalioraLaunchpad.cancelAndTransferTokensToPresaleCreator({gasLimit: 153531 });
          await tx.wait();
          await provider.waitForTransaction(tx.hash, 5);
          Sync(MalioraLaunchpad, userAddress)
          setbtncancel("Canceled")
          console.log("Done");
        } catch (err) {
          alert("Err"+JSON.stringify(err));
          setbtncancel("Cancel");
        }
      }

  }

  const syncAccount = async (MalioraLaunchpad, userAddress) => {
    const isCreator_ = await MalioraLaunchpad.presaleCreatorAddress()
        
    console.log(isCreator_, ethers.utils.getAddress(userAddress))
    if(isCreator_ == ethers.utils.getAddress(userAddress)){
      setIsCreator(true);
      setIsContributor(false);
    }
    else if(await MalioraLaunchpad.whitelistedAddresses(userAddress)){
      setIsCreator(false);
      setIsContributor(true);
    }else {
      setIsCreator(false);
      setIsContributor(false);
    }
  }

  useEffect(async () => {
    console.log(props.is);
    if (window.ethereum) {
      try {
        window.ethereum.on('accountsChanged', async (userAddress)=> {
            syncAccount(MalioraLaunchpad, userAddress[0])
        });


        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = await provider.getSigner();
        let userAddress = await signer.getAddress();
        const MelioraInfo = new ethers.Contract(getCurrentNetwork().info_addr, MelioraInfoABI, provider);
        const contractAddress = await MelioraInfo.getPresaleAddress(id);
        setsaleContractAddress(contractAddress);
        MalioraLaunchpad = await new ethers.Contract(contractAddress, MalioraLaunchpadABI, provider)
        syncAccount(MalioraLaunchpad, userAddress)
        settotalInvestorsCount(ethers.utils.formatEther(`${await MalioraLaunchpad.totalInvestorsCount()}`));
        setTokenPrice(ethers.utils.formatEther(`${await MalioraLaunchpad.tokenPriceInWei()}`));
        setprojectTitle(ethers.utils.toUtf8String(await MalioraLaunchpad.saleTitle()));
        setMaxInvest(ethers.utils.formatEther(`${await MalioraLaunchpad.maxInvestInWei()}`));
        setMinInvest(ethers.utils.formatEther(`${await MalioraLaunchpad.minInvestInWei()}`));
        let tokenAddress = await MalioraLaunchpad.token();
        setTokenAddress(tokenAddress);
        const ERC20 = await new ethers.Contract(tokenAddress, ERC20ABI, provider)
        settotalSupply(ethers.utils.formatEther(`${await ERC20.totalSupply()}`));
        settokenSymbol(`${await ERC20.symbol()}`);
        settotalToken(ethers.utils.formatEther(`${await MalioraLaunchpad.totalTokens()}`))
        
        setopenAt(await MalioraLaunchpad.openTime());
        setcloseAt(await MalioraLaunchpad.closeTime());
        setlistingAt(await MalioraLaunchpad.uniLiquidityAddingTime());
        sethardCap(ethers.utils.formatEther(`${await MalioraLaunchpad.hardCapInWei()}`));
        setsoftCap(ethers.utils.formatEther(`${await MalioraLaunchpad.softCapInWei()}`));
        setethInvested(ethers.utils.formatEther(`${await MalioraLaunchpad.investments(`${userAddress}`)}`));
        const totalTokensLocal = ethers.utils.formatEther(`${await MalioraLaunchpad.totalTokens()}`)
        settotalTokens(totalTokensLocal);
        settokensSold(totalTokensLocal - ethers.utils.formatEther(`${await MalioraLaunchpad.tokensLeft()}`));
        setMelipadLockAddress(await MalioraLaunchpad.melipadLiqLockAddress());
        console.log(await MalioraLaunchpad.melipadLiqLockAddress());

      } catch (err) { 
        console.log(err);
      }

    }

  }, [])



  function setCopyClipboard() {
    setCopied(1);
    setTimeout(() => {
      setCopied(0);
    }, 1000);
  }

  return (
    <Fragment>
      <Breadcrumb parent="Forms / Form Controls" title="Project" />
    
      <Container fluid={true}>
        <Row>
          <Col className="project-token" md="6">
            <Card>
              <CardBody>
                <h1>{projectTitle}</h1>
                <div className="copy-clipboard">
                  <h2>Token Contact Address: <span className="ellipsis">{truncate(tokenAddress)}</span></h2>
                  <CopyToClipboard text={tokenAddress}
                    onCopy={() => setCopyClipboard()}>
                    <button>
                      {copied === 1 ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faCopy} />}
                    </button>
                  </CopyToClipboard>
                </div>
              </CardBody>
            </Card>

          </Col>
          <Col className="project-progress" md="6">
            <Card>
              <CardBody>
                <h2>Sale Progress</h2>
                {/* <div className="project-progress-bar"></div> */}
                <div><ProgressBar variant="info" now={(tokensSold / totalTokens) * 100} /></div>
                <div className="progress-percent">
                  <h2>Completed: <span>{((tokensSold / totalTokens) * 100).toFixed(5)}%</span></h2>
                  <h2>{tokensSold * tokenPrice} / {totalTokens * tokenPrice} {currency}</h2>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md="6" className="project-token info">
            <Card>
              <CardBody>
                <h3>Price: <span>{tokenPrice} {currency}</span></h3>
                <h4>Min: <span>{minInvest}{currency}</span> | Max: <span>{maxInvest} {currency}</span></h4>
                <div className="project-price">
                  <Input
                    className="form-control"
                    type="number"
                    step="1e-18"
                    min={minInvest}
                    max={maxInvest}
                    placeholder="0"
                    onChange={e => setamtBuy(parseFloat(e.target.value))}
                  />
                  <div>Max</div>
                </div>
                {amtErrMSG && <ErroMSG msg={amtErrMSG}></ErroMSG>}
                <Button color="primary" onClick={invest} >{btnBuy}</Button>
              </CardBody>
            </Card>
          </Col>

          <Col md="6" className="project-progress info">
            <Card>
              <CardBody>
                <h2><span>{(ethInvested / tokenPrice).toFixed(4)}</span>Tokens You Bought</h2>
                <h2><span>{ethInvested}</span>{currency} You Invested</h2>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="project-buttons">
              <CardBody>
                <Row>
                  <Button color="primary" onClick={claimToken}>{btnClaim}</Button>
                  <Button color="primary" onClick={getRefund}>{btnRefund}</Button>
                </Row>
              </CardBody>
            </Card>
          </Col>
          {
            isCreator && 
            <Col>
            <Card className="project-buttons action-button">
              <CardBody>
                <Row>
                      <Button color="primary" onClick={cancel}>{btncancel}</Button>
                      <Button color="primary" onClick={unlock}>{btnUnlock}</Button>
                      <Button color="primary" onClick={collect}>{btnCollect}</Button>
                      <Button color="primary" onClick={lockAndList}>{btnLockAndList}</Button>
                </Row>
              </CardBody>
            </Card>
          </Col>
      } 
      {
            isContributor && 
            <Col>
            <Card className="project-buttons">
              <CardBody>
                <Row>
                      <Button color="primary" onClick={lockAndList}>{btnLockAndList}</Button>
                </Row>
              </CardBody>
            </Card>
          </Col>
      }
        </Row>

        <Row className="project-info-title">
          <h1>Sale Details</h1>
        </Row>

        <Row>
          <Col>
            <Card className="project-info">
              <CardBody>
                <Row>
                  <Col md="6">
                    <h2>Starts: <span>{unixTimeToUTC(openAt)}</span></h2>
                    <h2>Ends: <span>{unixTimeToUTC(closeAt)}</span></h2>
                    <h2>Token Price: <span>{tokenPrice} {currency}</span></h2>
                    <h2>Hard Cap: <span>{hardCap} {currency}</span></h2>
                    <h2>Soft Cap: <span>{softCap} {currency}</span></h2>
                    <h2>Tokens For Sale: <span>{totalToken} {tokenSymbol}</span></h2>
                  </Col>
                  <Col md="6">
                    {/* <h2>Access: <span>Public / Whitelist</span></h2> */}
                    <div className="copy-clipboard">
                      <h2>Sale Contract: <span>{truncate(saleContractAddress)}</span></h2>
                      <CopyToClipboard text={saleContractAddress}
                        onCopy={() => setCopyClipboard()}>
                        <button>
                          {copied === 1 ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faCopy} />}
                        </button>
                      </CopyToClipboard>
                    </div>
                    <div className="copy-clipboard">
                      <h2>Token Contract Address: <span>{truncate(tokenAddress)}</span></h2>
                      <CopyToClipboard text={tokenAddress}
                        onCopy={() => setCopyClipboard()}>
                        <button>
                          {copied === 1 ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faCopy} />}
                        </button>
                      </CopyToClipboard>
                    </div>
                    <h2>Token Symbol: <span>{tokenSymbol}</span></h2>
                    <h2>Total Supply: <span>{totalSupply} {tokenSymbol}</span></h2>
                    <h2>Listing: <span>{unixTimeToUTC(listingAt)}</span></h2>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Projects;
