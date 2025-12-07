import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { WalletInfo } from "@/lib/wallet";
import { truncateAddress } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type IdentityShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  walletInfo: WalletInfo;
};

export default function IdentityShareModal({
  isOpen,
  onClose,
  walletInfo
}: IdentityShareModalProps) {
  const [accessType, setAccessType] = useState("public");
  const [shareUrl, setShareUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && walletInfo.address) {
      const baseUrl = window.location.origin;
      setShareUrl(`${baseUrl}/id/${truncateAddress(walletInfo.address)}`);
    }
  }, [isOpen, walletInfo.address]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setIsCopied(true);
        toast({
          title: "URL copied",
          description: "The shareable link has been copied to clipboard"
        });
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy URL:", err);
        toast({
          title: "Failed to copy",
          description: "Could not copy the URL to clipboard",
          variant: "destructive"
        });
      });
  };

  const handleGenerate = () => {
    toast({
      title: "Link generated",
      description: `A ${accessType} shareable link has been created`
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-surface rounded-xl max-w-md w-full mx-4 overflow-hidden card-glow">
        <div className="h-1 animated-gradient"></div>
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">Share Your Identity</DialogTitle>
          <DialogDescription>
            Generate a shareable link for your identity data that others can view.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-background rounded-lg p-4 mb-4">
          <Label className="text-sm text-gray-400 mb-2">Your Identity URL</Label>
          <div className="flex">
            <Input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-grow bg-surfaceLight border border-gray-700 rounded-l-lg px-3 py-2 text-white focus:outline-none font-mono text-sm"
            />
            <Button
              onClick={handleCopyUrl}
              className="bg-surfaceLight hover:bg-gray-700 text-white rounded-r-lg px-3 py-2 flex items-center transition duration-300"
            >
              <i className={`bx ${isCopied ? 'bx-check' : 'bx-copy'}`}></i>
            </Button>
          </div>
        </div>
        
        <div className="bg-surfaceLight rounded-lg p-4 mb-4">
          <Label className="text-sm font-medium mb-2">Access Control</Label>
          <RadioGroup 
            value={accessType} 
            onValueChange={setAccessType}
            className="flex items-center"
          >
            <div className="flex items-center mr-4">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public" className="ml-2 text-sm">Public</Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private" className="ml-2 text-sm">Private</Label>
            </div>
          </RadioGroup>
        </div>
        
        <DialogFooter className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            className="flex-1 bg-primary hover:bg-opacity-80 text-white rounded-lg py-2 transition duration-300 glow-border"
          >
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
