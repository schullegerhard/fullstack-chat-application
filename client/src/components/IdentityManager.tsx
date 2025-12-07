import { useState } from "react";
import { WalletInfo } from "@/lib/wallet";
import IdentityCard from "./IdentityCard";
import CrossChainImport from "./CrossChainImport";
import IdentityShareModal from "./IdentityShareModal";
import { useToast } from "@/hooks/use-toast";
import { Identity } from "@shared/schema";

type IdentityManagerProps = {
  walletInfo: WalletInfo;
  identity: Identity | null;
  isLoading: boolean;
  refetchIdentity: () => void;
};

export default function IdentityManager({ 
  walletInfo, 
  identity, 
  isLoading,
  refetchIdentity
}: IdentityManagerProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { toast } = useToast();

  const handleShareIdentity = () => {
    setIsShareModalOpen(true);
  };

  const handleExportData = () => {
    if (!identity) {
      toast({
        title: "No identity data",
        description: "There is no identity data to export",
        variant: "destructive"
      });
      return;
    }

    const dataStr = JSON.stringify(identity, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", dataUri);
    downloadLink.setAttribute("download", `identity-${walletInfo.address.slice(0, 8)}.json`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast({
      title: "Identity exported",
      description: "Your identity data has been exported successfully",
    });
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      <IdentityCard 
        walletInfo={walletInfo}
        identity={identity}
        isLoading={isLoading}
        onShare={handleShareIdentity}
        onExport={handleExportData}
        refetchIdentity={refetchIdentity}
      />
      
      <CrossChainImport 
        walletInfo={walletInfo}
        onIdentityImported={refetchIdentity}
      />
      
      <IdentityShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        walletInfo={walletInfo}
      />
    </div>
  );
}
