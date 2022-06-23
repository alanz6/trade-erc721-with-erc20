pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract Token is ERC20 {
    constructor() ERC20("Gold", "GLD") {
        uint256 n = 1000;
        _mint(msg.sender, n * 10**uint(decimals()));
    }
}

contract TokenStorage {

    IERC20 public token;

    event Store(uint256 amount);
    event Take(uint256 amount);

    mapping(address => uint256) storedAmount;

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    function store(uint256 _amount) payable public {
        token.transferFrom(msg.sender, address(this), _amount);
        storedAmount[msg.sender] += _amount;
    }

    function take(uint256 _amount) payable public {
        require(storedAmount[msg.sender] >= _amount);
        token.transfer(msg.sender, _amount);
        storedAmount[msg.sender] -= _amount;
    }

    function getStoredAmount(address _account) external view returns(uint256) {
        return storedAmount[_account];
    }
}