import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_BADGES, Badge } from "@/lib/constants";

type IdentityBadgesProps = {
  isLoading: boolean;
  badges?: Badge[];
};

export default function IdentityBadges({ isLoading, badges = DEFAULT_BADGES }: IdentityBadgesProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Identity Badges</h3>
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          {badges.map((badge) => (
            <div 
              key={badge.id} 
              className="bg-surfaceLight rounded-lg p-3 flex flex-col items-center"
            >
              <div className={`w-10 h-10 rounded-full ${badge.iconBgColor} flex items-center justify-center mb-2`}>
                <i className={`bx ${badge.icon} text-xl ${badge.iconColor}`}></i>
              </div>
              <div className="text-sm font-medium text-center">{badge.name}</div>
              <div className="text-xs text-gray-400 text-center mt-1">{badge.network}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
