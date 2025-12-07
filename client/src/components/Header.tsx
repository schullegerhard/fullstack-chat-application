import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { truncateAddress } from "@/lib/utils";
import { WalletInfo } from "@/lib/wallet";

type HeaderProps = {
  walletInfo: WalletInfo;
  onConnectWallet: () => Promise<void>;
};

export default function Header({ walletInfo, onConnectWallet }: HeaderProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const copyAddressToClipboard = () => {
    if (!walletInfo.address) return;
    
    navigator.clipboard.writeText(walletInfo.address)
      .then(() => {
        setIsCopied(true);
        toast({
          title: "Address copied",
          description: "The wallet address has been copied to clipboard",
        });
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy address:", err);
        toast({
          title: "Failed to copy",
          description: "Could not copy the address to clipboard",
          variant: "destructive",
        });
      });
  };

  return (
    <header className="bg-surface border-b border-gray-800 border-opacity-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center animate-pulse-slow mr-3">
            <i className="bx bx-link text-xl"></i>
          </div>
          <h1 className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            CrossChain<span className="font-normal">Vault</span>
          </h1>
        </div>
        
        <div className="flex items-center">
          {!walletInfo.isConnected ? (
            <div className="md:flex items-center">
              <Button 
                onClick={onConnectWallet}
                className="bg-primary hover:bg-opacity-80 text-white rounded-lg px-4 py-2 flex items-center transition duration-300 glow-border"
              >
                <i className="bx bx-wallet-alt mr-2"></i>
                Connect Wallet
              </Button>
            </div>
          ) : (
            <div className="flex items-center bg-surfaceLight rounded-full px-3 py-1.5 border border-gray-700">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span className="font-mono text-xs text-gray-300 mr-2">
                {truncateAddress(walletInfo.address)}
              </span>
              <button 
                className={`text-gray-400 hover:text-primary ${isCopied ? 'text-green-500' : ''}`}
                onClick={copyAddressToClipboard}
              >
                <i className={`bx ${isCopied ? 'bx-check' : 'bx-copy'}`}></i>
              </button>
            </div>
          )}
          
          <button className="ml-3 md:ml-4 p-2 rounded-lg hover:bg-surfaceLight transition duration-300">
            <i className="bx bx-menu text-xl"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
