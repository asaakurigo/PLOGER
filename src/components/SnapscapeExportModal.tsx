import React, { useState } from "react";
import { X, Share2, Copy, Check, Download, Sparkles, ExternalLink } from "lucide-react";
import { PhotoPost } from "../types";
import { playAudioFeedback } from "../utils/audio";

interface SnapscapeExportModalProps {
  post: PhotoPost | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SnapscapeExportModal: React.FC<SnapscapeExportModalProps> = ({
  post,
  isOpen,
  onClose,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen || !post) return null;

  const shareUrl = `https://snaplog.app/s/${post.id}`;

  const handleCopyLink = () => {
    playAudioFeedback("pop_chime", true);
    navigator.clipboard?.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSimulateDownload = () => {
    playAudioFeedback("shutter", true);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const handleWebShare = async () => {
    playAudioFeedback("pop_chime", true);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ploger by @${post.author.username}`,
          text: post.microThought || post.caption,
          url: shareUrl,
        });
      } catch (err) {
        // Fallback to copy link
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-pink-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
              Export & Share Snap
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Export Card Preview */}
        <div className="p-4 flex flex-col items-center">
          <div className="w-full bg-[#151419] border border-white/10 rounded-2xl p-3.5 space-y-3 shadow-xl relative overflow-hidden">
            {/* Top Author Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={post.author.avatar}
                  alt={post.author.username}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20"
                />
                <div>
                  <span className="font-bold text-white text-xs block leading-tight">
                    {post.author.username}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {post.author.handle || `@${post.author.username}`}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#ff9d00] bg-black/60 px-2 py-0.5 rounded">
                {post.digicamMetadata?.dateStamp || "'26 09 16"}
              </span>
            </div>

            {/* Media Image */}
            <div className="relative rounded-xl overflow-hidden bg-black aspect-square">
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-full h-full object-cover"
              />
              {post.audioTag && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-purple-200 text-[9px] font-mono border border-purple-400/30">
                  🎵 {post.audioTag.title}
                </div>
              )}
            </div>

            {/* Thought or Caption */}
            <p className="text-xs text-white/90 leading-relaxed font-sans line-clamp-2">
              {post.microThought || post.caption}
            </p>

            {/* Subtle Creator Attribution Footer */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-neutral-400">
              <span className="tracking-widest uppercase font-bold text-neutral-300">PLOGER</span>
              <span className="text-neutral-500">ASAAKURIGO AI DEVELOPMENT</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 pt-0 space-y-2">
          <button
            onClick={handleWebShare}
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-pink-500/20 active:scale-98 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share to Socials</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyLink}
              className="py-2 px-3 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "Link Copied!" : "Copy Link"}</span>
            </button>

            <button
              onClick={handleSimulateDownload}
              className="py-2 px-3 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              {downloaded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
              <span>{downloaded ? "Saved!" : "Save Card"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
