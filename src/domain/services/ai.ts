import {
  AIContextType,
  DemoDataset,
  EventItem,
  ForumThread,
  NewsPost,
  ResourceItem,
  StudyTrack
} from "@/domain/models/types";

export interface AIContextRecord {
  contextId?: string | null;
  type: AIContextType;
  title: string;
  subtitle: string;
  badgeLabel: string;
  icon: string;
}

export interface AIQuickAction {
  id: string;
  label: string;
  prompt: string;
  icon: string;
}

export interface AIResolvedSource {
  id: string;
  type: string;
  title: string;
  eyebrow: string;
  summary: string;
  meta: string;
  routeName?: string;
  routeParams?: Record<string, string>;
}

const findContext = (
  contextId: string | null | undefined,
  events: EventItem[],
  resources: ResourceItem[],
  studyTracks: StudyTrack[],
  forumThreads: ForumThread[],
  newsPosts: NewsPost[]
) => {
  if (!contextId) return null;

  const event = events.find((item) => item.id === contextId);
  if (event) return { type: "event" as const, item: event };

  const resource = resources.find((item) => item.id === contextId);
  if (resource) return { type: "resource" as const, item: resource };

  const study = studyTracks.find((item) => item.id === contextId);
  if (study) return { type: "study" as const, item: study };

  const forum = forumThreads.find((item) => item.id === contextId);
  if (forum) return { type: "forum" as const, item: forum };

  const news = newsPosts.find((item) => item.id === contextId);
  if (news) return { type: "news" as const, item: news };

  return null;
};

export const inferAIContext = ({
  contextId,
  events,
  resources,
  studyTracks,
  forumThreads,
  newsPosts
}: {
  contextId?: string | null;
  events: EventItem[];
  resources: ResourceItem[];
  studyTracks: StudyTrack[];
  forumThreads: ForumThread[];
  newsPosts: NewsPost[];
}): AIContextRecord | null => {
  const context = findContext(contextId, events, resources, studyTracks, forumThreads, newsPosts);
  if (!context) return null;

  if (context.type === "event") {
    return {
      contextId,
      type: "event",
      title: context.item.title,
      subtitle: "Ask for deadlines, logistics, event prep, or next steps tied to this event.",
      badgeLabel: "Event context",
      icon: "calendar-outline"
    };
  }

  if (context.type === "resource") {
    return {
      contextId,
      type: "resource",
      title: context.item.title,
      subtitle: "Use this source for summaries, study help, flashcards, or related guidance.",
      badgeLabel: "Resource context",
      icon: "document-text-outline"
    };
  }

  if (context.type === "study") {
    return {
      contextId,
      type: "study",
      title: context.item.title,
      subtitle: "Turn this track into a focused prep plan, quiz flow, or weak-area review.",
      badgeLabel: "Study context",
      icon: "school-outline"
    };
  }

  if (context.type === "forum") {
    return {
      contextId,
      type: "forum",
      title: context.item.title,
      subtitle: "Get a clean summary, draft a helpful reply, or identify the clearest next answer.",
      badgeLabel: "Discussion context",
      icon: "chatbubble-ellipses-outline"
    };
  }

  return {
    contextId,
    type: "news",
    title: context.item.title,
    subtitle: "Ask what changed, what matters now, and what action to take next.",
    badgeLabel: "News context",
    icon: "megaphone-outline"
  };
};

export const getAIQuickActions = (context: AIContextRecord | null): AIQuickAction[] => {
  if (!context) {
    return [
      {
        id: "study-plan",
        label: "Build a study plan",
        prompt: "Create a study plan for my next FBLA priority.",
        icon: "calendar-clear-outline"
      },
      {
        id: "find-resource",
        label: "Find the right resource",
        prompt: "What resource should I open first for my next competition or deadline?",
        icon: "search-outline"
      },
      {
        id: "next-step",
        label: "What should I do next?",
        prompt: "What should I do next in FBLA Central this week?",
        icon: "sparkles-outline"
      },
      {
        id: "quiz-me",
        label: "Quiz me",
        prompt: "Quiz me on an FBLA topic I should be reviewing right now.",
        icon: "help-circle-outline"
      }
    ];
  }

  if (context.type === "event") {
    return [
      {
        id: "event-explain",
        label: "Explain this event",
        prompt: `Explain ${context.title} in a simple way and tell me what matters most.`,
        icon: "information-circle-outline"
      },
      {
        id: "event-plan",
        label: "Prep checklist",
        prompt: `Create a preparation checklist for ${context.title}.`,
        icon: "checkmark-done-outline"
      },
      {
        id: "event-next",
        label: "Next steps",
        prompt: `What should I do next for ${context.title}?`,
        icon: "arrow-forward-outline"
      }
    ];
  }

  if (context.type === "resource") {
    return [
      {
        id: "resource-summary",
        label: "Summarize this",
        prompt: `Summarize this resource and tell me the most important takeaways.`,
        icon: "reader-outline"
      },
      {
        id: "resource-flashcards",
        label: "Make flashcards",
        prompt: `Turn this resource into a short flashcard set.`,
        icon: "albums-outline"
      },
      {
        id: "resource-related",
        label: "Find related help",
        prompt: `What should I open after this resource?`,
        icon: "link-outline"
      }
    ];
  }

  if (context.type === "study") {
    return [
      {
        id: "study-plan",
        label: "Study plan",
        prompt: `Create a focused study plan for ${context.title}.`,
        icon: "calendar-outline"
      },
      {
        id: "study-quiz",
        label: "Quiz me",
        prompt: `Quiz me on ${context.title}.`,
        icon: "help-outline"
      },
      {
        id: "study-review",
        label: "Weak areas",
        prompt: `What should I review first in ${context.title}?`,
        icon: "trending-up-outline"
      }
    ];
  }

  if (context.type === "forum") {
    return [
      {
        id: "forum-summary",
        label: "Summarize thread",
        prompt: "Summarize this thread and tell me the clearest answer so far.",
        icon: "list-outline"
      },
      {
        id: "forum-reply",
        label: "Draft a reply",
        prompt: "Draft a helpful reply for this thread.",
        icon: "create-outline"
      },
      {
        id: "forum-next",
        label: "What would help most?",
        prompt: "What follow-up question or next step would help this thread most?",
        icon: "sparkles-outline"
      }
    ];
  }

  return [
    {
      id: "news-summary",
      label: "Explain this update",
      prompt: "Explain this update in simple terms.",
      icon: "newspaper-outline"
    },
    {
      id: "news-action",
      label: "Action to take",
      prompt: "What action should I take after reading this update?",
      icon: "flag-outline"
    },
    {
      id: "news-deadline",
      label: "What matters now?",
      prompt: "What matters most in this announcement right now?",
      icon: "time-outline"
    }
  ];
};

export const resolveAISourceLinks = ({
  sourceLinks,
  events,
  resources,
  newsPosts,
  studyTracks,
  forumThreads
}: {
  sourceLinks: { label: string; type: string; id: string }[];
  events: EventItem[];
  resources: ResourceItem[];
  newsPosts: NewsPost[];
  studyTracks: StudyTrack[];
  forumThreads: ForumThread[];
}): AIResolvedSource[] =>
  sourceLinks.flatMap<AIResolvedSource>((link) => {
    if (link.type === "event") {
      const item = events.find((event) => event.id === link.id);
      if (!item) return [];
      return [{
        id: link.id,
        type: link.type,
        title: item.title,
        eyebrow: "Event",
        summary: item.locationName,
        meta: "Open event details",
        routeName: "EventDetail",
        routeParams: { eventId: item.id }
      }];
    }

    if (link.type === "resource") {
      const item = resources.find((resource) => resource.id === link.id);
      if (!item) return [];
      return [{
        id: link.id,
        type: link.type,
        title: item.title,
        eyebrow: "Resource",
        summary: item.summary,
        meta: item.category,
        routeName: "ResourceDetail",
        routeParams: { resourceId: item.id }
      }];
    }

    if (link.type === "news_post") {
      const item = newsPosts.find((post) => post.id === link.id);
      if (!item) return [];
      return [{
        id: link.id,
        type: link.type,
        title: item.title,
        eyebrow: "News",
        summary: item.summary,
        meta: item.priorityLevel,
        routeName: "NewsDetail",
        routeParams: { newsPostId: item.id }
      }];
    }

    if (link.type === "study_track") {
      const item = studyTracks.find((track) => track.id === link.id);
      if (!item) return [];
      return [{
        id: link.id,
        type: link.type,
        title: item.title,
        eyebrow: "Study",
        summary: item.description,
        meta: `${item.estimatedTotalMinutes} min`,
        routeName: "StudyTrackDetail",
        routeParams: { studyTrackId: item.id }
      }];
    }

    if (link.type === "forum_thread") {
      const item = forumThreads.find((thread) => thread.id === link.id);
      if (!item) return [];
      return [{
        id: link.id,
        type: link.type,
        title: item.title,
        eyebrow: "Discussion",
        summary: item.body,
        meta: `${item.replyCount} replies`,
        routeName: "ThreadDetail",
        routeParams: { threadId: item.id }
      }];
    }

    return [];
  });

export const generateDemoAIAnswer = (
  dataset: DemoDataset,
  prompt: string,
  contextId?: string | null
) => {
  const lower = prompt.toLowerCase();
  const context = findContext(
    contextId,
    dataset.events,
    dataset.resources,
    dataset.studyTracks,
    dataset.forumThreads,
    dataset.newsPosts
  );

  let answer =
    "Here’s the clearest next step: start with the closest official deadline or event, open the matching source material, and finish with one concrete prep action you can complete today.";
  const sourceLinks: { label: string; type: "event" | "resource" | "news_post" | "study_track" | "forum_thread"; id: string }[] =
    [];
  const savedEventIds = new Set(dataset.eventSaves.map((item) => item.eventId));
  const savedEvents = dataset.events
    .filter((item) => savedEventIds.has(item.id))
    .sort((left, right) => new Date(left.startTime).getTime() - new Date(right.startTime).getTime());
  const primarySavedEvent = savedEvents[0] ?? dataset.events[0];
  const activeProgress = [...dataset.studyProgress].sort(
    (left, right) => new Date(right.lastOpenedAt ?? 0).getTime() - new Date(left.lastOpenedAt ?? 0).getTime()
  )[0];
  const activeTrack =
    dataset.studyTracks.find((item) => item.id === activeProgress?.studyTrackId) ??
    dataset.studyTracks.find((item) => item.relatedEventId === primarySavedEvent?.id) ??
    dataset.studyTracks[0];
  const weakTopics = dataset.studyProgress.flatMap((item) => item.weakTopics);
  const urgentNews =
    dataset.newsPosts.find((item) => item.isPinned || item.priorityLevel === "urgent") ?? dataset.newsPosts[0];
  const activeThread =
    dataset.forumThreads.find(
      (item) =>
        item.relatedEventId === primarySavedEvent?.id ||
        item.relatedStudyTrackId === activeTrack?.id
    ) ?? dataset.forumThreads[0];
  const officialResource =
    dataset.resources.find(
      (item) =>
        item.id === activeTrack?.relatedResourceIds[0] ||
        item.isOfficial
    ) ?? dataset.resources[0];

  if (context?.type === "event") {
    answer =
      `For ${context.item.title}, focus on the official logistics first, then review any linked prep material, and finish by deciding the next action you need to complete before the event starts.`;
    sourceLinks.push({ label: context.item.title, type: "event", id: context.item.id });
  }

  if (context?.type === "resource") {
    answer =
      `This resource is most useful when you pull out the key rules, definitions, and next actions. After a quick summary pass, turn the important sections into a short review set or checklist so you can actually use it in prep.`;
    sourceLinks.push({ label: context.item.title, type: "resource", id: context.item.id });
  }

  if (context?.type === "study") {
    answer =
      `For ${context.item.title}, start with the lowest-confidence concept, then move into one quiz or flashcard round, and finish by checking whether you can explain the topic without notes.`;
    sourceLinks.push({ label: context.item.title, type: "study_track", id: context.item.id });
  }

  if (context?.type === "forum") {
    answer =
      `This thread points to a practical member need. The best response is usually a short direct answer, one official reference, and one clear next step the member can take inside the app.`;
    sourceLinks.push({ label: context.item.title, type: "forum_thread", id: context.item.id });
  }

  if (context?.type === "news") {
    answer =
      `This update matters because it changes what the member should pay attention to right now. Pull out the deadline, the scope it affects, and the next action so the announcement turns into a clear plan.`;
    sourceLinks.push({ label: context.item.title, type: "news_post", id: context.item.id });
  }

  if (lower.includes("summarize")) {
    answer =
      context?.type === "forum"
        ? "Summary: the conversation is centered on a practical member question, and the strongest answer should combine clear guidance with one linked official or study source."
        : "Summary: this item matters because it connects official information, preparation support, and one clear next action inside FBLA Central.";
  }

  if (lower.includes("flashcard")) {
    answer =
      "Flashcard set idea: capture the key terms, one definition per card, one application example, and one reminder about what the member should do with that knowledge next.";
  }

  if (lower.includes("quiz")) {
    answer = weakTopics.length
      ? `Quiz approach: start with a short round on ${weakTopics.slice(0, 2).join(" and ")}, then finish with one retry pass so the misses turn into a focused review list.`
      : "Quiz approach: start with 5 short recall questions, follow with 2 application questions, then review the misses by turning them into a focused retry list.";
  }

  if (lower.includes("study plan") || lower.includes("prepare")) {
    const track: StudyTrack | undefined =
      dataset.studyTracks.find((item) => item.relatedEventId === contextId) ?? activeTrack;
    if (track && primarySavedEvent) {
      answer =
        `Study plan: start with ${primarySavedEvent.title}, spend 10 minutes on the linked official material, 12 minutes on your weakest topic, then finish with one quiz or flashcard round from ${track.title}.`;
      sourceLinks.push({ label: track.title, type: "study_track", id: track.id });
    }
  }

  if (
    !context &&
    (lower.includes("next step") || lower.includes("what should i do next") || lower.includes("this week"))
  ) {
    if (primarySavedEvent && activeTrack && urgentNews) {
      answer =
        `Your smartest next move is to clear anything blocking ${primarySavedEvent.title}, then continue ${activeTrack.title} with extra attention on ${weakTopics[0] ?? "your lowest-confidence topic"}.`;
      sourceLinks.push({ label: primarySavedEvent.title, type: "event", id: primarySavedEvent.id });
      sourceLinks.push({ label: activeTrack.title, type: "study_track", id: activeTrack.id });
      sourceLinks.push({ label: urgentNews.title, type: "news_post", id: urgentNews.id });
    }
  }

  if (!context && (lower.includes("resource") || lower.includes("open first"))) {
    if (officialResource && activeTrack) {
      answer =
        `Open ${officialResource.title} first because it supports ${activeTrack.title} and gives you something concrete you can use immediately in prep.`;
      sourceLinks.push({ label: officialResource.title, type: "resource", id: officialResource.id });
      sourceLinks.push({ label: activeTrack.title, type: "study_track", id: activeTrack.id });
    }
  }

  if (!context && (lower.includes("discussion") || lower.includes("reply") || lower.includes("thread"))) {
    if (activeThread) {
      answer =
        `The most useful discussion to open next is "${activeThread.title}" because it already has practical member answers tied to your current prep context.`;
      sourceLinks.push({ label: activeThread.title, type: "forum_thread", id: activeThread.id });
    }
  }

  if (!context && (lower.includes("weak") || lower.includes("missed"))) {
    if (activeTrack) {
      answer =
        `Your current weak-area pattern points to ${weakTopics.slice(0, 2).join(" and ") || "a targeted review block"}, so the fastest lift is a short pass through ${activeTrack.title} followed by one scored check.`;
      sourceLinks.push({ label: activeTrack.title, type: "study_track", id: activeTrack.id });
    }
  }

  if (officialResource && !sourceLinks.some((item) => item.id === officialResource.id)) {
    sourceLinks.push({ label: officialResource.title, type: "resource", id: officialResource.id });
  }

  if (urgentNews && !sourceLinks.some((item) => item.id === urgentNews.id)) {
    sourceLinks.push({ label: urgentNews.title, type: "news_post", id: urgentNews.id });
  }

  if (activeThread && (lower.includes("discussion") || lower.includes("reply"))) {
    sourceLinks.push({ label: activeThread.title, type: "forum_thread", id: activeThread.id });
  }

  return {
    answer,
    sourceLinks: sourceLinks.slice(0, 3)
  };
};
