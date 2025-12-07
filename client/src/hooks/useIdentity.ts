import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WalletInfo, getIdentityContract } from '@/lib/wallet';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';

type Identity = {
  identityHash: string;
  sourceChain: string;
  timestamp: string;
  isActive: boolean;
  isShared: boolean;
} | null;

export function useIdentity(walletInfo: WalletInfo) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: identity, isLoading, refetch } = useQuery<Identity>({
    queryKey: ['identity', walletInfo.address],
    queryFn: async () => {
      if (!walletInfo.signer) throw new Error('Wallet not connected');
      
      try {
        console.log('Fetching identity for address:', walletInfo.address);
        const contract = await getIdentityContract(walletInfo.signer);
        const identity = await contract.getIdentity(walletInfo.address);
        
        console.log('Raw identity data:', identity);
        
        // Check if we have valid identity data
        if (identity && identity.identityHash && identity.identityHash !== '') {
          const result = {
            identityHash: identity.identityHash,
            sourceChain: identity.sourceChain,
            timestamp: identity.timestamp.toString(),
            isActive: identity.isActive,
            isShared: identity.isShared || false
          };
          console.log('Processed identity data:', result);
          return result;
        } else {
          console.log('No valid identity found');
          return null;
        }
      } catch (error) {
        console.error('Error fetching identity:', error);
        return null;
      }
    },
    enabled: !!walletInfo.signer && !!walletInfo.address,
    staleTime: 0,
    gcTime: 0
  });

  const storeIdentityMutation = useMutation({
    mutationFn: async ({ identityHash, sourceChain }: { identityHash: string; sourceChain: string }) => {
      if (!walletInfo.signer) throw new Error('Wallet not connected');
      
      console.log('Storing identity:', { identityHash, sourceChain });
      
      const contract = await getIdentityContract(walletInfo.signer);
      
      try {
        // Get the current gas price
        const feeData = await walletInfo.provider?.getFeeData();
        if (!feeData) throw new Error('Could not get fee data');
        
        console.log('Fee data:', {
          gasPrice: feeData.gasPrice?.toString(),
          maxFeePerGas: feeData.maxFeePerGas?.toString(),
          maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString()
        });

        // Estimate gas with a fixed limit
        const gasLimit = ethers.getBigInt(500000); // Fixed gas limit
        
        // Prepare transaction options
        const txOptions: any = {
          gasLimit
        };

        // If legacy transaction (no EIP-1559)
        if (feeData.gasPrice) {
          txOptions.gasPrice = feeData.gasPrice;
        }
        
        console.log('Transaction options:', txOptions);
        
        // Send transaction
        const tx = await contract.storeIdentity(identityHash, sourceChain, txOptions);
        console.log('Transaction sent:', tx.hash);
        
        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);
        
        return receipt;
      } catch (error: any) {
        console.error('Store identity error:', error);
        
        // Handle user rejection
        if (error.code === 4001 || (error.message && error.message.includes('user rejected'))) {
          throw new Error('Transaction was rejected by user');
        }
        
        // Handle other errors
        throw new Error(error.message || 'Failed to store identity');
      }
    },
    onSuccess: async (receipt) => {
      console.log('Identity stored successfully, invalidating queries');
      await queryClient.invalidateQueries({ queryKey: ['identity', walletInfo.address] });
      
      // Add delay before refetching
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = await refetch();
      console.log('Refetch result:', result);

      if (!result.data) {
        throw new Error('Identity not found after storing');
      }

      toast({
        title: 'Identity stored',
        description: 'Your identity has been successfully stored on the blockchain.'
      });
    },
    onError: (error: Error) => {
      console.error('Store identity error:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const shareIdentityMutation = useMutation({
    mutationFn: async (recipientAddress: string) => {
      if (!walletInfo.signer) throw new Error('Wallet not connected');
      
      console.log('Sharing identity with:', recipientAddress);
      
      const contract = await getIdentityContract(walletInfo.signer);
      
      try {
        // Get the current gas price
        const feeData = await walletInfo.provider?.getFeeData();
        if (!feeData) throw new Error('Could not get fee data');

        // Use fixed gas limit
        const gasLimit = ethers.getBigInt(300000);
        
        // Prepare transaction options
        const txOptions: any = {
          gasLimit
        };

        // If legacy transaction (no EIP-1559)
        if (feeData.gasPrice) {
          txOptions.gasPrice = feeData.gasPrice;
        }
        
        // Send transaction
        const tx = await contract.shareIdentity(recipientAddress, txOptions);
        console.log('Share transaction sent:', tx.hash);
        
        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log('Share transaction confirmed:', receipt);
        
        return receipt;
      } catch (error: any) {
        console.error('Share identity error:', error);
        
        // Handle user rejection
        if (error.code === 4001 || (error.message && error.message.includes('user rejected'))) {
          throw new Error('Transaction was rejected by user');
        }
        
        // Handle other errors
        throw new Error(error.message || 'Failed to share identity');
      }
    },
    onSuccess: (receipt) => {
      console.log('Identity shared successfully:', receipt);
      toast({
        title: 'Identity shared',
        description: 'Your identity has been successfully shared.'
      });
    },
    onError: (error: Error) => {
      console.error('Share identity error:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const refetchIdentity = async () => {
    console.log('Manually refetching identity');
    await queryClient.invalidateQueries({ queryKey: ['identity', walletInfo.address] });
    const result = await refetch();
    console.log('Manual refetch result:', result);
    return result;
  };

  return {
    identity,
    isLoading,
    storeIdentity: storeIdentityMutation.mutate,
    shareIdentity: shareIdentityMutation.mutate,
    isStoring: storeIdentityMutation.isPending,
    isSharing: shareIdentityMutation.isPending,
    refetchIdentity
  };
}