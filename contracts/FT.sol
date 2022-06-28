pragma solidity ^0.8.1;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FT is ERC20 {
    constructor() ERC20("Gold", "GLD") {
        uint256 n = 1000;
        _mint(msg.sender, n * 10**uint(decimals()));
    }
}