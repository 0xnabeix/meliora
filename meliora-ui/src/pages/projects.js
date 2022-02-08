import { getCurrentNetwork }  from '../utils';
import React, { Fragment } from "react";
import MelioraInfoABI from "../ABIs/MelioraInfoABI.json";
import Breadcrumb from "../component/common/breadcrumb/breadcrumb";
import ProjectCards from "../component/cards/projectCards";
import { ProgressBar } from "react-bootstrap";
import {
  Container,
  Col,
  Row
} from "reactstrap";
import { useEffect } from 'react';

import { ethers } from "ethers";
import MalioraLaunchpadABI from '../ABIs/MelioraLaunchpadABI.json';
import ERC20ABI from '../ABIs/ERC20ABI.json';
import moment from "moment";


const { useState } = React;

const Projects = () => {
  const [tabIdx, setTabIdx] = useState(0);
  const [ongoing, setongoing] = useState([])
  const [upcomming, setupcomming] = useState([])
  const [ended, setended] = useState([])
  const [progress, setprogress] = useState(0);

  const connect = async () => {
    if (window.ethereum) {
      let size = 0;
      let eachProgress = 0;
      let currentTimeStamp = 0;
      let provider;
      let signer;
      let MelioraInfo;
      try{
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = await provider.getSigner();
        MelioraInfo = new ethers.Contract( getCurrentNetwork().info_addr, MelioraInfoABI, provider);
        size = await MelioraInfo.getPresalesCount();
        console.log(size);
        eachProgress = 100 / parseInt(size);
        currentTimeStamp = moment((new Date()).toUTCString()).unix();
      }catch(err){
        console.log(err);
      }
      for (let i = size-1; i >= 0; i--) {
        try { 
          const contractAddress = await MelioraInfo.getPresaleAddress(i);
          const MalioraLaunchpad =  new ethers.Contract(contractAddress, MalioraLaunchpadABI, provider)
          let totalInvestorsCount = `${await MalioraLaunchpad.totalInvestorsCount()}`;
          let hardCap = ethers.utils.formatEther(`${await MalioraLaunchpad.hardCapInWei()}`);
          let softCap = ethers.utils.formatEther(`${await MalioraLaunchpad.softCapInWei()}`);
          let saleTitle = ethers.utils.toUtf8String(`${await MalioraLaunchpad.saleTitle()}`);
          let telegram = ethers.utils.toUtf8String(`${await MalioraLaunchpad.linkTelegram()}`);
          let twitter = ethers.utils.toUtf8String(`${await MalioraLaunchpad.linkTwitter()}`);
          let website = ethers.utils.toUtf8String(`${await MalioraLaunchpad.linkWebsite()}`);
          let openTime = parseInt(await MalioraLaunchpad.openTime());
          let closeTime = parseInt(await MalioraLaunchpad.closeTime());
          let totalTokens = ethers.utils.formatEther(`${await MalioraLaunchpad.totalTokens()}`);
          let tokensSold = totalTokens-ethers.utils.formatEther(`${await MalioraLaunchpad.tokensLeft()}`);

          let tokens_address = `${await MalioraLaunchpad.token()}`;
          let ERC20 =  new ethers.Contract(tokens_address, ERC20ABI, provider)
          let symbol = await ERC20.symbol();
          
          let addArr = [];
          if(openTime <= currentTimeStamp && currentTimeStamp <= closeTime) {
              //ongioing
              setongoing(ongoing =>
                [
                  ...ongoing,
                  <Col sm="12" md="6" xl="4">
                    <ProjectCards hardCap={hardCap} softCap={softCap} tokensSold={tokensSold} totalTokens={totalTokens} totalInvestorsCount={totalInvestorsCount} symbol={symbol} ID={i} saleTitle={saleTitle} telegram={telegram} twitter={twitter} website={website} opening={openTime} closing={closeTime} status={1}></ProjectCards>
                  </Col>
                ])
          }else if(openTime > currentTimeStamp){
            // upcomming
            setupcomming(upcomming =>
              [
                ...upcomming,
                <Col sm="12" md="6" xl="4">
                  <ProjectCards hardCap={hardCap} softCap={softCap} tokensSold={tokensSold} totalTokens={totalTokens} totalInvestorsCount={totalInvestorsCount} symbol={symbol} ID={i} saleTitle={saleTitle} telegram={telegram} twitter={twitter} website={website} opening={openTime} closing={closeTime} status={2}></ProjectCards>
                </Col>
                
              ])
          }else {
            //ended
            setended(ended =>
              [
                
                ...ended,
                <Col sm="12" md="6" xl="4">
                  <ProjectCards hardCap={hardCap} softCap={softCap} tokensSold={tokensSold} totalTokens={totalTokens} totalInvestorsCount={totalInvestorsCount}  symbol={symbol} ID={i} saleTitle={saleTitle} telegram={telegram} twitter={twitter} website={website} opening={openTime} closing={closeTime} status={3}></ProjectCards>
                </Col>
              ])

          }
          
          setprogress((size-i) * eachProgress);
        } catch (err) {
          console.log(err);
        }
      }
    }

  }
  useEffect(connect, []);

  return (
    <>

      <Fragment>

        <Breadcrumb parent="Forms / Form Controls" title="Projects" />

        <Container fluid={true}>
          <Row className="project-tabs">
            <div className={tabIdx === 0 ? 'project-tab-item active' : 'project-tab-item'} onClick={() => setTabIdx(0)}>Ongoing</div>
            <div className={tabIdx === 1 ? 'project-tab-item active' : 'project-tab-item'} onClick={() => setTabIdx(1)}>Upcoming</div>
            <div className={tabIdx === 2 ? 'project-tab-item active' : 'project-tab-item'} onClick={() => setTabIdx(2)}>Ended</div>
          </Row>
          <Row>
            <Col>
            {progress < 100 && <ProgressBar variant="info" now={progress} />}
            </Col>
          </Row>
          {
            tabIdx === 0 ?
              <Row>
                {ongoing}
              </Row>
              : ""
          }
          {
            tabIdx === 1 ?
              <Row>
                {upcomming}
              </Row>
              : ""
          }
          {
            tabIdx === 2 ?
              <Row>
                {ended}
              </Row>
              : ""
          }
        </Container>
      </Fragment>
    </>
  );
};

export default Projects;
