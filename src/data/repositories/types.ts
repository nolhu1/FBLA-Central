import {
  EventSave,
  ForumCategory,
  ForumReply,
  ForumThread,
  HomeBundle,
  NewsPost,
  NewsState,
  Organization,
  ResourceItem,
  SocialChannel,
  SocialHighlight,
  StudyProgress,
  StudyTrack,
  StudyUnit,
  QuizAttempt,
  ResourceState,
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
  sourceLinks: { label: string; type: string; id: string }[];
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
  getEventSaves(): Promise<EventSave[]>;
  saveEvent(eventId: string, personalNote?: string): Promise<void>;
  updateEventSave(input: {
    eventId: string;
    isSaved: boolean;
    reminder1?: string | null;
    reminder2?: string | null;
    personalNote?: string;
  }): Promise<void>;
  getResources(): Promise<ResourceItem[]>;
  getResourceState(): Promise<ResourceState[]>;
  toggleResourceSave(resourceId: string): Promise<void>;
  getNews(): Promise<NewsPost[]>;
  getNewsState(): Promise<NewsState[]>;
  markNewsRead(newsPostId: string): Promise<void>;
  updateNewsState(input: { newsPostId: string; isRead?: boolean; isSaved?: boolean }): Promise<void>;
  getSocialHub(): Promise<SocialHubPayload>;
  getStudyTracks(): Promise<StudyTrack[]>;
  getStudyUnits(): Promise<StudyUnit[]>;
  getStudyProgress(): Promise<StudyProgress[]>;
  getQuizAttempts(): Promise<QuizAttempt[]>;
  submitQuizAttempt(input: {
    studyUnitId: string;
    scorePercent: number;
    questionCount: number;
    correctCount: number;
    missedTopicTags: string[];
  }): Promise<QuizAttempt>;
  getForumCategories(): Promise<ForumCategory[]>;
  getForumThreads(): Promise<ForumThread[]>;
  getForumReplies(threadId: string): Promise<ForumReply[]>;
  createForumThread(input: {
    categoryId: string;
    title: string;
    body: string;
    threadType: import("@/domain/models/types").ForumThreadType;
    relatedEventId?: string | null;
    relatedResourceId?: string | null;
    relatedStudyTrackId?: string | null;
    tags?: string[];
  }): Promise<ForumThread>;
  postForumReply(threadId: string, body: string): Promise<void>;
  askAI(input: AskAIInput): Promise<AskAIResult>;
  search(query: string): Promise<import("@/domain/models/types").SearchResult[]>;
}
