import { CHAIN_NETWORKS } from "@/lib/constants";

export default function ChainSelector() {
  return (
    <div className="bg-surface rounded-xl p-5 card-glow">
      <h2 className="text-lg font-display font-medium mb-4">Chain Networks</h2>
      
      <div className="space-y-3">
        {CHAIN_NETWORKS.map((chain) => (
          <div 
            key={chain.id}
            className={`${
              chain.isPrimary 
                ? "bg-primary bg-opacity-10 border border-primary border-opacity-30" 
                : "border border-gray-700 border-opacity-50 opacity-70 hover:opacity-100"
            } rounded-lg p-3 flex items-center transition duration-300`}
          >
            <div className={`w-10 h-10 rounded-full ${chain.isPrimary ? "bg-primary bg-opacity-20" : "bg-gray-700 bg-opacity-20"} flex items-center justify-center mr-3`}>
              <i className={`bx ${chain.icon} text-xl ${chain.iconColor}`}></i>
            </div>
            <div className="flex-grow">
              <div className="font-medium">{chain.name}</div>
              <div className="text-xs text-gray-400">{chain.description}</div>
            </div>
            {chain.isPrimary ? (
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            ) : (
              <button className="text-xs px-2 py-1 rounded bg-surfaceLight hover:bg-gray-700 transition">
                Connect
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Cross-Chain Status</h3>
        <div className="chain-connection-line flex justify-between mb-2">
          <div className="w-12 h-12 rounded-full bg-surfaceLight flex items-center justify-center z-10">
            <i className="bx bxl-ethereum text-lg text-secondary"></i>
          </div>
          <div className="w-12 h-12 rounded-full bg-surfaceLight flex items-center justify-center z-10">
            <i className="bx bx-link text-lg text-primary"></i>
          </div>
          <div className="w-12 h-12 rounded-full bg-surfaceLight flex items-center justify-center z-10">
            <i className="bx bx-diamond text-lg text-accent1"></i>
          </div>
        </div>
        <div className="text-xs text-center text-gray-400">
          Bridge connections active and operational
        </div>
      </div>
    </div>
  );
}
