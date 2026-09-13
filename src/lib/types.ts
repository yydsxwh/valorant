export type PublicUser = {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  rank: string;
  createdAt: number;
};

export type GuideStep = {
  title: string;
  body: string;
  tip?: string;
  kind?: "stand" | "aim" | "land" | "note";
};

export type PostRecord = {
  id: string;
  authorId: string;
  type: "video" | "guide";
  title: string;
  summary: string;
  body: string;
  videoKind: "youtube" | "bilibili" | "upload" | "demo";
  videoUrl: string;
  coverUrl: string;
  mapId: string;
  agentId: string;
  ability: string;
  side: string;
  site: string;
  area: string;
  purpose: string;
  difficulty: string;
  startX: number;
  startY: number;
  landX: number;
  landY: number;
  steps: GuideStep[];
  tags: string[];
  viewCount: number;
  likeCount: number;
  favoriteCount: number;
  commentCount: number;
  shareCount: number;
  createdAt: number;
  updatedAt: number;
  author: PublicUser;
  liked?: boolean;
  favorited?: boolean;
};

export type CommentRecord = {
  id: string;
  postId: string;
  authorId: string;
  parentId: string | null;
  body: string;
  likeCount: number;
  createdAt: number;
  author: PublicUser;
  liked?: boolean;
  replies: CommentRecord[];
};
