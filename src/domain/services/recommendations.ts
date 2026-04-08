import {
  DemoDataset,
  EventItem,
  HomeBundle,
  RecommendationBundle,
  User
} from "@/domain/models/types";
import { isUpcoming } from "@/utils/time";

const scoreEvent = (event: EventItem, user: User, savedEventIds: string[]) => {
  let score = 0;
  if (savedEventIds.includes(event.id)) score += 5;
  if (event.scopeType === "chapter") score += 4;
  if (event.scopeType === "state") score += 3;
  if (user.competitionInterests.some((interest) => event.title.toLowerCase().includes(interest.split(" ")[0]))) {
    score += 4;
  }
  if (event.eventType === "competitive_deadline") score += 5;
  return score;
};

export const buildRecommendationBundle = (dataset: DemoDataset): RecommendationBundle => {
  const savedEventIds = dataset.eventSaves.map((save) => save.eventId);
  const savedResourceIds = dataset.resourceState.filter((item) => item.isSaved).map((item) => item.resourceId);
  const activeWeakTopics = dataset.studyProgress.flatMap((progress) => progress.weakTopics);
  const followedThreads = dataset.forumFollows.map((follow) => follow.threadId);

  const recommendedEventIds = [...dataset.events]
    .filter((event) => isUpcoming(event.startTime))
    .sort((a, b) => scoreEvent(b, dataset.user, savedEventIds) - scoreEvent(a, dataset.user, savedEventIds))
    .slice(0, 3)
    .map((event) => event.id);

  const suggestedStudyTrackIds = dataset.studyTracks
    .filter(
      (track) =>
        savedEventIds.includes(track.relatedEventId ?? "") ||
        track.tags.some((tag) => activeWeakTopics.some((topic) => tag.includes(topic.split(" ")[0])))
    )
    .slice(0, 3)
    .map((track) => track.id);

  const relatedResourceIds = dataset.resources
    .filter(
      (resource) =>
        savedResourceIds.includes(resource.id) ||
        resource.tags.some((tag) =>
          [...dataset.user.generalInterests, ...dataset.user.competitionInterests].some((interest) =>
            tag.includes(interest.split(" ")[0])
          )
        )
    )
    .slice(0, 4)
    .map((resource) => resource.id);

  const relevantDiscussionIds = dataset.forumThreads
    .filter(
      (thread) =>
        followedThreads.includes(thread.id) ||
        savedEventIds.includes(thread.relatedEventId ?? "") ||
        thread.tags.some((tag) => dataset.user.competitionInterests.some((interest) => tag.includes(interest.split(" ")[0])))
    )
    .slice(0, 4)
    .map((thread) => thread.id);

  const importantUpdateIds = dataset.newsPosts
    .filter(
      (post) =>
        post.isPinned ||
        post.priorityLevel === "urgent" ||
        savedEventIds.includes(post.relatedEventId ?? "")
    )
    .slice(0, 4)
    .map((post) => post.id);

  return {
    recommendedEventIds,
    suggestedStudyTrackIds,
    relatedResourceIds,
    relevantDiscussionIds,
    importantUpdateIds,
    priorities: [
      "Finalize your competition submission package.",
      "Review validation and architecture talking points before your next mock demo.",
      "Check travel logistics for upcoming conference milestones."
    ]
  };
};

export const buildHomeBundle = (dataset: DemoDataset): HomeBundle => {
  const recommendationBundle = buildRecommendationBundle(dataset);
  const nextUp = [...dataset.events]
    .filter((event) => isUpcoming(event.startTime))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];

  const studyFocus = dataset.studyTracks.find(
    (track) => track.id === recommendationBundle.suggestedStudyTrackIds[0]
  );

  return {
    nextUp,
    priorities: recommendationBundle.priorities,
    studyFocus,
    recentAnnouncements: [...dataset.newsPosts]
      .sort((a, b) => {
        const aPriority = (a.isPinned ? 5 : 0) + (a.priorityLevel === "urgent" ? 4 : a.priorityLevel === "high" ? 3 : a.priorityLevel === "medium" ? 2 : 1);
        const bPriority = (b.isPinned ? 5 : 0) + (b.priorityLevel === "urgent" ? 4 : b.priorityLevel === "high" ? 3 : b.priorityLevel === "medium" ? 2 : 1);
        if (bPriority !== aPriority) return bPriority - aPriority;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      })
      .slice(0, 4),
    recommendedResources: recommendationBundle.relatedResourceIds
      .map((id) => dataset.resources.find((resource) => resource.id === id))
      .filter((resource): resource is NonNullable<typeof resource> => Boolean(resource)),
    communityActivity: [...dataset.forumThreads]
      .filter((thread) => recommendationBundle.relevantDiscussionIds.includes(thread.id))
      .sort((a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()),
    socialHighlights: [...dataset.socialHighlights]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 3),
    momentumSnapshot: {
      savedEvents: dataset.eventSaves.length,
      savedResources: dataset.resourceState.filter((item) => item.isSaved).length,
      studyProgress: dataset.studyProgress[0]?.progressPercent ?? 0,
      discussionParticipation: dataset.forumReplies.length,
      bookmarks:
        dataset.resourceState.filter((item) => item.isSaved).length +
        dataset.eventSaves.length +
        dataset.newsState.filter((item) => item.isSaved).length
    },
    recommendationBundle
  };
};
