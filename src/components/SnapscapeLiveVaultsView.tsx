import React, { useState } from "react";
import { Users, Plus, Radio, MapPin, Camera, Sparkles, Check, ChevronRight } from "lucide-react";
import { LiveVault, PhotoPost } from "../types";
import { playAudioFeedback } from "../utils/audio";

interface SnapscapeLiveVaultsViewProps {
  vaults: LiveVault[];
  onSelectPost: (post: PhotoPost) => void;
  onUploadToVault: (vaultId: string) => void;
}

export const SnapscapeLiveVaultsView: React.FC<SnapscapeLiveVaultsViewProps> = ({
  vaults,
  onSelectPost,
  onUploadToVault,
}) => {
  const [activeVaultId, setActiveVaultId] = useState<string>(vaults[0]?.id || "");
  const currentVault = vaults.find((v) => v.id === activeVaultId) || vaults[0];

  const handleSwitchVault = (id: string) => {
    playAudioFeedback("pop_chime", true);
    setActiveVaultId(id);
  };

  const handleUpload = () => {
    playAudioFeedback("shutter", true);
    onUploadToVault(activeVaultId);
  };

  return (
    <div className="space-y-5 animate-in fade-in pb-12">
      {/* Overview Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/20 to-black/60 border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <h2 className="font-bold text-base text-cyan-200">Collaborative Live Vaults</h2>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
              SHARED ALBUMS
            </span>
          </div>
          <p className="text-xs text-white/60">
            Real-time event photo feeds where all attendees upload uncurated candid shots simultaneously.
          </p>
        </div>
        <button
          onClick={handleUpload}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all self-start md:self-auto"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Upload Snap to Live Vault</span>
        </button>
      </div>

      {/* Vault Cards Horizontal Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {vaults.map((vault) => {
          const isSelected = vault.id === activeVaultId;
          return (
            <button
              key={vault.id}
              onClick={() => handleSwitchVault(vault.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? "bg-cyan-950/30 border-cyan-400/50 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400/30"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    vault.isActive 
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                      : "bg-white/10 text-white/50"
                  }`}>
                    {vault.isActive ? "● LIVE SYNC" : "ARCHIVED"}
                  </span>
                  <span className="text-[10px] text-white/50 font-mono">{vault.snapsCount} Snaps</span>
                </div>
                <h3 className="font-bold text-sm text-white">{vault.title}</h3>
                <p className="text-[11px] text-white/60 line-clamp-1">{vault.tagline}</p>
                <div className="flex items-center gap-1 text-[10px] text-white/40 pt-1">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>{vault.location}</span>
                </div>
              </div>

              {/* Participant Avatars */}
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5">
                <div className="flex -space-x-2">
                  {vault.participants.map((p, i) => (
                    <img
                      key={i}
                      src={p.avatar}
                      alt={p.username}
                      className="w-6 h-6 rounded-full border-2 border-neutral-900 object-cover"
                    />
                  ))}
                </div>
                <span className="text-[10px] text-cyan-300 font-mono flex items-center gap-0.5">
                  View Feed <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Vault Live Photo Grid */}
      {currentVault && (
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <h3 className="font-bold text-sm text-white">
                Live Feed: {currentVault.title}
              </h3>
              <span className="text-xs text-white/40">({currentVault.snaps.length} uploaded)</span>
            </div>
            <span className="text-xs font-mono text-white/50">All attendee rolls synced</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            {currentVault.snaps.map((snap) => (
              <div
                key={snap.id}
                onClick={() => onSelectPost(snap)}
                className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-white/10 cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <img
                  src={snap.imageUrl}
                  alt={snap.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={snap.author.avatar}
                      alt={snap.author.username}
                      className="w-5 h-5 rounded-full object-cover border border-white/40"
                    />
                    <span className="text-[10px] font-mono text-white/90 truncate">
                      {snap.author.username}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/80 line-clamp-1">{snap.caption}</p>
                </div>

                <div className="absolute bottom-1 right-1.5 px-1.5 py-0.5 rounded bg-black/60 font-mono text-[9px] text-cyan-300">
                  {snap.digicamMetadata.dateStamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
