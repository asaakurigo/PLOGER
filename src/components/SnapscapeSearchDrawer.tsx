import React, { useState } from "react";
import { Search, X, Tag, Flame, Sparkles, MapPin } from "lucide-react";
import { PhotoPost } from "../types";

interface SnapscapeSearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  posts: PhotoPost[];
  onSelectPost: (post: PhotoPost) => void;
}

const TRENDING_TAGS = ["#goldenhour", "#skate", "#bodega", "#candid", "#2amvibes", "#editorial", "#vintage"];

export const SnapscapeSearchDrawer: React.FC<SnapscapeSearchDrawerProps> = ({
  isOpen,
  onClose,
  posts,
  onSelectPost,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredPosts = posts.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.caption.toLowerCase().includes(q) ||
      p.author.username.toLowerCase().includes(q) ||
      p.location?.name.toLowerCase().includes(q) ||
      p.sentimentCategory.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md h-[85vh] bg-[#FAF8F5] text-neutral-900 rounded-t-[36px] sm:rounded-[36px] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-neutral-200">
          <h3 className="font-black font-sans uppercase tracking-tight text-lg text-neutral-900">
            Explore & Search
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center text-neutral-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 border-b border-neutral-200">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tags, vibes, locations, users..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-all"
            />
          </div>

          {/* Quick Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar">
            {TRENDING_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag.replace("#", ""))}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-neutral-200/70 hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap text-neutral-700"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
            {searchQuery ? `Found (${filteredPosts.length}) results` : "Curated Discoveries"}
          </span>

          <div className="grid grid-cols-2 gap-3">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => {
                  onSelectPost(post);
                  onClose();
                }}
                className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-neutral-200 group cursor-pointer shadow-sm hover:shadow-md"
              >
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end text-white text-xs">
                  <span className="font-bold truncate">{post.author.username}</span>
                  <p className="text-[10px] text-white/80 line-clamp-1">{post.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
