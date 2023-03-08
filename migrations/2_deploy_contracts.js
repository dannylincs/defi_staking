const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

module.exports = async function(deployer, network, accounts) {
  //Deploy Mock Tether contract
  await deployer.deploy(Tether);
  const tether = await Tether.deployed();

  //Deploy RWD Contract
  await deployer.deploy(RWD);
  const rwd = await RWD.deployed();

  //deploy DecentralBank contract
  await deployer.deploy(DecentralBank, rwd.address, tether.address);
  const decentralBank = await DecentralBank.deployed();

  //Transfer all RWD tokensto Decentral Bank
  await rwd.transfer(decentralBank.address, "1000000000000000000000000");

  //Distribute 100 Tether tokens to investor
  await tether.transfer(accounts[1], "100000000000000000000");
};
