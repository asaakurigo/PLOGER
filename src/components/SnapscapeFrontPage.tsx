import React, { useState } from "react";
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  Sparkles, 
  Smartphone, 
  Flame, 
  Layers, 
  Pin, 
  Lock, 
  Clock, 
  EyeOff, 
  Camera, 
  Music,
  Plus,
  Repeat,
  Terminal,
  Grid,
  ListFilter,
  Trophy,
  Users,
  Globe
} from "lucide-react";
import { PhotoPost, DoodleItem, MoodBoardItem, LiveVault, PhotoReplyThreadItem } from "../types";
import { SnapscapeSnapDetailModal } from "./SnapscapeSnapDetailModal";
import { SnapscapeDoodleModal } from "./SnapscapeDoodleModal";
import { SnapscapeWeeklyDumpModal } from "./SnapscapeWeeklyDumpModal";
import { SnapscapeLiveVaultsView } from "./SnapscapeLiveVaultsView";
import { SnapscapeMoodBoardView } from "./SnapscapeMoodBoardView";
import { SnapscapeMemoryBoxesView } from "./SnapscapeMemoryBoxesView";
import { SnapscapeGhostVaultModal } from "./SnapscapeGhostVaultModal";
import { SnapscapeMicroFeedView } from "./SnapscapeMicroFeedView";
import { SnapscapeQuotePhotoModal } from "./SnapscapeQuotePhotoModal";
import { SnapscapePhotoThreadModal } from "./SnapscapePhotoThreadModal";
import { SnapscapeDevNotesModal } from "./SnapscapeDevNotesModal";
import { SnapscapeDailyRankingsView } from "./SnapscapeDailyRankingsView";
import { 
  MOCK_LIVE_VAULTS, 
  MOCK_MEMORY_BOXES, 
  MOCK_MOOD_BOARD, 
  MOCK_WEEKLY_DUMP 
} from "../data/mockPosts";
import { playAudioFeedback } from "../utils/audio";

interface SnapscapeFrontPageProps {
  posts: PhotoPost[];
  onLikePost: (postId: string) => void;
  onLikeComment?: (postId: string, commentId: string) => void;
  onReplyComment?: (postId: string, parentId: string, replyText: string) => void;
  onAddComment: (postId: string, comment: string) => void;
  onReact?: (postId: string, emojiType: any) => void;
  onVotePost?: (postId: string) => void;
  followingHandles?: string[];
  onToggleFollow?: (handle: string) => void;
  onBlockUser?: (handle: string) => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenCreator: () => void;
  onPublishPost?: (post: PhotoPost) => void;
  onToggleShowcase?: () => void;
  isShowcaseActive?: boolean;
}

export type FrontPageSubView = "microfeed" | "rankings" | "masonry" | "vaults" | "moodboard" | "memoryboxes";

export const SnapscapeFrontPage: React.FC<SnapscapeFrontPageProps> = ({
  posts,
  onLikePost,
  onLikeComment,
  onReplyComment,
  onAddComment,
  onReact,
  onVotePost,
  followingHandles = ["@alex.candid", "@maya.frames", "@sam.archive"],
  onToggleFollow,
  onBlockUser,
  onOpenNotifications,
  onOpenProfile,
  onOpenCreator,
  onPublishPost,
  onToggleShowcase,
  isShowcaseActive = false,
}) => {
  // Default to Photo-First Micro-Feed ("Snaps & Thoughts")
  const [activeSubView, setActiveSubView] = useState<FrontPageSubView>("microfeed");
  const [feedFilter, setFeedFilter] = useState<"all" | "following">("all");
  const [selectedPost, setSelectedPost] = useState<PhotoPost | null>(null);
  const [heartBurstPostId, setHeartBurstPostId] = useState<string | null>(null);
  const [lastCardTap, setLastCardTap] = useState<{ id: string; time: number }>({ id: "", time: 0 });

  // Twitter-inspired interactive modals
  const [quotePostTarget, setQuotePostTarget] = useState<PhotoPost | null>(null);
  const [threadPostTarget, setThreadPostTarget] = useState<PhotoPost | null>(null);
  const [isDevNotesOpen, setIsDevNotesOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Creative modals
  const [doodlingPost, setDoodlingPost] = useState<PhotoPost | null>(null);
  const [isWeeklyDumpOpen, setIsWeeklyDumpOpen] = useState(false);
  const [isGhostVaultOpen, setIsGhostVaultOpen] = useState(false);
  const [noMetricMode, setNoMetricMode] = useState(false);

  // Dynamic state for live vaults and mood board pins
  const [liveVaults, setLiveVaults] = useState<LiveVault[]>(MOCK_LIVE_VAULTS);
  const [moodBoardItems, setMoodBoardItems] = useState<MoodBoardItem[]>(MOCK_MOOD_BOARD);

  // Filter public vs private posts, strictly sorted chronologically (newest first)
  const chronologicalPosts = [...posts].sort((a, b) => {
    const timeA = new Date(a.isoDate || 0).getTime();
    const timeB = new Date(b.isoDate || 0).getTime();
    return timeB - timeA;
  });

  // Filter based on social graph following / all
  const filteredFeedPosts = chronologicalPosts.filter((p) => {
    if (p.isPrivate) return false;
    if (feedFilter === "following") {
      const handle = p.author.handle || `@${p.author.username}`;
      return followingHandles.includes(handle) || p.author.username === "me";
    }
    return true;
  });

  const publicPosts = chronologicalPosts.filter((p) => !p.isPrivate);
  const privatePosts = chronologicalPosts.filter((p) => p.isPrivate);

  // Divide public posts into 2 columns for staggered aesthetic masonry grid
  const leftColumnPosts = filteredFeedPosts.filter((_, index) => index % 2 === 0);
  const rightColumnPosts = filteredFeedPosts.filter((_, index) => index % 2 === 1);

  // Keep selected post synced with latest state
  const activeSelectedPost = selectedPost
    ? posts.find((p) => p.id === selectedPost.id) || selectedPost
    : null;

  const handleCardClick = (post: PhotoPost) => {
    const now = Date.now();
    if (lastCardTap.id === post.id && now - lastCardTap.time < 320) {
      // Double tap detected -> TikTok Heart Burst & User Like!
      if (!post.isLikedByUser) {
        onLikePost(post.id);
      }
      playAudioFeedback("pop_chime", true);
      setHeartBurstPostId(post.id);
      setTimeout(() => setHeartBurstPostId(null), 850);
      setLastCardTap({ id: "", time: 0 });
    } else {
      setLastCardTap({ id: post.id, time: now });
      setTimeout(() => {
        setLastCardTap((prev) => {
          if (!prev && Date.now() - now >= 300) {
            return post;
          }
          return prev;
        });
      }, 300);
    }
  };

  const handleLikeBadgeClick = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    playAudioFeedback("pop_chime", true);
    onLikePost(postId);
  };

  const handleSaveDoodles = (postId: string, newDoodles: DoodleItem[]) => {
    const target = posts.find((p) => p.id === postId);
    if (target) {
      target.doodles = [...(target.doodles || []), ...newDoodles];
    }
    setDoodlingPost(null);
  };

  const handleAddPhotoReply = (postId: string, reply: PhotoReplyThreadItem) => {
    const target = posts.find((p) => p.id === postId);
    if (target) {
      target.threadReplies = [...(target.threadReplies || []), reply];
    }
  };

  const handlePublishDumpAsPost = (caption: string, photos: string[]) => {
    if (onPublishPost) {
      const dumpPost: PhotoPost = {
        id: `snap-dump-${Date.now()}`,
        author: {
          username: "you.candid",
          handle: "@you.candid",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          verified: true,
          streak: 1,
        },
        imageUrl: photos[0],
        caption: caption || "Dump of the Week // uncurated camera roll purge 🎞️",
        microThought: caption || "Sunday night uncurated purge. 0 posed shots, 100% genuine memories #NoFilterFriday",
        topicTags: ["#NoFilterFriday", "#GoldenHourDumps"],
        timestamp: "Just now",
        isoDate: new Date().toISOString(),
        sentimentCategory: "Chaotic Good",
        reactions: { fire: 1, skull: 0, nails: 0, sparkles: 2, lightning: 1, sob: 0 },
        commentsCount: 1,
        comments: [
          {
            id: `comm-dump-${Date.now()}`,
            user: "PLOG buddy",
            avatar: "/plog-buddy.jpg",
            text: "Dump of the Week automatically compiled and published! The candid uncurated energy is undefeated.",
            timestamp: "Just now",
            isBuddy: true,
            likesCount: 1,
            isLikedByUser: false,
          },
        ],
        digicamMetadata: {
          dateStamp: `'26 09 16 04:10`,
          iso: "ISO 400",
          filterApplied: "WEEKLY_DUMP_AUTO_COLLAGE",
          archivedAt: "Archived to Vault",
          shutterSpeed: "1/60s f/2.8",
        },
        aiAnalysis: {
          aesthetic_vibe: "Weekend Film Archive",
          vibe_score: 96,
          mood: "Golden Hour Purge",
          lighting_and_details: "Unedited multi-frame snapshot of candid daily life",
          bloopers_detected: "3 raw moments",
          suggested_captions: {
            aesthetic: "dumping memories 🎞️",
            chaotic: "too many good mistakes",
            minimal: "week 37",
          },
          stream_category: "Feels like 2 AM",
          roast_or_commentary: "Unfiltered authenticity at its finest. No posing needed.",
          story_overlay_text: "WEEKEND MEMORY DUMP",
        },
      };

      onPublishPost(dumpPost);
    }
  };

  const renderMasonryCard = (post: PhotoPost) => {
    const isLiked = !!post.isLikedByUser;
    const isBursting = heartBurstPostId === post.id;

    return (
      <div 
        key={post.id}
        onClick={() => handleCardClick(post)}
        className="relative group rounded-[26px] overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] bg-neutral-200 select-none"
      >
        <img 
          src={post.imageUrl} 
          alt={post.caption} 
          className="w-full h-auto object-cover block pointer-events-none"
          loading="lazy"
        />

        {/* TikTok Double-Tap Floating Heart Burst Animation */}
        {isBursting && (
          <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center animate-ping duration-700">
            <Heart className="w-16 h-16 text-[#FE2C55] fill-[#FE2C55] drop-shadow-[0_0_12px_rgba(254,44,85,0.9)] rotate-[-10deg]" />
          </div>
        )}

        {/* Rendered Sticker Stamps on Card Preview */}
        {post.doodles?.map((item) => {
          if (item.type === "stamp") {
            return (
              <div
                key={item.id}
                style={{ left: `${item.x ?? 50}%`, top: `${item.y ?? 50}%` }}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                <span className="text-base drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">
                  {item.emoji}
                </span>
              </div>
            );
          }
          return null;
        })}

        {/* Dual-View Front-Camera PIP Badge */}
        {post.dualView && (
          <div className="absolute top-2 left-2 w-9 h-9 rounded-full border-2 border-white shadow-lg overflow-hidden z-10">
            <img src={post.dualView.frontCameraUrl} alt="Dual view react" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Audio Tag Indicator Pill */}
        {post.audioTag && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-purple-200 border border-purple-400/30 text-[9px] font-mono flex items-center gap-1 z-10">
            <Music className="w-2.5 h-2.5 text-purple-400" />
            <span className="truncate max-w-[70px]">5s Audio</span>
          </div>
        )}

        {/* Floating Bottom-Left Stats Badge */}
        <div 
          className="absolute bottom-2.5 left-2.5 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[11px] font-semibold transition-transform z-20 pointer-events-auto"
          onClick={(e) => handleLikeBadgeClick(e, post.id)}
        >
          <button 
            type="button"
            className="flex items-center gap-1 transition-transform active:scale-125"
            title={isLiked ? "Unlike" : "Like (1 user like)"}
          >
            <Heart 
              className={`w-3.5 h-3.5 transition-all duration-200 ${
                isLiked 
                  ? "text-[#FE2C55] fill-[#FE2C55] scale-110 drop-shadow-[0_0_6px_rgba(254,44,85,0.7)]" 
                  : "text-white/90"
              }`} 
            />
            {!noMetricMode && (
              <span className={`font-mono text-[10px] transition-colors ${isLiked ? "text-[#FE2C55]" : "text-white"}`}>
                {post.reactions.fire}
              </span>
            )}
          </button>

          {!noMetricMode && (
            <div className="flex items-center gap-1 opacity-80 border-l border-white/20 pl-2">
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px]">{post.comments.length}</span>
            </div>
          )}
        </div>

        {/* Retro Orange Digicam Date Stamp */}
        {post.digicamMetadata?.dateStamp && (
          <div className="absolute bottom-2.5 right-2.5 text-[#ff9d00] font-mono text-[10px] font-bold tracking-widest bg-black/50 px-1.5 py-0.2 rounded pointer-events-none">
            {post.digicamMetadata.dateStamp}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex-1 flex flex-col relative pb-6">
      
      {/* Top Header */}
      <header className="px-5 py-3.5 flex items-center justify-between sticky top-0 bg-[#FAF8F5]/90 backdrop-blur-md z-20 border-b border-neutral-200/60">
        <div>
          <h1 className="text-xl font-black italic tracking-wider text-neutral-900 font-sans flex items-center gap-1.5">
            <span>PLOGER</span>
            <span className="text-[10px] not-italic px-1.5 py-0.2 rounded bg-pink-100 text-pink-600 font-mono font-bold">
              GEN Z
            </span>
          </h1>
          <p className="text-[10px] font-mono text-neutral-500 tracking-tight">
            Photo-first micro-feed • candid archiving
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Dual Phone Showcase View Toggle */}
          {onToggleShowcase && (
            <button
              onClick={onToggleShowcase}
              title="Toggle Dual Phone Showcase view"
              className={`p-1.5 rounded-full border transition-all ${
                isShowcaseActive 
                  ? "bg-neutral-900 text-white border-neutral-900" 
                  : "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200"
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          )}

          {/* Dev Notes / Changelog button */}
          <button
            onClick={() => {
              playAudioFeedback("pop_chime", true);
              setIsDevNotesOpen(true);
            }}
            className="p-1.5 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-800 transition-colors"
            title="Dev Notes & Release Changelog (@build)"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => {
              playAudioFeedback("pop_chime", true);
              onOpenNotifications();
            }}
            className="relative p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-neutral-800 stroke-[2.2]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#FAF8F5]" />
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={() => {
              playAudioFeedback("pop_chime", true);
              onOpenProfile();
            }}
            className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-neutral-300 hover:ring-neutral-900 transition-all active:scale-95"
            title="Profile & Settings"
          >
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
              alt="Profile"
              className="w-full h-full object-cover" 
            />
          </button>
        </div>
      </header>

      {/* Sub-View Navigation Tabs */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-neutral-200/60 sticky top-[57px] bg-[#FAF8F5]/90 backdrop-blur-md z-20">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: "microfeed", label: "Snaps & Thoughts" },
            { id: "rankings", label: "Daily Rankings", icon: Trophy },
            { id: "masonry", label: "Grid View" },
            { id: "vaults", label: "Live Vaults" },
            { id: "moodboard", label: "Mood Board" },
            { id: "memoryboxes", label: "Time Capsules" },
          ].map((tab) => {
            const Icon = (tab as any).icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSubView(tab.id as FrontPageSubView);
                  playAudioFeedback("pop_chime", true);
                }}
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                  activeSubView === tab.id
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "bg-neutral-200/70 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                }`}
              >
                {Icon && <Icon className="w-3 h-3 text-amber-400" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Utility Toggles */}
        <div className="flex items-center gap-1.5 pl-2 shrink-0">
          {/* Dump of the Week Button */}
          <button
            onClick={() => setIsWeeklyDumpOpen(true)}
            className="p-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm hover:opacity-90 active:scale-95 transition-all"
            title="Dump of the Week Auto-Collage"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          {/* Ghost Vault Lock Button */}
          <button
            onClick={() => setIsGhostVaultOpen(true)}
            className="p-1.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30 hover:bg-purple-900 active:scale-95 transition-all"
            title="Ghost Mode Vault (Biometric Lock)"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>

          {/* No Metric Mode Toggle */}
          <button
            onClick={() => {
              setNoMetricMode(!noMetricMode);
              playAudioFeedback("pop_chime", true);
            }}
            className={`px-2 py-1 rounded-full text-[10px] font-mono border transition-all ${
              noMetricMode 
                ? "bg-emerald-600 text-white border-emerald-600" 
                : "bg-neutral-100 text-neutral-500 border-neutral-200"
            }`}
            title="Toggle No Metric Mode (Zero pressure)"
          >
            {noMetricMode ? "No-Metric: ON" : "No-Metric"}
          </button>
        </div>
      </div>

      {/* Social Graph Filter Bar: "All Candid Snaps" vs "Friends & Following" */}
      {(activeSubView === "microfeed" || activeSubView === "masonry") && (
        <div className="px-4 pt-2.5 pb-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-neutral-200/70 p-0.5 rounded-full text-[11px] font-mono">
            <button
              onClick={() => setFeedFilter("all")}
              className={`px-3 py-0.5 rounded-full transition-all flex items-center gap-1 ${
                feedFilter === "all" ? "bg-white text-neutral-900 font-bold shadow-xs" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>Chronological All</span>
            </button>
            <button
              onClick={() => setFeedFilter("following")}
              className={`px-3 py-0.5 rounded-full transition-all flex items-center gap-1 ${
                feedFilter === "following" ? "bg-white text-neutral-900 font-bold shadow-xs" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Users className="w-3 h-3 text-pink-500" />
              <span>Friends & Following ({followingHandles.length})</span>
            </button>
          </div>

          <span className="text-[10px] font-mono text-neutral-400">
            Strictly Real-time
          </span>
        </div>
      )}

      {/* Main Content Area Based on Sub-View */}
      <main className="flex-1 px-4 pt-3 pb-28">
        {/* Sub-View 1: Photo-First Micro-Feed ("Snaps & Thoughts") */}
        {activeSubView === "microfeed" && (
          <SnapscapeMicroFeedView
            posts={filteredFeedPosts}
            onLikePost={onLikePost}
            onOpenThread={(post) => setThreadPostTarget(post)}
            onOpenQuoteModal={(post) => setQuotePostTarget(post)}
            onOpenSnapDetail={(post) => setSelectedPost(post)}
            onOpenDevNotes={() => setIsDevNotesOpen(true)}
            selectedTopic={selectedTopic}
            onSelectTopic={setSelectedTopic}
            noMetricMode={noMetricMode}
          />
        )}

        {/* Sub-View 2: Daily Rankings Leaderboard */}
        {activeSubView === "rankings" && (
          <SnapscapeDailyRankingsView
            posts={publicPosts}
            onSelectPost={(post) => setSelectedPost(post)}
            onVotePost={onVotePost}
            followingHandles={followingHandles}
            onToggleFollow={onToggleFollow}
            noMetricMode={noMetricMode}
          />
        )}

        {/* Sub-View 3: Masonry Grid Feed */}
        {activeSubView === "masonry" && (
          <div className="grid grid-cols-2 gap-3.5 animate-in fade-in">
            <div className="flex flex-col gap-3.5">
              {leftColumnPosts.map((post) => renderMasonryCard(post))}
            </div>
            <div className="flex flex-col gap-3.5">
              {rightColumnPosts.map((post) => renderMasonryCard(post))}
            </div>
          </div>
        )}

        {/* Sub-View 4: Collaborative Live Vaults */}
        {activeSubView === "vaults" && (
          <SnapscapeLiveVaultsView
            vaults={liveVaults}
            onSelectPost={(post) => setSelectedPost(post)}
            onAddSnapToVault={(vaultId) => onOpenCreator()}
          />
        )}

        {/* Sub-View 5: Close Friends Mood Board */}
        {activeSubView === "moodboard" && (
          <SnapscapeMoodBoardView
            items={moodBoardItems}
            onPinItem={(item) => setMoodBoardItems([item, ...moodBoardItems])}
          />
        )}

        {/* Sub-View 6: Time-Locked Memory Boxes */}
        {activeSubView === "memoryboxes" && (
          <SnapscapeMemoryBoxesView
            boxes={MOCK_MEMORY_BOXES}
            onSelectPost={(post) => setSelectedPost(post)}
          />
        )}
      </main>

      {/* Quote-Photos & Visual Retweets Modal */}
      <SnapscapeQuotePhotoModal
        post={quotePostTarget}
        isOpen={!!quotePostTarget}
        onClose={() => setQuotePostTarget(null)}
        onPublishQuotePost={(newPost) => {
          if (onPublishPost) {
            onPublishPost(newPost);
          }
        }}
      />

      {/* Photo-Reply Branching Thread Modal */}
      <SnapscapePhotoThreadModal
        post={threadPostTarget}
        isOpen={!!threadPostTarget}
        onClose={() => setThreadPostTarget(null)}
        onAddPhotoReply={handleAddPhotoReply}
      />

      {/* Permanent Dev Notes & Changelog Channel Modal */}
      <SnapscapeDevNotesModal
        isOpen={isDevNotesOpen}
        onClose={() => setIsDevNotesOpen(false)}
      />

      {/* Snap Detail Interactive Modal with Multi-threaded comments & reaction breakdown */}
      <SnapscapeSnapDetailModal
        post={activeSelectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        onLike={onLikePost}
        onLikeComment={onLikeComment}
        onReplyComment={onReplyComment}
        onAddComment={onAddComment}
        onReact={onReact}
        onOpenDoodleModal={(post) => setDoodlingPost(post)}
        followingHandles={followingHandles}
        onToggleFollow={onToggleFollow}
        onBlockUser={onBlockUser}
        noMetricMode={noMetricMode}
      />

      {/* Doodle & Stamp Canvas Modal */}
      <SnapscapeDoodleModal
        post={doodlingPost}
        isOpen={!!doodlingPost}
        onClose={() => setDoodlingPost(null)}
        onSaveDoodles={handleSaveDoodles}
      />

      {/* Dump of the Week Auto-Collage Modal */}
      <SnapscapeWeeklyDumpModal
        isOpen={isWeeklyDumpOpen}
        onClose={() => setIsWeeklyDumpOpen(false)}
        dumpData={MOCK_WEEKLY_DUMP}
        onPublishDump={handlePublishDumpAsPost}
      />

      {/* Ghost Vault Biometric Modal */}
      <SnapscapeGhostVaultModal
        isOpen={isGhostVaultOpen}
        onClose={() => setIsGhostVaultOpen(false)}
        privatePosts={privatePosts}
        onSelectPost={(post) => setSelectedPost(post)}
      />

    </div>
  );
};
