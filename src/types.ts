export type ThemeType = 
  | "Neon Cyber" 
  | "Y2K Digicam" 
  | "Minimal Glass" 
  | "Muted Earth" 
  | "Sunset Retro";

export type BuddyPersona = 
  | "Unhinged Bestie" 
  | "Hype Man" 
  | "Sarcastic Critic" 
  | "Chill Study Buddy" 
  | "Y2K Nostalgic" 
  | "Professional Tech Assistant";

export type LandingTab = 
  | "Live Stream" 
  | "Interactive Map" 
  | "Shared Dumps" 
  | "AI Buddy Chat";

export type WidgetStyle = 
  | "Digicam Viewfinder" 
  | "Clean Neo-Card" 
  | "Cyber HUD" 
  | "Polaroid Peel";

export type AudioFeedbackSound = 
  | "shutter" 
  | "digicam_beep" 
  | "pop_chime" 
  | "cyber_chirp";

export interface ThemeConfig {
  theme: ThemeType;
  accentColor: string;
  fontFamily: "Syne" | "Space Mono" | "VT323" | "Plus Jakarta Sans";
  widgetStyle: WidgetStyle;
}

export interface CustomizationSettings {
  hapticEnabled: boolean;
  audioFeedbackSound: AudioFeedbackSound;
  primaryLandingTab: LandingTab;
  soundVolume: number;
}

export interface PhotoAnalysisResult {
  aesthetic_vibe: string;
  vibe_score: number;
  mood: string;
  lighting_and_details: string;
  bloopers_detected: string;
  suggested_captions: {
    aesthetic: string;
    chaotic: string;
    minimal: string;
  };
  stream_category: string;
  roast_or_commentary: string;
  story_overlay_text: string;
}

export interface AudioTag {
  id: string;
  title: string;
  category: "ambient" | "music" | "voice_memo";
  duration: number; // in seconds, default 5
  presetId: "indie_bedroom" | "city_rain" | "club_subbass" | "skate_bowl" | "custom_voice";
}

export interface DoodleItem {
  id: string;
  type: "path" | "stamp" | "voice_marker";
  color?: string;
  brushSize?: number;
  points?: Array<{ x: number; y: number }>;
  emoji?: string;
  stampText?: string;
  x?: number; // percentage 0-100
  y?: number; // percentage 0-100
  author: string;
  timestamp: string;
}

export interface CameraSimulationSettings {
  preset: "disposable_90s" | "digicam_04" | "portra_35mm" | "cyber_glitch" | "noir";
  grainLevel: number; // 0-100
  lightLeak: boolean;
  timestampStyle: string; // e.g. "'26 09 16"
  delayToReveal: boolean; // Darkroom developing mode
}

export interface LiveVault {
  id: string;
  title: string;
  tagline: string;
  location: string;
  coverImage: string;
  participants: Array<{ username: string; avatar: string }>;
  snapsCount: number;
  isActive: boolean;
  snaps: PhotoPost[];
}

export interface MemoryBox {
  id: string;
  title: string;
  location: string;
  sealedDate: string;
  unlockDate: string; // ISO format
  isUnlocked: boolean;
  memberCount: number;
  coverBlurImage: string;
  snaps: PhotoPost[];
}

export interface MoodBoardItem {
  id: string;
  imageUrl: string;
  note?: string;
  pinnedBy: { username: string; avatar: string };
  pinnedAt: string;
  rotation: number; // degrees -12 to 12
  tapeStyle: "neon_pink" | "yellow_washi" | "silver_duct" | "clear";
}

export interface PostComment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
  isBuddy?: boolean;
  likesCount?: number;
  isLikedByUser?: boolean;
  parentId?: string | null;
  replies?: PostComment[];
}

export interface PhotoReplyThreadItem {
  id: string;
  author: {
    username: string;
    avatar: string;
    verified?: boolean;
  };
  imageUrl: string;
  thoughtText: string;
  timestamp: string;
  reactionsCount?: number;
  isLiked?: boolean;
}

export interface QuotePostData {
  originalPostId: string;
  originalAuthor: {
    username: string;
    avatar: string;
  };
  originalImageUrl: string;
  originalCaption: string;
  overlayType?: "reaction_photo" | "drawing" | "audio_note" | "sticker";
  overlayContent?: string;
}

export interface DevReleaseNote {
  id: string;
  version: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  features: string[];
  tags: string[];
}

export interface PhotoPost {
  id: string;
  author: {
    username: string;
    avatar: string;
    verified?: boolean;
    streak?: number;
    handle?: string; // e.g. "@alex.candid"
  };
  imageUrl: string;
  caption: string;
  timestamp: string;
  isoDate: string;
  location?: {
    name: string;
    coords: [number, number]; // lat, lng
  };
  sentimentCategory: string; // e.g. "Feels like 2 AM", "Main Character Energy", "Brain Rot Memes"
  reactions: {
    fire: number;
    skull: number;
    nails: number;
    sparkles: number;
    lightning: number;
    sob: number;
  };
  isLikedByUser?: boolean;
  userReaction?: string;
  commentsCount: number;
  comments: PostComment[];
  digicamMetadata: {
    dateStamp: string;
    iso: string;
    filterApplied: string;
    archivedAt: string;
    shutterSpeed: string;
  };
  aiAnalysis?: PhotoAnalysisResult;

  // Interactive & Creative Media Features
  audioTag?: AudioTag;
  dualView?: {
    frontCameraUrl: string;
    mainCameraUrl?: string;
  };
  doodles?: DoodleItem[];
  cameraSimulation?: CameraSimulationSettings;

  // Multi-Format Media Uploads
  mediaType?: "image" | "collage" | "video" | "doodle" | "audio_snapshot";
  mediaUrls?: string[]; // for multi-photo dumps / collages
  videoUrl?: string; // for short video clips or live snippets

  // Twitter-Inspired Mechanics
  microThought?: string; // 280-char short-form thought
  isLiveSnippet?: boolean; // 3-second live photo snippet
  quoteOf?: QuotePostData; // Quote-Photo / Visual Retweet
  threadReplies?: PhotoReplyThreadItem[]; // Branching photo sub-gallery reply thread
  topicTags?: string[]; // Trending vibe tags (e.g. #GoldenHourDumps)
  isOfficialReleaseNote?: boolean; // Official in-feed skippable post card from @build
  retweetsCount?: number;
  isRetweetedByUser?: boolean;

  // Social Graph & Daily Leaderboard
  dailyRank?: number; // 1, 2, 3, etc.
  dailyVotesCount?: number;
  velocityScore?: number; // engagement velocity score
  isVotedToday?: boolean;

  // Privacy & Zero-Pressure Engagement Features
  isPrivate?: boolean;
  isPinned?: boolean;
  ephemeralHoursLeft?: number; // e.g. 42 hours remaining until auto-archive
  anonymizedVibeVoting?: {
    firePct: number;
    sparklesPct: number;
    lightningPct: number;
    nailsPct: number;
    totalVotes: number;
    userVote?: "fire" | "sparkles" | "lightning" | "nails";
  };

  // Google Photos-Style Visual Search & Auto-Backup Attributes
  objects?: string[]; // e.g. ["coffee", "latte", "mug", "table"]
  detectedFaces?: Array<{ id: string; name: string; avatar: string }>;
  cityLocation?: string; // e.g. "Brooklyn, NY", "Tokyo, Japan"
  visualCategory?: "people" | "places" | "things" | "documents" | "screenshots" | "favorites";
  backupStatus?: "backed_up" | "syncing" | "local_only";
  fileSizeBytes?: number; // e.g. 3500000 (3.5MB)
  isArchived?: boolean;
  isFavorite?: boolean;
}

// TikTok Short-Form Video & Discovery Item
export interface ShortVideoItem {
  id: string;
  author: {
    username: string;
    handle: string;
    avatar: string;
    verified?: boolean;
    streak?: number;
  };
  videoUrl?: string; // Simulated or actual MP4
  posterUrl: string;
  caption: string;
  hashtags: string[];
  musicTrack: {
    id: string;
    title: string;
    artist: string;
    albumArt: string;
    isOriginalSound?: boolean;
    duration: number;
  };
  category: "trend" | "review" | "tutorial" | "vibe" | "discovery";
  reviewDetails?: {
    rating: number; // e.g. 9.6
    subject: string;
    pros: string[];
    verdict: string;
  };
  tutorialDetails?: {
    title: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    steps: string[];
  };
  likesCount: number;
  isLikedByUser?: boolean;
  commentsCount: number;
  comments?: PostComment[];
  savesCount: number;
  isSavedByUser?: boolean;
  sharesCount: number;
  timestamp: string;
}

// Google Photos Face Recognition Cluster
export interface DetectedFaceCluster {
  id: string;
  name: string;
  avatar: string;
  photosCount: number;
  featuredSnapUrl: string;
}

// Google Photos Cloud Backup & Vault State
export interface CloudVaultSettings {
  isAutoBackupEnabled: boolean;
  backupQuality: "original" | "storage_saver";
  backupOverCellular: boolean;
  backupDeviceFolders: {
    camera: boolean;
    screenshots: boolean;
    plogerDumps: boolean;
    downloads: boolean;
  };
  totalSpaceBytes: number; // e.g. 107374182400 (100 GB)
  usedSpaceBytes: number; // e.g. 15247182400 (14.2 GB)
  lastBackupTime: string;
  isSyncing: boolean;
}

export interface SocialGraphState {
  followingHandles: string[];
  blockedHandles: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "buddy";
  text: string;
  timestamp: string;
  image?: string;
  structuredOutput?: any;
}

export interface WeeklyRecapData {
  recap_title: string;
  vibe_summary: string;
  chaos_index: number;
  top_archetype: string;
  highlight_quote: string;
  camera_roll_roast: string;
  aesthetic_breakdown: Array<{
    label: string;
    percentage: number;
  }>;
}

export interface StructuredSystemResponse {
  theme_config: ThemeConfig;
  ai_buddy_persona: {
    mode: BuddyPersona;
    slangIntensity: number;
    tone: string;
  };
  photo_stream_metadata: {
    active_stream_category: string;
    total_snaps_archived: number;
    latest_sentiment: string;
  };
  customization_settings: CustomizationSettings;
}
