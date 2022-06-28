pragma solidity ^0.8.1;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract NFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("GameItem", "ITM") {
        for (uint i = 0; i < 10; i++){
            mintItem(msg.sender);
        }
    }

    function mintItem(address _to) private {
        uint256 newItemId = _tokenIds.current();
        _mint(_to, newItemId);
        _tokenIds.increment();
    }
}