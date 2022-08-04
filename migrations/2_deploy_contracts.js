const Token = artifacts.require("Token");
const TecaudexSwap = artifacts.require("TecaudexSwap");

module.exports = async function(deployer) {
  // deploy token
  await deployer.deploy(Token);
  const token = await Token.deployed();

  // deploy smart contract
  await deployer.deploy(TecaudexSwap);
  const contract = await TecaudexSwap.deployed();

  // transfer all tokens to TecaudexSwap
  await token.transfer(contract.address, '1000000000000000000000000')
};
