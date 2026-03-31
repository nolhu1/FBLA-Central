import { DemoDataset, SearchResult } from "@/domain/models/types";

export const runUnifiedSearch = (dataset: DemoDataset, query: string): SearchResult[] => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const matches = (value: string) => value.toLowerCase().includes(normalized);

  return [
    ...dataset.events
      .filter((item) => matches(item.title) || matches(item.description))
      .map<SearchResult>((item) => ({
        id: item.id,
        type: "event",
        title: item.title,
        shortSummary: item.description,
        relevanceMetadata: `${item.scopeType} event`,
        scope: item.scopeType,
        routeTarget: "EventDetail"
      })),
    ...dataset.resources
      .filter((item) => matches(item.title) || item.tags.some(matches))
      .map<SearchResult>((item) => ({
        id: item.id,
        type: "resource",
        title: item.title,
        shortSummary: item.summary,
        relevanceMetadata: item.category,
        scope: item.scopeType,
        routeTarget: "Resources"
      })),
    ...dataset.newsPosts
      .filter((item) => matches(item.title) || item.topicTags.some(matches))
      .map<SearchResult>((item) => ({
        id: item.id,
        type: "news",
        title: item.title,
        shortSummary: item.summary,
        relevanceMetadata: item.priorityLevel,
        scope: item.scopeType,
        routeTarget: "News"
      })),
    ...dataset.studyTracks
      .filter((item) => matches(item.title) || item.tags.some(matches))
      .map<SearchResult>((item) => ({
        id: item.id,
        type: "study",
        title: item.title,
        shortSummary: item.description,
        relevanceMetadata: item.trackType,
        scope: item.relatedEventId ? "state" : "national",
        routeTarget: "Study"
      })),
    ...dataset.forumThreads
      .filter((item) => matches(item.title) || item.tags.some(matches))
      .map<SearchResult>((item) => ({
        id: item.id,
        type: "forum",
        title: item.title,
        shortSummary: item.body,
        relevanceMetadata: item.threadType,
        scope: "state",
        routeTarget: "ThreadDetail"
      }))
  ].slice(0, 12);
};
