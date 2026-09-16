import React, { useState } from "react";
import { Lock, Unlock, Clock, Calendar, ShieldAlert, Sparkles, Plus, Eye, ChevronRight } from "lucide-react";
import { MemoryBox, PhotoPost } from "../types";
import { playAudioFeedback } from "../utils/audio";

interface SnapscapeMemoryBoxesViewProps {
  boxes: MemoryBox[];
  onSelectPost: (post: PhotoPost) => void;
}

export const SnapscapeMemoryBoxesView: React.FC<SnapscapeMemoryBoxesViewProps> = ({
  boxes,
  onSelectPost,
}) => {
  const [memoryBoxes, setMemoryBoxes] = useState<MemoryBox[]>(boxes);
  const [selectedBoxId, setSelectedBoxId] = useState<string>(boxes[0]?.id || "");

  const activeBox = memoryBoxes.find((b) => b.id === selectedBoxId) || memoryBoxes[0];

  const handleSimulateUnlock = (boxId: string) => {
    playAudioFeedback("digicam_beep", true);
    setMemoryBoxes((prev) =>
      prev.map((b) => (b.id === boxId ? { ...b, isUnlocked: !b.isUnlocked } : b))
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in pb-12">
      {/* Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-red-950/20 to-black/60 border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-base text-amber-200">Disappearing Memory Boxes</h2>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
              TIME-LOCKED
            </span>
          </div>
          <p className="text-xs text-white/60">
            Time-capsule galleries locked until a specific future date or milestone. No one can preview the shots until the vault opens.
          </p>
        </div>
      </div>

      {/* Memory Boxes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {memoryBoxes.map((box) => {
          const isSelected = box.id === selectedBoxId;
          return (
            <div
              key={box.id}
              className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                box.isUnlocked
                  ? "bg-emerald-950/20 border-emerald-500/30"
                  : "bg-amber-950/20 border-amber-500/30"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {box.isUnlocked ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                        <Unlock className="w-3 h-3" /> UNLOCKED & REVEALED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                        <Clock className="w-3 h-3" /> TIME-LOCKED
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-white/50">
                    {box.memberCount} Members
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white">{box.title}</h3>
                  <p className="text-xs text-white/50 font-mono">Location: {box.location}</p>
                </div>

                {/* Cover Preview Area */}
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-neutral-900 border border-white/10">
                  <img
                    src={box.coverBlurImage}
                    alt={box.title}
                    className={`w-full h-full object-cover transition-all ${
                      box.isUnlocked ? "blur-0" : "blur-xl scale-110"
                    }`}
                  />

                  {!box.isUnlocked && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-2">
                        <Lock className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-mono font-bold text-amber-200">SEALED UNTIL SEPT 22, 2026</p>
                      <p className="text-[10px] text-white/60 mt-0.5">Countdown: 05d 14h 22m remaining</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10">
                <button
                  onClick={() => handleSimulateUnlock(box.id)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-mono text-white/80 flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  <span>{box.isUnlocked ? "Re-Seal Capsule" : "Simulate Unlock"}</span>
                </button>

                {box.isUnlocked && (
                  <button
                    onClick={() => {
                      if (box.snaps.length > 0) onSelectPost(box.snaps[0]);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-[11px] flex items-center gap-1 transition-colors"
                  >
                    <span>Browse Secret Roll</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
