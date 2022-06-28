const { expect } = require("chai");

describe("NFT Market Contract", function () {
  let FT;
  let ft;
  let NFT;
  let nft;
  let NFTMarket;
  let nftMarket;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  
  beforeEach(async function () {
    FT = await ethers.getContractFactory("FT");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    ft = await FT.deploy();
    await ft.deployed();

    NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();
    await nft.deployed();

    NFTMarket = await ethers.getContractFactory("NFTMarket");
    nftMarket = await NFTMarket.deploy(ft.address, nft.address);
    await nftMarket.deployed();

    ft.transfer(addr1.address, 50);
  });

  describe("NFT Market", function () {
    it("Should store nft", async function () {
      // Owner stores token 0
      await nft.approve(nftMarket.address, 0);
      await nftMarket.store(0, 50);
      expect(await nftMarket.getOwner(0)).to.equal(owner.address);
    });

    it("Should be able to buy nft", async function () {
      // Owner stores token 0
      await nft.approve(nftMarket.address, 0);
      await nftMarket.store(0, 50);

      const initialOwnerFTBalance = await ft.balanceOf(
        owner.address
      );

      const initialAddr1FTBalance = await ft.balanceOf(
        addr1.address
      );
      
      // Address 1 buys token 0
      const tokenPrice = await nftMarket.getPrice(0);
      await ft.connect(addr1).approve(nftMarket.address, tokenPrice);
      await nftMarket.connect(addr1).buy(0);

      const finalOwnerFTBalance = await ft.balanceOf(
        owner.address
      );

      const finalAddr1FTBalance = await ft.balanceOf(
        addr1.address
      );

      expect(finalOwnerFTBalance).to.equal(initialOwnerFTBalance.add(50));
      expect(finalAddr1FTBalance).to.equal(initialAddr1FTBalance.sub(50));
      expect(await nftMarket.getOwner(0)).to.equal(addr1.address);
    });
  });
});