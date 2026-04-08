import {
  ForumCategory,
  ForumThread,
  ResourceItem,
  StudyTrack,
  User
} from "@/domain/models/types";

export interface CommunityCategoryRecord {
  category: ForumCategory;
  threadCount: number;
  label: string;
  icon: string;
}

export interface CommunityThreadRecord {
  thread: ForumThread;
  category?: ForumCategory;
  categoryLabel: string;
  statusLabel: string;
  statusTone: "active" | "locked" | "moderated";
  preview: string;
  statsLabel: string;
  linkedLabel?: string;
  importance: "featured" | "standard" | "question";
  isStudyRelated: boolean;
  isFollowed: boolean;
}

const iconMap: Record<string, string> = {
  "Competition Discussion": "trophy-outline",
  "Study Support": "school-outline",
  "General Questions": "help-circle-outline",
  "Event Preparation": "calendar-outline",
  "Chapter Life": "people-outline",
  "Conference Discussion": "business-outline",
  "Resource Help": "document-text-outline",
  "Announcements Discussion": "megaphone-outline"
};

export const buildCommunityCategories = (
  categories: ForumCategory[],
  threads: ForumThread[]
): CommunityCategoryRecord[] =>
  categories.map((category) => ({
    category,
    threadCount: threads.filter((item) => item.categoryId === category.id).length,
    label: category.name,
    icon: iconMap[category.name] ?? "chatbubble-ellipses-outline"
  }));

export const buildCommunityThreadRecords = (
  threads: ForumThread[],
  categories: ForumCategory[],
  followedThreadIds: string[] = []
): CommunityThreadRecord[] =>
  [...threads]
    .sort((left, right) => new Date(right.lastActivityAt).getTime() - new Date(left.lastActivityAt).getTime())
    .map((thread, index) => {
      const category = categories.find((item) => item.id === thread.categoryId);
      const statusTone =
        thread.status === "locked"
          ? "locked"
          : thread.status === "pending_review" || thread.status === "hidden"
            ? "moderated"
            : "active";

      const importance =
        thread.helpfulCount >= 7 || index === 0
          ? "featured"
          : thread.threadType === "question" || thread.replyCount === 0
            ? "question"
            : "standard";

      return {
        thread,
        category,
        categoryLabel: category?.name ?? "Discussion",
        statusLabel:
          thread.status === "locked"
            ? "Locked"
            : thread.status === "pending_review"
              ? "Pending review"
              : thread.replyCount === 0
                ? "Needs reply"
                : "Active",
        statusTone,
        preview: thread.body,
        statsLabel: `${thread.replyCount} repl${thread.replyCount === 1 ? "y" : "ies"} • ${thread.helpfulCount} helpful`,
        linkedLabel: thread.relatedEventId
          ? "Linked event"
          : thread.relatedResourceId
            ? "Linked resource"
            : thread.relatedStudyTrackId
              ? "Linked study"
              : undefined,
        importance,
        isStudyRelated: thread.threadType === "study_help" || thread.tags.some((tag) => tag.toLowerCase().includes("study")),
        isFollowed: followedThreadIds.includes(thread.id)
      };
    });

export const filterCommunityThreads = (
  records: CommunityThreadRecord[],
  query: string,
  categoryId?: string | null
) => {
  const needle = query.trim().toLowerCase();

  return records.filter((record) => {
    const matchesCategory = !categoryId || record.thread.categoryId === categoryId;
    const matchesQuery =
      !needle ||
      record.thread.title.toLowerCase().includes(needle) ||
      record.thread.body.toLowerCase().includes(needle) ||
      record.thread.tags.some((tag) => tag.toLowerCase().includes(needle));

    return matchesCategory && matchesQuery;
  });
};

export const getFeaturedCommunityThreads = (records: CommunityThreadRecord[]) =>
  records.filter((item) => item.importance === "featured").slice(0, 3);

export const getRecommendedCommunityThreads = (
  records: CommunityThreadRecord[],
  user: User | null,
  resources: ResourceItem[],
  studyTracks: StudyTrack[]
) => {
  const interests = [...(user?.competitionInterests ?? []), ...(user?.generalInterests ?? [])];
  return records
    .filter(
      (item) =>
        item.thread.tags.some((tag) =>
          interests.some((interest) => tag.toLowerCase().includes(interest.split(" ")[0].toLowerCase()))
        ) ||
        resources.some((resource) => resource.id === item.thread.relatedResourceId) ||
        studyTracks.some((track) => track.id === item.thread.relatedStudyTrackId)
    )
    .slice(0, 3);
};

export const getThreadEmptyCopy = (query: string) =>
  query.trim()
    ? {
        title: "No discussions match this search",
        body: "Try a broader keyword or open a category to find a different conversation."
      }
    : {
        title: "No threads here yet",
        body: "This category is quiet right now. Start the first conversation and give other members a place to respond."
      };

export const getReplyComposerPlaceholder = (thread: ForumThread) =>
  thread.status === "locked"
    ? "This thread is locked."
    : thread.threadType === "question"
      ? "Share the clearest answer or next step."
      : "Add a helpful reply, tip, or clarification.";

export const getLinkedThreadItems = (
  thread: ForumThread,
  resources: ResourceItem[],
  studyTracks: StudyTrack[]
) => ({
  relatedResource: resources.find((item) => item.id === thread.relatedResourceId),
  relatedStudyTrack: studyTracks.find((item) => item.id === thread.relatedStudyTrackId)
});
