import React, { useState } from "react";
import { X, MessageSquare, Camera, Heart, Send, Upload, Sparkles } from "lucide-react";
import { PhotoPost, PhotoReplyThreadItem } from "../types";
import { playAudioFeedback } from "../utils/audio";

interface SnapscapePhotoThreadModalProps {
  post: PhotoPost | null;
  isOpen: boolean;
  onClose: () => void;
  onAddPhotoReply: (postId: string, reply: PhotoReplyThreadItem) => void;
}

export const SnapscapePhotoThreadModal: React.FC<SnapscapePhotoThreadModalProps> = ({
  post,
  isOpen,
  onClose,
  onAddPhotoReply,
}) => {
  const [replyText, setReplyText] = useState("");
  const [replyPhoto, setReplyPhoto] = useState(
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80"
  );
  const [replies, setReplies] = useState<PhotoReplyThreadItem[]>(post?.threadReplies || []);

  if (!isOpen || !post) return null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() && !replyPhoto) return;
    playAudioFeedback("pop_chime", true);

    const newReply: PhotoReplyThreadItem = {
      id: `rep-${Date.now()}`,
      author: {
        username: "you.candid",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        verified: true,
      },
      imageUrl: replyPhoto,
      thoughtText: replyText || "photo reply to thread 📸",
      timestamp: "Just now",
      reactionsCount: 1,
      isLiked: false,
    };

    setReplies([...replies, newReply]);
    onAddPhotoReply(post.id, newReply);
    setReplyText("");
  };

  const handleToggleLikeReply = (replyId: string) => {
    playAudioFeedback("pop_chime", true);
    setReplies((prev) =>
      prev.map((r) => {
        if (r.id === replyId) {
          const isLiked = !!r.isLiked;
          const count = r.reactionsCount || 0;
          return {
            ...r,
            isLiked: !isLiked,
            reactionsCount: isLiked ? Math.max(0, count - 1) : count + 1,
          };
        }
        return r;
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-[#14161F] text-white rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-pink-200">Photo-Reply Thread</h3>
              <p className="text-[10px] text-white/50 font-mono">BRANCHING CASUAL SUB-GALLERY</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Thread Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Root Post Card */}
          <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <img
                src={post.author.avatar}
                alt={post.author.username}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-white">{post.author.username}</span>
                  <span className="text-[10px] font-mono text-white/40">{post.author.handle || `@${post.author.username}`}</span>
                </div>
                <span className="text-[10px] text-white/40 font-mono">{post.timestamp}</span>
              </div>
            </div>

            <p className="text-xs text-white/90 leading-relaxed font-sans">
              {post.microThought || post.caption}
            </p>

            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-neutral-900 border border-white/5">
              <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Thread Connector Line */}
          <div className="flex items-center gap-2 px-2 text-[10px] font-mono text-pink-400 uppercase tracking-wider">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-pink-500/50 to-transparent" />
            <span>Branching Reply Snaps ({replies.length})</span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-pink-500/50 to-transparent" />
          </div>

          {/* Sub-Gallery Replies */}
          <div className="space-y-3">
            {replies.length === 0 ? (
              <div className="py-8 text-center text-white/40 text-xs">
                No photo replies yet. Be the first to drop a candid snap in the thread!
              </div>
            ) : (
              replies.map((reply) => (
                <div
                  key={reply.id}
                  className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-2 relative ml-4 pl-4 border-l-2 border-l-pink-500/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={reply.author.avatar}
                        alt={reply.author.username}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-bold text-xs text-white">{reply.author.username}</span>
                      <span className="text-[10px] font-mono text-white/40">{reply.timestamp}</span>
                    </div>

                    <button
                      onClick={() => handleToggleLikeReply(reply.id)}
                      className="flex items-center gap-1 text-[11px] font-mono text-white/60 hover:text-pink-400"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          reply.isLiked ? "text-pink-500 fill-pink-500" : ""
                        }`}
                      />
                      <span>{reply.reactionsCount}</span>
                    </button>
                  </div>

                  <p className="text-xs text-white/85 leading-snug">{reply.thoughtText}</p>

                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-neutral-900 border border-white/10 max-w-xs">
                    <img
                      src={reply.imageUrl}
                      alt={reply.thoughtText}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reply Input Footer */}
        <form onSubmit={handleSendReply} className="p-3 border-t border-white/10 bg-black/50 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Reply with a candid thought (280 char max)..."
              maxLength={280}
              className="flex-1 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-pink-400"
            />
            <button
              type="submit"
              disabled={!replyText.trim() && !replyPhoto}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-pink-500/20 active:scale-95 disabled:opacity-40 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Reply Snap</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
