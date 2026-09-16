import React, { useState } from "react";
import { Sparkles, Percent, Hash } from "lucide-react";
import { PhotoPost } from "../types";
import { playAudioFeedback } from "../utils/audio";

interface SnapscapeReactionBadgesProps {
  post: PhotoPost;
  onReact?: (postId: string, emojiType: keyof PhotoPost["reactions"]) => void;
  noMetricMode?: boolean;
}

const EMOJI_MAP: Array<{
  key: keyof PhotoPost["reactions"];
  emoji: string;
  label: string;
  bgColor: string;
  barColor: string;
}> = [
  { key: "fire", emoji: "🔥", label: "Fire", bgColor: "hover:bg-orange-500/20 text-orange-400", barColor: "bg-orange-500" },
  { key: "sparkles", emoji: "✨", label: "Sparkles", bgColor: "hover:bg-yellow-400/20 text-yellow-300", barColor: "bg-yellow-400" },
  { key: "lightning", emoji: "⚡", label: "Lightning", bgColor: "hover:bg-cyan-400/20 text-cyan-300", barColor: "bg-cyan-400" },
  { key: "nails", emoji: "💅", label: "Slay", bgColor: "hover:bg-pink-400/20 text-pink-300", barColor: "bg-pink-400" },
  { key: "skull", emoji: "💀", label: "Dead", bgColor: "hover:bg-neutral-400/20 text-neutral-300", barColor: "bg-neutral-400" },
  { key: "sob", emoji: "😭", label: "Sob", bgColor: "hover:bg-blue-400/20 text-blue-300", barColor: "bg-blue-400" },
];

export const SnapscapeReactionBadges: React.FC<SnapscapeReactionBadgesProps> = ({
  post,
  onReact,
  noMetricMode = false,
}) => {
  const [viewMode, setViewMode] = useState<"counts" | "percentages">("counts");

  // Calculate total reactions across all emoji types
  const reactionValues = Object.values(post.reactions) as number[];
  const totalReactions = reactionValues.reduce((acc: number, count: number) => acc + (count || 0), 0);

  const handleEmojiClick = (emojiKey: keyof PhotoPost["reactions"]) => {
    playAudioFeedback("pop_chime", true);
    if (onReact) {
      onReact(post.id, emojiKey);
    }
  };

  return (
    <div className="w-full space-y-2 select-none">
      {/* Header with Mode Toggle */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-neutral-400 text-[11px] font-medium">
          Reactions Breakdown
        </span>

        {!noMetricMode && (
          <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-full border border-white/10 text-[10px] font-mono">
            <button
              type="button"
              onClick={() => setViewMode("counts")}
              className={`px-2 py-0.5 rounded-full transition-all flex items-center gap-1 ${
                viewMode === "counts" ? "bg-white/20 text-white font-bold" : "text-white/40 hover:text-white"
              }`}
            >
              <Hash className="w-2.5 h-2.5" />
              <span>Counts</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("percentages")}
              className={`px-2 py-0.5 rounded-full transition-all flex items-center gap-1 ${
                viewMode === "percentages" ? "bg-white/20 text-white font-bold" : "text-white/40 hover:text-white"
              }`}
            >
              <Percent className="w-2.5 h-2.5" />
              <span>Vibe %</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid of Badges or Percentage Progress Bars */}
      {viewMode === "counts" ? (
        <div className="flex items-center gap-1.5 flex-wrap">
          {EMOJI_MAP.map(({ key, emoji, label, bgColor }) => {
            const count = post.reactions[key] || 0;
            const isUserSelected = post.userReaction === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleEmojiClick(key)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all duration-200 border ${bgColor} ${
                  isUserSelected 
                    ? "bg-white/20 border-white/40 scale-105 shadow-sm" 
                    : "bg-white/5 border-white/10 hover:border-white/25"
                }`}
                title={`React with ${label}`}
              >
                <span>{emoji}</span>
                {!noMetricMode && (
                  <span className="font-bold">{count}</span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        /* Percentage Breakdown View */
        <div className="space-y-1.5 bg-white/5 p-3 rounded-2xl border border-white/10">
          {EMOJI_MAP.filter(({ key }) => (Number(post.reactions[key]) || 0) > 0).map(({ key, emoji, label, barColor }) => {
            const count = Number(post.reactions[key]) || 0;
            const pct = totalReactions > 0 ? Math.round((count / totalReactions) * 100) : 0;

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleEmojiClick(key)}
                className="w-full flex items-center justify-between text-[11px] group p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-1.5 w-16 shrink-0">
                  <span>{emoji}</span>
                  <span className="text-white/80 font-mono text-[10px]">{label}</span>
                </div>

                <div className="flex-1 mx-3 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <span className="font-mono text-white font-bold w-9 text-right text-[11px]">
                  {pct}%
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
