/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { PhotoPost, PostComment } from "./types";
import { INITIAL_POSTS } from "./data/mockPosts";
import { SnapscapeFrontPage } from "./components/SnapscapeFrontPage";
import { SnapscapeBottomNav, NavTab } from "./components/SnapscapeBottomNav";
import { SnapscapeCreatorSheet } from "./components/SnapscapeCreatorSheet";
import { SnapscapeSearchDrawer } from "./components/SnapscapeSearchDrawer";
import { SnapscapeNotificationsDrawer } from "./components/SnapscapeNotificationsDrawer";
import { SnapscapeProfileDrawer } from "./components/SnapscapeProfileDrawer";
import { SnapscapeDualShowcase } from "./components/SnapscapeDualShowcase";
import { SnapscapeSnapDetailModal } from "./components/SnapscapeSnapDetailModal";
import { AboutModal } from "./components/AboutModal";
import { playAudioFeedback } from "./utils/audio";

export default function App() {
  // Navigation tab state matching the bottom bar in the image
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  
  // Dual phone showcase mode toggle
  const [isShowcaseMode, setIsShowcaseMode] = useState(false);

  // Posts state
  const [posts, setPosts] = useState<PhotoPost[]>(INITIAL_POSTS);

  // Social Graph State (Asymmetric Follows & Blocked Handles)
  const [followingHandles, setFollowingHandles] = useState<string[]>([
    "@alex.candid",
    "@maya.frames",
    "@sam.archive",
  ]);
  const [blockedHandles, setBlockedHandles] = useState<string[]>([]);

  // Modals and Drawers
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAboutCompanyOpen, setIsAboutCompanyOpen] = useState(false);
  const [selectedPostForDetail, setSelectedPostForDetail] = useState<PhotoPost | null>(null);

  // Handler for publishing a post from the creator
  const handlePublishPost = (newPost: PhotoPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setActiveTab("home");
  };

  // Handler for liking a post (TikTok-style: user can only like/unlike once)
  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isCurrentlyLiked = !!p.isLikedByUser;
          return {
            ...p,
            isLikedByUser: !isCurrentlyLiked,
            reactions: {
              ...p.reactions,
              fire: isCurrentlyLiked ? Math.max(0, p.reactions.fire - 1) : p.reactions.fire + 1,
            },
          };
        }
        return p;
      })
    );
  };

  // Handler for multi-type reactions
  const handleReact = (postId: string, emojiType: keyof PhotoPost["reactions"]) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const prevReaction = p.userReaction;
          const newReactions = { ...p.reactions };
          if (prevReaction) {
            newReactions[prevReaction] = Math.max(0, newReactions[prevReaction] - 1);
          }
          if (prevReaction !== emojiType) {
            newReactions[emojiType] = (newReactions[emojiType] || 0) + 1;
          }
          return {
            ...p,
            userReaction: prevReaction === emojiType ? undefined : emojiType,
            reactions: newReactions,
          };
        }
        return p;
      })
    );
  };

  // Handler for voting on post in Daily Rankings
  const handleVotePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            dailyVotesCount: (p.dailyVotesCount || 0) + 1,
            velocityScore: (p.velocityScore || 90) + 4.5,
          };
        }
        return p;
      })
    );
  };

  // Handler for liking a comment (TikTok-style: user can only like/unlike once)
  const handleLikeComment = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          // Recursive like toggle for nested comments
          const toggleLikeInList = (comments: PostComment[]): PostComment[] => {
            return comments.map((c) => {
              if (c.id === commentId) {
                const isCurrentlyLiked = !!c.isLikedByUser;
                const count = c.likesCount || 0;
                return {
                  ...c,
                  isLikedByUser: !isCurrentlyLiked,
                  likesCount: isCurrentlyLiked ? Math.max(0, count - 1) : count + 1,
                };
              }
              if (c.replies && c.replies.length > 0) {
                return {
                  ...c,
                  replies: toggleLikeInList(c.replies),
                };
              }
              return c;
            });
          };

          return {
            ...p,
            comments: toggleLikeInList(p.comments),
          };
        }
        return p;
      })
    );
  };

  // Handler for adding a top-level comment
  const handleAddComment = (postId: string, comment: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComm: PostComment = {
            id: `comm-${Date.now()}`,
            user: "you",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
            text: comment,
            timestamp: "Just now",
            likesCount: 0,
            isLikedByUser: false,
            replies: [],
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComm],
          };
        }
        return p;
      })
    );
  };

  // Handler for replying directly to a nested comment
  const handleReplyComment = (postId: string, parentId: string, replyText: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newReply: PostComment = {
            id: `comm-reply-${Date.now()}`,
            user: "you",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
            text: replyText,
            timestamp: "Just now",
            parentId: parentId,
            likesCount: 0,
            isLikedByUser: false,
            replies: [],
          };

          const addReplyRecursively = (comments: PostComment[]): PostComment[] => {
            return comments.map((c) => {
              if (c.id === parentId) {
                return {
                  ...c,
                  replies: [...(c.replies || []), newReply],
                };
              }
              if (c.replies && c.replies.length > 0) {
                return {
                  ...c,
                  replies: addReplyRecursively(c.replies),
                };
              }
              return c;
            });
          };

          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: addReplyRecursively(p.comments),
          };
        }
        return p;
      })
    );
  };

  // Social Graph: Follow / Unfollow
  const handleToggleFollow = (handle: string) => {
    setFollowingHandles((prev) =>
      prev.includes(handle) ? prev.filter((h) => h !== handle) : [...prev, handle]
    );
  };

  // Social Graph: Block User
  const handleBlockUser = (handle: string) => {
    setBlockedHandles((prev) => [...prev, handle]);
    setFollowingHandles((prev) => prev.filter((h) => h !== handle));
  };

  // Bottom navigation tab click handler
  const handleTabChange = (tab: NavTab) => {
    playAudioFeedback("pop_chime", true);
    setActiveTab(tab);

    if (tab === "add") {
      setIsCreatorOpen(true);
    } else if (tab === "search") {
      setIsSearchOpen(true);
    } else if (tab === "notifications") {
      setIsNotificationsOpen(true);
    } else if (tab === "profile") {
      setIsProfileOpen(true);
    }
  };

  // Filter out posts from blocked users
  const visiblePosts = posts.filter(
    (p) => !blockedHandles.includes(p.author.handle || `@${p.author.username}`)
  );

  // If Dual Phone Showcase is active, render side-by-side view matching the user's uploaded mockup
  if (isShowcaseMode) {
    return (
      <SnapscapeDualShowcase
        posts={visiblePosts}
        onLikePost={handleLikePost}
        onLikeComment={handleLikeComment}
        onAddComment={handleAddComment}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenCreator={() => setIsCreatorOpen(true)}
        onPublishPost={handlePublishPost}
        onCloseShowcase={() => setIsShowcaseMode(false)}
      />
    );
  }

  const activeSelectedPostForDetail = selectedPostForDetail
    ? visiblePosts.find((p) => p.id === selectedPostForDetail.id) || selectedPostForDetail
    : null;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-neutral-900 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      
      {/* Front Page matching the Left Phone in the uploaded image */}
      <div className="flex-1 w-full max-w-md mx-auto relative flex flex-col">
        <SnapscapeFrontPage
          posts={visiblePosts}
          onLikePost={handleLikePost}
          onLikeComment={handleLikeComment}
          onReplyComment={handleReplyComment}
          onAddComment={handleAddComment}
          onReact={handleReact}
          onVotePost={handleVotePost}
          followingHandles={followingHandles}
          onToggleFollow={handleToggleFollow}
          onBlockUser={handleBlockUser}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenCreator={() => setIsCreatorOpen(true)}
          onPublishPost={handlePublishPost}
          onToggleShowcase={() => setIsShowcaseMode(true)}
          isShowcaseActive={isShowcaseMode}
        />

        {/* Floating/Docked Bottom Navigation Bar matching the image */}
        <div className="fixed bottom-0 inset-x-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md">
          <SnapscapeBottomNav
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
      </div>

      {/* Post Creator & Effects Studio Sheet (Right Phone in uploaded image) */}
      <SnapscapeCreatorSheet
        isOpen={isCreatorOpen}
        onClose={() => {
          setIsCreatorOpen(false);
          setActiveTab("home");
        }}
        onPublishPost={handlePublishPost}
      />

      {/* Explore & Search Drawer */}
      <SnapscapeSearchDrawer
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          setActiveTab("home");
        }}
        posts={visiblePosts}
        onSelectPost={(post) => setSelectedPostForDetail(post)}
      />

      {/* Notifications Drawer */}
      <SnapscapeNotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => {
          setIsNotificationsOpen(false);
          setActiveTab("home");
        }}
        onOpenCompanyCenter={() => setIsAboutCompanyOpen(true)}
      />

      {/* Profile & Archive Drawer (with ASAAKURIGO AI DEVELOPMENT Company Profile & Contact) */}
      <SnapscapeProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => {
          setIsProfileOpen(false);
          setActiveTab("home");
        }}
        posts={visiblePosts}
      />

      {/* Snap Detail Modal (when opening from search) */}
      <SnapscapeSnapDetailModal
        post={activeSelectedPostForDetail}
        isOpen={!!selectedPostForDetail}
        onClose={() => setSelectedPostForDetail(null)}
        onLike={handleLikePost}
        onLikeComment={handleLikeComment}
        onReplyComment={handleReplyComment}
        onAddComment={handleAddComment}
        onReact={handleReact}
        followingHandles={followingHandles}
        onToggleFollow={handleToggleFollow}
        onBlockUser={handleBlockUser}
      />

      {/* About & Company Center Modal */}
      <AboutModal
        isOpen={isAboutCompanyOpen}
        onClose={() => setIsAboutCompanyOpen(false)}
        themeConfig={{
          theme: "Neon Cyber",
          accentColor: "#ec4899",
          fontFamily: "Plus Jakarta Sans",
          widgetStyle: "Clean Neo-Card",
        }}
      />

    </div>
  );
}
