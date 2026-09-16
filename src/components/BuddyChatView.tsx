import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  Image as ImageIcon, 
  X, 
  Code2, 
  RotateCcw, 
  Flame, 
  Volume2, 
  Sliders, 
  Copy, 
  Check,
  Camera
} from "lucide-react";
import { 
  BuddyPersona, 
  ChatMessage, 
  ThemeConfig, 
  CustomizationSettings, 
  StructuredSystemResponse,
  PhotoPost
} from "../types";
import { playAudioFeedback } from "../utils/audio";

interface BuddyChatViewProps {
  currentPersona: BuddyPersona;
  onSelectPersona: (persona: BuddyPersona) => void;
  themeConfig: ThemeConfig;
  customSettings: CustomizationSettings;
  posts: PhotoPost[];
}

const QUICK_PROMPTS = [
  "Roast my latest photo dump 🔥",
  "Suggest 2 AM unpretentious captions 🌙",
  "What is my camera roll vibe right now? 💅",
  "Write an unhinged story overlay for my snap ⚡",
  "Give me 2004 Y2K flip phone lore 💾",
];

export const BuddyChatView: React.FC<BuddyChatViewProps> = ({
  currentPersona,
  onSelectPersona,
  themeConfig,
  customSettings,
  posts,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      role: "buddy",
      text: `yoooo! Ploger Buddy is in the building. I'm locked into "${currentPersona}" mode right now. Drop any unedited photo dump, ask me for captions, roast your camera angles, or let's just yap. What's the move today? ⚡`,
      timestamp: "Just now",
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showJsonInspector, setShowJsonInspector] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle Image Selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playAudioFeedback("pop_chime", customSettings.hapticEnabled);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Send message to Gemini server
  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || inputVal;
    if (!messageText.trim() && !selectedImage) return;

    playAudioFeedback("digicam_beep", customSettings.hapticEnabled);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: messageText,
      image: selectedImage || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputVal("");
    const imagePayload = selectedImage ? { data: selectedImage, mimeType: "image/jpeg" } : null;
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const history = updatedMessages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        text: m.text,
      }));

      const res = await fetch("/api/buddy/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          persona: currentPersona,
          history: history.slice(-6),
          image: imagePayload,
        }),
      });

      const data = await res.json();
      const buddyReply: ChatMessage = {
        id: `buddy-${Date.now()}`,
        role: "buddy",
        text: data.reply || data.fallbackReply || "Bestie my signal dipped, but I'm right here!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, buddyReply]);
      playAudioFeedback("pop_chime", customSettings.hapticEnabled);
    } catch (err) {
      console.error("Chat error:", err);
      const fallbackReply: ChatMessage = {
        id: `buddy-${Date.now()}`,
        role: "buddy",
        text: "My neural link hit a slight buffering moment, but no cap your photo aesthetic is immaculate!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  // Construct current structured output schema demanded by the system instructions
  const structuredOutput: StructuredSystemResponse = {
    theme_config: themeConfig,
    ai_buddy_persona: {
      mode: currentPersona,
      slangIntensity: currentPersona === "Unhinged Bestie" ? 9 : currentPersona === "Professional Tech Assistant" ? 1 : 6,
      tone: currentPersona,
    },
    photo_stream_metadata: {
      active_stream_category: "Feels like 2 AM",
      total_snaps_archived: posts.length,
      latest_sentiment: posts[0]?.sentimentCategory || "Feels like 2 AM",
    },
    customization_settings: customSettings,
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(structuredOutput, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-20">
      
      {/* Buddy Header & Persona Quick Select */}
      <div className="p-4 rounded-3xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg shadow-md"
            style={{ backgroundColor: themeConfig.accentColor, color: "#000" }}
          >
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-white">PLOGER BUDDY</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-white/50">
              Gen Z Companion Engine • Real-Time Vibe & Roast Assistant
            </p>
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playAudioFeedback("pop_chime", customSettings.hapticEnabled);
              setShowJsonInspector(!showJsonInspector);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
              showJsonInspector 
                ? "bg-white text-black border-white font-bold" 
                : "bg-white/5 text-white/70 hover:bg-white/10 border-white/10"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Engine JSON Schema</span>
          </button>
        </div>
      </div>

      {/* JSON Schema Inspector Drawer if open */}
      {showJsonInspector && (
        <div className="p-4 rounded-3xl bg-black/90 border border-cyan-500/30 shadow-2xl space-y-3 font-mono text-xs animate-in fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-cyan-400 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              SYSTEM INSTRUCTIONS SCHEMA OUTPUT:
            </span>
            <button
              onClick={copyJson}
              className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
            >
              {copiedJson ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedJson ? "Copied" : "Copy JSON"}</span>
            </button>
          </div>
          <pre className="text-white/80 overflow-x-auto p-2 bg-black/50 rounded-xl text-[11px] leading-relaxed max-h-64">
            {JSON.stringify(structuredOutput, null, 2)}
          </pre>
        </div>
      )}

      {/* Chat Messages Box */}
      <div 
        className="rounded-3xl border shadow-xl flex flex-col h-[520px] overflow-hidden"
        style={{
          backgroundColor: "rgba(18, 22, 30, 0.85)",
          borderColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{ backgroundColor: themeConfig.accentColor, color: "#000" }}
                  >
                    ⚡
                  </div>
                )}

                <div className={`space-y-1.5 max-w-[82%] sm:max-w-[70%]`}>
                  {/* Optional Image attachment preview */}
                  {m.image && (
                    <div className="rounded-2xl overflow-hidden border border-white/20 max-w-xs shadow-lg">
                      <img src={m.image} alt="User dump attachment" className="w-full h-auto object-cover" />
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? "bg-white text-black font-medium rounded-tr-sm ml-auto"
                        : "bg-white/10 text-white/95 rounded-tl-sm border border-white/10"
                    }`}
                  >
                    {m.text}
                  </div>

                  <span className={`text-[10px] font-mono text-white/40 block ${isUser ? "text-right" : "text-left"}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: themeConfig.accentColor, color: "#000" }}
              >
                ⚡
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-xs text-white/60 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Ploger Buddy is cooking up a response in {currentPersona} tone...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompt Chips */}
        <div className="px-4 py-2 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-black/20">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1 rounded-full text-[11px] whitespace-nowrap bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Pending Image Upload Banner */}
        {selectedImage && (
          <div className="px-4 py-2 bg-black/40 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={selectedImage} alt="Pending upload" className="w-10 h-10 rounded-lg object-cover border border-white/20" />
              <span className="text-xs text-white/80">Photo attached for vibe breakdown</span>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-black/40 flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            title="Attach a photo dump"
            className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors flex-shrink-0"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            placeholder={`Talk with Buddy in ${currentPersona} mode...`}
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputVal.trim() && !selectedImage}
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-black font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            style={{ backgroundColor: themeConfig.accentColor }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
