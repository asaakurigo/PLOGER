import React, { useState, useRef, useEffect } from "react";
import { 
  X, 
  Camera, 
  Sparkles, 
  Upload, 
  RefreshCw, 
  Check, 
  Sliders, 
  Battery, 
  Volume2, 
  Send, 
  Archive,
  Bot,
  AlertCircle
} from "lucide-react";
import { ThemeConfig, CustomizationSettings, BuddyPersona, PhotoPost, PhotoAnalysisResult } from "../types";
import { playAudioFeedback } from "../utils/audio";

interface DigicamSnapperModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPersona: BuddyPersona;
  themeConfig: ThemeConfig;
  customSettings: CustomizationSettings;
  onPublishPost: (post: PhotoPost) => void;
}

const FILTERS = [
  { id: "digicam-04", name: "Digicam '04", css: "contrast-125 brightness-110 saturate-125" },
  { id: "cyber-glow", name: "Cyber Glow", css: "hue-rotate-15 contrast-150 brightness-105" },
  { id: "disposable-35", name: "Disposable 35mm", css: "sepia-[0.25] contrast-110 warm" },
  { id: "bw-grain", name: "B&W Grain", css: "grayscale contrast-150" },
  { id: "night-blur", name: "Night Vision", css: "hue-rotate-90 saturate-200 brightness-110" },
];

export const DigicamSnapperModal: React.FC<DigicamSnapperModalProps> = ({
  isOpen,
  onClose,
  currentPersona,
  themeConfig,
  customSettings,
  onPublishPost,
}) => {
  const [useCamera, setUseCamera] = useState(true);
  const [streamActive, setStreamActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [isoSetting, setIsoSetting] = useState("ISO 800");
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [flashAnimation, setFlashAnimation] = useState(false);
  const [sentimentCategory, setSentimentCategory] = useState("Feels like 2 AM");
  const [customCaption, setCustomCaption] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PhotoAnalysisResult | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize camera stream
  useEffect(() => {
    if (!isOpen || !useCamera || capturedImage) return;

    let localStream: MediaStream | null = null;
    setCameraError(null);

    navigator.mediaDevices?.getUserMedia({ 
      video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } } 
    })
      .then((stream) => {
        localStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      })
      .catch((err) => {
        console.warn("Webcam access error:", err);
        setCameraError("Camera unavailable in iframe or denied. Upload from roll below!");
        setUseCamera(false);
      });

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      setStreamActive(false);
    };
  }, [isOpen, useCamera, capturedImage]);

  if (!isOpen) return null;

  // Handle capture from video stream
  const triggerCapture = () => {
    playAudioFeedback("shutter", customSettings.hapticEnabled);
    setFlashAnimation(true);
    setTimeout(() => setFlashAnimation(false), 200);

    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(dataUrl);
        analyzePhotoWithAI(dataUrl);
      }
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playAudioFeedback("pop_chime", customSettings.hapticEnabled);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCapturedImage(dataUrl);
      analyzePhotoWithAI(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Call Gemini AI server for photo analysis
  const analyzePhotoWithAI = async (imageDataUrl: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/buddy/analyze-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: {
            data: imageDataUrl,
            mimeType: "image/jpeg",
          },
          persona: currentPersona,
        }),
      });
      const data = await res.json();
      setAnalysisResult(data);
      if (data.suggested_captions?.aesthetic) {
        setCustomCaption(data.suggested_captions.aesthetic);
      }
      if (data.stream_category) {
        setSentimentCategory(data.stream_category);
      }
      playAudioFeedback("digicam_beep", customSettings.hapticEnabled);
    } catch (err) {
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Publish / Archive
  const handlePublish = (target: "stream" | "archive") => {
    if (!capturedImage) return;

    playAudioFeedback("shutter", customSettings.hapticEnabled);

    const now = new Date();
    const dateFormatted = `'26 09 14 ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newPost: PhotoPost = {
      id: `snap-${Date.now()}`,
      author: {
        username: "you.snaps",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        streak: 1,
      },
      imageUrl: capturedImage,
      caption: customCaption || "raw archive snapshot 📸",
      timestamp: "Just now",
      isoDate: now.toISOString(),
      sentimentCategory: sentimentCategory,
      location: {
        name: "Current Location",
        coords: [40.7128, -74.0060],
      },
      reactions: {
        fire: 1,
        skull: 0,
        nails: 0,
        sparkles: 2,
        lightning: 1,
        sob: 0,
      },
      commentsCount: 1,
      comments: [
        {
          id: `c-init-${Date.now()}`,
          user: "PLOGER BUDDY",
          avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
          text: analysisResult?.roast_or_commentary || "Certified raw dump! Logged into your memory bank forever ⚡",
          timestamp: "Just now",
          isBuddy: true,
        },
      ],
      digicamMetadata: {
        dateStamp: dateFormatted,
        iso: isoSetting,
        filterApplied: selectedFilter.name,
        archivedAt: `Background Memory Archive (ID #${Math.floor(Math.random() * 9000 + 1000)})`,
        shutterSpeed: "1/60s f/2.4",
      },
      aiAnalysis: analysisResult || undefined,
    };

    onPublishPost(newPost);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setCustomCaption("");
    setUseCamera(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-150">
      
      {/* Screen flashbang effect */}
      {flashAnimation && (
        <div className="fixed inset-0 bg-white z-[999] pointer-events-none transition-opacity duration-150 opacity-90 animate-out fade-out" />
      )}

      <div 
        className="w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border flex flex-col max-h-[92vh] transition-all"
        style={{
          backgroundColor: "#10141c",
          borderColor: `${themeConfig.accentColor}40`,
        }}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-pixel text-lg text-rose-400 tracking-wider font-bold">DIGICAM 3.8X</span>
            <span className="text-[11px] font-mono text-white/50 px-2 py-0.5 rounded bg-white/5 border border-white/10">
              {isoSetting}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[11px] font-mono text-white/60">
              <Battery className="w-4 h-4 text-emerald-400" />
              <span>94%</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewfinder / Capture Canvas */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[340px] max-h-[440px]">
          
          {capturedImage ? (
            /* Captured Photo Display with Digicam Watermark */
            <div className="relative w-full h-full flex items-center justify-center bg-black/80">
              <img 
                src={capturedImage} 
                alt="Captured dump" 
                className={`max-h-[400px] w-auto object-contain rounded-lg ${selectedFilter.css}`}
              />
              {/* LED Timestamp stamp */}
              <div className="absolute bottom-4 right-5 digicam-stamp text-sm sm:text-base pointer-events-none select-none">
                '26 09 14 21:58
              </div>
              <div className="absolute top-4 left-4 digicam-stamp-green text-xs font-mono select-none">
                REC ● 30FPS [RAW]
              </div>
            </div>
          ) : useCamera ? (
            /* Live Camera Stream with HUD Viewfinder */
            <div className="relative w-full h-full flex items-center justify-center">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-cover ${selectedFilter.css}`}
              />

              {/* Viewfinder HUD Overlay */}
              <div className="absolute inset-0 pointer-events-none border-[12px] border-black/20 flex flex-col justify-between p-4">
                <div className="flex justify-between items-start text-xs font-mono text-white/80 drop-shadow">
                  <div className="flex items-center gap-2 bg-black/50 px-2.5 py-1 rounded backdrop-blur">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>STBY ● LIVE</span>
                  </div>
                  <div className="bg-black/50 px-2 py-1 rounded text-[11px] digicam-stamp-green">
                    AF [AUTO FOCUS]
                  </div>
                </div>

                {/* Center Crosshair Focus Grid */}
                <div className="self-center w-20 h-20 border border-white/40 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 border-t-2 border-l-2 border-white" />
                </div>

                <div className="flex justify-between items-end text-xs font-mono">
                  <div className="bg-black/50 px-2 py-1 rounded text-white/70">
                    {selectedFilter.name}
                  </div>
                  <div className="digicam-stamp text-sm">
                    '26 09 14
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Fallback Upload View if camera disabled or not granted */
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                <Camera className="w-8 h-8" />
              </div>
              <div>
                <p className="text-white font-semibold">Ready to upload from your roll</p>
                <p className="text-xs text-white/50 max-w-sm mt-1">
                  Upload an unedited photo dump to run through Ploger Buddy's aesthetic engine.
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-full font-bold text-xs bg-white text-black hover:bg-white/90 transition-all flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Choose Photo from Device
              </button>
            </div>
          )}

          {cameraError && !capturedImage && (
            <div className="absolute top-3 inset-x-4 bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs px-3 py-2 rounded-xl flex items-center justify-between backdrop-blur">
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {cameraError}
              </span>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="underline font-bold hover:text-white"
              >
                Upload File
              </button>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileUpload} 
        />

        {/* Bottom Controls / Post Editor */}
        <div className="p-4 bg-black/60 border-t border-white/10 space-y-3.5 overflow-y-auto max-h-[300px]">
          
          {capturedImage ? (
            /* Step 2: AI Analysis & Post Options */
            <div className="space-y-3 animate-in fade-in">
              
              {/* AI Buddy Live Reaction Card */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={{ background: themeConfig.accentColor, color: "#000" }}
                >
                  ⚡
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      PLOGER BUDDY ({currentPersona})
                    </span>
                    {isAnalyzing ? (
                      <span className="text-[10px] text-white/50 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                        Analyzing vibe...
                      </span>
                    ) : analysisResult ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        VIBE {analysisResult.vibe_score}/100
                      </span>
                    ) : null}
                  </div>

                  <p className="text-xs text-white/80 mt-1 italic leading-relaxed">
                    {isAnalyzing 
                      ? "Scanning lighting aesthetics, candid bloopers, and generating unpretentious Gen Z captions..."
                      : analysisResult?.roast_or_commentary || "Clean unedited dump ready for your archive!"}
                  </p>

                  {analysisResult?.bloopers_detected && (
                    <p className="text-[11px] text-amber-300/90 mt-1">
                      👀 <strong>Spotted:</strong> {analysisResult.bloopers_detected}
                    </p>
                  )}
                </div>
              </div>

              {/* Caption Selection Chips */}
              {analysisResult?.suggested_captions && (
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono font-bold text-white/50">
                    AI Suggested Captions (Click to Apply)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCustomCaption(analysisResult.suggested_captions.aesthetic)}
                      className={`text-left p-2 rounded-xl text-xs border transition-all ${
                        customCaption === analysisResult.suggested_captions.aesthetic
                          ? "bg-white/15 border-white text-white font-medium"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-[9px] uppercase font-bold text-amber-400 block">Aesthetic</span>
                      <span className="truncate block">{analysisResult.suggested_captions.aesthetic}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCustomCaption(analysisResult.suggested_captions.chaotic)}
                      className={`text-left p-2 rounded-xl text-xs border transition-all ${
                        customCaption === analysisResult.suggested_captions.chaotic
                          ? "bg-white/15 border-white text-white font-medium"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-[9px] uppercase font-bold text-rose-400 block">Chaotic</span>
                      <span className="truncate block">{analysisResult.suggested_captions.chaotic}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCustomCaption(analysisResult.suggested_captions.minimal)}
                      className={`text-left p-2 rounded-xl text-xs border transition-all ${
                        customCaption === analysisResult.suggested_captions.minimal
                          ? "bg-white/15 border-white text-white font-medium"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-[9px] uppercase font-bold text-cyan-400 block">Minimal</span>
                      <span className="truncate block">{analysisResult.suggested_captions.minimal}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Caption Input & Category */}
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={customCaption}
                  onChange={(e) => setCustomCaption(e.target.value)}
                  placeholder="Write your unedited caption..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                />

                <select
                  value={sentimentCategory}
                  onChange={(e) => setSentimentCategory(e.target.value)}
                  className="bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Feels like 2 AM" className="bg-gray-900">Feels like 2 AM</option>
                  <option value="Main Character Energy" className="bg-gray-900">Main Character Energy</option>
                  <option value="Brain Rot Memes" className="bg-gray-900">Brain Rot Memes</option>
                  <option value="Golden Hour Drift" className="bg-gray-900">Golden Hour Drift</option>
                  <option value="Candid Bloopers" className="bg-gray-900">Candid Bloopers</option>
                </select>
              </div>

              {/* Action Buttons: Publish or Archive Only */}
              <div className="flex items-center justify-between pt-1 gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white bg-white/5 border border-white/10 transition-colors"
                >
                  Retake Photo
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePublish("archive")}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white/80 bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    Archive Only
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePublish("stream")}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-black shadow-lg transition-transform active:scale-95"
                    style={{ backgroundColor: themeConfig.accentColor }}
                  >
                    <Send className="w-3.5 h-3.5" />
                    Share to Live Stream
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Step 1: Live Controls (Filters, ISO, Shutter) */
            <div className="space-y-3">
              {/* Filter selection pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      playAudioFeedback("pop_chime", customSettings.hapticEnabled);
                      setSelectedFilter(f);
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] whitespace-nowrap transition-all ${
                      selectedFilter.id === f.id
                        ? "bg-white text-black font-bold shadow"
                        : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>

              {/* Shutter Bar */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    playAudioFeedback("pop_chime", customSettings.hapticEnabled);
                    fileInputRef.current?.click();
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs border border-white/10"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Roll</span>
                </button>

                {/* Big Physical Camera Shutter */}
                <button
                  id="main-shutter-trigger"
                  type="button"
                  onClick={triggerCapture}
                  className="relative group p-1.5 rounded-full bg-white/20 border border-white/40 transition-transform active:scale-90"
                >
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all group-hover:brightness-110"
                    style={{ 
                      backgroundColor: themeConfig.accentColor,
                      boxShadow: `0 0 20px ${themeConfig.accentColor}80` 
                    }}
                  >
                    <Camera className="w-6 h-6 text-black" />
                  </div>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      playAudioFeedback("digicam_beep", customSettings.hapticEnabled);
                      setIsoSetting((prev) => prev === "ISO 800" ? "ISO 1600" : prev === "ISO 1600" ? "ISO 200" : "ISO 800");
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-white/70 border border-white/10"
                  >
                    {isoSetting}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
