import { DemoDataset, ForumThread, NewsPost, ResourceItem, StudyTrack } from "@/domain/models/types";

const findContext = (dataset: DemoDataset, contextId?: string | null) => {
  if (!contextId) return null;
  return (
    dataset.events.find((item) => item.id === contextId) ??
    dataset.resources.find((item) => item.id === contextId) ??
    dataset.studyTracks.find((item) => item.id === contextId) ??
    dataset.forumThreads.find((item) => item.id === contextId) ??
    dataset.newsPosts.find((item) => item.id === contextId) ??
    null
  );
};

export const generateDemoAIAnswer = (
  dataset: DemoDataset,
  prompt: string,
  contextId?: string | null
) => {
  const lower = prompt.toLowerCase();
  const context = findContext(dataset, contextId);

  let answer =
    "Here’s the clearest next step: focus on your nearest deadline, open the linked official guide, and practice the one workflow that proves the app is connected rather than screen-by-screen.";
  const sourceLinks: Array<{ label: string; type: "event" | "resource" | "news_post" | "study_track" | "forum_thread"; id: string }> =
    [];

  if (context && "title" in context) {
    answer = `For ${context.title}, start with the official source material, then move into the related study or discussion support. The best demo moment is to show how one action in this feature unlocks the next step somewhere else in the app.`;
  }

  if (lower.includes("summarize") && context) {
    answer = `Summary: ${context.title} is a high-priority item in your member workflow. Use it to connect official information, preparation resources, and a recommended discussion or study next step.`;
  }

  if (lower.includes("study plan") || lower.includes("prepare")) {
    const track: StudyTrack | undefined =
      dataset.studyTracks.find((item) => item.relatedEventId === contextId) ?? dataset.studyTracks[0];
    if (track) {
      answer = `Study plan: spend 10 minutes on the architecture story, 12 minutes on validation checks, then finish with the demo checklist so your presentation ends on a strong connected-system story.`;
      sourceLinks.push({ label: track.title, type: "study_track", id: track.id });
    }
  }

  const officialResource: ResourceItem | undefined = dataset.resources.find((item) => item.isOfficial);
  const urgentNews: NewsPost | undefined = dataset.newsPosts.find((item) => item.priorityLevel === "urgent");
  const activeThread: ForumThread | undefined = dataset.forumThreads[0];

  if (officialResource) {
    sourceLinks.push({ label: officialResource.title, type: "resource", id: officialResource.id });
  }

  if (urgentNews) {
    sourceLinks.push({ label: urgentNews.title, type: "news_post", id: urgentNews.id });
  }

  if (activeThread && lower.includes("discussion")) {
    sourceLinks.push({ label: activeThread.title, type: "forum_thread", id: activeThread.id });
  }

  return {
    answer,
    sourceLinks
  };
};
