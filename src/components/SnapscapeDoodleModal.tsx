import React, { useState, useRef, useEffect } from "react";
import { X, Check, RotateCcw, Sparkles, Mic, Palette, Sticker } from "lucide-react";
import { DoodleItem, PhotoPost } from "../types";
import { playAudioFeedback } from "../utils/audio";

interface SnapscapeDoodleModalProps {
  post: PhotoPost | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveDoodles: (postId: string, newDoodles: DoodleItem[]) => void;
}

const BRUSH_COLORS = [
  "#FF2A85", // Neon Hot Pink
  "#00F0FF", // Cyber Cyan
  "#39FF14", // Neon Lime
  "#FFE600", // Bright Yellow
  "#FFFFFF", // Pure White
  "#9D00FF", // Purple Neon
];

const STICKER_PRESETS = [
  { emoji: "✨", text: "CORE MEMORY" },
  { emoji: "💖", text: "UNHINGED" },
  { emoji: "🔥", text: "MAIN CHARACTER" },
  { emoji: "⚡", text: "GENUINE DIGICAM '04" },
  { emoji: "💅", text: "NO FILTER" },
  { emoji: "🪐", text: "3 AM VIBES" },
];

export const SnapscapeDoodleModal: React.FC<SnapscapeDoodleModalProps> = ({
  post,
  isOpen,
  onClose,
  onSaveDoodles,
}) => {
  const [activeTab, setActiveTab] = useState<"draw" | "stickers" | "voice">("draw");
  const [currentColor, setCurrentColor] = useState<string>("#FF2A85");
  const [brushSize, setBrushSize] = useState<number>(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const [doodles, setDoodles] = useState<DoodleItem[]>([]);
  const [currentPath, setCurrentPath] = useState<Array<{ x: number; y: number }>>([]);
  const [voiceRecorded, setVoiceRecorded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (post && isOpen) {
      setDoodles(post.doodles || []);
    }
  }, [post, isOpen]);

  // Redraw canvas whenever doodles change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    doodles.forEach((item) => {
      if (item.type === "path" && item.points && item.points.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = item.color || "#FF2A85";
        ctx.lineWidth = item.brushSize || 4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const startX = (item.points[0].x / 100) * canvas.width;
        const startY = (item.points[0].y / 100) * canvas.height;
        ctx.moveTo(startX, startY);

        for (let i = 1; i < item.points.length; i++) {
          const ptX = (item.points[i].x / 100) * canvas.width;
          const ptY = (item.points[i].y / 100) * canvas.height;
          ctx.lineTo(ptX, ptY);
        }
        ctx.stroke();
      }
    });
  }, [doodles]);

  if (!isOpen || !post) return null;

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const xPct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    return { x: xPct, y: yPct };
  };

  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (activeTab !== "draw") return;
    setIsDrawing(true);
    const pt = getCanvasCoords(e);
    setCurrentPath([pt]);
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeTab !== "draw") return;
    const pt = getCanvasCoords(e);
    setCurrentPath((prev) => {
      const next = [...prev, pt];
      // Live draw
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx && next.length > 1) {
          const prevPt = next[next.length - 2];
          ctx.beginPath();
          ctx.strokeStyle = currentColor;
          ctx.lineWidth = brushSize;
          ctx.lineCap = "round";
          ctx.moveTo((prevPt.x / 100) * canvas.width, (prevPt.y / 100) * canvas.height);
          ctx.lineTo((pt.x / 100) * canvas.width, (pt.y / 100) * canvas.height);
          ctx.stroke();
        }
      }
      return next;
    });
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentPath.length > 1) {
      const newDoodle: DoodleItem = {
        id: `path-${Date.now()}`,
        type: "path",
        color: currentColor,
        brushSize,
        points: currentPath,
        author: "you",
        timestamp: "Just now",
      };
      setDoodles((prev) => [...prev, newDoodle]);
    }
    setCurrentPath([]);
  };

  const handleAddSticker = (preset: { emoji: string; text: string }) => {
    playAudioFeedback("pop_chime", true);
    // Random position around center
    const x = Math.floor(25 + Math.random() * 50);
    const y = Math.floor(25 + Math.random() * 50);

    const newSticker: DoodleItem = {
      id: `stamp-${Date.now()}`,
      type: "stamp",
      emoji: preset.emoji,
      stampText: preset.text,
      x,
      y,
      author: "you",
      timestamp: "Just now",
    };
    setDoodles((prev) => [...prev, newSticker]);
  };

  const handleRecordVoiceMemo = () => {
    playAudioFeedback("cyber_chirp", true);
    setVoiceRecorded(true);
    const voiceMarker: DoodleItem = {
      id: `voice-${Date.now()}`,
      type: "voice_marker",
      emoji: "🎙️",
      stampText: "5s Voice Memo Tagged",
      x: 50,
      y: 85,
      author: "you",
      timestamp: "Just now",
    };
    setDoodles((prev) => [...prev, voiceMarker]);
  };

  const handleClear = () => {
    setDoodles([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    playAudioFeedback("pop_chime", true);
  };

  const handleSave = () => {
    playAudioFeedback("pop_chime", true);
    onSaveDoodles(post.id, doodles);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-[#16181F] text-white rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        
        {/* Top Header */}
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-pink-400" />
            <h3 className="font-bold text-sm tracking-wide">Doodle & Stamp Overlay</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="px-2.5 py-1 text-xs rounded-full bg-white/10 hover:bg-white/20 text-white/70 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Canvas on Photo */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden p-2">
          <div 
            ref={containerRef}
            className="relative w-full max-h-[380px] rounded-2xl overflow-hidden shadow-inner flex items-center justify-center"
          >
            <img 
              src={post.imageUrl} 
              alt="Doodle target" 
              className="w-full h-auto max-h-[380px] object-cover pointer-events-none select-none" 
            />

            {/* Canvas for Smooth Drawing */}
            <canvas
              ref={canvasRef}
              width={600}
              height={600}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
            />

            {/* Rendered Sticker Stamps on Photo */}
            {doodles.map((item) => {
              if (item.type === "stamp" || item.type === "voice_marker") {
                return (
                  <div
                    key={item.id}
                    style={{ left: `${item.x ?? 50}%`, top: `${item.y ?? 50}%` }}
                    className="absolute z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none animate-in zoom-in-50"
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
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-4 py-2 border-t border-white/10 bg-black/30 flex items-center justify-around text-xs">
          <button
            onClick={() => setActiveTab("draw")}
            className={`flex items-center gap-1.5 py-1 px-3 rounded-full font-medium transition-all ${
              activeTab === "draw" ? "bg-pink-500 text-white shadow-md shadow-pink-500/30" : "text-white/60 hover:text-white"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Neon Draw</span>
          </button>
          <button
            onClick={() => setActiveTab("stickers")}
            className={`flex items-center gap-1.5 py-1 px-3 rounded-full font-medium transition-all ${
              activeTab === "stickers" ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/30" : "text-white/60 hover:text-white"
            }`}
          >
            <Sticker className="w-3.5 h-3.5" />
            <span>Sticker Stamps</span>
          </button>
          <button
            onClick={() => setActiveTab("voice")}
            className={`flex items-center gap-1.5 py-1 px-3 rounded-full font-medium transition-all ${
              activeTab === "voice" ? "bg-purple-500 text-white shadow-md shadow-purple-500/30" : "text-white/60 hover:text-white"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Memo</span>
          </button>
        </div>

        {/* Tool Settings Area */}
        <div className="p-3 bg-black/50 border-t border-white/5 space-y-3">
          {activeTab === "draw" && (
            <div className="space-y-2">
              {/* Color Palette */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/50 font-mono">Neon Color</span>
                <div className="flex items-center gap-2">
                  {BRUSH_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrentColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        currentColor === c ? "ring-2 ring-white scale-125 shadow-[0_0_8px_currentColor]" : "opacity-80 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Brush Thickness */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-[11px] text-white/50 font-mono w-14">Size: {brushSize}px</span>
                <input 
                  type="range" 
                  min="2" 
                  max="14" 
                  value={brushSize} 
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="flex-1 accent-pink-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === "stickers" && (
            <div className="grid grid-cols-3 gap-2">
              {STICKER_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddSticker(p)}
                  className="px-2 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex flex-col items-center gap-0.5 text-center transition-all active:scale-95"
                >
                  <span className="text-base">{p.emoji}</span>
                  <span className="text-[9px] font-mono font-bold text-white/80 truncate w-full">{p.text}</span>
                </button>
              ))}
            </div>
          )}

          {activeTab === "voice" && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-purple-950/30 border border-purple-500/30">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-purple-200">5-Second Audio Tag</p>
                <p className="text-[10px] text-white/50">Drop an ambient sound or friend voice memo onto photo</p>
              </div>
              <button
                onClick={handleRecordVoiceMemo}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                  voiceRecorded ? "bg-emerald-500 text-white" : "bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30"
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{voiceRecorded ? "Tagged ✓" : "Record 5s"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-3 border-t border-white/10 bg-black/60 flex items-center justify-between">
          <span className="text-[11px] text-white/40 font-mono">
            {doodles.length} overlay {doodles.length === 1 ? "element" : "elements"}
          </span>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-pink-500/30 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Apply Overlays</span>
          </button>
        </div>

      </div>
    </div>
  );
};
