const { expect } = require("chai");

const tokenCount = 10;

describe("NFT Contract", function () {
  let NFT;
  let nft;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    NFT = await ethers.getContractFactory("NFT");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    nft = await NFT.deploy();
    await nft.deployed();
  });

  describe("Deployment", function () {
    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await nft.balanceOf(owner.address);
      expect(tokenCount).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer token 0 from owner to addr1
      await nft.transferFrom(owner.address, addr1.address, 0)
      const addr1Balance = await nft.balanceOf(
        addr1.address
      );
      expect(addr1Balance).to.equal(1);
      expect(await nft.ownerOf(0)).to.equal(addr1.address);

      // Transfer token 0 from addr1 to addr2
      await nft.connect(addr1).transferFrom(addr1.address, addr2.address, 0);
      const addr2Balance = await nft.balanceOf(
        addr2.address
      );
      expect(addr2Balance).to.equal(1);
      expect(await nft.ownerOf(0)).to.equal(addr2.address);
    });
  });
});