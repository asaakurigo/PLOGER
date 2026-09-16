import React, { useState } from "react";
import { X, Sparkles, Terminal, Code2, ExternalLink, Tag, ShieldCheck, Mail } from "lucide-react";
import { DevReleaseNote } from "../types";
import { MOCK_DEV_RELEASE_NOTES } from "../data/mockPosts";

interface SnapscapeDevNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SnapscapeDevNotesModal: React.FC<SnapscapeDevNotesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  if (!isOpen) return null;

  const notes = MOCK_DEV_RELEASE_NOTES;
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));

  const filteredNotes = selectedTag
    ? notes.filter((n) => n.tags.includes(selectedTag))
    : notes;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl bg-[#0D0F17] text-white rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-purple-200">Dev Notes & Changelog</h3>
                <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                  @build
                </span>
              </div>
              <p className="text-[11px] text-white/50 font-mono">
                Official Engineering Feed • ASAAKURIGO AI DEVELOPMENT
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Company Info Header Banner */}
        <div className="px-5 py-3 bg-gradient-to-r from-purple-950/40 to-black/60 border-b border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-white/80">Crafted by ASAAKURIGO AI DEVELOPMENT</span>
          </div>
          <a
            href="mailto:asaakurigo@gmail.com"
            className="flex items-center gap-1 text-[11px] font-mono text-purple-300 hover:text-purple-200 hover:underline"
          >
            <Mail className="w-3 h-3" />
            <span>Contact Team</span>
          </a>
        </div>

        {/* Tag Filters */}
        <div className="px-5 py-2.5 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all ${
              !selectedTag
                ? "bg-purple-600 text-white font-bold"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            All Releases
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-2.5 py-1 rounded-full text-xs font-mono flex items-center gap-1 whitespace-nowrap transition-all ${
                selectedTag === tag
                  ? "bg-purple-600 text-white font-bold"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              <Tag className="w-2.5 h-2.5" />
              <span>{tag}</span>
            </button>
          ))}
        </div>

        {/* Release Notes List */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {filteredNotes.map((note) => (
            <article
              key={note.id}
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 relative hover:border-purple-500/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/50">
                      {note.version}
                    </span>
                    <h4 className="font-bold text-sm text-white">{note.title}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-white/40 mt-1">
                    <span>{note.author}</span>
                    <span>•</span>
                    <span>{note.date}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-white/80 leading-relaxed font-sans">
                {note.summary}
              </p>

              {/* Bulleted Features */}
              <div className="space-y-1.5 pl-2 border-l-2 border-purple-500/40">
                {note.features.map((feat, idx) => (
                  <div key={idx} className="text-xs text-white/70 flex items-start gap-1.5">
                    <span className="text-purple-400">•</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1.5 pt-1">
                {note.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/50"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs font-mono text-white/50">
          <span>Continuous Candid Architecture</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
          >
            Close Notes
          </button>
        </div>
      </div>
    </div>
  );
};
