import React, { useState } from "react";
import { 
  Heart, 
  MessageSquare, 
  Repeat, 
  Share2, 
  Music, 
  Sparkles, 
  Play, 
  Square, 
  Check, 
  Flame, 
  Disc,
  Info,
  ExternalLink
} from "lucide-react";
import { PhotoPost } from "../types";
import { playAudioFeedback, playAmbientTrack, stopCurrentAmbientTrack } from "../utils/audio";
import { TRENDING_MICRO_TOPICS } from "../data/mockPosts";

interface SnapscapeMicroFeedViewProps {
  posts: PhotoPost[];
  onLikePost: (postId: string) => void;
  onOpenThread: (post: PhotoPost) => void;
  onOpenQuoteModal: (post: PhotoPost) => void;
  onOpenSnapDetail: (post: PhotoPost) => void;
  onOpenDevNotes?: () => void;
  selectedTopic: string | null;
  onSelectTopic: (topic: string | null) => void;
  noMetricMode?: boolean;
}

export const SnapscapeMicroFeedView: React.FC<SnapscapeMicroFeedViewProps> = ({
  posts,
  onLikePost,
  onOpenThread,
  onOpenQuoteModal,
  onOpenSnapDetail,
  onOpenDevNotes,
  selectedTopic,
  onSelectTopic,
  noMetricMode = false,
}) => {
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [heartBurstPostId, setHeartBurstPostId] = useState<string | null>(null);

  const filteredPosts = selectedTopic
    ? posts.filter((p) => p.topicTags?.includes(selectedTopic) || p.microThought?.includes(selectedTopic))
    : posts;

  const handleToggleAudio = (post: PhotoPost) => {
    if (!post.audioTag) return;
    if (playingAudioId === post.id) {
      stopCurrentAmbientTrack();
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(post.id);
      playAmbientTrack(post.audioTag.presetId, post.audioTag.duration || 5, () => {
        setPlayingAudioId(null);
      });
    }
  };

  const handleShare = (postId: string) => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedId(postId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLike = (post: PhotoPost) => {
    playAudioFeedback("pop_chime", true);
    if (!post.isLikedByUser) {
      setHeartBurstPostId(post.id);
      setTimeout(() => setHeartBurstPostId(null), 800);
    }
    onLikePost(post.id);
  };

  return (
    <div className="space-y-4 animate-in fade-in pb-12">
      {/* Trending Micro-Topics Pill Carousel */}
      <div className="space-y-1.5 px-1">
        <div className="flex items-center justify-between text-xs font-mono text-neutral-600">
          <span className="font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Trending Visual Vibes</span>
          </span>
          {selectedTopic && (
            <button
              onClick={() => onSelectTopic(null)}
              className="text-[10px] text-pink-600 font-bold hover:underline"
            >
              Clear Filter
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => onSelectTopic(null)}
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all ${
              !selectedTopic
                ? "bg-neutral-900 text-white shadow-sm"
                : "bg-neutral-200/80 text-neutral-600 hover:bg-neutral-300"
            }`}
          >
            All Snaps
          </button>
          {TRENDING_MICRO_TOPICS.map((topic) => (
            <button
              key={topic.tag}
              onClick={() => onSelectTopic(selectedTopic === topic.tag ? null : topic.tag)}
              className={`px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1.5 whitespace-nowrap transition-all ${
                selectedTopic === topic.tag
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-sm"
                  : "bg-white border border-neutral-300/80 text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <span>{topic.icon}</span>
              <span className="font-bold">{topic.tag}</span>
              <span className="text-[10px] opacity-60">({topic.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Micro-Feed List */}
      <div className="space-y-3">
        {filteredPosts.map((post) => {
          const isOfficial = post.isOfficialReleaseNote;
          const isAudioPlaying = playingAudioId === post.id;
          const isBursting = heartBurstPostId === post.id;

          return (
            <article
              key={post.id}
              className={`rounded-3xl p-4 transition-all duration-200 border ${
                isOfficial
                  ? "bg-gradient-to-br from-[#12141F] to-[#1E192B] text-white border-purple-500/40 shadow-lg"
                  : "bg-white text-neutral-900 border-neutral-200/80 shadow-sm hover:shadow-md"
              }`}
            >
              {/* Official In-Feed Release Note Badge */}
              {isOfficial && (
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                    <span>Official Release Card • ASAAKURIGO AI DEV</span>
                  </div>
                  {onOpenDevNotes && (
                    <button
                      onClick={onOpenDevNotes}
                      className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 text-[10px] font-bold flex items-center gap-1"
                    >
                      <span>View Changelog</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Author Row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={post.author.avatar}
                    alt={post.author.username}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-neutral-200/50"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm leading-none">{post.author.username}</span>
                      {post.author.verified && (
                        <span className="text-[10px] bg-blue-500 text-white rounded-full px-1.5 py-0.2 font-bold">
                          ✓
                        </span>
                      )}
                      <span className="text-xs font-mono opacity-50">
                        {post.author.handle || `@${post.author.username}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-mono opacity-50">{post.timestamp}</span>
                      {post.isLiveSnippet && (
                        <span className="px-1.5 py-0.2 rounded bg-red-500/10 text-red-500 text-[9px] font-mono font-bold">
                          LIVE 3S
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Digicam date stamp tag */}
                <span className="text-[10px] font-mono text-amber-500 font-bold">
                  {post.digicamMetadata?.dateStamp || "'26 09"}
                </span>
              </div>

              {/* Micro-Thought (280-char cap short-form text) */}
              <p className="mt-2.5 text-sm leading-relaxed font-sans font-medium">
                {post.microThought || post.caption}
              </p>

              {/* Topic Tags */}
              {post.topicTags && post.topicTags.length > 0 && (
                <div className="flex items-center gap-1.5 mt-2">
                  {post.topicTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => onSelectTopic(tag)}
                      className="text-xs font-mono font-bold text-pink-600 hover:underline"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Photo Media (Always required for Photo-First Micro-Feed) */}
              <div 
                className="mt-3 relative rounded-2xl overflow-hidden bg-neutral-900 cursor-pointer group shadow-sm select-none"
                onClick={() => onOpenSnapDetail(post)}
              >
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="w-full max-h-[360px] object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                  loading="lazy"
                />

                {/* Double-tap heart burst */}
                {isBursting && (
                  <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center animate-ping duration-700">
                    <Heart className="w-16 h-16 text-[#FE2C55] fill-[#FE2C55] drop-shadow-[0_0_12px_rgba(254,44,85,0.9)]" />
                  </div>
                )}

                {/* Dual-View Front-Camera PIP Badge */}
                {post.dualView && (
                  <div className="absolute top-3 left-3 w-12 h-12 rounded-full border-2 border-white shadow-xl overflow-hidden z-10">
                    <img src={post.dualView.frontCameraUrl} alt="Dual view react" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Audio Tag Indicator */}
                {post.audioTag && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleAudio(post);
                    }}
                    className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white font-mono text-xs flex items-center gap-1.5 z-10 border border-purple-400/40 hover:bg-black/90 active:scale-95 transition-all"
                  >
                    {isAudioPlaying ? <Square className="w-3 h-3 text-pink-400" /> : <Play className="w-3 h-3 text-pink-400" />}
                    <span className="text-[10px] font-bold">{isAudioPlaying ? "Playing Clip" : "5s Audio Tag"}</span>
                  </button>
                )}
              </div>

              {/* Embedded Quote-Photo Card (Visual Retweet) */}
              {post.quoteOf && (
                <div 
                  className="mt-3 p-3 rounded-2xl bg-neutral-100 dark:bg-black/30 border border-neutral-200 dark:border-white/10 flex items-start gap-3 cursor-pointer hover:border-cyan-400 transition-colors"
                  onClick={() => onOpenSnapDetail(post)}
                >
                  <img
                    src={post.quoteOf.originalImageUrl}
                    alt="Quoted snap"
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Repeat className="w-3 h-3 text-cyan-500" />
                      <span className="font-bold text-xs">{post.quoteOf.originalAuthor.username}</span>
                      <span className="text-[10px] font-mono opacity-50">quoted snap</span>
                    </div>
                    <p className="text-xs opacity-80 line-clamp-2">
                      {post.quoteOf.originalCaption}
                    </p>
                  </div>
                </div>
              )}

              {/* Twitter-Style Action Bar */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-100 dark:border-white/5 text-xs font-mono">
                {/* 1. Branching Photo Reply Thread */}
                <button
                  onClick={() => onOpenThread(post)}
                  className="flex items-center gap-1.5 text-neutral-600 hover:text-pink-600 transition-colors p-1"
                  title="Branching photo replies thread"
                >
                  <MessageSquare className="w-4 h-4" />
                  {!noMetricMode && (
                    <span>{(post.threadReplies?.length || 0) + post.commentsCount}</span>
                  )}
                </button>

                {/* 2. Quote-Photo / Visual Retweet */}
                <button
                  onClick={() => onOpenQuoteModal(post)}
                  className="flex items-center gap-1.5 text-neutral-600 hover:text-cyan-600 transition-colors p-1"
                  title="Quote-Photo / Visual Retweet"
                >
                  <Repeat className="w-4 h-4" />
                  {!noMetricMode && (
                    <span>{post.retweetsCount || 1}</span>
                  )}
                </button>

                {/* 3. Like (TikTok 1-tap) */}
                <button
                  onClick={() => handleLike(post)}
                  className="flex items-center gap-1.5 transition-transform active:scale-125 p-1"
                  title={post.isLikedByUser ? "Unlike" : "Like"}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      post.isLikedByUser
                        ? "text-[#FE2C55] fill-[#FE2C55] scale-110"
                        : "text-neutral-600 hover:text-[#FE2C55]"
                    }`}
                  />
                  {!noMetricMode && (
                    <span className={post.isLikedByUser ? "text-[#FE2C55] font-bold" : "text-neutral-600"}>
                      {post.reactions.fire}
                    </span>
                  )}
                </button>

                {/* 4. Share */}
                <button
                  onClick={() => handleShare(post.id)}
                  className="flex items-center gap-1 text-neutral-600 hover:text-neutral-900 transition-colors p-1"
                  title="Share snap"
                >
                  {copiedId === post.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
