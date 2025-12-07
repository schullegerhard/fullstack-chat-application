// client/src/lib/constants.ts
// Add any constants needed by your application
import { ethers } from "ethers";

export const API_URL = 'http://localhost:5000/api';
export const SUPPORTED_CHAINS = ['ethereum', 'polkadot', 'lisk'];
export const MOONBASE_RPC_URL = "https://rpc.api.moonbase.moonbeam.network";
export const MOONBASE_CHAIN_ID = 1287;

export const IdentityVaultABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_identityHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_sourceChain",
        "type": "string"
      }
    ],
    "name": "storeIdentity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getIdentity",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "identityHash",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "sourceChain",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          }
        ],
        "internalType": "struct IdentityVault.Identity",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      }
    ],
    "name": "shareIdentity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const CHAIN_NETWORKS = [
  {
    id: "moonbeam",
    name: "Moonbeam",
    description: "Primary Network",
    icon: "bxl-ethereum",
    iconColor: "text-primary",
    isPrimary: true,
    isActive: true
  },
  {
    id: "ethereum",
    name: "Ethereum",
    description: "Identity Source",
    icon: "bxl-ethereum",
    iconColor: "text-gray-400",
    isPrimary: false,
    isActive: false
  },
  {
    id: "lisk",
    name: "Lisk",
    description: "Identity Source",
    icon: "bx-diamond",
    iconColor: "text-gray-400",
    isPrimary: false,
    isActive: false
  }
];

export const IDENTITY_TYPES = [
  { value: "poap", label: "POAP" },
  { value: "nft", label: "NFT" },
  { value: "badge", label: "Badge" },
  { value: "message", label: "Message" }
];

export const SOURCE_CHAINS = [
  { value: "ethereum", label: "Ethereum Mainnet" },
  { value: "lisk", label: "Lisk" },
  { value: "optimism", label: "Optimism" },
  { value: "arbitrum", label: "Arbitrum" }
];

export type Badge = {
  id: string;
  name: string;
  network: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
};

export const DEFAULT_BADGES: Badge[] = [
  {
    id: "verified",
    name: "Verified User",
    network: "Moonbeam",
    icon: "bx-badge-check",
    iconBgColor: "bg-primary bg-opacity-20",
    iconColor: "text-primary"
  },
  {
    id: "staker",
    name: "Staker",
    network: "Polkadot",
    icon: "bx-coin-stack",
    iconBgColor: "bg-secondary bg-opacity-20",
    iconColor: "text-secondary"
  },
  {
    id: "nft-creator",
    name: "NFT Creator",
    network: "Ethereum",
    icon: "bx-box",
    iconBgColor: "bg-accent1 bg-opacity-20",
    iconColor: "text-accent1"
  }
];

export const IDENTITY_CONTRACT_ADDRESS = "0xe909fb6aF39120A14441740FdC2Be873Ee5650b2";
