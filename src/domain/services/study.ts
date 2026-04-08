import {
  EventItem,
  ForumThread,
  HomeBundle,
  QuizAttempt,
  ResourceItem,
  StudyProgress,
  StudyTrack,
  StudyUnit,
  User
} from "@/domain/models/types";
import { hasStudyPracticeContent } from "@/domain/services/studyPractice";

export interface StudyMetric {
  label: string;
  value: string;
  tone: "gold" | "sky" | "teal";
}

export interface StudyMasteryItem {
  topic: string;
  score: number;
  state: "strong" | "steady" | "weak";
}

export interface StudyModeAction {
  id: string;
  label: string;
  caption: string;
  icon: string;
  route: { name: string; params?: Record<string, string | undefined> };
}

export interface StudyRecommendation {
  id: string;
  kind: "track" | "resource" | "discussion";
  title: string;
  caption: string;
  meta: string;
  route: { name: string; params?: Record<string, string | undefined> };
}

export interface StudyRecentItem {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  meta: string;
  route: { name: string; params?: Record<string, string | undefined> };
}

export interface StudyDashboard {
  title: string;
  subtitle: string;
  hero: {
    title: string;
    summary: string;
    progressPercent: number;
    readinessLabel: string;
    primaryActionLabel: string;
    secondaryActionLabel: string;
    primaryRoute: { name: string; params?: Record<string, string> };
    secondaryRoute: { name: string; params?: Record<string, string> };
  } | null;
  readinessScore: number;
  readinessSummary: string;
  weeklyActivity: { day: string; value: number }[];
  accuracyTrend: number[];
  metrics: StudyMetric[];
  mastery: StudyMasteryItem[];
  weakest: StudyMasteryItem[];
  strongest: StudyMasteryItem[];
  suggestedTopic?: StudyMasteryItem | null;
  modes: StudyModeAction[];
  recommendations: StudyRecommendation[];
  activeTracks: StudyRecentItem[];
  recentSessions: StudyRecentItem[];
}

interface BuildStudyDashboardInput {
  user: User | null;
  home: HomeBundle | undefined;
  tracks: StudyTrack[];
  units: StudyUnit[];
  progress: StudyProgress[];
  quizAttempts: QuizAttempt[];
  resources: ResourceItem[];
  events: EventItem[];
  threads: ForumThread[];
}

const labelize = (value: string) =>
  value
    .split(/[_-]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatShortDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });

const average = (values: number[]) => (values.length ? Math.round(values.reduce((sum, item) => sum + item, 0) / values.length) : 0);

const buildPrimaryStudyRoute = (
  trackId: string,
  unit?: StudyUnit | null
): { name: string; params: Record<string, string> } => {
  if (unit && (unit.unitType === "flashcards" || unit.unitType === "quiz") && hasStudyPracticeContent(unit.id)) {
    return { name: "StudyPracticeDetail", params: { studyUnitId: unit.id } };
  }

  return { name: "StudyTrackDetail", params: { studyTrackId: trackId, focusUnitId: unit?.id ?? "" } };
};

const buildWeeklyActivity = (progress: StudyProgress[], quizAttempts: QuizAttempt[]) => {
  const days = [...Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return {
      date,
      key: date.toISOString().slice(0, 10),
      day: date.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 1),
      value: 0
    };
  })];

  const bump = (value?: string | null, amount = 1) => {
    if (!value) return;
    const key = new Date(value).toISOString().slice(0, 10);
    const target = days.find((item) => item.key === key);
    if (target) target.value += amount;
  };

  progress.forEach((item) => bump(item.lastOpenedAt, 2));
  quizAttempts.forEach((item) => bump(item.attemptedAt, 1));

  return days.map(({ day, value }) => ({ day, value }));
};

const buildStreak = (progress: StudyProgress[], quizAttempts: QuizAttempt[]) => {
  const activeDays = Array.from(
    new Set(
      [...progress.map((item) => item.lastOpenedAt), ...quizAttempts.map((item) => item.attemptedAt)]
        .filter(Boolean)
        .map((item) => new Date(item as string).toISOString().slice(0, 10))
    )
  ).sort((left, right) => new Date(right).getTime() - new Date(left).getTime());

  if (!activeDays.length) return 0;

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (const key of activeDays) {
    const currentKey = cursor.toISOString().slice(0, 10);
    if (key !== currentKey) {
      if (streak === 0) {
        cursor.setDate(cursor.getDate() - 1);
        if (key !== cursor.toISOString().slice(0, 10)) break;
      } else {
        break;
      }
    }
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

export const buildStudyDashboard = ({
  user,
  home,
  tracks,
  units,
  progress,
  quizAttempts,
  resources,
  events,
  threads
}: BuildStudyDashboardInput): StudyDashboard => {
  const activeProgress = [...progress].sort(
    (left, right) =>
      new Date(right.lastOpenedAt ?? 0).getTime() - new Date(left.lastOpenedAt ?? 0).getTime()
  )[0];
  const activeTrack =
    tracks.find((item) => item.id === activeProgress?.studyTrackId) ??
    home?.studyFocus ??
    tracks[0] ??
    null;
  const activeTrackProgress = progress.find((item) => item.studyTrackId === activeTrack?.id) ?? null;
  const activeTrackUnits = units
    .filter((item) => item.studyTrackId === activeTrack?.id)
    .sort((left, right) => left.sequenceOrder - right.sequenceOrder);
  const nextUnit =
    activeTrackUnits.find((item) => item.id === activeTrackProgress?.nextRecommendedUnitId) ??
    activeTrackUnits[0] ??
    null;
  const averageAccuracy = average(quizAttempts.map((item) => item.scorePercent));
  const completedTracks = progress.filter((item) => item.completedAt || item.progressPercent >= 100).length;
  const streak = buildStreak(progress, quizAttempts);
  const weeklyActivity = buildWeeklyActivity(progress, quizAttempts);
  const weeklyMinutes = weeklyActivity.reduce((sum, item) => sum + item.value * 12, 0);
  const activeWeakTopics = progress.flatMap((item) => item.weakTopics);
  const missedTopics = quizAttempts.flatMap((item) => item.missedTopicTags);

  const topicSeed = new Map<string, number>();
  activeTrack?.tags.forEach((tag) => topicSeed.set(tag, 76));
  activeWeakTopics.forEach((topic) => topicSeed.set(topic, Math.min(topicSeed.get(topic) ?? 70, 42)));
  missedTopics.forEach((topic) => topicSeed.set(topic, Math.min(topicSeed.get(topic) ?? 68, 48)));
  user?.competitionInterests.forEach((topic) => {
    if (!topicSeed.has(topic)) topicSeed.set(topic, 64);
  });

  const mastery = Array.from(topicSeed.entries())
    .map(([topic, score]) => {
      const improvedScore =
        score +
        Math.min(12, Math.round((activeTrackProgress?.progressPercent ?? 0) / 10)) +
        Math.max(0, Math.round((averageAccuracy - 70) / 4));
      const normalized = Math.max(28, Math.min(96, improvedScore));
      return {
        topic,
        score: normalized,
        state: normalized >= 78 ? "strong" : normalized >= 58 ? "steady" : "weak"
      } as StudyMasteryItem;
    })
    .sort((left, right) => right.score - left.score);

  const strongest = mastery.slice(0, 3);
  const weakest = [...mastery].reverse().slice(0, 3).reverse();
  const suggestedTopic = weakest[0] ?? mastery[0] ?? null;

  const readinessScore = Math.max(
    32,
    Math.min(
      96,
      Math.round(
        (activeTrackProgress?.progressPercent ?? 45) * 0.5 +
          averageAccuracy * 0.3 +
          (activeWeakTopics.length ? 18 : 24) +
          (streak >= 3 ? 8 : 2)
      )
    )
  );

  const readinessSummary =
    readinessScore >= 82
      ? "Your prep is in a strong place. Tighten one weak topic and do a final confidence pass."
      : readinessScore >= 68
        ? "You have real momentum. Focus on weak topics and one scored quiz to lift readiness fast."
        : "Your foundation is started. A focused review sprint will move readiness quickly this week.";

  const upcomingEvent = activeTrack?.relatedEventId
    ? events.find((item) => item.id === activeTrack.relatedEventId)
    : undefined;

  const recommendations: StudyRecommendation[] = [
    ...tracks
      .filter((item) => home?.recommendationBundle.suggestedStudyTrackIds.includes(item.id))
      .slice(0, 2)
      .map((track) => ({
        id: `track-${track.id}`,
        kind: "track" as const,
        title: track.title,
        caption: track.description,
        meta: `${track.estimatedTotalMinutes} min • ${labelize(track.trackType)}`,
        route: { name: "StudyTrackDetail", params: { studyTrackId: track.id } }
      })),
    ...resources
      .filter((item) => home?.recommendedResources.some((resource) => resource.id === item.id))
      .slice(0, 1)
      .map((resource) => ({
        id: `resource-${resource.id}`,
        kind: "resource" as const,
        title: resource.title,
        caption: resource.summary,
        meta: `${resource.estimatedReadMinutes} min • ${resource.category}`,
        route: { name: "ResourceDetail", params: { resourceId: resource.id } }
      })),
    ...threads
      .filter((item) => item.relatedStudyTrackId && item.relatedStudyTrackId === activeTrack?.id)
      .slice(0, 1)
      .map((thread) => ({
        id: `thread-${thread.id}`,
        kind: "discussion" as const,
        title: thread.title,
        caption: thread.body,
        meta: `${thread.replyCount} replies • ${formatShortDate(thread.lastActivityAt)}`,
        route: { name: "ThreadDetail", params: { threadId: thread.id } }
      }))
  ].slice(0, 3);

  const modes: StudyModeAction[] = [
    {
      id: "flashcards",
      label: "Flashcards",
      caption: "Fast recall set",
      icon: "albums-outline",
      route: { name: "StudyPracticeBrowser", params: { mode: "flashcards" } }
    },
    {
      id: "quiz",
      label: "Quiz",
      caption: averageAccuracy ? `${averageAccuracy}% avg accuracy` : "Score your understanding",
      icon: "help-circle-outline",
      route: { name: "StudyPracticeBrowser", params: { mode: "quiz" } }
    },
    {
      id: "review",
      label: "Review",
      caption: suggestedTopic ? suggestedTopic.topic : "Weak areas first",
      icon: "sparkles-outline",
      route: { name: "StudyTrackDetail", params: { studyTrackId: activeTrack?.id ?? tracks[0]?.id ?? "", focusTopic: suggestedTopic?.topic ?? "" } }
    },
    {
      id: "checklist",
      label: "Checklist",
      caption: upcomingEvent ? "Event prep flow" : "Finish strong",
      icon: "checkmark-done-outline",
      route: { name: "StudyTrackDetail", params: { studyTrackId: activeTrack?.id ?? tracks[0]?.id ?? "", focusUnitType: "checklist" } }
    }
  ].filter(
    (item) =>
      item.route.name === "StudyPracticeBrowser" ||
      Boolean(item.route.params?.studyTrackId)
  );

  const activeTracks: StudyRecentItem[] = tracks
    .map((track) => {
      const itemProgress = progress.find((entry) => entry.studyTrackId === track.id);
      return {
        track,
        itemProgress
      };
    })
    .sort((left, right) => (right.itemProgress?.progressPercent ?? 0) - (left.itemProgress?.progressPercent ?? 0))
    .slice(0, 2)
    .map(({ track, itemProgress }) => ({
      id: track.id,
      eyebrow: itemProgress ? "Active track" : "Suggested track",
      title: track.title,
      summary: track.description,
      meta: `${itemProgress?.progressPercent ?? 0}% complete • ${track.estimatedTotalMinutes} min`,
      route: { name: "StudyTrackDetail", params: { studyTrackId: track.id } }
    }));

  const recentSessions: StudyRecentItem[] = [
    ...quizAttempts.slice(0, 2).map((attempt) => {
      const unit = units.find((item) => item.id === attempt.studyUnitId);
      const track = tracks.find((item) => item.id === unit?.studyTrackId);
      return {
        id: attempt.id,
        eyebrow: "Recent quiz",
        title: unit?.title ?? "Quiz session",
        summary: track?.title ?? "Study track",
        meta: `${attempt.scorePercent}% • ${formatShortDate(attempt.attemptedAt)}`,
        route: { name: "StudyTrackDetail", params: { studyTrackId: track?.id ?? activeTrack?.id ?? "" } }
      };
    }),
    ...progress.slice(0, 1).map((item) => {
      const track = tracks.find((entry) => entry.id === item.studyTrackId);
      return {
        id: item.id,
        eyebrow: "Continue session",
        title: track?.title ?? "Study track",
        summary: item.weakTopics.length ? `Needs review: ${item.weakTopics[0]}` : "Pick up where you left off",
        meta: `${item.progressPercent}% • ${formatShortDate(item.lastOpenedAt ?? new Date().toISOString())}`,
        route: { name: "StudyTrackDetail", params: { studyTrackId: item.studyTrackId } }
      };
    })
  ].filter((item) => item.route.params?.studyTrackId).slice(0, 3);

  return {
    title: "Study",
    subtitle: activeTrack
      ? `${streak ? `${streak}-day streak` : "Fresh week"} • ${activeTrack.title}`
      : "Your personalized prep command center",
    hero: activeTrack
      ? {
          title: nextUnit ? `Continue ${activeTrack.title}` : activeTrack.title,
          summary: nextUnit
            ? `${nextUnit.title} is the best next move${upcomingEvent ? ` before ${upcomingEvent.title}` : ""}.`
            : activeTrack.description,
          progressPercent: activeTrackProgress?.progressPercent ?? 0,
          readinessLabel: `${readinessScore}% readiness`,
          primaryActionLabel: nextUnit?.unitType === "quiz" ? "Start quiz" : "Continue",
          secondaryActionLabel: suggestedTopic ? `Review ${suggestedTopic.topic}` : "Ask AI",
          primaryRoute: buildPrimaryStudyRoute(activeTrack.id, nextUnit),
          secondaryRoute: suggestedTopic
            ? { name: "StudyTrackDetail", params: { studyTrackId: activeTrack.id, focusTopic: suggestedTopic.topic } }
            : { name: "AI" }
        }
      : null,
    readinessScore,
    readinessSummary,
    weeklyActivity,
    accuracyTrend: quizAttempts.slice(0, 5).map((item) => item.scorePercent).reverse(),
    metrics: [
      { label: "Streak", value: `${streak}d`, tone: "gold" },
      { label: "Accuracy", value: averageAccuracy ? `${averageAccuracy}%` : "--", tone: "sky" },
      { label: "Finished", value: `${completedTracks}`, tone: "teal" },
      { label: "This week", value: `${weeklyMinutes}m`, tone: "gold" }
    ],
    mastery,
    weakest,
    strongest,
    suggestedTopic,
    modes,
    recommendations,
    activeTracks,
    recentSessions
  };
};
