var Register = artifacts.require("./Register.sol");
var UserStorage = artifacts.require("./UserStorage.sol");

module.exports = function(deployer) {
  deployer.deploy(UserStorage);
  deployer.deploy(Register);
};
