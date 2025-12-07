require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";

// Multiple RPC endpoints for better reliability
const MOONBASE_RPC_URLS = [
  "https://moonbase-alpha.public.blastapi.io",
  "https://rpc.api.moonbase.moonbeam.network",
  "https://moonbase.unitedbloc.com:1000"
];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    moonbase: {
      url: MOONBASE_RPC_URLS[0],
      chainId: 1287,
      accounts: [PRIVATE_KEY],
      timeout: 60000, // Increase timeout to 60 seconds
      gasPrice: "auto",
      gas: "auto",
      // Fallback RPC URLs
      fallbackRpcUrls: MOONBASE_RPC_URLS.slice(1),
    },
  },
  etherscan: {
    apiKey: {
      moonbase: process.env.MOONSCAN_API_KEY || "",
    },
  },
}; 