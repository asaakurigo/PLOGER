import React, { useState } from "react";
import { 
  X, 
  Heart, 
  MessageCircle, 
  Share2, 
  Sparkles, 
  Send, 
  MapPin, 
  Check, 
  Bot, 
  Music, 
  Disc, 
  Palette, 
  Pin, 
  Lock, 
  Clock, 
  Flame, 
  Zap, 
  Play, 
  Square,
  UserPlus,
  UserCheck,
  ShieldAlert,
  MoreHorizontal
} from "lucide-react";
import { PhotoPost } from "../types";
import { playAudioFeedback, playAmbientTrack, stopCurrentAmbientTrack } from "../utils/audio";
import { SnapscapeCommentTree } from "./SnapscapeCommentTree";
import { SnapscapeReactionBadges } from "./SnapscapeReactionBadges";
import { SnapscapeExportModal } from "./SnapscapeExportModal";

interface SnapscapeSnapDetailModalProps {
  post: PhotoPost | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (postId: string) => void;
  onLikeComment?: (postId: string, commentId: string) => void;
  onReplyComment?: (postId: string, parentId: string, replyText: string) => void;
  onAddComment: (postId: string, comment: string) => void;
  onReact?: (postId: string, emojiType: any) => void;
  onOpenDoodleModal?: (post: PhotoPost) => void;
  onTogglePin?: (postId: string) => void;
  onToggleGhostVault?: (postId: string) => void;
  onVoteVibe?: (postId: string, vibe: "fire" | "sparkles" | "lightning" | "nails") => void;
  followingHandles?: string[];
  onToggleFollow?: (handle: string) => void;
  onBlockUser?: (handle: string) => void;
  noMetricMode?: boolean;
}

export const SnapscapeSnapDetailModal: React.FC<SnapscapeSnapDetailModalProps> = ({
  post,
  isOpen,
  onClose,
  onLike,
  onLikeComment,
  onReplyComment,
  onAddComment,
  onReact,
  onOpenDoodleModal,
  onTogglePin,
  onToggleGhostVault,
  onVoteVibe,
  followingHandles = [],
  onToggleFollow,
  onBlockUser,
  noMetricMode = false,
}) => {
  const [newComment, setNewComment] = useState("");
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [heartBurstPos, setHeartBurstPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [lastTapTime, setLastTapTime] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  if (!isOpen || !post) return null;

  const authorHandle = post.author.handle || `@${post.author.username}`;
  const isFollowingAuthor = followingHandles.includes(authorHandle);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(post.id, newComment.trim());
    setNewComment("");
    playAudioFeedback("pop_chime", true);
  };

  const handleOpenExport = () => {
    playAudioFeedback("pop_chime", true);
    setIsExportModalOpen(true);
  };

  // 5-second ambient snapshot audio playback
  const handleToggleAudio = () => {
    if (!post.audioTag) return;
    if (isPlayingAudio) {
      stopCurrentAmbientTrack();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      playAmbientTrack(post.audioTag.presetId, post.audioTag.duration || 5, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  // TikTok-style double tap on photo to like & show floating heart burst
  const handlePhotoDoubleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (now - lastTapTime < 320) {
      if (!post.isLikedByUser) {
        onLike(post.id);
      }
      playAudioFeedback("pop_chime", true);
      setHeartBurstPos({ x, y });
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 850);
    }
    setLastTapTime(now);
  };

  const handleLikeClick = () => {
    playAudioFeedback("pop_chime", true);
    onLike(post.id);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
        <div 
          className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh] bg-[#14161B] text-white border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Author and Asymmetric Follow / Block */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-black/30">
            <div className="flex items-center gap-3">
              <img 
                src={post.author.avatar} 
                alt={post.author.username} 
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20"
              />
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-sm text-white">{post.author.username}</span>
                  {post.author.verified && (
                    <span className="text-[10px] bg-blue-500 text-white rounded-full px-1.5 py-0.2 font-bold">✓</span>
                  )}
                  {post.isPinned && (
                    <span className="text-[9px] bg-pink-500/20 text-pink-300 font-mono px-1.5 py-0.2 rounded font-bold">
                      PINNED
                    </span>
                  )}

                  {/* Asymmetric Follow Button */}
                  {onToggleFollow && (
                    <button
                      onClick={() => {
                        playAudioFeedback("pop_chime", true);
                        onToggleFollow(authorHandle);
                      }}
                      className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                        isFollowingAuthor 
                          ? "bg-white/10 text-white/70 hover:bg-white/20" 
                          : "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-90"
                      }`}
                    >
                      {isFollowingAuthor ? (
                        <>
                          <UserCheck className="w-3 h-3 text-emerald-400" />
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

                {post.location && (
                  <div className="flex items-center gap-1 text-[11px] text-white/50">
                    <MapPin className="w-3 h-3 text-pink-400" />
                    <span>{post.location.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Doodle & Stamp Overlay Button */}
              {onOpenDoodleModal && (
                <button
                  onClick={() => onOpenDoodleModal(post)}
                  className="px-2.5 py-1 rounded-full bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 text-xs font-mono flex items-center gap-1 transition-colors"
                  title="Doodle or leave stamp"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Doodle</span>
                </button>
              )}

              {/* Pin to Profile */}
              {onTogglePin && (
                <button
                  onClick={() => onTogglePin(post.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    post.isPinned ? "bg-pink-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                  title={post.isPinned ? "Unpin from profile" : "Pin to profile"}
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Export Card Button */}
              <button
                onClick={handleOpenExport}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors"
                title="Export & Share snap card"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* More / Block Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {showMoreMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-neutral-900 border border-neutral-700 rounded-2xl p-1.5 shadow-xl z-30 animate-in fade-in">
                    {onBlockUser && (
                      <button
                        onClick={() => {
                          onBlockUser(authorHandle);
                          setShowMoreMenu(false);
                          onClose();
                        }}
                        className="w-full px-3 py-2 rounded-xl text-left text-xs text-red-400 hover:bg-red-500/20 flex items-center gap-2 transition-colors font-mono"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Block Author</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  stopCurrentAmbientTrack();
                  onClose();
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 p-4 space-y-4">
            
            {/* Photo Preview Container with TikTok Double-Tap Like */}
            <div 
              className="relative rounded-2xl overflow-hidden bg-black shadow-lg group select-none cursor-pointer"
              onClick={handlePhotoDoubleTap}
            >
              <img 
                src={post.imageUrl} 
                alt={post.caption} 
                className="w-full max-h-[380px] object-cover mx-auto pointer-events-none"
              />

              {/* Rendered Sticker Stamps on Photo */}
              {post.doodles?.map((item) => {
                if (item.type === "stamp" || item.type === "voice_marker") {
                  return (
                    <div
                      key={item.id}
                      style={{ left: `${item.x ?? 50}%`, top: `${item.y ?? 50}%` }}
                      className="absolute z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
                    >
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-pink-500/40 text-white shadow-[0_0_12px_rgba(255,42,133,0.4)]">
                        <span className="text-sm">{item.emoji}</span>
                        <span className="text-[10px] font-mono font-bold tracking-wider text-pink-300">
                          {item.stampText}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              })}

              {/* Dual-View Front-Camera PIP Circle */}
              {post.dualView?.frontCameraUrl && (
                <div className="absolute top-3 left-3 w-16 h-16 rounded-full border-2 border-white shadow-2xl overflow-hidden z-20 animate-in zoom-in-50">
                  <img 
                    src={post.dualView.frontCameraUrl} 
                    alt="Reaction front camera" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[7px] text-center font-mono text-cyan-300 py-0.2">
                    REACT
                  </div>
                </div>
              )}

              {/* Ephemeral 48h Badge */}
              {post.ephemeralHoursLeft && !post.isPinned && (
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center gap-1 z-20">
                  <Clock className="w-3 h-3" />
                  <span>{post.ephemeralHoursLeft}h left</span>
                </div>
              )}

              {/* TikTok Double-Tap Floating Heart Burst */}
              {showHeartBurst && (
                <div 
                  style={{ left: `${heartBurstPos.x}%`, top: `${heartBurstPos.y}%` }}
                  className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-30 animate-ping duration-700"
                >
                  <Heart className="w-20 h-20 text-[#FE2C55] fill-[#FE2C55] drop-shadow-[0_0_16px_rgba(254,44,85,0.9)] rotate-[-12deg]" />
                </div>
              )}

              {/* Retro Digicam Watermark */}
              {post.digicamMetadata?.dateStamp && (
                <div className="absolute bottom-3 right-3 text-[#ff9d00] font-mono text-xs font-bold tracking-widest bg-black/50 px-2 py-0.5 rounded pointer-events-none select-none">
                  {post.digicamMetadata.dateStamp}
                </div>
              )}
            </div>

            {/* Micro-Thought & Caption */}
            <div className="px-1 space-y-1.5">
              {post.microThought && (
                <p className="text-sm text-white/95 leading-relaxed font-sans font-medium">
                  {post.microThought}
                </p>
              )}
              {post.caption && post.caption !== post.microThought && (
                <p className="text-xs text-white/70 leading-relaxed font-sans">
                  {post.caption}
                </p>
              )}
              <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
                <span>{post.timestamp}</span>
                {post.topicTags?.map((tag) => (
                  <span key={tag} className="text-pink-400 font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Audio Memo Bar */}
            {post.audioTag && (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/40 via-blue-950/30 to-black/50 border border-purple-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 ${
                    isPlayingAudio ? "animate-spin" : ""
                  }`}>
                    <Disc className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-purple-200">{post.audioTag.title}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">
                        5s AUDIO TAG
                      </span>
                    </div>
                    <span className="text-[10px] text-white/50">Ambient Sound Memory</span>
                  </div>
                </div>

                <button
                  onClick={handleToggleAudio}
                  className="px-3 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 active:scale-95 transition-all"
                >
                  {isPlayingAudio ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isPlayingAudio ? "Stop" : "Play Clip"}</span>
                </button>
              </div>
            )}

            {/* Reactions & Percentage Breakdown Module */}
            <div className="p-3 bg-black/40 rounded-2xl border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLikeClick}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 transition-transform active:scale-110"
                  >
                    <Heart 
                      className={`w-4 h-4 transition-colors ${
                        post.isLikedByUser 
                          ? "text-[#FE2C55] fill-[#FE2C55]" 
                          : "text-white/80"
                      }`} 
                    />
                    {!noMetricMode && (
                      <span className={`text-xs font-mono font-bold ${
                        post.isLikedByUser ? "text-[#FE2C55]" : "text-white"
                      }`}>
                        {post.reactions.fire}
                      </span>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-white/80 text-xs font-mono">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{post.comments.length}</span>
                  </div>
                </div>

                <button
                  onClick={handleOpenExport}
                  className="text-xs font-mono text-pink-400 hover:text-pink-300 flex items-center gap-1"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Export Card</span>
                </button>
              </div>

              {/* Standard Counts & Percentage Breakdown Badges */}
              <SnapscapeReactionBadges
                post={post}
                onReact={onReact}
                noMetricMode={noMetricMode}
              />
            </div>

            {/* Multi-Threaded Nested Comments Section */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white/70 uppercase tracking-wider font-mono">
                  Nested Discussion Tree ({post.comments.length})
                </h4>
                <span className="text-[10px] text-white/40 font-mono">
                  Multi-threaded replies & 1-tap likes
                </span>
              </div>

              <div className="max-h-60 overflow-y-auto pr-1">
                <SnapscapeCommentTree
                  comments={post.comments}
                  postId={post.id}
                  onLikeComment={onLikeComment || (() => {})}
                  onReplyComment={onReplyComment || ((_, parentId, text) => onAddComment(post.id, text))}
                  noMetricMode={noMetricMode}
                />
              </div>
            </div>

          </div>

          {/* Comment Input Footer */}
          <form onSubmit={handleSendComment} className="p-3 border-t border-white/10 bg-black/40 flex items-center gap-2">
            <input 
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment to the thread... (Enter to post)"
              className="flex-1 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-pink-400"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 disabled:opacity-40 flex items-center justify-center text-white transition-all active:scale-95 shadow-md shadow-pink-500/20 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>

      {/* External Export Card Modal with Subtle Creator Attribution */}
      <SnapscapeExportModal
        post={post}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </>
  );
};
