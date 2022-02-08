//** Initial Migrate Script */
require("dotenv").config();


const MelioraInfo = artifacts.require("MelioraInfo");
const MelioraFactory = artifacts.require("MelioraFactory");
const MelioraLaunchpad = artifacts.require("MelioraLaunchpad");
const FaucetERC20 = artifacts.require("FaucetERC20");

module.exports = async function (deployer, network, accounts) {
  console.log(accounts);
  await deployer.deploy(MelioraInfo);
  const melioraInfo = await MelioraInfo.deployed();
  const melioraInfoAddress = melioraInfo.address;
  await deployer.deploy(MelioraFactory, melioraInfoAddress);
  const melioraFactoryInstance = await MelioraFactory.deployed();
};
