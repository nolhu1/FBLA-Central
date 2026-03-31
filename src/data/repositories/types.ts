import {
  ForumReply,
  ForumThread,
  HomeBundle,
  NewsPost,
  Organization,
  ResourceItem,
  SocialChannel,
  SocialHighlight,
  StudyTrack,
  User
} from "@/domain/models/types";
import { OnboardingInput } from "@/data/schemas/onboarding";

export interface SignInInput {
  email: string;
  password: string;
  createIfNeeded?: boolean;
}

export interface AskAIInput {
  prompt: string;
  contextId?: string | null;
}

export interface AskAIResult {
  answer: string;
  sourceLinks: Array<{ label: string; type: string; id: string }>;
}

export interface SocialHubPayload {
  channels: SocialChannel[];
  highlights: SocialHighlight[];
}

export interface FBLACentralRepository {
  restoreSession(): Promise<User | null>;
  signIn(input: SignInInput): Promise<User>;
  signOut(): Promise<void>;
  completeOnboarding(input: OnboardingInput): Promise<User>;
  getOrganizations(): Promise<Organization[]>;
  getHomeBundle(): Promise<HomeBundle>;
  getEvents(): Promise<import("@/domain/models/types").EventItem[]>;
  saveEvent(eventId: string, personalNote?: string): Promise<void>;
  getResources(): Promise<ResourceItem[]>;
  toggleResourceSave(resourceId: string): Promise<void>;
  getNews(): Promise<NewsPost[]>;
  markNewsRead(newsPostId: string): Promise<void>;
  getSocialHub(): Promise<SocialHubPayload>;
  getStudyTracks(): Promise<StudyTrack[]>;
  getForumThreads(): Promise<ForumThread[]>;
  getForumReplies(threadId: string): Promise<ForumReply[]>;
  postForumReply(threadId: string, body: string): Promise<void>;
  askAI(input: AskAIInput): Promise<AskAIResult>;
  search(query: string): Promise<import("@/domain/models/types").SearchResult[]>;
}
