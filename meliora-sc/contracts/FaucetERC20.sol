pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract FaucetERC20 is ERC20 {
     constructor() public ERC20("FuacetERC20", "FERC") {
        _mint(msg.sender, 10000000000 ether);
    }
}
