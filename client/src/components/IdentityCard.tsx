import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { WalletInfo, storeIdentity } from "@/lib/wallet";
import { useToast } from "@/hooks/use-toast";
import { formatDate, timeAgo, truncateAddress, generateRandomHash } from "@/lib/utils";
import IdentityBadges from "./IdentityBadges";
import { useState } from "react";
import { Identity } from "@shared/schema";

type IdentityCardProps = {
  walletInfo: WalletInfo;
  identity: Identity | null;
  isLoading: boolean;
  onShare: () => void;
  onExport: () => void;
  refetchIdentity: () => void;
};

export default function IdentityCard({
  walletInfo,
  identity,
  isLoading,
  onShare,
  onExport,
  refetchIdentity
}: IdentityCardProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newHash, setNewHash] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditIdentity = () => {
    setNewHash(identity?.hash || generateRandomHash());
    setIsEditing(true);
  };

  const handleSaveIdentity = async () => {
    if (!walletInfo.signer) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to save your identity",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUpdating(true);
      await storeIdentity(walletInfo.signer, newHash);
      
      toast({
        title: "Identity updated",
        description: "Your identity has been saved to the blockchain"
      });
      
      refetchIdentity();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save identity:", error);
      toast({
        title: "Update failed",
        description: "Failed to save identity to the blockchain",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleGenerateNewHash = () => {
    setNewHash(generateRandomHash());
  };

  const firstActivityDate = identity?.firstActive 
    ? new Date(identity.firstActive) 
    : new Date();

  return (
    <div className="bg-surface rounded-xl overflow-hidden card-glow">
      <div className="h-3 animated-gradient"></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-display font-medium">Identity Vault</h2>
          <span className="px-3 py-1 rounded-full bg-primary bg-opacity-20 text-primary text-xs">
            Moonbase Alpha
          </span>
        </div>

        <div className="bg-background rounded-lg p-5 mb-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div className="flex items-center mb-3 md:mb-0">
              {isLoading ? (
                <>
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="ml-3">
                    <Skeleton className="w-32 h-6 mb-1" />
                    <Skeleton className="w-40 h-4" />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mr-3">
                    <i className="bx bx-user text-xl text-primary"></i>
                  </div>
                  <div>
                    <div className="text-lg font-medium">
                      {identity?.name || "CryptoExplorer"}
                    </div>
                    <div className="text-sm font-mono text-gray-400">
                      {truncateAddress(walletInfo.address, 10, 6)}
                    </div>
                  </div>
                </>
              )}
            </div>
            <Button
              onClick={isEditing ? handleSaveIdentity : handleEditIdentity}
              className="bg-primary hover:bg-opacity-80 text-white rounded-lg px-4 py-2 flex items-center justify-center transition duration-300 glow-border w-full md:w-auto"
              disabled={isLoading || isUpdating || !walletInfo.isConnected}
            >
              {isUpdating ? (
                <>
                  <i className="bx bx-loader-alt animate-spin mr-2"></i>
                  Saving...
                </>
              ) : isEditing ? (
                <>
                  <i className="bx bx-save mr-2"></i>
                  Save Identity
                </>
              ) : (
                <>
                  <i className="bx bx-edit mr-2"></i>
                  Edit Identity
                </>
              )}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-surfaceLight rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Reputation Score</div>
              {isLoading ? (
                <Skeleton className="w-24 h-6" />
              ) : (
                <div className="flex items-center">
                  <div className="font-medium text-lg">{identity?.reputation || "785"}</div>
                  <div className="ml-2 px-2 py-0.5 rounded bg-green-500 bg-opacity-20 text-green-500 text-xs">
                    Excellent
                  </div>
                </div>
              )}
            </div>
            <div className="bg-surfaceLight rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">First Activity</div>
              {isLoading ? (
                <Skeleton className="w-32 h-6" />
              ) : (
                <div className="flex items-center">
                  <div>{formatDate(firstActivityDate)}</div>
                  <div className="ml-2 px-2 py-0.5 rounded bg-secondary bg-opacity-20 text-secondary text-xs">
                    {timeAgo(firstActivityDate)}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-surfaceLight rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Identity Hash</div>
            {isLoading ? (
              <Skeleton className="w-full h-12" />
            ) : isEditing ? (
              <div className="flex flex-col space-y-2">
                <div className="flex">
                  <input 
                    type="text"
                    value={newHash}
                    onChange={(e) => setNewHash(e.target.value)}
                    className="font-mono text-sm break-all bg-background p-3 rounded-l border border-gray-700 border-opacity-50 w-full"
                  />
                  <Button
                    onClick={handleGenerateNewHash}
                    className="bg-primary hover:bg-opacity-80 rounded-r border-r border-t border-b border-gray-700 px-3"
                  >
                    <i className="bx bx-refresh"></i>
                  </Button>
                </div>
                <div className="flex space-x-2 justify-end">
                  <Button
                    variant="outline" 
                    onClick={handleCancelEdit}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="font-mono text-sm break-all bg-background p-3 rounded border border-gray-700 border-opacity-50">
                {identity?.hash || "No identity hash stored. Click 'Edit Identity' to create one."}
              </div>
            )}
          </div>
        </div>
        
        <IdentityBadges isLoading={isLoading} badges={identity?.badges} />
        
        <div className="flex flex-wrap gap-3 mt-5">
          <Button
            onClick={onShare}
            className="flex-1 bg-secondary hover:bg-opacity-80 text-white rounded-lg py-2.5 flex items-center justify-center transition duration-300 glow-border"
            disabled={isLoading || !identity?.hash}
          >
            <i className="bx bx-share-alt mr-2"></i>
            Share Identity
          </Button>
          <Button
            onClick={onExport}
            className="flex-1 bg-surfaceLight hover:bg-opacity-80 text-white rounded-lg py-2.5 flex items-center justify-center transition duration-300"
            disabled={isLoading || !identity?.hash}
          >
            <i className="bx bx-download mr-2"></i>
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );
}
