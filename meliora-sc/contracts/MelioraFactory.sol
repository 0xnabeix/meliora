// SPDX-License-Identifier: MIT

//** Meliora Crowfunding Contract*/
//** Author Alex Hong : Meliora Finance 2021.5 */

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "./libraries/IERC20.sol";
import "./MelioraLaunchpad.sol";
import "./MelioraInfo.sol";
import "./MelioraLaunchpadLiquidityLock.sol";

interface IUniswapV2Factory {
    function getPair(address tokenA, address tokenB) external view returns (address pair);
}

contract MelioraFactory {
    using SafeMath for uint256;

    event PresaleCreated(bytes32 title, uint256 melipadId, address creator);

    IUniswapV2Factory private constant uniswapFactory =
        IUniswapV2Factory(address(0x6725F303b657a9451d8BA641348b6761A6CC7a17));
    address private constant wethAddress = address(0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd);

    MelioraInfo public immutable melipad;

    constructor(address _melipadInfoAddress) public {
        melipad = MelioraInfo(_melipadInfoAddress);
    }

    struct PresaleInfo {
        address tokenAddress;
        address unsoldTokensDumpAddress;
        address[] whitelistedAddresses;
        uint256 tokenPriceInWei;
        uint256 hardCapInWei;
        uint256 softCapInWei;
        uint256 maxInvestInWei;
        uint256 minInvestInWei;
        uint256 openTime;
        uint256 closeTime;
    }

    struct PresaleUniswapInfo {
        uint256 listingPriceInWei;
        uint256 liquidityAddingTime;
        uint256 lpTokensLockDurationInDays;
        uint256 liquidityPercentageAllocation;
    }

    struct PresaleStringInfo {
        bytes32 saleTitle;
        bytes32 linkTelegram;
        bytes32 linkDiscord;
        bytes32 linkTwitter;
        bytes32 linkWebsite;
    }

    // copied from https://github.com/Uniswap/uniswap-v2-periphery/blob/master/contracts/libraries/UniswapV2Library.sol
    // calculates the CREATE2 address for a pair without making any external calls
    function uniV2LibPairFor(
        address factory,
        address tokenA,
        address tokenB
    ) internal pure returns (address pair) {
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        pair = address(
            uint256(
                keccak256(
                    abi.encodePacked(
                        hex"ff",
                        factory,
                        keccak256(abi.encodePacked(token0, token1)),
                        hex"96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f" // init code hash
                    )
                )
            )
        );
    }

    function initializePresale(
        MelioraLaunchpad _presale,
        uint256 _totalTokens,
        uint256 _finalTokenPriceInWei,
        PresaleInfo calldata _info,
        PresaleUniswapInfo calldata _uniInfo,
        PresaleStringInfo calldata _stringInfo
    ) internal {
        _presale.setAddressInfo(msg.sender, _info.tokenAddress, _info.unsoldTokensDumpAddress);
        _presale.setGeneralInfo(
            _totalTokens,
            _finalTokenPriceInWei,
            _info.hardCapInWei,
            _info.softCapInWei,
            _info.maxInvestInWei,
            _info.minInvestInWei,
            _info.openTime,
            _info.closeTime
        );
        _presale.setUniswapInfo(
            _uniInfo.listingPriceInWei,
            _uniInfo.liquidityAddingTime,
            _uniInfo.lpTokensLockDurationInDays,
            _uniInfo.liquidityPercentageAllocation
        );
        _presale.setStringInfo(
            _stringInfo.saleTitle,
            _stringInfo.linkTelegram,
            _stringInfo.linkDiscord,
            _stringInfo.linkTwitter,
            _stringInfo.linkWebsite
        );

        _presale.addwhitelistedAddresses(_info.whitelistedAddresses);
    }

    function createPresale(
        PresaleInfo calldata _info,
        PresaleUniswapInfo calldata _uniInfo,
        PresaleStringInfo calldata _stringInfo
    ) external {
        IERC20 token = IERC20(_info.tokenAddress);

        MelioraLaunchpad presale = new MelioraLaunchpad(address(this), melipad.owner());

        address existingPairAddress = uniswapFactory.getPair(address(token), wethAddress);
        require(existingPairAddress == address(0)); // token should not be listed in Uniswap

         uint256 maxEthPoolTokenAmount = _info.hardCapInWei.mul(_uniInfo.liquidityPercentageAllocation).div(100);
        uint256 maxLiqPoolTokenAmount = maxEthPoolTokenAmount.mul(1e18).div(_uniInfo.listingPriceInWei);

        uint256 maxTokensToBeSold = _info.hardCapInWei.mul(1e18).div(_info.tokenPriceInWei);
        uint256 requiredTokenAmount = maxLiqPoolTokenAmount.add(maxTokensToBeSold);
        token.transferFrom(msg.sender, address(presale), requiredTokenAmount);

        initializePresale(presale, maxTokensToBeSold, _info.tokenPriceInWei, _info, _uniInfo, _stringInfo);

        address pairAddress = uniV2LibPairFor(address(uniswapFactory), address(token), wethAddress);
        MelioraLaunchpadLiquidityLock liquidityLock = new MelioraLaunchpadLiquidityLock(
                IERC20(pairAddress),
                msg.sender,
                _uniInfo.liquidityAddingTime + (_uniInfo.lpTokensLockDurationInDays * 1 days)
            );

        uint256 melipadId = melipad.addPresaleAddress(address(presale));
        presale.setmelipadInfo(address(liquidityLock), melipad.getDevFeePercentage(), melipadId);

        emit PresaleCreated(_stringInfo.saleTitle, melipadId, msg.sender);
    }
}
