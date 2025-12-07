import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { WalletInfo } from "@/lib/wallet";
import { useIdentity } from "@/hooks/useIdentity";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Step = {
  title: string;
  description: string;
  action?: () => void;
  buttonText?: string;
  isCompleted: boolean;
};

type IdentityGuideProps = {
  walletInfo: WalletInfo;
};

export default function IdentityGuide({ walletInfo }: IdentityGuideProps) {
  const { toast } = useToast();
  const { identity, storeIdentity, shareIdentity, refetchIdentity } = useIdentity(walletInfo);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isStoring, setIsStoring] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (identity?.identityHash) {
      setIsStoring(false);
    }
  }, [identity?.identityHash]);

  const handleStore = async () => {
    setIsStoring(true);
    try {
      await storeIdentity({ 
        identityHash: "0x" + Array(64).fill('0').join(''), // placeholder hash
        sourceChain: "ethereum" 
      });
      await refetchIdentity();
    } catch (error) {
      console.error('Error storing identity:', error);
      setIsStoring(false);
    }
  };

  const handleShare = async () => {
    if (!recipientAddress) return;
    setIsSharing(true);
    try {
      await shareIdentity(recipientAddress);
      await refetchIdentity();
    } catch (error) {
      console.error('Error sharing identity:', error);
      setIsSharing(false);
    }
  };

  const steps = [
    {
      title: 'Store Identity',
      description: 'Store your identity on the blockchain',
      isCompleted: !!identity?.identityHash,
      action: (
        <Button
          onClick={handleStore}
          disabled={!!identity?.identityHash || isStoring}
          variant={isStoring ? "outline" : "default"}
        >
          {isStoring ? 'Storing...' : 'Store Identity'}
        </Button>
      ),
    },
    {
      title: 'Share Identity',
      description: 'Share your identity with another address',
      isCompleted: identity?.isShared,
      action: (
        <div className="flex gap-4">
          <Input
            placeholder="Recipient address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            disabled={!identity?.identityHash || identity?.isShared}
          />
          <Button
            onClick={handleShare}
            disabled={!identity?.identityHash || !recipientAddress || identity?.isShared || isSharing}
            variant={isSharing ? "outline" : "default"}
          >
            {isSharing ? 'Sharing...' : 'Share'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Current Status</h2>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <p>
              Identity Hash:{' '}
              {identity?.identityHash ? (
                <code className="bg-muted px-1 py-0.5 rounded">{identity.identityHash}</code>
              ) : (
                'Not stored'
              )}
            </p>
            <p>
              Source Chain:{' '}
              {identity?.sourceChain ? (
                <code className="bg-muted px-1 py-0.5 rounded">{identity.sourceChain}</code>
              ) : (
                'Not stored'
              )}
            </p>
            <p>
              Shared Status:{' '}
              {identity?.isShared ? (
                <Badge variant="default">Shared</Badge>
              ) : (
                <Badge variant="secondary">Not Shared</Badge>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Setup Guide</h2>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg ${
                step.isCompleted ? 'border-green-500 bg-green-50/10' : 'border-border'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {step.isCompleted ? (
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step.action
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
} 