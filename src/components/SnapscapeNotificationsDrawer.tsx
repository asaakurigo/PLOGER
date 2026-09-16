import React from "react";
import { X, Heart, MessageCircle, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

interface SnapscapeNotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCompanyCenter: () => void;
}

const NOTIFICATIONS = [
  {
    id: "notif-1",
    user: "PLOG buddy",
    avatar: "/plog-buddy.jpg",
    action: "dropped a 99/100 Vibe Score analysis on your new skyline post.",
    time: "4m ago",
    type: "buddy",
  },
  {
    id: "notif-2",
    user: "alex.candid",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    action: "liked your skate memory on Pier 62 ramp.",
    time: "18m ago",
    type: "like",
  },
  {
    id: "notif-3",
    user: "zara.dumps",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    action: "commented: 'where did you capture this?'",
    time: "1h ago",
    type: "comment",
  },
  {
    id: "notif-4",
    user: "Memory Vault Engine",
    avatar: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=150&q=80",
    action: "Successfully synced 6 high-res digicam dumps to local backup.",
    time: "3h ago",
    type: "system",
  },
];

export const SnapscapeNotificationsDrawer: React.FC<SnapscapeNotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onOpenCompanyCenter,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md h-[80vh] bg-[#FAF8F5] text-neutral-900 rounded-t-[36px] sm:rounded-[36px] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <h3 className="font-black font-sans uppercase tracking-tight text-lg text-neutral-900">
              Notifications
            </h3>
            <span className="w-2 h-2 rounded-full bg-red-500" />
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center text-neutral-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {NOTIFICATIONS.map((n) => (
            <div 
              key={n.id}
              className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 flex items-start gap-3 shadow-xs hover:border-neutral-400 transition-all"
            >
              <img 
                src={n.avatar} 
                alt={n.user} 
                className="w-9 h-9 rounded-full object-cover ring-1 ring-neutral-200 mt-0.5" 
              />
              <div className="flex-1 text-xs">
                <p className="text-neutral-800 leading-snug">
                  <strong className="font-bold text-neutral-900 mr-1">{n.user}</strong>
                  {n.action}
                </p>
                <span className="text-[10px] text-neutral-400 font-mono mt-1 block">{n.time}</span>
              </div>
              {n.type === "like" && <Heart className="w-4 h-4 text-pink-500 fill-pink-500 mt-1" />}
              {n.type === "comment" && <MessageCircle className="w-4 h-4 text-blue-500 mt-1" />}
              {n.type === "buddy" && <Sparkles className="w-4 h-4 text-purple-500 mt-1" />}
              {n.type === "system" && <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1" />}
            </div>
          ))}

          {/* Company Hub Card at bottom */}
          <div className="mt-4 p-4 rounded-2xl bg-neutral-900 text-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                DEVELOPED BY
              </span>
              <span className="text-[10px] font-bold text-emerald-400">VERIFIED STUDIO</span>
            </div>
            <h4 className="text-sm font-bold font-syne">ASAAKURIGO AI DEVELOPMENT</h4>
            <p className="text-[11px] text-neutral-300 leading-relaxed">
              Inquiries, partnerships, or curious about the tech stack behind SNAPSCAPE?
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenCompanyCenter();
              }}
              className="w-full py-2 rounded-xl bg-white text-neutral-900 text-xs font-bold hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5 mt-1"
            >
              <span>View Company Center & Contact</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
