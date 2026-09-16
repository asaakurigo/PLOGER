import React, { useState } from "react";
import { Heart, Reply, CornerDownRight, MessageCircle, ChevronDown, ChevronRight, Check } from "lucide-react";
import { PostComment } from "../types";
import { playAudioFeedback } from "../utils/audio";

interface SnapscapeCommentTreeProps {
  comments: PostComment[];
  postId: string;
  onLikeComment: (postId: string, commentId: string) => void;
  onReplyComment: (postId: string, parentId: string, replyText: string) => void;
  noMetricMode?: boolean;
}

interface SingleCommentItemProps {
  comment: PostComment;
  postId: string;
  depth?: number;
  onLikeComment: (postId: string, commentId: string) => void;
  onReplyComment: (postId: string, parentId: string, replyText: string) => void;
  noMetricMode?: boolean;
}

const SingleCommentItem: React.FC<SingleCommentItemProps> = ({
  comment,
  postId,
  depth = 0,
  onLikeComment,
  onReplyComment,
  noMetricMode = false,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isBuddy = comment.isBuddy || comment.user.toLowerCase().includes("buddy");
  const avatarSrc = isBuddy ? "/plog-buddy.jpg" : comment.avatar;
  const displayName = isBuddy ? "PLOG buddy" : comment.user;
  const hasReplies = comment.replies && comment.replies.length > 0;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReplyComment(postId, comment.id, replyText.trim());
    setReplyText("");
    setIsReplying(false);
    setIsCollapsed(false);
    playAudioFeedback("pop_chime", true);
  };

  return (
    <div className={`flex flex-col text-xs group transition-all ${depth > 0 ? "mt-2 ml-4 pl-3 border-l-2 border-white/10" : "mt-2"}`}>
      <div className="flex items-start gap-2.5">
        {/* Avatar */}
        <div className="relative shrink-0">
          <img 
            src={avatarSrc} 
            alt={displayName} 
            className={`w-7 h-7 rounded-full object-cover mt-0.5 ${
              isBuddy ? "ring-2 ring-cyan-400" : "ring-1 ring-white/20"
            }`} 
          />
          {isBuddy && (
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-pink-500 rounded-full ring-1 ring-black" />
          )}
        </div>

        {/* Comment Bubble */}
        <div className="flex-1 bg-white/5 rounded-2xl p-2.5 border border-white/5 flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-white text-[11px]">{displayName}</span>
              {isBuddy && (
                <span className="text-[8px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                  AI BUDDY
                </span>
              )}
              <span className="text-[10px] text-white/40 font-mono">{comment.timestamp}</span>
            </div>

            <p className="text-white/85 leading-relaxed text-xs break-words">{comment.text}</p>

            {/* Action Bar: Reply & Collapse */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center gap-1 text-[10px] font-mono text-white/50 hover:text-pink-300 transition-colors"
              >
                <Reply className="w-3 h-3" />
                <span>{isReplying ? "Cancel" : "Reply"}</span>
              </button>

              {hasReplies && (
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="flex items-center gap-1 text-[10px] font-mono text-white/40 hover:text-white/80 transition-colors"
                >
                  {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  <span>{comment.replies!.length} {comment.replies!.length === 1 ? "reply" : "replies"}</span>
                </button>
              )}
            </div>
          </div>

          {/* TikTok-Style 1-Tap Comment Like */}
          <button
            onClick={() => onLikeComment(postId, comment.id)}
            className="flex flex-col items-center gap-0.5 pt-0.5 shrink-0 transition-transform active:scale-125 focus:outline-none"
            title={comment.isLikedByUser ? "Unlike comment" : "Like comment"}
          >
            <Heart 
              className={`w-3.5 h-3.5 transition-all duration-200 ${
                comment.isLikedByUser 
                  ? "text-[#FE2C55] fill-[#FE2C55] scale-110 drop-shadow-[0_0_6px_rgba(254,44,85,0.7)]" 
                  : "text-white/40 hover:text-white/70"
              }`} 
            />
            {!noMetricMode && (comment.likesCount ?? 0) > 0 && (
              <span className={`text-[10px] font-mono font-medium ${
                comment.isLikedByUser ? "text-[#FE2C55]" : "text-white/40"
              }`}>
                {comment.likesCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Inline Reply Input Box */}
      {isReplying && (
        <form 
          onSubmit={handleSendReply}
          className="mt-2 ml-9 flex items-center gap-2 animate-in fade-in"
        >
          <div className="flex items-center text-white/40">
            <CornerDownRight className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Reply to ${displayName}...`}
            className="flex-1 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-pink-400"
            autoFocus
          />
          <button
            type="submit"
            disabled={!replyText.trim()}
            className="px-3 py-1.5 rounded-full bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white text-[11px] font-bold transition-all active:scale-95"
          >
            Send
          </button>
        </form>
      )}

      {/* Nested Discussion Tree (Recursive Children) */}
      {!isCollapsed && hasReplies && (
        <div className="space-y-1">
          {comment.replies!.map((subReply) => (
            <SingleCommentItem
              key={subReply.id}
              comment={subReply}
              postId={postId}
              depth={depth + 1}
              onLikeComment={onLikeComment}
              onReplyComment={onReplyComment}
              noMetricMode={noMetricMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const SnapscapeCommentTree: React.FC<SnapscapeCommentTreeProps> = ({
  comments,
  postId,
  onLikeComment,
  onReplyComment,
  noMetricMode = false,
}) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-6 text-white/40 font-mono text-xs">
        No comments yet. Start the candid discussion!
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {comments.map((comment) => (
        <SingleCommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          onLikeComment={onLikeComment}
          onReplyComment={onReplyComment}
          noMetricMode={noMetricMode}
        />
      ))}
    </div>
  );
};
