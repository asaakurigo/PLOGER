import React, { useState } from "react";
import { X, Repeat, Camera, Sparkles, MessageSquare, Check, Music } from "lucide-react";
import { PhotoPost, QuotePostData } from "../types";
import { playAudioFeedback } from "../utils/audio";

interface SnapscapeQuotePhotoModalProps {
  post: PhotoPost | null;
  isOpen: boolean;
  onClose: () => void;
  onPublishQuotePost: (newPost: PhotoPost) => void;
}

export const SnapscapeQuotePhotoModal: React.FC<SnapscapeQuotePhotoModalProps> = ({
  post,
  isOpen,
  onClose,
  onPublishQuotePost,
}) => {
  const [thoughtText, setThoughtText] = useState("");
  const [overlayType, setOverlayType] = useState<QuotePostData["overlayType"]>("reaction_photo");
  const [reactionPhoto, setReactionPhoto] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
  );
  const [selectedSticker, setSelectedSticker] = useState("⚡ UNREAL");

  if (!isOpen || !post) return null;

  const charLimit = 280;
  const remainingChars = charLimit - thoughtText.length;

  const handlePostQuote = () => {
    if (!thoughtText.trim() && !reactionPhoto) return;
    playAudioFeedback("shutter", true);

    const quoteData: QuotePostData = {
      originalPostId: post.id,
      originalAuthor: {
        username: post.author.username,
        avatar: post.author.avatar,
      },
      originalImageUrl: post.imageUrl,
      originalCaption: post.caption,
      overlayType,
      overlayContent: overlayType === "sticker" ? selectedSticker : "Side-by-side candid reaction",
    };

    const newQuotePost: PhotoPost = {
      id: `snap-quote-${Date.now()}`,
      author: {
        username: "you.candid",
        handle: "@you.candid",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        verified: true,
        streak: 1,
      },
      imageUrl: reactionPhoto,
      caption: thoughtText || `Quoting @${post.author.username}'s snap`,
      microThought: thoughtText || `Quoting @${post.author.username}'s snap`,
      timestamp: "Just now",
      isoDate: new Date().toISOString(),
      sentimentCategory: "Quote Reaction",
      quoteOf: quoteData,
      reactions: { fire: 1, skull: 0, nails: 0, sparkles: 1, lightning: 1, sob: 0 },
      commentsCount: 0,
      comments: [],
      retweetsCount: 1,
      digicamMetadata: {
        dateStamp: `'26 09 16 04:10`,
        iso: "ISO 800",
        filterApplied: "QUOTE_PHOTO_CAM",
        archivedAt: "Archived to Vault",
        shutterSpeed: "1/120s f/2.8",
      },
    };

    onPublishQuotePost(newQuotePost);
    setThoughtText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-[#14161F] text-white rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Repeat className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-cyan-200">Quote-Photo Reaction</h3>
              <p className="text-[10px] text-white/50 font-mono">VISUAL RETWEET PROTOCOL</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Micro-Thought Input (280-char cap) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span className="font-mono">Your candid thought</span>
              <span
                className={`font-mono text-[11px] ${
                  remainingChars < 20 ? "text-rose-400 font-bold" : "text-cyan-400"
                }`}
              >
                {remainingChars} left
              </span>
            </div>
            <textarea
              value={thoughtText}
              onChange={(e) => {
                if (e.target.value.length <= charLimit) {
                  setThoughtText(e.target.value);
                }
              }}
              placeholder="Add your 280-character micro-thought or quote commentary..."
              rows={3}
              className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>

          {/* Reaction Overlay Selector */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-white/60">Visual Reaction Style</span>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              {[
                { id: "reaction_photo", label: "Side-by-Side Photo", icon: <Camera className="w-3.5 h-3.5" /> },
                { id: "sticker", label: "Sticker Stamp", icon: <Sparkles className="w-3.5 h-3.5" /> },
                { id: "audio_note", label: "Audio Tag Note", icon: <Music className="w-3.5 h-3.5" /> },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setOverlayType(style.id as any)}
                  className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                    overlayType === style.id
                      ? "border-cyan-400 bg-cyan-950/40 text-cyan-200"
                      : "border-white/10 bg-white/5 text-white/60 hover:text-white"
                  }`}
                >
                  {style.icon}
                  <span className="text-[10px]">{style.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Side-by-side or embedded preview */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-white/50">Quote Post Preview</span>
            <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-3">
              {/* User reaction photo if side-by-side */}
              {overlayType === "reaction_photo" && (
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-neutral-900 border border-cyan-500/30">
                  <img src={reactionPhoto} alt="Your reaction" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-cyan-500/80 text-black font-mono text-[9px] font-bold">
                    YOUR CANDID REACT
                  </div>
                </div>
              )}

              {/* Embedded Original Post Quoted */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-white truncate">{post.author.username}</span>
                    <span className="font-mono text-[10px] text-white/40">{post.author.handle || `@${post.author.username}`}</span>
                  </div>
                  <p className="text-[11px] text-white/70 line-clamp-2">
                    {post.microThought || post.caption}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-full text-xs text-white/60 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handlePostQuote}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
          >
            <Repeat className="w-3.5 h-3.5 text-black" />
            <span>Post Quote-Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
