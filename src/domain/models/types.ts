export type AppMode = "demo" | "production";
export type ScopeType = "chapter" | "subdivision" | "state" | "national";
export type OrganizationType =
  | "national"
  | "state_chapter"
  | "local_chapter"
  | "state_subdivision";
export type EventType =
  | "chapter_meeting"
  | "chapter_activity"
  | "subdivision_event"
  | "state_conference"
  | "national_conference"
  | "competitive_deadline"
  | "workshop"
  | "milestone";
export type ResourceType =
  | "pdf"
  | "webpage"
  | "form"
  | "guide"
  | "template"
  | "checklist"
  | "article"
  | "video"
  | "policy"
  | "study_reference";
export type ForumThreadType =
  | "question"
  | "discussion"
  | "tip_guide"
  | "study_help"
  | "logistics"
  | "official_discussion";
export type ForumStatus =
  | "active"
  | "pending_review"
  | "hidden"
  | "locked"
  | "removed";
export type StudyUnitType = "flashcards" | "quiz" | "reading" | "checklist";
export type AIContextType =
  | "general"
  | "event"
  | "resource"
  | "study"
  | "forum"
  | "news";
export type SavedItemType =
  | "event"
  | "resource"
  | "news_post"
  | "study_track"
  | "forum_thread";

export interface Organization {
  id: string;
  type: OrganizationType;
  name: string;
  shortName: string;
  parentOrganizationId?: string | null;
  stateCode?: string | null;
  subdivisionTypeLabel?: string | null;
  schoolName?: string | null;
  status: "active" | "inactive";
  logoUrl?: string;
  websiteUrl?: string;
}

export interface NotificationPreferences {
  enabled: boolean;
  categories: {
    upcomingSavedEvents: boolean;
    urgentAnnouncements: boolean;
    studyReminders: boolean;
    followedThreadReplies: boolean;
    recommendedOpportunities: boolean;
    resourceUpdates: boolean;
  };
  quietHours: {
    start: string;
    end: string;
  };
  digestFrequency: "instant" | "daily" | "weekly";
}

export interface PrivacyPreferences {
  showSchoolName: boolean;
  showGraduationYear: boolean;
  showChapter: boolean;
}

export interface AccessibilityPreferences {
  largeText: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
}

export interface User {
  id: string;
  division: "high_school";
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  photoUrl?: string;
  graduationYear: number;
  schoolName: string;
  localChapterId: string;
  stateChapterId: string;
  stateSubdivisionId?: string | null;
  goals: string[];
  generalInterests: string[];
  competitionInterests: string[];
  notificationPreferences: NotificationPreferences;
  privacyPreferences: PrivacyPreferences;
  accessibilityPreferences: AccessibilityPreferences;
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  eventType: EventType;
  scopeType: ScopeType;
  organizationId: string;
  stateChapterId?: string | null;
  stateSubdivisionId?: string | null;
  localChapterId?: string | null;
  startTime: string;
  endTime: string;
  timezone: string;
  locationName: string;
  locationAddress?: string;
  virtualUrl?: string;
  status: "scheduled" | "open" | "closed";
  coverImageUrl?: string;
  sourceType: "official" | "imported" | "curated";
  sourceReference?: string;
}

export interface EventSave {
  id: string;
  userId: string;
  eventId: string;
  savedAt: string;
  reminder1?: string | null;
  reminder2?: string | null;
  personalNote?: string;
  studyPlanId?: string | null;
}

export interface ResourceItem {
  id: string;
  title: string;
  summary: string;
  resourceType: ResourceType;
  category: string;
  contentFormat: "url" | "document" | "embedded";
  scopeType: ScopeType;
  organizationId?: string | null;
  url?: string;
  storagePath?: string;
  thumbnailUrl?: string;
  estimatedReadMinutes: number;
  tags: string[];
  sourceName: string;
  sourceUrl?: string;
  publishedAt: string;
  updatedAt: string;
  isOfficial: boolean;
  isDownloadable: boolean;
}

export interface ResourceState {
  id: string;
  userId: string;
  resourceId: string;
  isSaved: boolean;
  isOfflineAvailable: boolean;
  lastOpenedAt?: string | null;
  readingProgressPercent: number;
  userNote?: string;
  highlightCount: number;
}

export interface NewsPost {
  id: string;
  title: string;
  body: string;
  summary: string;
  scopeType: ScopeType;
  organizationId: string;
  priorityLevel: "low" | "medium" | "high" | "urgent";
  topicTags: string[];
  coverImageUrl?: string;
  relatedEventId?: string | null;
  relatedResourceId?: string | null;
  relatedThreadId?: string | null;
  publishedAt: string;
  expiresAt?: string | null;
  createdByType: "chapter" | "state" | "national";
  isPinned: boolean;
  isOfficial: boolean;
}

export interface NewsState {
  id: string;
  userId: string;
  newsPostId: string;
  isRead: boolean;
  isSaved: boolean;
  readAt?: string | null;
  savedAt?: string | null;
}

export interface SocialChannel {
  id: string;
  organizationId: string;
  platform: "Instagram" | "TikTok" | "YouTube" | "X" | "Facebook" | "Website";
  handle: string;
  profileUrl: string;
  displayName: string;
  isPrimary: boolean;
  isActive: boolean;
  lastVerifiedAt?: string | null;
}

export interface SocialHighlight {
  id: string;
  socialChannelId: string;
  title: string;
  summary: string;
  previewImageUrl?: string;
  externalPostUrl: string;
  publishedAt: string;
  relatedEventId?: string | null;
  relatedNewsPostId?: string | null;
}

export interface StudyTrack {
  id: string;
  title: string;
  description: string;
  trackType: "competition" | "topic" | "skills" | "event_prep";
  relatedEventId?: string | null;
  relatedResourceIds: string[];
  difficultyLevel: "foundation" | "intermediate" | "advanced";
  estimatedTotalMinutes: number;
  tags: string[];
  isOfficial: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudyUnit {
  id: string;
  studyTrackId: string;
  title: string;
  unitType: StudyUnitType;
  contentRef: string;
  sequenceOrder: number;
  estimatedMinutes: number;
}

export interface StudyProgress {
  id: string;
  userId: string;
  studyTrackId: string;
  progressPercent: number;
  lastOpenedAt?: string | null;
  completedAt?: string | null;
  weakTopics: string[];
  nextRecommendedUnitId?: string | null;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  studyUnitId: string;
  scorePercent: number;
  questionCount: number;
  correctCount: number;
  attemptedAt: string;
  missedTopicTags: string[];
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  scopeType: ScopeType;
  organizationId?: string | null;
  visibilityType: "public" | "chapter" | "state";
  sortOrder: number;
}

export interface ForumThread {
  id: string;
  categoryId: string;
  authorUserId: string;
  title: string;
  body: string;
  threadType: ForumThreadType;
  status: ForumStatus;
  relatedEventId?: string | null;
  relatedResourceId?: string | null;
  relatedStudyTrackId?: string | null;
  tags: string[];
  replyCount: number;
  helpfulCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
}

export interface ForumReply {
  id: string;
  threadId: string;
  authorUserId: string;
  body: string;
  status: ForumStatus;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ForumFollow {
  id: string;
  userId: string;
  threadId: string;
  followedAt: string;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  sourceLinks: { label: string; type: SavedItemType | "event" | "news_post"; id: string }[];
  createdAt: string;
}

export interface AIConversation {
  id: string;
  userId: string;
  contextType: AIContextType;
  contextId?: string | null;
  createdAt: string;
  updatedAt: string;
  messages: AIMessage[];
}

export interface AIGeneratedAsset {
  id: string;
  userId: string;
  assetType: "summary" | "flashcards" | "study_plan" | "quiz" | "thread_summary";
  sourceItemType: SavedItemType | "event" | "news_post";
  sourceItemId: string;
  contentBlob: string;
  createdAt: string;
}

export interface RecommendationBundle {
  recommendedEventIds: string[];
  suggestedStudyTrackIds: string[];
  relatedResourceIds: string[];
  relevantDiscussionIds: string[];
  importantUpdateIds: string[];
  priorities: string[];
}

export interface SearchResult {
  id: string;
  type: "event" | "resource" | "news" | "study" | "forum";
  title: string;
  shortSummary: string;
  relevanceMetadata: string;
  scope: ScopeType;
  routeTarget: string;
}

export interface MomentumSnapshot {
  savedEvents: number;
  savedResources: number;
  studyProgress: number;
  discussionParticipation: number;
  bookmarks: number;
}

export interface HomeBundle {
  nextUp?: EventItem | NewsPost | null;
  priorities: string[];
  studyFocus?: StudyTrack | null;
  recentAnnouncements: NewsPost[];
  recommendedResources: ResourceItem[];
  communityActivity: ForumThread[];
  socialHighlights: SocialHighlight[];
  momentumSnapshot: MomentumSnapshot;
  recommendationBundle: RecommendationBundle;
}

export interface DemoDataset {
  organizations: Organization[];
  user: User;
  events: EventItem[];
  eventSaves: EventSave[];
  resources: ResourceItem[];
  resourceState: ResourceState[];
  newsPosts: NewsPost[];
  newsState: NewsState[];
  socialChannels: SocialChannel[];
  socialHighlights: SocialHighlight[];
  studyTracks: StudyTrack[];
  studyUnits: StudyUnit[];
  studyProgress: StudyProgress[];
  quizAttempts: QuizAttempt[];
  forumCategories: ForumCategory[];
  forumThreads: ForumThread[];
  forumReplies: ForumReply[];
  forumFollows: ForumFollow[];
  aiConversations: AIConversation[];
  aiGeneratedAssets: AIGeneratedAsset[];
}
