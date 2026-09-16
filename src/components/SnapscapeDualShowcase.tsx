import React from "react";
import { SnapscapeFrontPage } from "./SnapscapeFrontPage";
import { SnapscapeBottomNav, NavTab } from "./SnapscapeBottomNav";
import { PhotoPost } from "../types";
import { 
  Sparkles, 
  Upload, 
  Smile, 
  X, 
  Heart, 
  MessageCircle, 
  Smartphone,
  Check
} from "lucide-react";
import { playAudioFeedback } from "../utils/audio";

interface SnapscapeDualShowcaseProps {
  posts: PhotoPost[];
  onLikePost: (postId: string) => void;
  onLikeComment?: (postId: string, commentId: string) => void;
  onAddComment: (postId: string, comment: string) => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenCreator: () => void;
  onPublishPost: (post: PhotoPost) => void;
  onCloseShowcase: () => void;
}

export const SnapscapeDualShowcase: React.FC<SnapscapeDualShowcaseProps> = ({
  posts,
  onLikePost,
  onLikeComment,
  onAddComment,
  onOpenNotifications,
  onOpenProfile,
  onOpenCreator,
  onPublishPost,
  onCloseShowcase,
}) => {
  // Creator preview state for the right phone
  const [activeTool, setActiveTool] = React.useState<"filters" | "grain" | "text" | "stickers" | "glitch" | "chromatic">("chromatic");
  const [intensity, setIntensity] = React.useState(65);
  const [postedAlert, setPostedAlert] = React.useState(false);

  const selectedImage = "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80";

  const handleRightPhonePost = () => {
    playAudioFeedback("shutter", true);
    setPostedAlert(true);
    setTimeout(() => setPostedAlert(false), 2500);

    const newPost: PhotoPost = {
      id: `snap-${Date.now()}`,
      author: {
        username: "cyber.twilight",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        verified: true,
        streak: 15,
      },
      imageUrl: selectedImage,
      caption: "dusk rooftop overlooking the glowing skyline 🌆✨",
      timestamp: "Just now",
      isoDate: new Date().toISOString(),
      location: {
        name: "Neon Skyline Rooftop",
        coords: [40.7128, -74.0060],
      },
      sentimentCategory: "Feels like 2 AM",
      reactions: {
        fire: 42,
        skull: 1,
        nails: 8,
        sparkles: 35,
        lightning: 20,
        sob: 0,
      },
      commentsCount: 2,
      comments: [
        {
          id: `comm-${Date.now()}`,
          user: "PLOG buddy",
          avatar: "/plog-buddy.jpg",
          text: "The chromatic aberration on the magenta skyline is generational aesthetic! ⚡",
          timestamp: "Just now",
          isBuddy: true,
          likesCount: 1,
          isLikedByUser: false,
        },
      ],
      digicamMetadata: {
        dateStamp: "'26 09 16 02:40",
        iso: "ISO 800",
        filterApplied: "Chromatic Aberration",
        archivedAt: "Archived to Vault",
        shutterSpeed: "1/120s f/2.4",
      },
    };

    onPublishPost(newPost);
  };

  const getEffectStyle = (): React.CSSProperties => {
    const factor = intensity / 100;
    if (activeTool === "chromatic") {
      return {
        filter: `drop-shadow(-${Math.round(factor * 6)}px 0 0 rgba(255, 0, 128, 0.75)) drop-shadow(${Math.round(factor * 6)}px 0 0 rgba(0, 255, 255, 0.75)) contrast(${100 + factor * 20}%)`,
      };
    }
    if (activeTool === "glitch") {
      return {
        filter: `contrast(${110 + factor * 30}%) saturate(${110 + factor * 40}%)`,
      };
    }
    return {
      filter: `contrast(${100 + factor * 20}%)`,
    };
  };

  return (
    <div className="w-full min-h-screen bg-[#EFECE6] py-8 px-4 flex flex-col items-center justify-center animate-in fade-in">
      
      {/* Top Banner with view toggle */}
      <div className="w-full max-w-5xl flex items-center justify-between pb-6">
        <div>
          <h2 className="text-xl font-black tracking-tight text-neutral-900 uppercase">
            SNAPSCAPE Showcase
          </h2>
          <p className="text-xs text-neutral-600">
            Interactive dual-device preview matching your uploaded design mockup
          </p>
        </div>

        <button
          onClick={onCloseShowcase}
          className="px-4 py-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold transition-all shadow-md flex items-center gap-2"
        >
          <Smartphone className="w-4 h-4" />
          <span>Exit to Single View</span>
        </button>
      </div>

      {/* Two Phones Side-by-Side (matching the user's uploaded image!) */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 xl:gap-12 w-full max-w-5xl">
        
        {/* PHONE 1: LEFT PHONE - SNAPSCAPE FRONT PAGE */}
        <div className="relative w-[340px] sm:w-[380px] h-[780px] bg-black rounded-[50px] p-3.5 shadow-2xl ring-1 ring-black/20 shrink-0">
          {/* Top Notch Speaker */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-30 flex items-center justify-center">
            <div className="w-10 h-1 bg-neutral-800 rounded-full" />
            <div className="w-2 h-2 rounded-full bg-neutral-900 ml-2" />
          </div>

          {/* Screen Content */}
          <div className="w-full h-full bg-[#FAF8F5] rounded-[38px] overflow-hidden flex flex-col relative">
            <div className="flex-1 overflow-y-auto">
              <SnapscapeFrontPage
                posts={posts}
                onLikePost={onLikePost}
                onLikeComment={onLikeComment}
                onAddComment={onAddComment}
                onOpenNotifications={onOpenNotifications}
                onOpenProfile={onOpenProfile}
                onOpenCreator={onOpenCreator}
              />
            </div>

            {/* Bottom Bar in Left Phone */}
            <div className="absolute bottom-0 inset-x-0 bg-[#FAF8F5]">
              <SnapscapeBottomNav
                activeTab="home"
                onTabChange={(tab) => {
                  if (tab === "add") onOpenCreator();
                  else if (tab === "notifications") onOpenNotifications();
                  else if (tab === "profile") onOpenProfile();
                }}
              />
            </div>
          </div>
        </div>

        {/* PHONE 2: RIGHT PHONE - CREATOR & EFFECTS STUDIO */}
        <div className="relative w-[340px] sm:w-[380px] h-[780px] bg-black rounded-[50px] p-3.5 shadow-2xl ring-1 ring-black/20 shrink-0">
          {/* Top Notch Speaker */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-30 flex items-center justify-center">
            <div className="w-10 h-1 bg-neutral-800 rounded-full" />
            <div className="w-2 h-2 rounded-full bg-neutral-900 ml-2" />
          </div>

          {/* Screen Content */}
          <div className="w-full h-full bg-[#121214] text-white rounded-[38px] overflow-hidden flex flex-col relative">
            
            {/* Top Photo Preview */}
            <div className="flex-1 relative flex items-center justify-center p-3 pt-10 bg-black">
              <div className="relative w-full h-[320px] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={selectedImage}
                  alt="City Skyline" 
                  className={`w-full h-full object-cover transition-all ${activeTool === "glitch" ? "glitch-active" : ""}`}
                  style={getEffectStyle()}
                />

                {/* Grain texture */}
                {activeTool === "grain" && (
                  <div className="absolute inset-0 grain-overlay opacity-60" />
                )}

                {postedAlert && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
                    <div className="flex items-center gap-2 text-white font-bold bg-pink-600 px-4 py-2 rounded-full shadow-lg">
                      <Check className="w-4 h-4" />
                      <span>Post Published to Feed!</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Drawer (EXACT MATCH to right phone) */}
            <div className="bg-[#18191D] rounded-t-[32px] px-5 pt-3 pb-4 border-t border-white/5 space-y-3.5 shadow-2xl">
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto" />

              {/* Tools row */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setActiveTool("filters")}
                  className="flex flex-col items-center gap-1 text-white/60 hover:text-white"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTool === "filters" ? "bg-white/20 text-white" : ""}`}>
                    <div className="relative w-4 h-4">
                      <div className="absolute -top-0.5 left-0.5 w-2.5 h-2.5 rounded-full border border-current" />
                      <div className="absolute bottom-0 -left-0.5 w-2.5 h-2.5 rounded-full border border-current" />
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-current" />
                    </div>
                  </div>
                  <span className="text-[8px] uppercase font-bold tracking-wider">FILTERS</span>
                </button>

                <button
                  onClick={() => setActiveTool("grain")}
                  className="flex flex-col items-center gap-1 text-white/60 hover:text-white"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTool === "grain" ? "bg-white/20 text-white" : ""}`}>
                    <div className="w-3.5 h-3.5 border border-current rounded grid grid-cols-2 gap-0.5 p-0.5">
                      <div className="bg-current rounded-full" />
                      <div className="bg-current rounded-full" />
                      <div className="bg-current rounded-full" />
                      <div className="bg-current rounded-full" />
                    </div>
                  </div>
                  <span className="text-[8px] uppercase font-bold tracking-wider">GRAIN</span>
                </button>

                <button
                  onClick={() => setActiveTool("text")}
                  className="flex flex-col items-center gap-1 text-white/60 hover:text-white"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTool === "text" ? "bg-white/20 text-white" : ""}`}>
                    <span className="font-serif font-bold text-sm">T</span>
                  </div>
                  <span className="text-[8px] uppercase font-bold tracking-wider">TEXT</span>
                </button>

                <button
                  onClick={() => setActiveTool("stickers")}
                  className="flex flex-col items-center gap-1 text-white/60 hover:text-white"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTool === "stickers" ? "bg-white/20 text-white" : ""}`}>
                    <Smile className="w-4 h-4" />
                  </div>
                  <span className="text-[8px] uppercase font-bold tracking-wider">STICKERS</span>
                </button>

                {/* EFFECTS */}
                <div className="flex flex-col items-end">
                  <span className="text-[7px] uppercase tracking-wider text-white/40 font-mono mb-0.5">EFFECTS</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTool("glitch")}
                      className={`flex flex-col items-center gap-0.5 ${activeTool === "glitch" ? "opacity-100 scale-105" : "opacity-60"}`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-400 to-pink-500 flex items-center justify-center text-[8px]">
                        ⚡
                      </div>
                      <span className="text-[7px] uppercase font-bold">GLITCH</span>
                    </button>

                    <button
                      onClick={() => setActiveTool("chromatic")}
                      className={`flex flex-col items-center gap-0.5 ${activeTool === "chromatic" ? "opacity-100 scale-105" : "opacity-60"}`}
                    >
                      <div 
                        className="w-7 h-7 rounded-lg bg-black/60 flex items-center justify-center font-black text-sm"
                        style={{ textShadow: "-1.5px 0 #00ffff, 1.5px 0 #ff007f", color: "#fff" }}
                      >
                        C
                      </div>
                      <span className="text-[6px] uppercase font-bold text-center leading-tight">CHROMATIC<br/>ABERRATION</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Slider: intensity */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-white/60">
                  <span className="lowercase">intensity</span>
                  <span className="font-mono text-[9px] text-pink-400">{intensity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-white"
                  style={{
                    background: "linear-gradient(to right, #8B5CF6 0%, #D946EF 50%, #EC4899 100%)",
                  }}
                />
              </div>

              {/* POST Button */}
              <button
                onClick={handleRightPhonePost}
                className="w-full py-3 rounded-full bg-black text-white border border-white/20 active:scale-95 transition-all flex items-center justify-center shadow-lg"
              >
                <span className="font-black italic text-base tracking-wider font-sans">
                  POST
                </span>
              </button>
            </div>

            {/* Bottom Bar in Right Phone: with + Add highlighted pink */}
            <div className="bg-[#141518]">
              <SnapscapeBottomNav
                activeTab="add"
                isDark={true}
                onTabChange={(tab) => {
                  if (tab === "home") onCloseShowcase();
                }}
              />
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
