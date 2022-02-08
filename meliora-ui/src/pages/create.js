import React, { Fragment, useEffect } from "react";
import Breadcrumb from "../component/common/breadcrumb/breadcrumb";
import MelioraFactoryABI from "../ABIs/MelioraFactoryABI.json";
import ERC20ABI from "../ABIs/ERC20ABI.json";
import { ethers, BigNumber } from "ethers";
import moment from 'moment'
import {
  getCurrentNetwork,
  makeData,
  calculateApproveAmt,
  decimals,
  BURN_ADDRESS
} from '../utils';
import ErroMSG from '../component/ErrorMSG';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

import { useHistory } from "react-router-dom";

import { useState } from "react";
const Create = (props) => {
  const history = useHistory();

  const local = new Date();
  let minDate = moment(local).format("YYYY-MM-DDTHH:mm")

  const disableText = "Approve (Transfer 0 Token)";
  const [submitBtn, setSubmitBtn] = useState("Connect");

  const [tokenErr, setTokenErr] = useState(false)
  const [tokenAddress, setTokenAddress] = useState("")

  const [unsoldTokenErr, setUnsoldTokenErr] = useState(false)
  const [unsoldAddress, setUnsoldAddress] = useState("")

  const [hardCapErr, setHardCapErr] = useState(false);
  const [hardCap, setHardCap] = useState(0)


  const [softCapErr, setSoftCapErr] = useState(false);
  const [softCap, setSoftCap] = useState(0)

  const [whiteList, setwhiteList] = useState("");
  // const [softCap, setSoftCap] = useState(0)


  const [maxInvest, setMaxInvest] = useState(0)
  const [minInvest, setMinInvest] = useState(0)
  const [minInvestErr, setMinInvestErr] = useState(false)


  const [openTime, setOpenTime] = useState(minDate)
  const [closeTime, setCloseTime] = useState(minDate)
  const [closeTimeErr, setCloseTimeErr] = useState(false)

  const [listingTime, setListingTime] = useState(minDate)
  const [listingTimeErr, setListingTimeErr] = useState(false)

  const [liquidityPercentageAllocation, setLiquidityPercentageAllocation] = useState("0")
  const [listingPrice, setListingPrice] = useState("")
  const [tokenPrice, setTokenPrice] = useState(0)

  const [lpTokensLockDurationInDays, setlpTokensLockDurationInDays] = useState(0)

  const [saleTitle, setSaleTitle] = useState("dummy");
  const [saleTitleErr, setSaleTitleErr] = useState(false);
  const [linkDiscord, setLinkDiscord] = useState("dummy");
  const [linkDiscordErr, setLinkDiscordErr] = useState(false);
  const [linkTelegram, setLinkTelegram] = useState("dummy");
  const [linkTelegramErr, setLinkTelegramErr] = useState(false);
  const [linkTwitter, setLinkTwitter] = useState("dummy");
  const [linkTwitterErr, setLinkTwitterErr] = useState(false);
  const [linkWebsite, setLinkWebsite] = useState("dummy");
  const [linkWebsiteErr, setLinkWebsiteErr] = useState(false);

  const currency=getCurrentNetwork().currency;
  const tokenTitle=getCurrentNetwork().tokenTitle;
  const exchange=getCurrentNetwork().exchange;



  let approveAmt, setApproveAmt = 0;

  let Done = "Done";
  
  let handleChange = () => {
    if (listingPrice == "" || tokenPrice == "" || listingPrice == 0 || tokenPrice == 0) {
      setSubmitBtn(``)
      return;
    }
    approveAmt = Math.ceil(calculateApproveAmt(hardCap || 0, liquidityPercentageAllocation ? liquidityPercentageAllocation : 0, listingPrice, tokenPrice));;

    if (approveAmt == 0) {
      setSubmitBtn(`Create`)
      return;
    }
    setSubmitBtn(`Approve(Transfer ${approveAmt})`)
  }

  

  const approve = async (e) => {
    let approveAmt_btn = submitBtn;
    try {
      setSubmitBtn("Please wait...")
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      let userAddress = await signer.getAddress();
      
      const ERC20 = new ethers.Contract(tokenAddress, ERC20ABI, signer);

      const already = ethers.utils.formatEther(await ERC20.allowance(userAddress, getCurrentNetwork().factory_addr))
      
      let amounttoApprove = Math.ceil(calculateApproveAmt(hardCap || 0, liquidityPercentageAllocation ? liquidityPercentageAllocation : 0, listingPrice, tokenPrice));
      let diff = amounttoApprove - already;
      if(diff <= already) {
        setSubmitBtn(`Create`)
        return;
      }
    
      
      const tx = await ERC20.approve(getCurrentNetwork().factory_addr, ethers.utils.parseEther(`${amounttoApprove}`));
      console.log(await tx.wait())
      await provider.waitForTransaction(tx.hash, 5)
      setSubmitBtn("Create");

    } catch (err) {
        alert(err);
        setSubmitBtn(approveAmt_btn);
    }
  }

  const submitDataToSC = async (e) => {
      // let formData = new FormData(e.target)
      if(tokenErr || saleTitleErr || unsoldTokenErr || hardCapErr || softCapErr || minInvestErr || closeTimeErr || listingTimeErr){
        alert("please fill valid form details")
        return;
      }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      let whiteListArr = whiteList?whiteList.split(","):[];
      console.log(whiteListArr);
      for(let i = 0; i < whiteListArr.length; i++) {
        console.log(whiteListArr[i]);
        if(!ethers.utils.isAddress(whiteListArr[i]))
        {
          alert("Please Enter Valid whitelisted array with ',' Comma-separated")
          return;
        }
      }
      
      const launchpadInfo =  {
        tokenAddress: tokenAddress,
        unsoldTokensDumpAddress: unsoldAddress || BURN_ADDRESS,
        whitelistedAddresses: whiteListArr,
        tokenPriceInWei: ethers.utils.parseEther(tokenPrice),
        hardCapInWei: ethers.utils.parseEther(hardCap),
        softCapInWei: ethers.utils.parseEther(softCap || '0'),
        maxInvestInWei: ethers.utils.parseEther(maxInvest || '0'),
        minInvestInWei: ethers.utils.parseEther(minInvest || '0'),
        openTime: moment((new Date(openTime)).toUTCString()).unix(),
        closeTime: moment((new Date(closeTime)).toUTCString()).unix()
      };
      const launchpadUniswapInfo = {
        listingPriceInWei: ethers.utils.parseEther(listingPrice || '0'),
        liquidityAddingTime: moment((new Date(listingTime)).toUTCString()).unix(),
        lpTokensLockDurationInDays: BigNumber.from(`${lpTokensLockDurationInDays}`),
        liquidityPercentageAllocation: BigNumber.from(`${Math.round(liquidityPercentageAllocation)}`)
      }
      const launchpadStringInfo = {  
        saleTitle: ethers.utils.formatBytes32String(saleTitle),
        linkTelegram: ethers.utils.formatBytes32String(linkTelegram),
        linkDiscord: ethers.utils.formatBytes32String(linkDiscord),
        linkTwitter: ethers.utils.formatBytes32String(linkTwitter),
        linkWebsite: ethers.utils.formatBytes32String(linkWebsite)
      }
      
  
      console.log(JSON.stringify(launchpadInfo));
      console.log(JSON.stringify(launchpadStringInfo));
      console.log(JSON.stringify(launchpadUniswapInfo));


      const MelioraFactory = new ethers.Contract(getCurrentNetwork().factory_addr, MelioraFactoryABI, signer); 
      

      
      let userAddress = await signer.getAddress();
      MelioraFactory.on("PresaleCreated", (title, safuId, creator) => {
          if(creator == userAddress)
            history.push(`project/${safuId}`);
          // console.log(title, safuId, creator);
      });
      setSubmitBtn("Creating...")
      let tx = await MelioraFactory
        .createPresale(launchpadInfo, launchpadUniswapInfo, launchpadStringInfo, {gasLimit: 4532374});

      tx.wait();

      await provider.waitForTransaction(tx.hash, 5)
      setSubmitBtn("Created")
    } catch (err) {
      alert(err);
      setSubmitBtn("Create")
      console.log(err);
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitBtn == `Create`) {
      submitDataToSC(e);
    }
    else if (submitBtn != disableText && submitBtn != Done) {
      approve(e);
    }
  }

  


  useEffect(async () => {
    if (submitBtn == '-' && !window.ethereum) {
      alert("No crypto wallet found.");
      setSubmitBtn("MetaMask not found")
    } else {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setSubmitBtn(disableText)
      window.ethereum.on('message', msg => {
        console.log(msg);
      });
    }

  }, []);

  useEffect(handleChange, [hardCap, liquidityPercentageAllocation, listingPrice, tokenPrice]);

  const tokenValidation = (value, setStateFxnErr, setStateFxnValue) => {
    if (!ethers.utils.isAddress(value)) {
      setStateFxnErr(true);
      return;
    }
    setStateFxnErr(false);
    setStateFxnValue(value);
  }

  const lessValueValidation = (val1, val2, errFXN) => {
    if (val1 < val2) {
      errFXN(true);
      return;
    }
    errFXN(false);
  }
  




  return (
    <Fragment>
      <Breadcrumb parent="Forms / Form Controls" title={`Create Sale On ${currency} Network`} />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form className="form theme-form" onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <h5>Presale Details</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          * {tokenTitle} Token Address
                        </Label>
                        <Input
                          className="form-control"
                          type="text"
                          placeholder="0xb64cd4f56043f8d80691433e395d08b1bebdadf0"
                          name="tokenAddress"
                          onChange={(e) => {
                            tokenValidation(e.target.value, setTokenErr, setTokenAddress)
                          }
                          }
                          required
                        />
                        {tokenErr && (<ErroMSG msg="Please Enter Valid address"></ErroMSG>)}
                      </FormGroup>
                    </Col>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          Project Name
                        </Label>
                        <Input
                          name="saleTitle"
                          className="form-control"
                          type="text"
                          placeholder="Meliora"
                          onChange={e=>{
                            if(e.target.value.length >= 31)
                            {
                              setSaleTitleErr(true);
                            }
                            setSaleTitle(e.target.value)
                          }}
                        />
                        {saleTitleErr && (<ErroMSG msg="Project Name should be < 31 character"></ErroMSG>)}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          * Token Price (ETH)
                        </Label>
                        <Input
                          name="tokenPrice"
                          className="form-control"
                          type="number"
                          step="1e-18"
                          min="1e-18"
                          placeholder="0.005"
                          onChange={(e) => {
                            lessValueValidation(parseFloat(hardCap), parseFloat(e.target.value),setHardCapErr);
                            setTokenPrice(e.target.value)
                          }}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          *Address for unsold tokens.
                        </Label>
                        <Input
                          name="unsoldTokensDumpAddress"
                          className="form-control"
                          type="text"
                          placeholder="0x000000000000000000000000000000000000dEaD"
                          onChange={(e) => {
                            tokenValidation(e.target.value, setUnsoldTokenErr, setUnsoldAddress)
                          }}
                          required
                        />
                        {unsoldTokenErr && (<ErroMSG msg="Please Enter Valid address"></ErroMSG>)}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          * Hard Cap (ETH)
                        </Label>
                        <Input
                          name="hardCap"
                          className="form-control"
                          type="number"
                          placeholder="0"
                          step="1e-18"
                          min="1e-18"
                          onChange={(e) => {
                            lessValueValidation(parseFloat(e.target.value), parseFloat(tokenPrice), setHardCapErr);
                            lessValueValidation( parseFloat(e.target.value), parseFloat(softCap), setSoftCapErr);
                            setHardCap(e.target.value)
                          }}
                          required
                        />
                        {hardCapErr && <ErroMSG msg="Hard cap should greater than token price"></ErroMSG>}
                      </FormGroup>
                    </Col>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          Soft Cap (ETH)
                        </Label>
                        <Input
                          name="softCapInWei"
                          className="form-control"
                          type="number"
                          placeholder="0"
                          step="1e-18"
                          min="0"
                          onChange={(e) => {
                            lessValueValidation(parseFloat(hardCap), parseFloat(e.target.value), setSoftCapErr);
                            setSoftCap(e.target.value)
                          }}
                        />
                        {softCapErr && <ErroMSG msg="Soft should less than Hard Cap"></ErroMSG>}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          Max. cap per wallet (ETH)
                        </Label>
                        <Input
                          name="maxInvestInWei"
                          className="form-control"
                          type="number"
                          placeholder="0"
                          step="1e-18"
                          min="0"
                          onChange={(e) => {
                            lessValueValidation(parseFloat(e.target.value), parseFloat(minInvest), setMinInvestErr);
                            setMaxInvest(e.target.value)
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          Min. cap per wallet (ETH)
                        </Label>
                        <Input
                          name="minInvestInWei"
                          className="form-control"
                          type="number"
                          placeholder="0"
                          step="1e-18"
                          min="0"
                          onChange={(e) => {
                            lessValueValidation(parseFloat(maxInvest), parseFloat(e.target.value), setMinInvestErr);
                            setMinInvest(e.target.value)
                          }}
                        />
                        {minInvestErr && <ErroMSG msg="Min invest should less than max Cap"></ErroMSG>}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          * Starts at
                        </Label>
                        <Input
                          name="openTime"
                          className="form-control digits"
                          id="opens-at-time"
                          min
                          type="datetime-local"
                          min={minDate}
                          // value="2021-05-19 20:00:00"
                          onChange = {(e) => {
                              console.log("local "+moment().unix());
                              console.log("UTC "+moment((new Date(e.target.value)).toUTCString()).unix());
                              var a = moment(e.target.value);
                              var b = moment(closeTime);
                              const diff = b.diff(a, 'week');
                              console.log(diff);
                              if(diff < 0){
                                setCloseTimeErr(true);
                                return;
                              }

                              lessValueValidation(1,diff, setCloseTimeErr);
                              setOpenTime(e.target.value)
                          }
                          }
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          * Ends at
                        </Label>
                        <Input
                          name="closeTime"
                          className="form-control digits"
                          id="closes-at-time"
                          type="datetime-local"
                          min={moment(`${openTime}`).add(1,"hours").format("YYYY-MM-DDTHH:mm")}
                          onChange={(e)=>{
                              var a = moment(e.target.value);
                              var b = moment(openTime);
                              const diff = a.diff(b, 'week');
                              if(diff < 0){
                                setCloseTimeErr(true);
                                return;
                              }
                              lessValueValidation(1, diff, setCloseTimeErr);
                              setCloseTime(e.target.value);
                          }}
                          // value="2021-05-19 20:00:00"
                          required
                        />
                        {closeTimeErr && <ErroMSG msg="Maximum duration is 2 weeks"></ErroMSG>}
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <h5>Whitelist</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          Whitelisted Addreses (Comma-separated)
                        </Label>
                        <textarea
                          className="form-control"
                          rows="5"
                          name="whiteList"
                          onChange={ e => setwhiteList(e.target.value)}
                          placeholder="0xfb6116b0987c567930f191b15c945909e168f0a3,0xc7807e24338b41a34d849492920f2b9d0e4de2cd,0xf60c2ea62edbfe808163751dd0d8693dcb30019c"
                        ></textarea>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <h5>{exchange} Liquidity Allocation</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          * Listing Price (E.g. 0.005 ETH)
                        </Label>
                        <Input
                          className="form-control"
                          type="number"
                          step="1e-18"
                          min="1e-18"
                          placeholder="0.005"
                          name="listingPriceInWei"
                          onChange={(e) => {
                            setListingPrice(e.target.value)
                          }}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          * {exchange} LP Allocation
                        </Label>
                        <Input
                          className="form-control"
                          type="number"
                          placeholder="%30"
                          name="liquidityPercentageAllocation"
                          min="0"
                          max="100"
                          onChange={(e) => {
                            if (e.target.value < 0 || e.target.value > 100) {
                              alert("please Enter value in range 0 to 100")
                              return;
                            } else
                              setLiquidityPercentageAllocation(e.target.value);
                          }}
                          required
                        />
                        
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          * Listing Time
                        </Label>
                        <Input
                          name="liquidityAddingTime"
                          className="form-control digits"
                          id="uniswap-listing-time"
                          type="datetime-local"
                          min={moment(`${closeTime}`).add(1,"minutes").format("YYYY-MM-DDTHH:mm")}
                          onChange={e=>{
                            setListingTime(e.target.value)
                          }}
                          required
                        />
                        {listingTimeErr && <ErroMSG msg="Listing time is greater than closing time"></ErroMSG>}
                      </FormGroup>
                    </Col>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                        * {exchange} LP Tokens Lock Duration (Days)
                        </Label>
                        <Input
                          className="form-control"
                          type="number"
                          placeholder="1"
                          min="1"
                          name="lpTokensLockDurationInDays"
                          onChange={(e) => {
                            setlpTokensLockDurationInDays(e.target.value)
                          }}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <h5>Project Socials</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          Website
                        </Label>
                        <Input
                          name="linkWebsite"
                          className="form-control"
                          type="text"
                          onChange={e=>{
                            if(e.target.value.length >= 31)
                            {
                              setLinkWebsiteErr(true);
                            }
                            setLinkWebsite(e.target.value)
                          }}
                        />
                        {linkWebsiteErr && (<ErroMSG msg="Project Name should be < 31 character"></ErroMSG>)}
                        
                      </FormGroup>
                    </Col>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          Telegram
                        </Label>
                        <Input
                          name="linkTelegram"
                          className="form-control"
                          type="text"
                          onChange={e=>{
                            if(e.target.value.length >= 31)
                            {
                              setLinkTelegramErr(true);
                            }
                            setLinkTelegram(e.target.value)
                          }}
                        />
                        {linkTelegramErr && (<ErroMSG msg="Project Name should be < 31 character"></ErroMSG>)}
                        
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          Discord
                        </Label>
                        <Input
                          name="linkDiscord"
                          className="form-control"
                          type="text"
                          onChange={e=>{
                            if(e.target.value.length >= 31)
                            {
                              setLinkDiscordErr(true);
                            }
                            setLinkDiscord(e.target.value)
                          }}
                        />
                        {linkDiscordErr && (<ErroMSG msg="Project Name should be < 31 character"></ErroMSG>)}
                      </FormGroup>
                    </Col>
                    <Col sm="12" md="6">
                      <FormGroup>
                        <Label>
                          Twitter
                        </Label>
                        <Input
                          name="linkTwitter"
                          className="form-control"
                          type="text"
                          onChange={e=>{
                            if(e.target.value.length >= 31)
                            {
                              setLinkTwitterErr(true);
                            }
                            setLinkTwitter(e.target.value)
                          }}
                        />
                        {linkTwitterErr && (<ErroMSG msg="Project Name should be < 31 character"></ErroMSG>)}
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Row>
                    <Col>
                      <Button color="primary" className="mr-1" disabled={submitBtn == disableText}>
                        {submitBtn}
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Form>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Create;
