import React, { useState } from "react";
import { Pin, Plus, Heart, Sparkles, MessageSquare, Image, Check, X } from "lucide-react";
import { MoodBoardItem } from "../types";
import { playAudioFeedback } from "../utils/audio";

interface SnapscapeMoodBoardViewProps {
  items: MoodBoardItem[];
  onPinItem: (newItem: MoodBoardItem) => void;
}

export const SnapscapeMoodBoardView: React.FC<SnapscapeMoodBoardViewProps> = ({
  items,
  onPinItem,
}) => {
  const [boardItems, setBoardItems] = useState<MoodBoardItem[]>(items);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [selectedTape, setSelectedTape] = useState<"neon_pink" | "yellow_washi" | "silver_duct">("neon_pink");
  const [selectedImg, setSelectedImg] = useState(
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&q=80"
  );

  const tapeStyles = {
    neon_pink: "bg-pink-500/40 border-pink-400/50 text-pink-200",
    yellow_washi: "bg-amber-300/40 border-amber-200/50 text-amber-100",
    silver_duct: "bg-neutral-300/40 border-neutral-200/50 text-neutral-100",
    clear: "bg-white/20 border-white/30 text-white/80",
  };

  const handleAddPin = () => {
    if (!noteText.trim()) return;
    playAudioFeedback("pop_chime", true);

    const newItem: MoodBoardItem = {
      id: `mb-${Date.now()}`,
      imageUrl: selectedImg,
      note: noteText,
      pinnedBy: {
        username: "you",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      },
      pinnedAt: "Just now",
      rotation: Math.floor(Math.random() * 8) - 4,
      tapeStyle: selectedTape,
    };

    setBoardItems([newItem, ...boardItems]);
    onPinItem(newItem);
    setNoteText("");
    setIsPinModalOpen(false);
  };

  return (
    <div className="space-y-5 animate-in fade-in pb-12">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/20 to-black/60 border border-pink-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Pin className="w-4 h-4 text-pink-400" />
            <h2 className="font-bold text-base text-pink-200">"Close Friends" Mood Board</h2>
            <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-mono text-[10px] font-bold">
              PRIVATE CORKBOARD
            </span>
          </div>
          <p className="text-xs text-white/60">
            A shared, zero-algorithm canvas where your inner circle pins candid snapshots, washi tape notes, and memories.
          </p>
        </div>
        <button
          onClick={() => setIsPinModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-pink-500/20 active:scale-95 transition-all self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Pin to Mood Board</span>
        </button>
      </div>

      {/* Aesthetic Corkboard Grid */}
      <div className="p-6 rounded-3xl bg-[#0D0F16] border border-white/10 relative shadow-inner min-h-[400px]">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none rounded-3xl" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10">
          {boardItems.map((item) => (
            <div
              key={item.id}
              style={{ transform: `rotate(${item.rotation}deg)` }}
              className="group relative bg-[#1A1D27] p-3 pb-4 rounded-xl border border-white/10 shadow-xl transition-transform hover:scale-105 hover:z-20 duration-200"
            >
              {/* Tape Strip */}
              <div
                className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-sm backdrop-blur-sm border text-[8px] font-mono uppercase tracking-widest z-10 shadow-sm ${
                  tapeStyles[item.tapeStyle] || tapeStyles.neon_pink
                }`}
              >
                WASHI_TAPE
              </div>

              {/* Photo */}
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-neutral-900 mb-2.5">
                <img
                  src={item.imageUrl}
                  alt="Mood board memory"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Handwritten Note */}
              {item.note && (
                <p className="text-xs font-sans text-neutral-200 leading-snug line-clamp-2 px-1">
                  "{item.note}"
                </p>
              )}

              {/* Pinned By Footer */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[10px] text-white/50">
                <div className="flex items-center gap-1.5">
                  <img
                    src={item.pinnedBy.avatar}
                    alt={item.pinnedBy.username}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span className="font-mono text-white/70">{item.pinnedBy.username}</span>
                </div>
                <span className="font-mono">{item.pinnedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pin New Memory Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#161822] text-white rounded-2xl border border-pink-500/30 p-4 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="font-bold text-sm text-pink-200 flex items-center gap-1.5">
                <Pin className="w-4 h-4 text-pink-400" />
                <span>Pin Memory to Board</span>
              </h3>
              <button
                onClick={() => setIsPinModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-white/60">Candid Memory Note</label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Leave a candid note for close friends..."
                rows={2}
                className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-pink-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-white/60">Tape Style</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "neon_pink", name: "Neon Pink" },
                  { id: "yellow_washi", name: "Yellow Washi" },
                  { id: "silver_duct", name: "Silver Duct" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTape(t.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                      selectedTape === t.id
                        ? "border-pink-400 bg-pink-500/20 text-pink-200"
                        : "border-white/10 bg-white/5 text-white/60"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setIsPinModalOpen(false)}
                className="px-3 py-1.5 rounded-full text-xs text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPin}
                className="px-4 py-2 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-pink-500/30"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Pin Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
