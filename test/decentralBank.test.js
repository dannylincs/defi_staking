//const { assert } = require("console");

const RWD = artifacts.require("RWD");
const Tether = artifacts.require("Tether");
const DecentralBank = artifacts.require("DecentralBank");

require("chai")
  .use(require("chai-as-promised"))
  .should();

//All of the code goes here for testing

contract("DecentralBank", ([owner, customer]) => {
  let tether, rwd, decentralBank;

  function tokens(number) {
    return web3.utils.toWei(number, "ether");
  }

  before(async () => {
    //load contracts
    tether = await Tether.new();
    rwd = await RWD.new();
    decentralBank = await DecentralBank.new(rwd.address, tether.address);

    //transfer all tokens to DecentraBank (1 million)
    await rwd.transfer(decentralBank.address, tokens("1000000"));

    //Transfer all tokens to DecentralBank.new
    await tether.transfer(customer, tokens("100"), { from: owner });
  });

  describe("Mock Tether Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await tether.name();
      assert.equal(name, "Mock Tether Token");
    });
  });

  describe("Reward Token Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await rwd.name();
      assert.equal(name, "Reward Token");
    });
  });

  describe("Decentral Bank Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await decentralBank.name();
      assert.equal(name, "Decentral Bank");
    });

    it("contract has tokens", async () => {
      let balance = await rwd.balanceOf(decentralBank.address);
      assert.equal(balance, tokens("1000000"));
    });

    describe("Yield Farming", async () => {
      it("rewards tokens for staking", async () => {
        let result;

        //Check Investor Balance
        result = await tether.balanceOf(customer);
        assert.equal(
          result.toString(),
          tokens("100"),
          "customer mock wallet balance before staking"
        );

        //check Staking for customer of  100 tokens
        await tether.approve(decentralBank.address, tokens("100"), {
          from: customer,
        });
        await decentralBank.depositTokens(tokens("100"), {
          from: customer,
        });

        //check Updated Balance of Customer
        result = await tether.balanceOf(customer);
        assert.equal(
          result.toString(),
          tokens("0"),
          "customer mock wallet balance after staking 100 tokens"
        );

        //check updated Balance of Decentral Bank
        result = await tether.balanceOf(decentralBank.address);
        assert.equal(
          result.toString(),
          tokens("100"),
          "decentral bank mock wallet balance after staking from customer"
        );

        //Is Staking update
        result = await decentralBank.isStaking(customer);
        assert.equal(
          result.toString(),
          "true",
          "customer is staking status after staking"
        );

        // Isssue Tokens
        await decentralBank.issueTokens({ from: owner });

        // Ensure Only The Owner Can Issue Tokens
        await decentralBank.issueTokens ({ from: customer }).should.be.rejected;

        // Unstake Tokens
        await decentralBank.unstakeTokens({from: customer})


        
        // Check unstaking Balances
        result = await tether.balanceOf(customer);
        assert.equal(
          result.toString(),
          tokens("100"),
          "customer mock wallet balance after unstaking"
        );

        //check updated Balance of Decentral Bank
        result = await tether.balanceOf(decentralBank.address);
        assert.equal(
          result.toString(),
          tokens("0"),
          "decentral bank mock wallet balance after staking from customer"
        );

        //Is Staking update
        result = await decentralBank.isStaking(customer);
        assert.equal(
          result.toString(),
          "false",
          "customer is no longer staking after unstaking"
        );

      });
    });
  });
});
