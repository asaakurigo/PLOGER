import React, { useState } from "react";
import { X, Lock, ShieldCheck, Fingerprint, Eye, EyeOff, Sparkles, Check } from "lucide-react";
import { PhotoPost } from "../types";
import { playAudioFeedback } from "../utils/audio";

interface SnapscapeGhostVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  privatePosts: PhotoPost[];
  onSelectPost: (post: PhotoPost) => void;
  onUnhidePost?: (postId: string) => void;
}

export const SnapscapeGhostVaultModal: React.FC<SnapscapeGhostVaultModalProps> = ({
  isOpen,
  onClose,
  privatePosts,
  onSelectPost,
  onUnhidePost,
}) => {
  const [pin, setPin] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      playAudioFeedback("pop_chime", true);
      const nextPin = pin + num;
      setPin(nextPin);
      setErrorMsg("");

      if (nextPin.length === 4) {
        if (nextPin === "1234" || nextPin === "0000") {
          playAudioFeedback("digicam_beep", true);
          setIsUnlocked(true);
        } else {
          setErrorMsg("Incorrect passcode. Try 1234 or tap Biometrics.");
          setTimeout(() => setPin(""), 600);
        }
      }
    }
  };

  const handleBiometricAuth = () => {
    playAudioFeedback("cyber_chirp", true);
    setIsUnlocked(true);
  };

  const handleLockAgain = () => {
    setIsUnlocked(false);
    setPin("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-[#12141C] text-white rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-black/50 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-purple-200">Ghost Mode Vault</h3>
              <p className="text-[10px] text-white/50 font-mono">ENCRYPTED PRIVATE CURATION</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isUnlocked && (
              <button
                onClick={handleLockAgain}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[10px] font-mono text-white/70"
              >
                Lock
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isUnlocked ? (
          <div className="p-6 flex flex-col items-center justify-center text-center space-y-5">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Biometric Vault Protected</h4>
              <p className="text-xs text-white/50">Enter your 4-digit PIN (1234) or scan Face ID</p>
            </div>

            {/* PIN Dots */}
            <div className="flex items-center gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border border-purple-400/50 transition-all ${
                    pin.length > i ? "bg-purple-500 scale-110 shadow-[0_0_8px_rgba(168,85,247,0.6)]" : "bg-white/5"
                  }`}
                />
              ))}
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 font-mono animate-shake">{errorMsg}</p>
            )}

            {/* PIN Keypad */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"].map((btn) => (
                <button
                  key={btn}
                  onClick={() => {
                    if (btn === "C") setPin("");
                    else if (btn === "⌫") setPin(pin.slice(0, -1));
                    else handleKeyPress(btn);
                  }}
                  className="h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-base font-bold text-white transition-all active:scale-90"
                >
                  {btn}
                </button>
              ))}
            </div>

            {/* Face ID Quick Unlock Button */}
            <button
              onClick={handleBiometricAuth}
              className="px-4 py-2.5 rounded-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-mono font-bold flex items-center gap-2 transition-all active:scale-95"
            >
              <Fingerprint className="w-4 h-4 text-purple-400" />
              <span>Simulate Face ID / Biometrics</span>
            </button>
          </div>
        ) : (
          <div className="p-4 overflow-y-auto space-y-4">
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Biometric Session Verified</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-300">
                {privatePosts.length} Private Snaps
              </span>
            </div>

            {privatePosts.length === 0 ? (
              <div className="py-12 text-center text-white/50 space-y-2">
                <EyeOff className="w-8 h-8 mx-auto text-white/30" />
                <p className="text-xs">No private snaps hidden yet.</p>
                <p className="text-[11px] text-white/40">
                  You can set any post to "Private Ghost Mode" in the creator sheet or snap options.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {privatePosts.map((post) => (
                  <div
                    key={post.id}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-purple-500/30 cursor-pointer"
                    onClick={() => onSelectPost(post)}
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                      <p className="text-[11px] text-white truncate">{post.caption}</p>
                      {onUnhidePost && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUnhidePost(post.id);
                          }}
                          className="mt-1 px-2 py-0.5 rounded bg-white/20 text-[9px] font-mono text-white hover:bg-white/30 self-start"
                        >
                          Unhide to Feed
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
