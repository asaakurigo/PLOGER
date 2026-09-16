import React, { useState } from "react";
import { 
  X, 
  Building2, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  Camera, 
  Send, 
  Copy, 
  Check, 
  ExternalLink,
  Users,
  CheckCircle2,
  Terminal,
  Code2
} from "lucide-react";
import { PhotoPost } from "../types";
import { MOCK_DEV_RELEASE_NOTES } from "../data/mockPosts";

interface SnapscapeProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  posts: PhotoPost[];
}

export const SnapscapeProfileDrawer: React.FC<SnapscapeProfileDrawerProps> = ({
  isOpen,
  onClose,
  posts,
}) => {
  const [activeSection, setActiveSection] = useState<"profile" | "company" | "contact" | "devnotes">("profile");
  
  // Contact form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact@asaakurigo.ai");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md h-[90vh] bg-[#FAF8F5] text-neutral-900 rounded-t-[36px] sm:rounded-[36px] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <h3 className="font-black font-sans uppercase tracking-tight text-lg text-neutral-900">
              {activeSection === "profile" && "Your Profile & Archive"}
              {activeSection === "company" && "Company Profile"}
              {activeSection === "contact" && "Contact ASAAKURIGO"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center text-neutral-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center border-b border-neutral-200 px-5 pt-2 bg-neutral-100/60 gap-4">
          <button
            onClick={() => setActiveSection("profile")}
            className={`pb-2 text-xs font-bold border-b-2 transition-all ${
              activeSection === "profile" 
                ? "text-neutral-900 border-neutral-900" 
                : "text-neutral-500 border-transparent hover:text-neutral-800"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveSection("company")}
            className={`pb-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeSection === "company" 
                ? "text-neutral-900 border-neutral-900" 
                : "text-neutral-500 border-transparent hover:text-neutral-800"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Company Info</span>
          </button>
          <button
            onClick={() => setActiveSection("contact")}
            className={`pb-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === "contact" 
                ? "text-neutral-900 border-neutral-900" 
                : "text-neutral-500 border-transparent hover:text-neutral-800"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact</span>
          </button>
          <button
            onClick={() => setActiveSection("devnotes")}
            className={`pb-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === "devnotes" 
                ? "text-purple-600 border-purple-600" 
                : "text-neutral-500 border-transparent hover:text-neutral-800"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-purple-600" />
            <span>Dev Notes</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* SECTION 1: User Profile */}
          {activeSection === "profile" && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" 
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-neutral-900 shadow-md" 
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-base text-neutral-900">alex.candid</h4>
                    <span className="text-[10px] bg-neutral-900 text-white font-bold px-1.5 py-0.5 rounded-full">
                      PRO
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Shooting 35mm candid street & memory dumps ✨
                  </p>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white border border-neutral-200 shadow-xs text-center">
                <div>
                  <span className="block font-black text-sm text-neutral-900">{posts.length}</span>
                  <span className="text-[10px] text-neutral-400 font-mono uppercase">Snaps</span>
                </div>
                <div>
                  <span className="block font-black text-sm text-neutral-900">42 Days</span>
                  <span className="text-[10px] text-neutral-400 font-mono uppercase">Streak 🔥</span>
                </div>
                <div>
                  <span className="block font-black text-sm text-neutral-900">1.2k</span>
                  <span className="text-[10px] text-neutral-400 font-mono uppercase">Vibe Likes</span>
                </div>
              </div>

              {/* Saved Snap Dumps Gallery */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                  Your Memory Vault
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {posts.slice(0, 6).map((p) => (
                    <div key={p.id} className="aspect-square rounded-xl overflow-hidden bg-neutral-200 relative group">
                      <img src={p.imageUrl} alt={p.caption} className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/60 text-[9px] text-[#ff9d00] font-mono font-bold">
                        {p.digicamMetadata?.dateStamp?.slice(0, 8) || "'26 09"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company & Developer Card */}
              <div className="p-4 rounded-2xl bg-neutral-900 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                    Product Architecture
                  </span>
                  <span className="text-[10px] font-bold text-amber-400">ASAAKURIGO AI</span>
                </div>
                <h4 className="text-sm font-bold font-syne">ASAAKURIGO AI DEVELOPMENT</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Want to learn more about the studio behind SNAPSCAPE or initiate a business or technical inquiry?
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setActiveSection("company")}
                    className="flex-1 py-2 rounded-xl bg-white text-neutral-900 text-xs font-bold hover:bg-neutral-100 transition-colors text-center"
                  >
                    View Company
                  </button>
                  <button
                    onClick={() => setActiveSection("contact")}
                    className="flex-1 py-2 rounded-xl bg-neutral-800 text-white text-xs font-bold hover:bg-neutral-700 transition-colors text-center"
                  >
                    Contact Team
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Company Profile (ASAAKURIGO AI DEVELOPMENT) */}
          {activeSection === "company" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-neutral-900 text-white space-y-2 shadow-md">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                  Organization & Studio
                </span>
                <h4 className="text-base font-bold font-syne">
                  ASAAKURIGO AI DEVELOPMENT
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  ASAAKURIGO AI DEVELOPMENT is an innovative artificial intelligence and consumer software studio dedicated to creating high-speed, culturally attuned social engines and intelligent multimodal products.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-900 font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Specialties</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">
                    Multimodal AI companions, real-time memory synchronization, sensory digital experiences, and next-gen social utilities.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-900 font-bold text-xs">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    <span>Engineering Ethos</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 leading-relaxed">
                    Uncompromising speed, authentic user expression, rigorous content safety, and zero-bloat user interfaces.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 font-mono">STUDIO</span>
                  <span className="font-bold text-neutral-900">ASAAKURIGO AI DEVELOPMENT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 font-mono">PRIMARY APP</span>
                  <span className="font-bold text-neutral-900">PLOGER</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 font-mono">DIRECT INQUIRIES</span>
                  <span className="font-mono text-emerald-600 font-bold">contact@asaakurigo.ai</span>
                </div>
              </div>

              <button
                onClick={() => setActiveSection("contact")}
                className="w-full py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-black transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <Mail className="w-4 h-4" />
                <span>Transmit Message to ASAAKURIGO</span>
              </button>
            </div>
          )}

          {/* SECTION 3: Contact Form */}
          {activeSection === "contact" && (
            <div className="space-y-4 animate-in fade-in">
              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-900">Inquiry Transmitted!</h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Thank you for contacting ASAAKURIGO AI DEVELOPMENT. Our product and developer team will review your message and reply promptly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                      setSubject("");
                    }}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-neutral-900 font-bold block text-xs">Direct Email Address</span>
                      <span className="text-[11px] font-mono text-emerald-600 font-semibold">contact@asaakurigo.ai</span>
                    </div>
                    <button
                      onClick={handleCopyEmail}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium transition-colors"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedEmail ? "Copied" : "Copy"}</span>
                    </button>
                  </div>

                  <form onSubmit={handleSendContact} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-neutral-500">Your Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-neutral-500">Your Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@example.com"
                        className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-neutral-500">Subject</label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Partnership, feedback, press inquiry..."
                        className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-neutral-500">Message</label>
                      <textarea
                        required
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Your inquiry or thoughts for ASAAKURIGO AI DEVELOPMENT..."
                        className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit to ASAAKURIGO</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          )}

          {/* SECTION 4: Dev Notes Official Channel */}
          {activeSection === "devnotes" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-950 text-white space-y-2 border border-purple-500/30 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-300" />
                    <span className="font-mono font-bold text-xs uppercase text-purple-200">@build Official Feed</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 font-bold">
                    VERIFIED DEV
                  </span>
                </div>
                <p className="text-xs text-purple-100/90 leading-relaxed">
                  Direct engineering memos, architecture changelogs, and feature drops published directly by ASAAKURIGO AI DEVELOPMENT.
                </p>
              </div>

              {/* Release Notes List */}
              <div className="space-y-3">
                {MOCK_DEV_RELEASE_NOTES.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono text-[10px] font-bold">
                        {note.version}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">{note.date}</span>
                    </div>

                    <h4 className="font-extrabold text-xs text-neutral-900 leading-snug">
                      {note.title}
                    </h4>

                    <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                      {note.summary}
                    </p>

                    <div className="space-y-1 pl-2 border-l-2 border-purple-300">
                      {note.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="text-[11px] text-neutral-700 flex items-start gap-1">
                          <span className="text-purple-600 font-bold">•</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      {note.tags.map((tag) => (
                        <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
