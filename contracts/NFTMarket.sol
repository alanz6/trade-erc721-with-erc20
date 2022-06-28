pragma solidity ^0.8.1;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "hardhat/console.sol";

contract NFTMarket is IERC721Receiver {

    IERC20 public ft;
    IERC721 public nft;

    event Store(address _owner, uint256 _tokenId);
    event Buy(address _buyer, uint256 _tokenId);

    mapping(uint256 => uint256) nftPrice;
    mapping(uint256 => address) nftOwner; //stores owner of each NFT on the market

    constructor(address _ftAddress, address _nftAddress) {
        ft = IERC20(_ftAddress);
        nft = IERC721(_nftAddress);
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4){
        return this.onERC721Received.selector;
    }

    function store(uint256 _tokenId, uint256 _price) public {
        nft.safeTransferFrom(msg.sender, address(this), _tokenId);
        nftPrice[_tokenId] = _price;
        nftOwner[_tokenId] = msg.sender;
    }

    function setPrice(uint256 _tokenId, uint256 _price) public {
        require(msg.sender == nftOwner[_tokenId]);
        nftPrice[_tokenId] = _price;
    }

    function buy(uint256 _tokenId) public {
        ft.transferFrom(msg.sender, address(this), getPrice(_tokenId));
        nft.safeTransferFrom(address(this), msg.sender, _tokenId);
        ft.transfer(nftOwner[_tokenId], getPrice(_tokenId));
        nftOwner[_tokenId] = msg.sender;
    }

    function getPrice(uint256 _tokenId) public view returns(uint256) {
        return nftPrice[_tokenId];
    }

    function getOwner(uint256 _tokenId) public view returns(address) {
        return nftOwner[_tokenId];
    }
}