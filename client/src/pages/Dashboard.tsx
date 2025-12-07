import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NetworkStatus from "@/components/NetworkStatus";
import ChainSelector from "@/components/ChainSelector";
import IdentityManager from "@/components/IdentityManager";
import IdentityGuide from "@/components/IdentityGuide";
import { WalletInfo, defaultWalletInfo, connectWallet } from "@/lib/wallet";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Identity } from "@shared/schema";

export default function Dashboard() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo>(defaultWalletInfo);
  const { toast } = useToast();

  const { data: identity, isLoading, refetch } = useQuery<Identity | null>({
    queryKey: walletInfo.isConnected ? [`/api/identity/${walletInfo.address}`] : ["no-identity"],
    enabled: walletInfo.isConnected,
    initialData: null
  });

  useEffect(() => {
    // Check if we have a wallet connection in localStorage
    const checkExistingConnection = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        try {
          const wallet = await connectWallet();
          setWalletInfo(wallet);
        } catch (error) {
          console.error("Failed to reconnect wallet:", error);
        }
      }
    };

    checkExistingConnection();

    // Listen for account changes
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        setWalletInfo(defaultWalletInfo);
      } else if (walletInfo.address !== accounts[0]) {
        // Account changed, reconnect
        try {
          const wallet = await connectWallet();
          setWalletInfo(wallet);
        } catch (error) {
          console.error("Failed to update wallet after account change:", error);
        }
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [walletInfo.address]);

  const handleConnectWallet = async () => {
    try {
      const wallet = await connectWallet();
      setWalletInfo(wallet);
      toast({
        title: "Wallet connected",
        description: "Your wallet has been successfully connected."
      });
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect to your wallet",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        walletInfo={walletInfo}
        onConnectWallet={handleConnectWallet}
      />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <NetworkStatus walletInfo={walletInfo} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <IdentityGuide walletInfo={walletInfo} />
          </div>
          
          <div>
            <ChainSelector />
            <IdentityManager 
              walletInfo={walletInfo}
              identity={identity}
              isLoading={isLoading}
              refetchIdentity={() => refetch()}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
