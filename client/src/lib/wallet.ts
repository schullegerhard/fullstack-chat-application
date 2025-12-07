import { ethers } from "ethers";
import { IdentityVaultABI, IDENTITY_CONTRACT_ADDRESS, MOONBASE_RPC_URL, MOONBASE_CHAIN_ID } from "@/lib/constants";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export type WalletInfo = {
  address: string;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  chainId: number;
  isConnected: boolean;
};

export const defaultWalletInfo: WalletInfo = {
  address: "",
  provider: null,
  signer: null,
  chainId: 0,
  isConnected: false,
};

export async function connectWallet(): Promise<WalletInfo> {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const networkInfo = await provider.getNetwork();
    const chainId = Number(networkInfo.chainId);
    const signer = await provider.getSigner();

    if (chainId !== MOONBASE_CHAIN_ID) {
      await switchToMoonbaseAlpha();
      return connectWallet();
    }

    return {
      address: accounts[0],
      provider,
      signer,
      chainId,
      isConnected: true,
    };
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    throw error;
  }
}

export async function switchToMoonbaseAlpha() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${MOONBASE_CHAIN_ID.toString(16)}` }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${MOONBASE_CHAIN_ID.toString(16)}`,
              chainName: "Moonbase Alpha",
              nativeCurrency: {
                name: "DEV",
                symbol: "DEV",
                decimals: 18,
              },
              rpcUrls: [MOONBASE_RPC_URL],
              blockExplorerUrls: ["https://moonbase.moonscan.io/"],
            },
          ],
        });
      } catch (addError) {
        console.error("Failed to add Moonbase Alpha network:", addError);
        throw addError;
      }
    } else {
      console.error("Failed to switch to Moonbase Alpha:", switchError);
      throw switchError;
    }
  }
}

export async function getIdentityContract(
  signer: ethers.JsonRpcSigner
): Promise<ethers.Contract> {
  console.log('Creating contract instance with address:', IDENTITY_CONTRACT_ADDRESS);
  return new ethers.Contract(
    IDENTITY_CONTRACT_ADDRESS,
    IdentityVaultABI,
    signer
  );
}

export async function getBlockNumber(provider: ethers.BrowserProvider): Promise<number> {
  return await provider.getBlockNumber();
}

export async function getGasPrice(provider: ethers.BrowserProvider): Promise<string> {
  const gasPrice = await provider.getFeeData();
  return `${ethers.formatUnits(gasPrice.gasPrice || 0, 'gwei')} Gwei`;
}

export async function storeIdentity(
  signer: ethers.JsonRpcSigner,
  identityHash: string
): Promise<void> {
  const contract = await getIdentityContract(signer);
  const tx = await contract.storeIdentity(identityHash);
  await tx.wait();
}

export async function getIdentity(
  signer: ethers.JsonRpcSigner,
  address: string
): Promise<string> {
  const contract = await getIdentityContract(signer);
  return await contract.getIdentity(address);
}
