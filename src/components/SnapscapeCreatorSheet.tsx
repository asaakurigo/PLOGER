import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  Upload, 
  Type, 
  Smile, 
  Check, 
  Sliders, 
  Flame,
  Volume2,
  Camera,
  Music,
  Clock,
  Lock,
  Sun,
  Layers,
  Disc,
  Play,
  Square,
  Video,
  Grid3X3,
  PenTool,
  Hash
} from "lucide-react";
import { PhotoPost, AudioTag, CameraSimulationSettings } from "../types";
import { playAudioFeedback, playAmbientTrack, stopCurrentAmbientTrack } from "../utils/audio";

interface SnapscapeCreatorSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishPost: (post: PhotoPost) => void;
  hapticEnabled?: boolean;
}

const AUDIO_PRESETS: Array<{
  id: AudioTag["presetId"];
  title: string;
  category: AudioTag["category"];
  icon: string;
}> = [
  { id: "indie_bedroom", title: "Bedroom Cassette Chords", category: "ambient", icon: "🎸" },
  { id: "city_rain", title: "City Rain & Neon Hiss", category: "ambient", icon: "🌧️" },
  { id: "club_subbass", title: "Warehouse Sub-bass 808", category: "music", icon: "🔊" },
  { id: "skate_bowl", title: "Skatepark Wooden Echo", category: "ambient", icon: "🛹" },
  { id: "custom_voice", title: "5s Voice Memo Note", category: "voice_memo", icon: "🎙️" },
];

const SUGGESTED_TOPICS = [
  "#GoldenHourDumps",
  "#CurrentOutfit",
  "#3pmDeskCheck",
  "#LateNightBodega",
  "#NoFilterFriday",
];

export const SnapscapeCreatorSheet: React.FC<SnapscapeCreatorSheetProps> = ({
  isOpen,
  onClose,
  onPublishPost,
  hapticEnabled = true,
}) => {
  // Media format selection (Photo, Dump/Collage, Short Video/Clip, Doodle, Audio Snap)
  const [mediaFormat, setMediaFormat] = useState<"image" | "collage" | "video" | "doodle" | "audio_snapshot">("image");

  // Active tool selection
  const [activeTool, setActiveTool] = useState<"filters" | "grain" | "text" | "stickers" | "glitch" | "chromatic">("chromatic");
  const [intensity, setIntensity] = useState<number>(65);

  // Retro Camera Simulation Engine Settings
  const [cameraPreset, setCameraPreset] = useState<"disposable_90s" | "digicam_04" | "portra_35mm" | "cyber_glitch" | "noir">("digicam_04");
  const [grainLevel, setGrainLevel] = useState<number>(45);
  const [lightLeakEnabled, setLightLeakEnabled] = useState<boolean>(true);
  const [timestampStyle, setTimestampStyle] = useState<string>("'26 09 16 02:40");
  const [delayToReveal, setDelayToReveal] = useState<boolean>(false);
  const [isDevelopingFilm, setIsDevelopingFilm] = useState<boolean>(false);
  const [developCountdown, setDevelopCountdown] = useState<number>(3);

  // Audio-Tagged Snapshot Settings
  const [audioTagEnabled, setAudioTagEnabled] = useState<boolean>(true);
  const [selectedAudioPreset, setSelectedAudioPreset] = useState<AudioTag["presetId"]>("indie_bedroom");
  const [isPlayingAudioPreview, setIsPlayingAudioPreview] = useState<boolean>(false);

  // Dual-View Reaction Layer
  const [dualViewEnabled, setDualViewEnabled] = useState<boolean>(false);
  const [frontCameraUrl, setFrontCameraUrl] = useState<string>(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
  );

  // Social Mechanics & Privacy Settings
  const [isPrivateGhost, setIsPrivateGhost] = useState<boolean>(false);
  const [isEphemeral48h, setIsEphemeral48h] = useState<boolean>(false);
  const [isVibeVotingOnly, setIsVibeVotingOnly] = useState<boolean>(false);

  // Photo image & Collage multi-photos
  const [selectedImage, setSelectedImage] = useState<string>(
    "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80"
  );
  const [collageImages, setCollageImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80",
  ]);
  
  // 280-Character Micro-Thought & Caption
  const [microThought, setMicroThought] = useState("rooftop twilight with the best view in the city 🌆✨ #GoldenHourDumps");
  const [textOverlay, setTextOverlay] = useState<string>("");
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);

  if (!isOpen) return null;

  // Audio Preview Toggle
  const handleToggleAudioPreview = () => {
    if (isPlayingAudioPreview) {
      stopCurrentAmbientTrack();
      setIsPlayingAudioPreview(false);
    } else {
      setIsPlayingAudioPreview(true);
      playAmbientTrack(selectedAudioPreset, 5, () => {
        setIsPlayingAudioPreview(false);
      });
    }
  };

  // Compute live visual style based on tool, camera simulation, and intensity
  const getImageEffectStyle = (): React.CSSProperties => {
    const factor = intensity / 100;
    let filterString = "";

    // Camera preset baseline
    switch (cameraPreset) {
      case "disposable_90s":
        filterString += "sepia(0.25) saturate(1.3) contrast(1.15) brightness(1.05) ";
        break;
      case "digicam_04":
        filterString += "saturate(1.25) contrast(1.2) hue-rotate(5deg) ";
        break;
      case "portra_35mm":
        filterString += "saturate(1.1) contrast(1.05) brightness(1.02) sepia(0.1) ";
        break;
      case "cyber_glitch":
        filterString += `contrast(${110 + factor * 20}%) saturate(${120 + factor * 30}%) `;
        break;
      case "noir":
        filterString += "grayscale(1) contrast(1.4) brightness(0.9) ";
        break;
    }

    switch (activeTool) {
      case "chromatic":
        return {
          filter: `${filterString} drop-shadow(-${Math.round(factor * 5)}px 0 0 rgba(255, 0, 128, 0.75)) drop-shadow(${Math.round(factor * 5)}px 0 0 rgba(0, 255, 255, 0.75))`,
        };
      case "glitch":
        return {
          filter: `${filterString} contrast(${110 + factor * 30}%) saturate(${110 + factor * 40}%)`,
          transform: factor > 0.4 ? `skewX(${Math.sin(Date.now()) * factor * 1.5}deg)` : undefined,
        };
      case "grain":
        return {
          filter: `${filterString} contrast(${100 + factor * 25}%) brightness(${100 - factor * 10}%)`,
        };
      case "filters":
        return {
          filter: `${filterString} sepia(${factor * 0.4}) saturate(${100 + factor * 50}%) contrast(${100 + factor * 15}%)`,
        };
      default:
        return { filter: filterString.trim() || undefined };
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const res = event.target.result as string;
          setSelectedImage(res);
          if (mediaFormat === "collage") {
            setCollageImages((prev) => [res, ...prev.slice(0, 2)]);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTopic = (tag: string) => {
    if (!microThought.includes(tag) && microThought.length + tag.length + 1 <= 280) {
      setMicroThought((prev) => (prev.trim() ? `${prev.trim()} ${tag}` : tag));
      playAudioFeedback("pop_chime", hapticEnabled);
    }
  };

  const executePublish = () => {
    stopCurrentAmbientTrack();
    playAudioFeedback("shutter", hapticEnabled);

    const isAudioType = mediaFormat === "audio_snapshot" || audioTagEnabled;
    const audioTagObj: AudioTag | undefined = isAudioType
      ? {
          id: `audio-${Date.now()}`,
          title: AUDIO_PRESETS.find((p) => p.id === selectedAudioPreset)?.title || "Ambient Memory",
          category: AUDIO_PRESETS.find((p) => p.id === selectedAudioPreset)?.category || "ambient",
          duration: 5,
          presetId: selectedAudioPreset,
        }
      : undefined;

    const cameraSim: CameraSimulationSettings = {
      preset: cameraPreset,
      grainLevel,
      lightLeak: lightLeakEnabled,
      timestampStyle,
      delayToReveal,
    };

    // Extract hashtags from microThought
    const tags = microThought.match(/#[a-zA-Z0-9_]+/g) || ["#Ploger"];

    const newPost: PhotoPost = {
      id: `snap-${Date.now()}`,
      author: {
        username: "me",
        handle: "@me.candid",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        streak: 15,
        verified: true,
      },
      imageUrl: selectedImage,
      caption: microThought,
      microThought: microThought,
      mediaType: mediaFormat,
      mediaUrls: mediaFormat === "collage" ? collageImages : undefined,
      videoUrl: mediaFormat === "video" ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" : undefined,
      topicTags: tags,
      timestamp: "Just now",
      isoDate: new Date().toISOString(),
      location: {
        name: "Downtown Rooftop, NY",
        coords: [40.7128, -74.0060],
      },
      sentimentCategory: "Main Character Energy",
      reactions: {
        fire: 1,
        skull: 0,
        nails: 0,
        sparkles: 1,
        lightning: 1,
        sob: 0,
      },
      commentsCount: 1,
      retweetsCount: 0,
      dailyVotesCount: 1,
      velocityScore: 95.0,
      comments: [
        {
          id: `comm-ai-${Date.now()}`,
          user: "PLOG buddy",
          avatar: "/plog-buddy.jpg",
          text: `Captured with ${cameraPreset.replace("_", " ")} mode! Raw aesthetic perfection.`,
          timestamp: "Just now",
          isBuddy: true,
          likesCount: 1,
          isLikedByUser: false,
        },
      ],
      digicamMetadata: {
        dateStamp: timestampStyle,
        iso: "ISO 800",
        filterApplied: cameraPreset.toUpperCase(),
        archivedAt: "Archived to Vault (Sync ID #9980)",
        shutterSpeed: "1/120s f/2.4",
      },
      aiAnalysis: {
        aesthetic_vibe: "Nocturnal Cyber Skyline",
        vibe_score: 99,
        mood: "Atmospheric Twilight",
        lighting_and_details: "Magenta dusk horizon blending into neon skyscraper glow",
        bloopers_detected: "None, raw candid composition",
        suggested_captions: {
          aesthetic: "twilight frequencies 🌆",
          chaotic: "standing on the edge of the simulation",
          minimal: "skyline // dusk",
        },
        stream_category: "Feels like 2 AM",
        roast_or_commentary: "Certified desktop wallpaper material. You understood the aesthetic assignment completely.",
        story_overlay_text: "CYBER DUSK VIBE",
      },
      audioTag: audioTagObj,
      dualView: dualViewEnabled ? { frontCameraUrl } : undefined,
      cameraSimulation: cameraSim,
      isPrivate: isPrivateGhost,
      ephemeralHoursLeft: isEphemeral48h ? 48 : undefined,
      anonymizedVibeVoting: isVibeVotingOnly
        ? {
            firePct: 50,
            sparklesPct: 30,
            lightningPct: 15,
            nailsPct: 5,
            totalVotes: 1,
            userVote: "fire",
          }
        : undefined,
    };

    onPublishPost(newPost);
    onClose();
  };

  const handlePost = () => {
    if (delayToReveal) {
      setIsDevelopingFilm(true);
      playAudioFeedback("digicam_beep", hapticEnabled);
      let count = 3;
      setDevelopCountdown(count);

      const timer = setInterval(() => {
        count -= 1;
        if (count > 0) {
          setDevelopCountdown(count);
          playAudioFeedback("pop_chime", hapticEnabled);
        } else {
          clearInterval(timer);
          setIsDevelopingFilm(false);
          executePublish();
        }
      }, 1000);
    } else {
      executePublish();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in">
      <div className="w-full max-w-md h-full sm:h-[900px] sm:max-h-[96vh] bg-[#121214] text-white sm:rounded-[40px] overflow-hidden flex flex-col relative border border-white/10 shadow-2xl">
        
        {/* Top Header / Bar */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between z-10 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-pink-400" />
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-pink-400">
              Retro Camera & Multi-Media Studio
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label className="p-2 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer text-white/80 transition-colors">
              <Upload className="w-4 h-4" />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </label>
            <button
              onClick={() => {
                stopCurrentAmbientTrack();
                onClose();
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Multi-Format Selector Ribbon */}
        <div className="px-4 py-2 border-b border-white/5 bg-black/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: "image", label: "Photo", icon: Camera },
            { id: "collage", label: "Dump/Collage", icon: Grid3X3 },
            { id: "video", label: "Video Clip", icon: Video },
            { id: "doodle", label: "Doodle", icon: PenTool },
            { id: "audio_snapshot", label: "Audio Snap", icon: Music },
          ].map((fmt) => {
            const Icon = fmt.icon;
            const isSelected = mediaFormat === fmt.id;
            return (
              <button
                key={fmt.id}
                onClick={() => {
                  setMediaFormat(fmt.id as any);
                  playAudioFeedback("pop_chime", hapticEnabled);
                }}
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm"
                    : "bg-white/5 text-white/60 hover:text-white"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{fmt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Film Developing Overlay */}
        {isDevelopingFilm && (
          <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in">
            <div className="relative w-20 h-20 rounded-full border-4 border-amber-500/30 border-t-amber-400 animate-spin flex items-center justify-center">
              <span className="font-mono text-xl font-bold text-amber-300">{developCountdown}</span>
            </div>
            <h3 className="font-mono text-sm tracking-widest uppercase text-amber-300">
              Developing Film Chemistry...
            </h3>
            <p className="text-xs text-white/50 max-w-xs font-mono">
              Applying emulsion curves, ISO halation & candid grain textures
            </p>
          </div>
        )}

        {/* Canvas / Viewfinder Preview Area */}
        <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center group select-none">
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            
            {/* Media Rendering based on Format */}
            {mediaFormat === "collage" ? (
              <div className="grid grid-cols-2 gap-1 w-full h-full p-2 bg-neutral-950">
                {collageImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Collage ${i}`}
                    style={getImageEffectStyle()}
                    className={`w-full h-full object-cover rounded-xl ${i === 2 ? "col-span-2 aspect-video" : "aspect-square"}`}
                  />
                ))}
              </div>
            ) : (
              <img 
                src={selectedImage} 
                alt="Capture preview"
                style={getImageEffectStyle()}
                className="w-full h-full object-cover transition-all duration-300"
              />
            )}

            {/* Video Format Indicator Overlay */}
            {mediaFormat === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-pink-500/80 text-white flex items-center justify-center shadow-lg animate-pulse">
                  <Play className="w-6 h-6 ml-1 fill-white" />
                </div>
                <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[10px] font-mono font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>3s LIVE SNIPPET</span>
                </div>
              </div>
            )}

            {/* Dual-View Front Camera PIP Circle */}
            {dualViewEnabled && (
              <div className="absolute top-4 left-4 w-20 h-20 rounded-full border-2 border-white shadow-2xl overflow-hidden z-20 animate-in zoom-in-50">
                <img 
                  src={frontCameraUrl} 
                  alt="Reaction front camera" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-center font-mono text-cyan-300 py-0.5">
                  SELF PIP
                </div>
              </div>
            )}

            {/* Light Leak Overlay Simulation */}
            {lightLeakEnabled && (
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-amber-500/20 via-rose-500/10 to-transparent mix-blend-screen" />
            )}

            {/* Retro Orange Digicam Date Stamp */}
            <div className="absolute bottom-4 right-4 text-[#ff9d00] font-mono text-sm font-black tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pointer-events-none">
              {timestampStyle}
            </div>

            {/* Text Overlay on Photo */}
            {textOverlay && (
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 text-center text-lg font-extrabold uppercase text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {textOverlay}
              </div>
            )}
          </div>
        </div>

        {/* Studio Controls Scrollable Body */}
        <div className="bg-[#161820] border-t border-white/10 p-4 space-y-3.5 max-h-[400px] overflow-y-auto">
          
          {/* Micro-Thought & 280-Character Cap Counter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-neutral-300 font-bold flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-pink-400" />
                <span>Micro-Thought (Cap 280)</span>
              </span>
              <span className={`font-mono text-[10px] font-bold ${
                microThought.length > 260 ? "text-amber-400" : "text-neutral-400"
              }`}>
                {microThought.length} / 280
              </span>
            </div>

            <textarea 
              value={microThought}
              onChange={(e) => {
                if (e.target.value.length <= 280) {
                  setMicroThought(e.target.value);
                }
              }}
              rows={2}
              maxLength={280}
              placeholder="Pair this snap with your candid thought (max 280 chars)..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-pink-500 resize-none font-sans"
            />

            {/* Trending Vibe Chips for Quick Tagging */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
              <span className="text-[10px] text-neutral-400 font-mono shrink-0 flex items-center gap-0.5">
                <Hash className="w-2.5 h-2.5" />
                <span>Vibes:</span>
              </span>
              {SUGGESTED_TOPICS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTopic(tag)}
                  className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-pink-300 border border-white/10 text-[10px] font-mono shrink-0 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: Retro Camera Simulation Engine */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white/70 font-bold flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-pink-400" />
                <span>Camera Preset</span>
              </span>
              <span className="text-pink-400 text-[10px] uppercase font-bold">{cameraPreset.replace("_", " ")}</span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {[
                { id: "digicam_04", name: "Digicam '04", tag: "2000s" },
                { id: "disposable_90s", name: "Disposable", tag: "90s" },
                { id: "portra_35mm", name: "Portra 35", tag: "Film" },
                { id: "cyber_glitch", name: "Cyber", tag: "Vapor" },
                { id: "noir", name: "Noir", tag: "B&W" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setCameraPreset(p.id as any);
                    playAudioFeedback("pop_chime", hapticEnabled);
                  }}
                  className={`p-1.5 rounded-xl border text-center transition-all ${
                    cameraPreset === p.id
                      ? "border-pink-500 bg-pink-500/20 text-white shadow-md shadow-pink-500/20"
                      : "border-white/10 bg-white/5 text-white/60 hover:text-white"
                  }`}
                >
                  <p className="text-[10px] font-bold truncate leading-tight">{p.name}</p>
                  <p className="text-[8px] font-mono text-white/40">{p.tag}</p>
                </button>
              ))}
            </div>

            {/* Grain & Light Leak Sliders */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-white/60">
                  <span>Film Grain</span>
                  <span>{grainLevel}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={grainLevel}
                  onChange={(e) => setGrainLevel(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg accent-pink-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-mono text-white/70">Light Leak</span>
                <button
                  onClick={() => setLightLeakEnabled(!lightLeakEnabled)}
                  className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold transition-all ${
                    lightLeakEnabled ? "bg-amber-500 text-black" : "bg-white/10 text-white/50"
                  }`}
                >
                  {lightLeakEnabled ? "ON" : "OFF"}
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Audio-Tagged Snapshot (5-Second Sound Memory) */}
          <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5 text-purple-200 font-bold">
                <Music className="w-3.5 h-3.5 text-purple-400" />
                <span>Audio-Tagged Snapshot</span>
              </div>
              <button
                onClick={() => setAudioTagEnabled(!audioTagEnabled)}
                className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                  audioTagEnabled ? "bg-purple-500 text-white" : "bg-white/10 text-white/50"
                }`}
              >
                {audioTagEnabled ? "ATTACHED" : "OFF"}
              </button>
            </div>

            {audioTagEnabled && (
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-1.5">
                  {AUDIO_PRESETS.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedAudioPreset(p.id)}
                      className={`px-2 py-1.5 rounded-xl border text-left text-[10px] flex items-center gap-1.5 transition-all ${
                        selectedAudioPreset === p.id
                          ? "border-purple-400 bg-purple-500/30 text-white font-bold"
                          : "border-white/5 bg-black/30 text-white/60 hover:text-white"
                      }`}
                    >
                      <span>{p.icon}</span>
                      <span className="truncate">{p.title}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-white/40 font-mono">5s ambient sound loop attached</span>
                  <button
                    onClick={handleToggleAudioPreview}
                    className="px-2.5 py-1 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-mono flex items-center gap-1 transition-all active:scale-95"
                  >
                    {isPlayingAudioPreview ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isPlayingAudioPreview ? "Stop Preview" : "Preview Sound"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Dual-View & Delay to Reveal */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setDualViewEnabled(!dualViewEnabled);
                playAudioFeedback("pop_chime", hapticEnabled);
              }}
              className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                dualViewEnabled ? "border-cyan-400 bg-cyan-950/30 text-cyan-200" : "border-white/10 bg-white/5 text-white/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px]">Dual-View Front PIP</span>
                <span className="text-[9px] font-mono font-bold">{dualViewEnabled ? "ON" : "OFF"}</span>
              </div>
              <p className="text-[9px] text-white/50 pt-1">Front camera reaction circle</p>
            </button>

            <button
              onClick={() => {
                setDelayToReveal(!delayToReveal);
                playAudioFeedback("pop_chime", hapticEnabled);
              }}
              className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                delayToReveal ? "border-amber-400 bg-amber-950/30 text-amber-200" : "border-white/10 bg-white/5 text-white/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px]">Delay-to-Reveal</span>
                <span className="text-[9px] font-mono font-bold">{delayToReveal ? "ON" : "OFF"}</span>
              </div>
              <p className="text-[9px] text-white/50 pt-1">Simulate darkroom developing delay</p>
            </button>
          </div>

          {/* Section 4: Privacy & Ephemeral toggles */}
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPrivateGhost(!isPrivateGhost)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                  isPrivateGhost ? "bg-purple-600 text-white" : "bg-white/10 text-white/50"
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>Ghost Vault Only</span>
              </button>

              <button
                onClick={() => setIsEphemeral48h(!isEphemeral48h)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                  isEphemeral48h ? "bg-pink-600 text-white" : "bg-white/10 text-white/50"
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>48h Ephemeral</span>
              </button>
            </div>

            <button
              onClick={() => setIsVibeVotingOnly(!isVibeVotingOnly)}
              className={`px-2 py-1 rounded-full text-[10px] font-mono ${
                isVibeVotingOnly ? "text-amber-300 font-bold" : "text-white/40"
              }`}
            >
              Vibe Votes %
            </button>
          </div>

          {/* Giant Capture & Post Button */}
          <button
            onClick={handlePost}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-black font-black italic text-base tracking-wider active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-pink-500/20"
          >
            <Camera className="w-4 h-4 text-black" />
            <span>CAPTURE & PUBLISH SNAP</span>
          </button>

        </div>

      </div>
    </div>
  );
};
