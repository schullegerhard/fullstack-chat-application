import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { IDENTITY_TYPES, SOURCE_CHAINS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { WalletInfo } from "@/lib/wallet";
import { useIdentity } from "@/hooks/useIdentity";
import { generateRandomHash } from "@/lib/utils";
import { ethers } from 'ethers';

type CrossChainImportProps = {
  walletInfo: WalletInfo;
  onIdentityImported: () => void;
};

export default function CrossChainImport({
  walletInfo,
  onIdentityImported
}: CrossChainImportProps) {
  const { toast } = useToast();
  const { storeIdentity, isStoring, refetchIdentity } = useIdentity(walletInfo);
  const [address, setAddress] = useState("");
  const [sourceChain, setSourceChain] = useState("");
  const [identityType, setIdentityType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState<{ hash: string } | null>(null);

  const handleLookup = async () => {
    if (!address || !sourceChain || !identityType) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields before proceeding.',
        variant: 'destructive'
      });
      return;
    }

    if (!ethers.isAddress(address)) {
      toast({
        title: 'Invalid Address',
        description: 'Please enter a valid Ethereum address.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to fetch identity data
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockHash = ethers.keccak256(ethers.toUtf8Bytes(`${address}-${sourceChain}-${identityType}-${Date.now()}`));
      setFetchedData({ hash: mockHash });
      
      toast({
        title: 'Identity Found',
        description: 'Identity data has been fetched successfully.',
      });
    } catch (error) {
      console.error('Error fetching identity:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch identity data. Please try again.',
        variant: 'destructive'
      });
      setFetchedData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (!fetchedData) {
      toast({
        title: 'No Data',
        description: 'Please lookup the identity data first.',
        variant: 'destructive'
      });
      return;
    }

    if (!walletInfo.isConnected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to import identity.',
        variant: 'destructive'
      });
      return;
    }

    try {
      toast({
        title: 'Importing Identity',
        description: 'Please confirm the transaction in your wallet...',
      });

      await storeIdentity({ 
        identityHash: fetchedData.hash,
        sourceChain: sourceChain
      });

      // Wait a moment for the transaction to be processed
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Refetch identity to confirm it was stored
      const updatedIdentity = await refetchIdentity();
      
      if (updatedIdentity.data) {
        toast({
          title: 'Success',
          description: 'Identity has been successfully imported!',
        });
        onIdentityImported();
        
        // Reset form
        setAddress("");
        setSourceChain("");
        setIdentityType("");
        setFetchedData(null);
      } else {
        throw new Error('Identity not found after import');
      }
    } catch (error: unknown) {
      console.error('Import error:', error);
      
      // Type guard for Error objects
      const errorMessage = error instanceof Error ? error.message : 'Failed to import identity. Please try again.';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="bg-surface rounded-xl overflow-hidden card-glow">
      <div className="h-3 animated-gradient"></div>
      <div className="p-6">
        <h2 className="text-xl font-display font-medium mb-4">Import Identity</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isLoading || isStoring}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sourceChain">Source Chain</Label>
            <Select 
              value={sourceChain} 
              onValueChange={setSourceChain}
              disabled={isLoading || isStoring}
            >
              <SelectTrigger id="sourceChain">
                <SelectValue placeholder="Select chain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="Lisk">Lisk</SelectItem>
                <SelectItem value="binance">Binance Smart Chain</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="identityType">Identity Type</Label>
            <Select 
              value={identityType} 
              onValueChange={setIdentityType}
              disabled={isLoading || isStoring}
            >
              <SelectTrigger id="identityType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="POAP's">POAP's</SelectItem>
                <SelectItem value="NFT's">NFT's</SelectItem>
                <SelectItem value="kyc">Badges</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={handleLookup}
              disabled={isLoading || isStoring || !address || !sourceChain || !identityType}
            >
              {isLoading ? 'Looking up...' : 'Lookup'}
            </Button>
            
            <Button
              onClick={handleImport}
              disabled={isStoring || !fetchedData || !walletInfo.isConnected}
              variant="secondary"
            >
              {isStoring ? 'Importing...' : 'Import'}
            </Button>
          </div>

          {fetchedData && (
            <div className="mt-4 p-4 bg-surfaceLight rounded-lg">
              <h3 className="font-medium mb-2">Found Identity</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-400">Type:</span> {identityType}</p>
                <p><span className="text-gray-400">Address:</span> {address}</p>
                <p><span className="text-gray-400">Chain:</span> {sourceChain}</p>
                <p><span className="text-gray-400">Hash:</span> {`${fetchedData.hash.slice(0, 10)}...${fetchedData.hash.slice(-8)}`}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
