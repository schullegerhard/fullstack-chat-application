export default function Footer() {
  return (
    <footer className="border-t border-gray-800 border-opacity-50 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center justify-center md:justify-start">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
                <i className="bx bx-link text-sm"></i>
              </div>
              <span className="text-sm font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                CrossChainVault
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1 text-center md:text-left">
              A cross-chain identity solution
            </div>
          </div>
          
          <div className="flex space-x-4 text-sm text-gray-400">
            <a href="#" className="hover:text-primary transition">Documentation</a>
            <a href="https://github.com" className="hover:text-primary transition">GitHub</a>
            <a href="#" className="hover:text-primary transition">Support</a>
          </div>
          
          <div className="mt-4 md:mt-0 text-xs text-gray-500">
            Powered by Moonbeam & Polkadot
          </div>
        </div>
      </div>
    </footer>
  );
}
