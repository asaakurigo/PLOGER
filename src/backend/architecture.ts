/**
 * ASAAKURIGO AI DEVELOPMENT - PLOGER BACKEND ARCHITECTURE & DATA SPECIFICATION
 * 
 * Production-ready Database Models, Relational / Document Schemas,
 * High-Velocity Daily Ranking Algorithms, Nested Comment Tree Queries,
 * and RESTful API Contract.
 */

// ============================================================================
// 1. POSTGRESQL (RELATIONAL / PRISMA) SCHEMA DEFINITION
// ============================================================================

export const POSTGRES_PRISMA_SCHEMA = `
// schema.prisma - ASAAKURIGO AI DEVELOPMENT Social Graph & Content Engine

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  extensions = [ltree, pg_trgm]
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

enum MediaType {
  IMAGE
  COLLAGE
  VIDEO
  DOODLE
  AUDIO_SNAPSHOT
}

model User {
  id              String         @id @default(uuid())
  handle          String         @unique // e.g. "@alex.candid"
  username        String
  avatarUrl       String
  bio             String?        @db.VarChar(160)
  verified        Boolean        @default(false)
  streakDays      Int            @default(0)
  isGhostMode     Boolean        @default(false)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  // Asymmetric Social Graph Relations
  following       Follow[]       @relation("UserFollowing")
  followers       Follow[]       @relation("UserFollowers")
  blockedUsers    Block[]        @relation("UserBlocking")
  blockedBy       Block[]        @relation("UserBlockedBy")

  // Content Relations
  posts           Post[]
  comments        Comment[]
  reactions       PostReaction[]
  commentLikes    CommentLike[]
  dailyVotes      DailyVote[]

  @@index([handle])
}

model Follow {
  followerId      String
  followingId     String
  createdAt       DateTime       @default(now())

  follower        User           @relation("UserFollowing", fields: [followerId], references: [id], onDelete: Cascade)
  following       User           @relation("UserFollowers", fields: [followingId], references: [id], onDelete: Cascade)

  @@id([followerId, followingId])
  @@index([followingId, createdAt(sort: Desc)])
}

model Block {
  blockerId       String
  blockedId       String
  createdAt       DateTime       @default(now())

  blocker         User           @relation("UserBlocking", fields: [blockerId], references: [id], onDelete: Cascade)
  blocked         User           @relation("UserBlockedBy", fields: [blockedId], references: [id], onDelete: Cascade)

  @@id([blockerId, blockedId])
}

model Post {
  id                  String         @id @default(uuid())
  authorId            String
  mediaType           MediaType      @default(IMAGE)
  imageUrl            String         // Primary media cover
  mediaUrls           String[]       // Multi-photo collage dumps
  videoUrl            String?        // Short video / 3s live clip
  caption             String         @db.VarChar(280)
  microThought        String?        @db.VarChar(280) // Twitter-style candid thought
  sentimentCategory   String         @default("Candid")
  topicTags           String[]       // Trending vibe topics, e.g. ["#GoldenHourDumps"]
  isLiveSnippet       Boolean        @default(false)
  isPrivate           Boolean        @default(false)
  ephemeralExpiresAt  DateTime?      // 48-hour self-destruct / auto-vault
  
  // Quote-Post & Thread Relations
  quoteOfPostId       String?
  quoteOf             Post?          @relation("QuotePosts", fields: [quoteOfPostId], references: [id], onDelete: SetNull)
  quotedBy            Post[]         @relation("QuotePosts")

  // Counters & Engagement Aggregates (Denormalized for Sub-millisecond Read Speed)
  likesCount          Int            @default(0)
  commentsCount       Int            @default(0)
  quotesCount         Int            @default(0)
  dailyVotesCount     Int            @default(0)
  velocityScore       Float          @default(0.0) // Continuously updated by cron worker
  dailyRank           Int?           // Calculated once daily

  createdAt           DateTime       @default(now())
  updatedAt           DateTime       @updatedAt

  author              User           @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments            Comment[]
  reactions           PostReaction[]
  dailyVotes          DailyVote[]

  @@index([authorId, createdAt(sort: Desc)])
  @@index([createdAt(sort: Desc)]) // Chronological home feed index
  @@index([velocityScore(sort: Desc)]) // Real-time trending index
  @@index([dailyVotesCount(sort: Desc)]) // Daily leaderboard index
}

model Comment {
  id              String         @id @default(uuid())
  postId          String
  authorId        String
  parentId        String?        // Self-referencing foreign key for nested threading
  path            String         // Materialized path or ltree for O(1) subtree fetch: "root.parent.child"
  depth           Int            @default(0) // Tree indentation depth
  text            String         @db.VarChar(500)
  likesCount      Int            @default(0)
  isBuddyBot      Boolean        @default(false)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  post            Post           @relation(fields: [postId], references: [id], onDelete: Cascade)
  author          User           @relation(fields: [authorId], references: [id], onDelete: Cascade)
  parent          Comment?       @relation("NestedReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies         Comment[]      @relation("NestedReplies")
  likes           CommentLike[]

  @@index([postId, path])
  @@index([parentId])
}

model PostReaction {
  id              String         @id @default(uuid())
  postId          String
  userId          String
  emojiType       String         // "fire" | "skull" | "nails" | "sparkles" | "lightning" | "sob"
  createdAt       DateTime       @default(now())

  post            Post           @relation(fields: [postId], references: [id], onDelete: Cascade)
  user            User           @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([postId, userId]) // 1 reaction per user per post (TikTok style)
  @@index([postId, emojiType])
}

model CommentLike {
  commentId       String
  userId          String
  createdAt       DateTime       @default(now())

  comment         Comment        @relation(fields: [commentId], references: [id], onDelete: Cascade)
  user            User           @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([commentId, userId])
}

model DailyVote {
  id              String         @id @default(uuid())
  postId          String
  userId          String
  voteDate        String         // YYYY-MM-DD
  weight          Float          @default(1.0)
  createdAt       DateTime       @default(now())

  post            Post           @relation(fields: [postId], references: [id], onDelete: Cascade)
  user            User           @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, voteDate]) // 1 community vote per user per day
  @@index([postId, voteDate])
}
`;

// ============================================================================
// 2. MONGODB DOCUMENT SCHEMA ALTERNATIVE
// ============================================================================

export const MONGODB_SCHEMA_DESIGN = `
/**
 * MongoDB / Mongoose Schema Design for ASAAKURIGO AI DEVELOPMENT
 * Optimized for rapid writes and high concurrency.
 */
{
  "users": {
    "_id": "ObjectId",
    "handle": "@alex.candid",
    "username": "alex.candid",
    "avatarUrl": "https://...",
    "following": ["userId_1", "userId_2"],
    "blocked": ["userId_9"],
    "verified": true,
    "createdAt": "ISODate"
  },
  "posts": {
    "_id": "ObjectId",
    "authorId": "ObjectId",
    "mediaType": "image" | "collage" | "video" | "audio_snapshot",
    "imageUrl": "https://...",
    "mediaUrls": ["url1", "url2"],
    "microThought": "280 chars max",
    "topicTags": ["#GoldenHourDumps"],
    "reactionsSummary": {
      "fire": 89,
      "sparkles": 95,
      "lightning": 64,
      "nails": 18,
      "skull": 2,
      "sob": 1
    },
    "velocityScore": 94.6,
    "dailyVotes": 412,
    "quoteOf": {
      "originalPostId": "ObjectId",
      "authorHandle": "@maya.frames"
    }
  },
  "comments": {
    "_id": "ObjectId",
    "postId": "ObjectId",
    "parentId": "ObjectId | null",
    "ancestors": ["rootId", "parentId"],
    "text": "candid reply tree",
    "likesCount": 12,
    "createdAt": "ISODate"
  }
}
`;

// ============================================================================
// 3. HIGH-VELOCITY DAILY RANKING ALGORITHM
// ============================================================================

export interface RankingMetrics {
  likesCount: number;
  commentsCount: number;
  quotesCount: number;
  dailyVotesCount: number;
  ageInHours: number;
  isVerifiedAuthor: boolean;
}

/**
 * Calculates real-time engagement velocity for the "Top Rankings of the Day"
 * 
 * Formula:
 * Velocity = (L*1.5 + C*2.5 + Q*3.0 + V*4.5) / (HoursOld + 2)^1.5 * QualityFactor
 * 
 * - Community votes (V) have the highest weight (4.5) as deliberate community signals.
 * - Quotes (Q) represent high social propagation value (3.0).
 * - Comments (C) represent discussion depth (2.5).
 * - Likes (L) provide baseline engagement (1.5).
 * - Gravity decay ((HoursOld + 2)^1.5) ensures fresh 24-hour content rotates cleanly.
 */
export function calculateEngagementVelocity(metrics: RankingMetrics): number {
  const {
    likesCount,
    commentsCount,
    quotesCount,
    dailyVotesCount,
    ageInHours,
    isVerifiedAuthor,
  } = metrics;

  const weights = {
    like: 1.5,
    comment: 2.5,
    quote: 3.0,
    vote: 4.5,
  };

  const rawEngagement =
    likesCount * weights.like +
    commentsCount * weights.comment +
    quotesCount * weights.quote +
    dailyVotesCount * weights.vote;

  const gravity = 1.5;
  const timeDecay = Math.pow(Math.max(0.1, ageInHours) + 2, gravity);
  const qualityMultiplier = isVerifiedAuthor ? 1.08 : 1.0;

  const velocity = (rawEngagement / timeDecay) * 10 * qualityMultiplier;
  return Math.round(velocity * 10) / 10;
}

// ============================================================================
// 4. LOW-LATENCY NESTED COMMENT TREE BUILDER
// ============================================================================

export interface RawCommentRecord {
  id: string;
  postId: string;
  author: {
    username: string;
    avatar: string;
    handle?: string;
  };
  text: string;
  timestamp: string;
  parentId: string | null;
  likesCount: number;
  isLikedByUser?: boolean;
}

export interface NestedCommentNode extends RawCommentRecord {
  replies: NestedCommentNode[];
}

/**
 * Converts a flat list of comment records into an optimized nested hierarchy tree in O(N) time.
 */
export function buildNestedCommentTree(comments: RawCommentRecord[]): NestedCommentNode[] {
  const commentMap = new Map<string, NestedCommentNode>();
  const rootComments: NestedCommentNode[] = [];

  // Pass 1: Initialize nodes with empty replies array
  comments.forEach((c) => {
    commentMap.set(c.id, { ...c, replies: [] });
  });

  // Pass 2: Assemble parent-child tree hierarchy
  comments.forEach((c) => {
    const node = commentMap.get(c.id)!;
    if (c.parentId && commentMap.has(c.parentId)) {
      commentMap.get(c.parentId)!.replies.push(node);
    } else {
      rootComments.push(node);
    }
  });

  return rootComments;
}

// ============================================================================
// 5. RESTFUL API ENDPOINT CONTRACT (EXPRESS / NEXT.JS API HANDLERS)
// ============================================================================

export const REST_API_CONTRACT = {
  // Feed Endpoints
  GET_HOME_FEED: {
    route: "/api/feed/home",
    description: "Fetches chronological posts excluding blocked users, paginated by cursor.",
    query: { cursor: "string (ISO Date)", limit: 20 },
  },
  GET_FOLLOWING_FEED: {
    route: "/api/feed/following",
    description: "Fetches posts authored only by accounts the authenticated user follows.",
    query: { cursor: "string (ISO Date)", limit: 20 },
  },
  GET_TRENDING_TOPICS: {
    route: "/api/feed/trending",
    description: "Retrieves posts filtered by visual micro-topic tag, ordered by velocityScore.",
    query: { topic: "#GoldenHourDumps", limit: 20 },
  },

  // Daily Leaderboard & Community Voting
  GET_DAILY_RANKINGS: {
    route: "/api/rankings/daily",
    description: "Returns Top 10 Ranked Posts and Top Creators of the Day sorted by velocity score and daily community votes.",
  },
  CAST_DAILY_VOTE: {
    route: "/api/posts/:postId/vote",
    method: "POST",
    description: "Casts user's single daily vote for a post. Enforces 1 vote per user per calendar day.",
  },

  // Asymmetric Social Graph (Follow / Unfollow / Block)
  POST_FOLLOW: {
    route: "/api/users/:handle/follow",
    method: "POST",
    description: "Asymmetrically follows user. Adds target to user's following list.",
  },
  POST_UNFOLLOW: {
    route: "/api/users/:handle/unfollow",
    method: "POST",
    description: "Removes user from following list.",
  },
  POST_BLOCK: {
    route: "/api/users/:handle/block",
    method: "POST",
    description: "Blocks target user. Filters them out of home, following, and comment feeds.",
  },

  // Multi-Threaded Comments
  POST_COMMENT: {
    route: "/api/posts/:postId/comments",
    method: "POST",
    body: { text: "string (max 500 chars)", parentId: "string | null" },
    description: "Creates top-level comment or replies to existing comment (nested thread).",
  },
  GET_COMMENTS_TREE: {
    route: "/api/posts/:postId/comments",
    method: "GET",
    description: "Returns nested tree of comments using materialized path traversal.",
  },
};
