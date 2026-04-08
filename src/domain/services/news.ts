import { EventSave, NewsPost, NewsState, Organization, User } from "@/domain/models/types";

export type NewsScopeFilter = "chapter" | "state" | "national";
export type NewsTypeFilter =
  | "all"
  | "urgent"
  | "pinned"
  | "event_updates"
  | "opportunities"
  | "reminders"
  | "general"
  | "saved";

export interface NewsFeedRecord {
  post: NewsPost;
  state?: NewsState;
  scope: NewsScopeFilter;
  scopeLabel: string;
  scopeContext: string;
  sourceLabel: string;
  category: Exclude<NewsTypeFilter, "all" | "urgent" | "pinned" | "saved">;
  isUnread: boolean;
  isSaved: boolean;
  isUrgent: boolean;
  isPinned: boolean;
  hasRelatedContent: boolean;
  publishedLabel: string;
  metaLine: string;
  relevanceScore: number;
}

interface BuildNewsFeedInput {
  posts: NewsPost[];
  newsState: NewsState[];
  organizations: Organization[];
  user: User | null;
  eventSaves?: EventSave[];
}

const priorityWeight: Record<NewsPost["priorityLevel"], number> = {
  urgent: 400,
  high: 280,
  medium: 180,
  low: 90
};

const relativeTime = (value: string) => {
  const deltaMs = Date.now() - new Date(value).getTime();
  const deltaHours = Math.max(1, Math.round(deltaMs / (1000 * 60 * 60)));

  if (deltaHours < 24) return `${deltaHours}h ago`;

  const deltaDays = Math.round(deltaHours / 24);
  if (deltaDays < 7) return `${deltaDays}d ago`;

  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const getCategory = (post: NewsPost): NewsFeedRecord["category"] => {
  const haystack = `${post.title} ${post.summary} ${post.body} ${post.topicTags.join(" ")}`.toLowerCase();

  if (post.relatedEventId) return "event_updates";
  if (
    ["deadline", "due", "reminder", "submit", "registration", "check-in", "cutoff", "final call"].some((item) =>
      haystack.includes(item)
    )
  ) {
    return "reminders";
  }
  if (
    ["opportunity", "academy", "apply", "application", "scholarship", "featured", "leadership"].some((item) =>
      haystack.includes(item)
    )
  ) {
    return "opportunities";
  }

  return "general";
};

const resolveScope = (post: NewsPost, user: User | null): NewsScopeFilter => {
  if (post.scopeType === "national" || post.createdByType === "national") return "national";
  if (
    post.scopeType === "chapter" &&
    user?.localChapterId &&
    post.organizationId === user.localChapterId
  ) {
    return "chapter";
  }
  if (
    post.scopeType === "chapter" &&
    post.organizationId !== user?.localChapterId
  ) {
    return "state";
  }
  return "state";
};

const getScopeContext = (post: NewsPost, source?: Organization | null) => {
  if (post.createdByType === "chapter") return source?.shortName ?? "Your chapter";
  if (post.createdByType === "state") return source?.shortName ?? "State chapter";
  return source?.shortName ?? "FBLA National";
};

const getScopeLabel = (scope: NewsScopeFilter) => {
  if (scope === "chapter") return "Chapter";
  if (scope === "state") return "State";
  return "National";
};

const matchesScope = (post: NewsPost, scope: NewsScopeFilter, user: User | null) => {
  if (scope === "chapter") {
    return post.organizationId === user?.localChapterId || post.scopeType === "chapter";
  }
  if (scope === "state") {
    return (
      post.createdByType === "state" ||
      post.scopeType === "state" ||
      post.scopeType === "subdivision" ||
      post.organizationId === user?.stateChapterId ||
      post.organizationId === user?.stateSubdivisionId
    );
  }
  return post.createdByType === "national" || post.scopeType === "national";
};

export const buildNewsFeedRecords = ({
  posts,
  newsState,
  organizations,
  user,
  eventSaves = []
}: BuildNewsFeedInput): NewsFeedRecord[] => {
  const stateMap = new Map(newsState.map((item) => [item.newsPostId, item]));
  const savedEventIds = new Set(eventSaves.map((item) => item.eventId));

  return posts
    .filter((post) => {
      if (!user) return true;
      if (post.createdByType === "national") return true;
      if (post.organizationId === user.localChapterId) return true;
      if (post.organizationId === user.stateChapterId) return true;
      if (user.stateSubdivisionId && post.organizationId === user.stateSubdivisionId) return true;
      return post.scopeType === "national";
    })
    .map((post) => {
      const state = stateMap.get(post.id);
      const source = organizations.find((item) => item.id === post.organizationId);
      const scope = resolveScope(post, user);
      const isUnread = !(state?.isRead ?? false);
      const isSaved = state?.isSaved ?? false;
      const isUrgent = post.priorityLevel === "urgent" || post.priorityLevel === "high";
      const isPinned = post.isPinned;
      const category = getCategory(post);
      const ageHours = Math.max(1, (Date.now() - new Date(post.publishedAt).getTime()) / (1000 * 60 * 60));
      const recencyScore = Math.max(0, 80 - ageHours);
      const relevanceScore =
        priorityWeight[post.priorityLevel] +
        (isPinned ? 220 : 0) +
        (isUnread ? 45 : 0) +
        (isSaved ? 24 : 0) +
        (post.relatedEventId && savedEventIds.has(post.relatedEventId) ? 110 : 0) +
        (scope === "chapter" ? 130 : scope === "state" ? 90 : 40) +
        recencyScore;

      return {
        post,
        state,
        scope,
        scopeLabel: getScopeLabel(scope),
        scopeContext: getScopeContext(post, source),
        sourceLabel: source?.name ?? getScopeContext(post, source),
        category,
        isUnread,
        isSaved,
        isUrgent,
        isPinned,
        hasRelatedContent: Boolean(post.relatedEventId || post.relatedResourceId || post.relatedThreadId),
        publishedLabel: relativeTime(post.publishedAt),
        metaLine: `${getScopeLabel(scope)} • ${relativeTime(post.publishedAt)}`,
        relevanceScore
      };
    })
    .sort((left, right) => right.relevanceScore - left.relevanceScore);
};

export const filterNewsRecords = (
  records: NewsFeedRecord[],
  scope: NewsScopeFilter,
  type: NewsTypeFilter,
  user: User | null
) =>
  records.filter((record) => {
    if (!matchesScope(record.post, scope, user)) return false;
    if (type === "all") return true;
    if (type === "urgent") return record.isUrgent;
    if (type === "pinned") return record.isPinned;
    if (type === "saved") return record.isSaved;
    return record.category === type;
  });

export const getDefaultNewsScope = (records: NewsFeedRecord[], user: User | null): NewsScopeFilter => {
  const scopes: NewsScopeFilter[] = ["chapter", "state", "national"];
  const ranked = scopes
    .map((scope) => ({
      scope,
      score: filterNewsRecords(records, scope, "all", user)
        .slice(0, 3)
        .reduce((sum, item) => sum + item.relevanceScore, 0)
    }))
    .sort((left, right) => right.score - left.score);

  return ranked[0]?.scope ?? "chapter";
};

export const getNewsScopeSubtitle = (user: User | null, scope: NewsScopeFilter) => {
  if (scope === "chapter") return user?.schoolName ? `${user.schoolName} chapter updates` : "Your chapter updates";
  if (scope === "state") return "State and section updates that affect your season";
  return "National programs, deadlines, and official opportunities";
};

export const getNewsEmptyCopy = (scope: NewsScopeFilter, type: NewsTypeFilter) => {
  if (type === "saved") {
    return {
      title: "No saved updates yet",
      body: "Bookmark important announcements to keep deadlines, logistics, and opportunities close."
    };
  }

  const scopeLabel = scope === "chapter" ? "chapter" : scope === "state" ? "state" : "national";
  return {
    title: `Nothing to review in ${scopeLabel} right now`,
    body: "Try another scope or clear a filter to see more official updates."
  };
};
