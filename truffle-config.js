require("babel-register");
require("babel-polyfill");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: "7545",
      network_id: "*", // Connect to any network
      /*
      gasPrice: 1000000000000,
      gas: 6721975, //gas limit
      */
    },
  },
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/truffle_abis",
  compilers: {
    solc: {
      version: "^0.8.9",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
