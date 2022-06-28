const { expect } = require("chai");

describe("FT Contract", function () {
  let FT;
  let ft;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    FT = await ethers.getContractFactory("FT");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    ft = await FT.deploy();
    await ft.deployed();
  });

  describe("Deployment", function () {
    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await ft.balanceOf(owner.address);
      expect(await ft.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await ft.transfer(addr1.address, 50);
      const addr1Balance = await ft.balanceOf(
        addr1.address
      );
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      await ft.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await ft.balanceOf(
        addr2.address
      );
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await ft.balanceOf(
        owner.address
      );

      // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
        ft.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await ft.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await ft.balanceOf(
        owner.address
      );

      // Transfer 100 tokens from owner to addr1.
      await ft.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await ft.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await ft.balanceOf(
        owner.address
      );
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

      const addr1Balance = await ft.balanceOf(
        addr1.address
      );
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await ft.balanceOf(
        addr2.address
      );
      expect(addr2Balance).to.equal(50);
    });
  });
});