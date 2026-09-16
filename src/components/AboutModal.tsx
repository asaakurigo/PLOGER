import React, { useState } from "react";
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Mail, 
  Send, 
  Check, 
  Globe, 
  ExternalLink,
  MessageSquare,
  Users,
  Copy,
  CheckCircle2
} from "lucide-react";
import { ThemeConfig } from "../types";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeConfig: ThemeConfig;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  themeConfig,
}) => {
  const [activeTab, setActiveTab] = useState<"about" | "company" | "contact">("about");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact@asaakurigo.ai");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    setContactSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in">
      <div 
        className="w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border flex flex-col max-h-[90vh]"
        style={{
          backgroundColor: "#11151f",
          borderColor: `${themeConfig.accentColor}50`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shadow-md"
              style={{ backgroundColor: themeConfig.accentColor, color: "#000" }}
            >
              ⚡
            </div>
            <div>
              <h2 className="text-base font-bold font-syne text-white uppercase tracking-wider">
                About & Company Center
              </h2>
              <p className="text-[11px] text-white/50">Information, Company Details & Inquiries</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-white/10 bg-black/20 px-6 pt-2 gap-2">
          <button
            onClick={() => setActiveTab("about")}
            className={`pb-2 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === "about"
                ? "text-white border-white"
                : "text-white/50 border-transparent hover:text-white/80"
            }`}
          >
            About App
          </button>
          <button
            onClick={() => setActiveTab("company")}
            className={`pb-2 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "company"
                ? "text-white border-white"
                : "text-white/50 border-transparent hover:text-white/80"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Company Profile</span>
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`pb-2 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "contact"
                ? "text-white border-white"
                : "text-white/50 border-transparent hover:text-white/80"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Us</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-5 text-xs text-white/80 leading-relaxed overflow-y-auto">
          
          {/* TAB 1: About App */}
          {activeTab === "about" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-400 block">
                  The Ploger Vision
                </span>
                <p className="text-sm font-medium text-white italic leading-relaxed">
                  "Built to seamlessly bridge real-time daily photo sharing with automatic background memory archiving, tuned specifically for Gen Z culture."
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                  Why Ploger?
                </h3>
                <p className="text-white/70">
                  Modern social feeds have become overly polished, curated, and exhausting. Ploger revives the spontaneous, candid nostalgia of early-2000s digicam flash photos, late-night diner runs, and unedited bloopers—safely back-syncing your memories automatically.
                </p>
              </div>

              <div className="space-y-2.5 p-4 rounded-2xl bg-black/30 border border-white/10">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>SAFETY & COMMUNITY GUARDRAILS</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-white/70 list-disc list-inside">
                  <li>
                    <strong className="text-white">Strict Content Safety:</strong> Zero tolerance against harmful, predatory, or non-consensual imagery.
                  </li>
                  <li>
                    <strong className="text-white">Supportive Roast Boundaries:</strong> AI Buddy maintains playful, good-natured humor that is encouraging and never abusive.
                  </li>
                  <li>
                    <strong className="text-white">Privacy First:</strong> Geolocation and background vault streams remain under user control.
                  </li>
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-white font-bold block">Curious who engineered this?</span>
                  <span className="text-[11px] text-white/50">View company background, leadership & tech stack.</span>
                </div>
                <button
                  onClick={() => setActiveTab("company")}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-black"
                  style={{ backgroundColor: themeConfig.accentColor }}
                >
                  Meet Company →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Company Profile (ASAAKURIGO AI DEVELOPMENT) */}
          {activeTab === "company" && (
            <div className="space-y-4 animate-in fade-in">
              <div 
                className="p-5 rounded-2xl border space-y-3 relative overflow-hidden"
                style={{
                  backgroundColor: "rgba(25, 32, 44, 0.6)",
                  borderColor: `${themeConfig.accentColor}40`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
                    Parent Organization
                  </span>
                  <span className="text-[10px] font-mono text-white/40">EST. 2026</span>
                </div>
                <h3 className="text-lg font-bold font-syne text-white">
                  ASAAKURIGO AI DEVELOPMENT
                </h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  ASAAKURIGO AI DEVELOPMENT is an innovative artificial intelligence and consumer software studio dedicated to creating high-speed, culturally attuned social engines and intelligent multimodal products.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-white font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Focus Areas</span>
                  </div>
                  <p className="text-[11px] text-white/60 leading-relaxed">
                    Multimodal AI companions, real-time memory synchronization, sensory digital experiences, and next-gen social utilities.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-white font-bold">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Engineering Ethos</span>
                  </div>
                  <p className="text-[11px] text-white/60 leading-relaxed">
                    Uncompromising speed, authentic user expression, rigorous content safety, and zero-bloat user interfaces.
                  </p>
                </div>
              </div>

              {/* Company Quick Details */}
              <div className="space-y-2 p-4 rounded-2xl bg-black/40 border border-white/10">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/50 font-mono">ORGANIZATION</span>
                  <span className="text-white font-semibold">ASAAKURIGO AI DEVELOPMENT</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/50 font-mono">PRODUCT</span>
                  <span className="text-white font-semibold">Ploger (Real-Time Social & Memory Vault)</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/50 font-mono">INQUIRIES</span>
                  <span className="text-emerald-400 font-mono">contact@asaakurigo.ai</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-white/50">Need direct partnership or press inquiries?</span>
                <button
                  onClick={() => setActiveTab("contact")}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-black flex items-center gap-1"
                  style={{ backgroundColor: themeConfig.accentColor }}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact Our Team</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Contact Us */}
          {activeTab === "contact" && (
            <div className="space-y-4 animate-in fade-in">
              {contactSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="text-base font-bold text-white">Message Received!</h4>
                  <p className="text-xs text-emerald-200/80 max-w-sm mx-auto">
                    Thank you for reaching out to ASAAKURIGO AI DEVELOPMENT. Our product and developer support team will review your message and reply promptly.
                  </p>
                  <button
                    onClick={() => {
                      setContactSubmitted(false);
                      setContactMessage("");
                      setContactSubject("");
                    }}
                    className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold block text-xs">Direct Email Dispatch</span>
                      <span className="text-[11px] font-mono text-emerald-400">contact@asaakurigo.ai</span>
                    </div>
                    <button
                      onClick={handleCopyEmail}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedEmail ? "Copied" : "Copy Email"}</span>
                    </button>
                  </div>

                  <form onSubmit={handleSendContact} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono font-bold text-white/50">Your Name</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Alex Morgan"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono font-bold text-white/50">Your Email</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="alex@example.com"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono font-bold text-white/50">Subject / Inquiry Type</label>
                      <input
                        type="text"
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        placeholder="Partnership, Feature Request, Feedback, Press..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono font-bold text-white/50">Message</label>
                      <textarea
                        required
                        rows={3}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Tell ASAAKURIGO AI DEVELOPMENT about your thoughts or collaboration idea..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-black flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-transform"
                      style={{ backgroundColor: themeConfig.accentColor }}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit to ASAAKURIGO AI DEVELOPMENT</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <span className="text-[10px] font-mono text-white/40">
            © 2026 ASAAKURIGO AI DEVELOPMENT
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-black"
            style={{ backgroundColor: themeConfig.accentColor }}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
