import { useEffect, useState } from "react";
import { WalletInfo, getBlockNumber, getGasPrice } from "@/lib/wallet";

type NetworkStatusProps = {
  walletInfo: WalletInfo;
};

export default function NetworkStatus({ walletInfo }: NetworkStatusProps) {
  const [blockHeight, setBlockHeight] = useState<number | string>("--");
  const [gasPrice, setGasPrice] = useState<string>("-- Gwei");
  
  useEffect(() => {
    if (!walletInfo.provider) return;
    
    const fetchBlockchainData = async () => {
      try {
        const blockNum = await getBlockNumber(walletInfo.provider);
        setBlockHeight(blockNum.toLocaleString());
        
        const gas = await getGasPrice(walletInfo.provider);
        setGasPrice(gas);
      } catch (error) {
        console.error("Error fetching blockchain data:", error);
      }
    };
    
    fetchBlockchainData();
    
    // Set up polling to update regularly
    const interval = setInterval(fetchBlockchainData, 10000); // every 10 seconds
    
    return () => clearInterval(interval);
  }, [walletInfo.provider]);
  
  return (
    <div className="bg-surface rounded-lg p-3 mb-6 flex flex-wrap items-center justify-between card-glow">
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
        <span className="text-sm font-medium">Connected to</span>
        <span className="ml-2 px-3 py-1 bg-surfaceLight rounded-full text-xs font-medium text-secondary">
          Moonbase Alpha
        </span>
      </div>
      <div className="flex items-center mt-2 sm:mt-0">
        <div className="px-2 py-1 bg-surfaceLight rounded text-xs flex items-center mr-2">
          <i className="bx bx-cube text-accent2 mr-1"></i>
          <span>{blockHeight}</span>
        </div>
        <div className="px-2 py-1 bg-surfaceLight rounded text-xs flex items-center">
          <i className="bx bx-pulse text-accent1 mr-1"></i>
          <span>{gasPrice}</span>
        </div>
      </div>
    </div>
  );
}
