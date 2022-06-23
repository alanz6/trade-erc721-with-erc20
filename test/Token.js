// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("Token Storage Contract", function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecycle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let Token;
  let hardhatToken;
  let TokenStorage;
  let tokenStorage;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    hardhatToken = await Token.deploy();
    await hardhatToken.deployed();

    TokenStorage = await ethers.getContractFactory("TokenStorage");
    tokenStorage = await TokenStorage.deploy(hardhatToken.address);
    await tokenStorage.deployed();
  });

  describe("Token Storage", function () {
    it("Should store tokens", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(
        owner.address
      );

      // Owner of token stores 50 tokens
      await hardhatToken.approve(tokenStorage.address, 50);
      await tokenStorage.store(50);
      const ownerStoredAmount = await tokenStorage.getStoredAmount(owner.address);
      console.log(ownerStoredAmount);
      expect(ownerStoredAmount).to.equal(50);
      
      const finalOwnerBalance = await hardhatToken.balanceOf(
        owner.address
      );

      console.log(initialOwnerBalance.sub(50));
      console.log(finalOwnerBalance);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(50));
    });

    it("Should be able to take tokens", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(
        owner.address
      );

      // Owner of token first stores 50 tokens
      await hardhatToken.approve(tokenStorage.address, 50);
      await tokenStorage.store(50);

      // Owner of token takes 50 tokens
      await tokenStorage.take(50);
      const ownerStoredAmount = await tokenStorage.getStoredAmount(owner.address);
      expect(ownerStoredAmount).to.equal(0);

      const finalOwnerBalance = await hardhatToken.balanceOf(
        owner.address
      );

      expect(finalOwnerBalance).to.equal(initialOwnerBalance);
    });
  });
});