import {
  EventItem,
  ForumThread,
  HomeBundle,
  NewsPost,
  Organization,
  ResourceItem,
  SocialHighlight,
  StudyTrack,
  User
} from "@/domain/models/types";
import { formatDateTime, formatMonthDay } from "@/utils/time";

export type HomeHeroType = "announcement" | "event" | "study" | "fallback";

export interface HomeHero {
  type: HomeHeroType;
  title: string;
  summary: string;
  meta: string;
  badge: string;
  primaryLabel: string;
  primaryRoute: { name: string; params?: Record<string, string | undefined> };
  secondaryLabel?: string;
  secondaryRoute?: { name: string; params?: Record<string, string | undefined> };
}

const priorityWeight = (post: NewsPost) => {
  const base =
    post.priorityLevel === "urgent"
      ? 4
      : post.priorityLevel === "high"
        ? 3
        : post.priorityLevel === "medium"
          ? 2
          : 1;

  return base + (post.isPinned ? 3 : 0);
};

export const buildHomeHero = (bundle: HomeBundle | undefined): HomeHero => {
  const announcements = [...(bundle?.recentAnnouncements ?? [])].sort(
    (a, b) => priorityWeight(b) - priorityWeight(a)
  );
  const urgentAnnouncement = announcements.find(
    (post) => post.isPinned || post.priorityLevel === "urgent" || post.priorityLevel === "high"
  );

  if (urgentAnnouncement) {
    return {
      type: "announcement",
      title: urgentAnnouncement.title,
      summary: urgentAnnouncement.summary,
      meta: formatDateTime(urgentAnnouncement.publishedAt),
      badge: urgentAnnouncement.isPinned ? "Pinned update" : `${urgentAnnouncement.priorityLevel} priority`,
      primaryLabel: "Read update",
      primaryRoute: { name: "NewsDetail", params: { newsPostId: urgentAnnouncement.id } },
      secondaryLabel: urgentAnnouncement.relatedEventId ? "View event" : "Ask AI",
      secondaryRoute: urgentAnnouncement.relatedEventId
        ? { name: "EventDetail", params: { eventId: urgentAnnouncement.relatedEventId } }
        : { name: "AI" }
    };
  }

  if (bundle?.nextUp && "startTime" in bundle.nextUp) {
    const event = bundle.nextUp as EventItem;
    return {
      type: "event",
      title: event.title,
      summary: event.description,
      meta: `${formatMonthDay(event.startTime)} • ${event.locationName}`,
      badge: event.eventType === "competitive_deadline" ? "Deadline" : "Next event",
      primaryLabel: "View event",
      primaryRoute: { name: "EventDetail", params: { eventId: event.id } },
      secondaryLabel: "My schedule",
      secondaryRoute: { name: "Events" }
    };
  }

  if (bundle?.studyFocus) {
    return {
      type: "study",
      title: bundle.studyFocus.title,
      summary: bundle.studyFocus.description,
      meta: `${bundle.studyFocus.estimatedTotalMinutes} min path`,
      badge: "Continue study",
      primaryLabel: "Continue",
      primaryRoute: { name: "StudyTrackDetail", params: { studyTrackId: bundle.studyFocus.id } },
      secondaryLabel: "Ask AI",
      secondaryRoute: { name: "AI" }
    };
  }

  return {
    type: "fallback",
    title: "Start your next prep block",
    summary: "Open study, review your schedule, or use AI to build a focused plan for the week.",
    meta: "No urgent blockers right now",
    badge: "Recommended next step",
    primaryLabel: "Open study",
    primaryRoute: { name: "Study" },
    secondaryLabel: "Ask AI",
    secondaryRoute: { name: "AI" }
  };
};

export const buildHomeContextLine = ({
  user,
  organizations,
  bundle
}: {
  user: User | null;
  organizations: Organization[];
  bundle: HomeBundle | undefined;
}) => {
  if (!user) return "FBLA Central";

  const chapter = organizations.find((item) => item.id === user.localChapterId)?.shortName;
  const state = organizations.find((item) => item.id === user.stateChapterId)?.shortName;
  const priorityCount = [
    ...(bundle?.priorities ?? []).slice(0, 2),
    ...(bundle?.recentAnnouncements ?? []).filter((item) => item.isPinned || item.priorityLevel === "urgent")
  ].length;

  if (priorityCount > 0 && chapter && state) {
    return `${chapter} • ${state} • ${priorityCount} priorities active`;
  }

  if (chapter && state) {
    return `${chapter} • ${state}`;
  }

  return user.schoolName;
};

export const buildMomentumMessage = ({
  hero,
  studyFocus,
  resources,
  threads,
  highlights
}: {
  hero: HomeHero;
  studyFocus: StudyTrack | null;
  resources: ResourceItem[];
  threads: ForumThread[];
  highlights: SocialHighlight[];
}) => {
  if (hero.type === "event" && studyFocus) {
    return {
      title: "Because this deadline is coming up",
      body: `Your best next move is ${studyFocus.title.toLowerCase()} before ${resources[0]?.title ?? "reviewing your materials"}.`,
      actionLabel: "Open study",
      route: { name: "StudyTrackDetail", params: { studyTrackId: studyFocus.id } }
    };
  }

  if (threads[0]) {
    return {
      title: "Need a second opinion?",
      body: `A relevant thread is active right now: "${threads[0].title}".`,
      actionLabel: "Open discussion",
      route: { name: "ThreadDetail", params: { threadId: threads[0].id } }
    };
  }

  if (highlights[0]) {
    return {
      title: "Stay in the loop",
      body: highlights[0].title,
      actionLabel: "Open social hub",
      route: { name: "SocialHub" }
    };
  }

  return {
    title: "Keep momentum going",
    body: "Use AI to turn this week’s priorities into a simple prep plan.",
    actionLabel: "Ask AI",
    route: { name: "AI" }
  };
};
