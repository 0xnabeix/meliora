import { ethers, BigNumber } from "ethers";
import moment from 'moment'

const decimals = "1000000000000000000";
// const CONTRACT_ADDRESSES = "0xba1aafa3c8bd15d4bd1f2426286485523c4b6523";
// const LANCHPAD_CONTRACT_ADDRESSES = "0x405FE5d99E49ac168F9892c1d0F10b177C71df56";
const BURN_ADDRESS = "0x0000000000000000000000000000000000000000";
// const MelioraInfo_CA = "0x80f14B7320E6ffe4C3E15a123e8f7E14A09aC56b";


const network = new Map();
// add as new networks 
network.set(97, {
                name: "BSC testnet",
                currency: "BNB",
                exchange: "PancakeSwap",
                tokenTitle: "BEP-20",
                factory_addr: "0xd8111B92C3F969992e829d10DeE461693B2f569E", 
                launchpad_addr: "0x405FE5d99E49ac168F9892c1d0F10b177C71df56",
                info_addr: "0x44882E570152cD4c68b53a9FF6dB58F03197e869"});

/* 
chanege 
factory_addr -> MeliorFactory contract 
launchpad_addr -> MelioraLaunchpad
info_addr -> MelioraInfo

*/
network.set(56, {
                  name: "BSC mainnet",
                  currency: "BNB",
                  exchange: "PancakeSwap",
                  tokenTitle: "BEP-20",
                  factory_addr: "0xba1aafa3c8bd15d4bd1f2426286485523c4b6523", 
                  launchpad_addr: "0x405FE5d99E49ac168F9892c1d0F10b177C71df56",
                  info_addr: "0x80f14B7320E6ffe4C3E15a123e8f7E14A09aC56b"})
  
network.set(1, {
                    name: "Ethereum mainnet",
                    currency: "BNB",
                    exchange: "Uniswap",
                    tokenTitle: "ERC20",
                    factory_addr: "0xba1aafa3c8bd15d4bd1f2426286485523c4b6523", 
                    launchpad_addr: "0x405FE5d99E49ac168F9892c1d0F10b177C71df56",
                    info_addr: "0x80f14B7320E6ffe4C3E15a123e8f7E14A09aC56b"})
    
        
// network.set(1, {
//                 name: "Ethereum testnet",
//                 factory_addr: "0xba1aafa3c8bd15d4bd1f2426286485523c4b6523", 
//                 launchpad_addr: "0x405FE5d99E49ac168F9892c1d0F10b177C71df56",
//                 info_addr: "0x80f14B7320E6ffe4C3E15a123e8f7E14A09aC56b"})



const getCurrentNetwork = ()=>{
  if(!network.has(parseInt(localStorage.getItem("currChain"))))
  {
    throw Error("This Network is not allowed");
  }
  return network.get(parseInt(localStorage.getItem("currChain")));
}


let calculateApproveAmt = (hardCapInWei, liquidityPercentageAllocation, listingPriceInWei, tokenPriceInWei) => {
  const maxTokensToBeSold = tokenPriceInWei > 0 ? hardCapInWei / tokenPriceInWei : 0;
  const maxEthPoolTokenAmount = hardCapInWei * (liquidityPercentageAllocation / 100);
  const maxLiqPoolTokenAmount = +listingPriceInWei ? (maxEthPoolTokenAmount / listingPriceInWei) : 0;
  const requiredTokenAmount = (maxLiqPoolTokenAmount + maxTokensToBeSold);
  return requiredTokenAmount;
}


let makeData = (formData) => {
  let whiteList = formData.get('whiteList');
  let whiteListArray = whiteList != '' ? whiteList.split(" ") : [];


  const launchpadInfo = {
    tokenAddress: formData.get('tokenAddress'),
    unsoldTokensDumpAddress: formData.get('unsoldTokensDumpAddress') || BURN_ADDRESS,
    whitelistedAddresses: [],
    tokenPriceInWei: ethers.utils.parseEther(formData.get('tokenPriceInWei')),
    hardCapInWei: ethers.utils.parseEther(formData.get('hardCapInWei')),
    softCapInWei: ethers.utils.parseEther(formData.get('softCapInWei') || '0'),
    maxInvestInWei: ethers.utils.parseEther(formData.get('maxInvestInWei') || '0'),
    minInvestInWei: ethers.utils.parseEther(formData.get('minInvestInWei') || '0'),
    openTime: moment(formData.get('openTime')).unix(),
    closeTime: moment(formData.get('closeTime')).unix()
  };

  const launchpadUniswapInfo = {
    listingPriceInWei: ethers.utils.parseEther(formData.get('listingPriceInWei') || '0'),
    liquidityAddingTime: moment(formData.get('liquidityAddingTime')).unix(),
    liquidityPercentageAllocation: BigNumber.from(formData.get('liquidityPercentageAllocation')),
    lpTokensLockDurationInDays: BigNumber.from("1")
  };

  const launchpadStringInfo = {
    saleTitle: ethers.utils.formatBytes32String(formData.get('saleTitle')),
    linkTelegram: ethers.utils.formatBytes32String(formData.get('linkTelegram')),
    linkDiscord: ethers.utils.formatBytes32String(formData.get('linkDiscord')),
    linkTwitter: ethers.utils.formatBytes32String(formData.get('linkTwitter')),
    linkWebsite: ethers.utils.formatBytes32String(formData.get('linkWebsite'))
  }


  return { launchpadInfo: launchpadInfo, launchpadUniswapInfo: launchpadUniswapInfo, launchpadStringInfo: launchpadStringInfo };
}

function truncate(val) {
  return `${val.substring(0, 6)}...${val.substring(38)}`;
}

let unixTimeToUTC = (timeStamp) => {
  var dateTime = new Date(timeStamp * 1000);
  return dateTime.toUTCString();
  
  // return urn `${moment(timeStamp / 1000).format("YYYY-MM-DD hh:mm a")};
}


export {
  makeData,
  getCurrentNetwork,
  calculateApproveAmt,
  decimals,
  BURN_ADDRESS,
  truncate,
  unixTimeToUTC,
  network
  
}