import React, { useState } from "react";
import { Trophy, Flame, Zap, Award, ThumbsUp, Sparkles, UserPlus, Check, Clock, TrendingUp } from "lucide-react";
import { PhotoPost } from "../types";
import { playAudioFeedback } from "../utils/audio";
import { calculateEngagementVelocity } from "../backend/architecture";

interface SnapscapeDailyRankingsViewProps {
  posts: PhotoPost[];
  onSelectPost: (post: PhotoPost) => void;
  onVotePost?: (postId: string) => void;
  followingHandles?: string[];
  onToggleFollow?: (handle: string) => void;
  noMetricMode?: boolean;
}

export const SnapscapeDailyRankingsView: React.FC<SnapscapeDailyRankingsViewProps> = ({
  posts,
  onSelectPost,
  onVotePost,
  followingHandles = [],
  onToggleFollow,
  noMetricMode = false,
}) => {
  const [votedPostId, setVotedPostId] = useState<string | null>(null);

  // Compute ranking metrics for all posts
  const rankedPosts = [...posts]
    .map((p, index) => {
      const ageHours = Math.max(0.5, (Date.now() - new Date(p.isoDate || 0).getTime()) / (1000 * 60 * 60));
      const calculatedVelocity = calculateEngagementVelocity({
        likesCount: p.reactions.fire + p.reactions.sparkles,
        commentsCount: p.commentsCount,
        quotesCount: p.retweetsCount || 0,
        dailyVotesCount: p.dailyVotesCount || (120 - index * 15),
        ageInHours: ageHours,
        isVerifiedAuthor: !!p.author.verified,
      });

      return {
        ...p,
        computedVelocity: p.velocityScore || calculatedVelocity,
        computedVotes: p.dailyVotesCount || Math.max(10, 420 - index * 45),
      };
    })
    .sort((a, b) => b.computedVelocity - a.computedVelocity);

  const topPodium = rankedPosts.slice(0, 3);
  const runnerUps = rankedPosts.slice(3, 10);

  // Distinct top creators of the day
  const topCreators = Array.from(new Set(rankedPosts.map((p) => p.author.handle || `@${p.author.username}`)))
    .slice(0, 4)
    .map((handle) => {
      const post = rankedPosts.find((p) => (p.author.handle || `@${p.author.username}`) === handle)!;
      return {
        handle,
        username: post.author.username,
        avatar: post.author.avatar,
        verified: post.author.verified,
        streak: post.author.streak || 14,
      };
    });

  const handleVote = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    playAudioFeedback("pop_chime", true);
    setVotedPostId(postId);
    if (onVotePost) {
      onVotePost(postId);
    }
  };

  const getPodiumStyle = (rankIndex: number) => {
    switch (rankIndex) {
      case 0:
        return {
          badge: "bg-amber-400 text-amber-950 ring-amber-300",
          border: "border-amber-400/50 shadow-amber-500/10",
          medal: "🥇 #1 TOP OF THE DAY",
        };
      case 1:
        return {
          badge: "bg-slate-300 text-slate-900 ring-slate-200",
          border: "border-slate-300/40 shadow-slate-500/10",
          medal: "🥈 #2 SILVER",
        };
      case 2:
        return {
          badge: "bg-amber-700 text-amber-100 ring-amber-600",
          border: "border-amber-700/40 shadow-amber-700/10",
          medal: "🥉 #3 BRONZE",
        };
      default:
        return {
          badge: "bg-neutral-800 text-white ring-neutral-700",
          border: "border-neutral-200",
          medal: `#${rankIndex + 1}`,
        };
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in pb-10">
      
      {/* Leaderboard Header Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-purple-950 text-white border border-purple-500/20 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="font-extrabold text-sm tracking-wide uppercase">
              Top Rankings of the Day
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 text-[10px] font-mono">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Resets in 14h 22m</span>
          </div>
        </div>

        <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
          Ranked live by community votes, engagement velocity, and candid discussion depth. Cast your daily vote below!
        </p>
      </div>

      {/* Top Creators of the Day Horizontal Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold font-mono uppercase text-neutral-600 tracking-wider">
            Trending Creators
          </h3>
          <span className="text-[10px] text-neutral-400 font-mono">Asymmetric Follow</span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          {topCreators.map((creator) => {
            const isFollowing = followingHandles.includes(creator.handle);

            return (
              <div
                key={creator.handle}
                className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-neutral-200/80 shadow-xs shrink-0"
              >
                <img
                  src={creator.avatar}
                  alt={creator.username}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-neutral-300"
                />
                <div>
                  <span className="text-xs font-bold text-neutral-900 block leading-tight">
                    {creator.username}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-400">
                    {creator.handle}
                  </span>
                </div>

                {onToggleFollow && (
                  <button
                    onClick={() => {
                      playAudioFeedback("pop_chime", true);
                      onToggleFollow(creator.handle);
                    }}
                    className={`ml-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all flex items-center gap-1 ${
                      isFollowing
                        ? "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                        : "bg-neutral-900 text-white hover:bg-neutral-800"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3 h-3" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Podium Cards (Top 3) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold font-mono uppercase text-neutral-600 tracking-wider px-1">
          Daily Leaderboard Podium
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {topPodium.map((post, idx) => {
            const style = getPodiumStyle(idx);
            const isVoted = votedPostId === post.id;

            return (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className={`p-3.5 rounded-3xl bg-white border ${style.border} shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5 relative overflow-hidden`}
              >
                <div className="flex gap-3.5">
                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-neutral-100 shrink-0">
                    <img
                      src={post.imageUrl}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-black shadow-sm ring-1 ${style.badge}`}>
                        #{idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Post Info & Engagement Velocity */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold font-mono text-purple-700">
                          {style.medal}
                        </span>
                        {!noMetricMode && (
                          <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-500">
                            <TrendingUp className="w-3 h-3 text-emerald-600" />
                            <span className="font-bold text-emerald-700">{post.computedVelocity}</span>
                            <span>velocity</span>
                          </div>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-neutral-900 mt-1 line-clamp-2">
                        {post.microThought || post.caption}
                      </h4>

                      <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-neutral-500">
                        <img
                          src={post.author.avatar}
                          alt={post.author.username}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="font-medium text-neutral-700 truncate">{post.author.username}</span>
                        <span>•</span>
                        <span className="font-mono text-[10px]">{post.timestamp}</span>
                      </div>
                    </div>

                    {/* Voting Action Row */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100 mt-2">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-600">
                        <span className="flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                          <span>{post.reactions.fire}</span>
                        </span>
                        {!noMetricMode && (
                          <span className="text-neutral-400">
                            ({post.computedVotes} votes)
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleVote(e, post.id)}
                        className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                          isVoted
                            ? "bg-amber-400 text-amber-950 ring-2 ring-amber-300 font-black"
                            : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                        }`}
                      >
                        <ThumbsUp className={`w-3 h-3 ${isVoted ? "fill-amber-950" : ""}`} />
                        <span>{isVoted ? "Voted!" : "Vote"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Runner-Ups List (#4 to #10) */}
      {runnerUps.length > 0 && (
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold font-mono uppercase text-neutral-600 tracking-wider px-1">
            Top 10 Contenders
          </h3>

          <div className="space-y-2">
            {runnerUps.map((post, idx) => {
              const rank = idx + 4;
              const isVoted = votedPostId === post.id;

              return (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-xs hover:border-neutral-300 flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-neutral-50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 text-center font-mono font-bold text-xs text-neutral-400">
                      #{rank}
                    </span>
                    <img
                      src={post.imageUrl}
                      alt={post.caption}
                      className="w-11 h-11 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-neutral-900 truncate">
                        {post.microThought || post.caption}
                      </p>
                      <span className="text-[10px] font-mono text-neutral-400 block">
                        @{post.author.username} • {post.reactions.fire} 🔥
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleVote(e, post.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all shrink-0 ${
                      isVoted
                        ? "bg-amber-400 text-amber-950"
                        : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    {isVoted ? "Voted" : "Vote"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
