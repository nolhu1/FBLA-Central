import { STORAGE_KEYS } from "@/constants/config";
import { demoDataset } from "@/features/demo/demoData";
import { generateDemoAIAnswer } from "@/domain/services/ai";
import { buildHomeBundle } from "@/domain/services/recommendations";
import { runUnifiedSearch } from "@/domain/services/search";
import { OnboardingInput } from "@/data/schemas/onboarding";
import {
  DemoDataset,
  QuizAttempt,
  ForumReply,
  ForumThread,
  User
} from "@/domain/models/types";
import { storage } from "@/data/storage/async";

import {
  AskAIInput,
  AskAIResult,
  FBLACentralRepository,
  SignInInput,
  SocialHubPayload
} from "./types";

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const demoSeedSignature = JSON.stringify(demoDataset);

let runtimeState: DemoDataset = clone(demoDataset);
let sessionUser: User | null = null;
let hydrated = false;

const hydrateDemoState = async () => {
  if (hydrated) return;
  const [storedState, storedSession, storedSeedSignature] = await Promise.all([
    storage.getObject<DemoDataset>(STORAGE_KEYS.demoState),
    storage.getObject<User>(STORAGE_KEYS.session),
    storage.getObject<string>(STORAGE_KEYS.demoSeedSignature)
  ]);

  const shouldReseed = storedSeedSignature !== demoSeedSignature;

  if (storedState && !shouldReseed) {
    runtimeState = storedState;
  } else {
    runtimeState = clone(demoDataset);
  }

  if (storedSession && !shouldReseed) {
    sessionUser = storedSession;
  } else if (storedSession && shouldReseed) {
    sessionUser = {
      ...runtimeState.user,
      email: storedSession.email || runtimeState.user.email,
      onboardingComplete: storedSession.onboardingComplete ?? runtimeState.user.onboardingComplete
    };
  }

  hydrated = true;

  if (!storedState || shouldReseed || storedSeedSignature !== demoSeedSignature) {
    await persist();
  }
};

const persist = async () => {
  await Promise.all([
    storage.setObject(STORAGE_KEYS.demoState, runtimeState),
    sessionUser ? storage.setObject(STORAGE_KEYS.session, sessionUser) : storage.remove(STORAGE_KEYS.session),
    storage.setObject(STORAGE_KEYS.demoSeedSignature, demoSeedSignature)
  ]);
};

const requireUser = async () => {
  await hydrateDemoState();
  if (!sessionUser) throw new Error("No session found.");
  return sessionUser;
};

export class DemoRepository implements FBLACentralRepository {
  async restoreSession() {
    await hydrateDemoState();
    return sessionUser;
  }

  async signIn(input: SignInInput) {
    await hydrateDemoState();
    sessionUser = {
      ...runtimeState.user,
      email: input.email || runtimeState.user.email,
      onboardingComplete: runtimeState.user.onboardingComplete
    };
    await persist();
    return sessionUser;
  }

  async signOut() {
    await hydrateDemoState();
    runtimeState.user = {
      ...runtimeState.user,
      onboardingComplete: false,
      updatedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };
    sessionUser = null;
    await persist();
  }

  async completeOnboarding(input: OnboardingInput) {
    await hydrateDemoState();
    runtimeState.user = {
      ...runtimeState.user,
      ...input,
      email: input.email || runtimeState.user.email,
      displayName: `${input.firstName} ${input.lastName}`,
      onboardingComplete: true,
      updatedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };
    sessionUser = runtimeState.user;
    await persist();
    return runtimeState.user;
  }

  async getOrganizations() {
    await hydrateDemoState();
    return runtimeState.organizations;
  }

  async getHomeBundle() {
    await requireUser();
    return buildHomeBundle(runtimeState);
  }

  async getEvents() {
    await requireUser();
    return runtimeState.events;
  }

  async getEventSaves() {
    const user = await requireUser();
    return runtimeState.eventSaves.filter((item) => item.userId === user.id);
  }

  async saveEvent(eventId: string, personalNote?: string) {
    const user = await requireUser();
    const existing = runtimeState.eventSaves.find((item) => item.eventId === eventId && item.userId === user.id);
    if (existing) {
      existing.personalNote = personalNote ?? existing.personalNote;
    } else {
      runtimeState.eventSaves.unshift({
        id: `save-${eventId}`,
        userId: user.id,
        eventId,
        savedAt: new Date().toISOString(),
        personalNote
      });
    }
    await persist();
  }

  async updateEventSave(input: {
    eventId: string;
    isSaved: boolean;
    reminder1?: string | null;
    reminder2?: string | null;
    personalNote?: string;
  }) {
    const user = await requireUser();
    const existingIndex = runtimeState.eventSaves.findIndex(
      (item) => item.eventId === input.eventId && item.userId === user.id
    );

    if (!input.isSaved) {
      if (existingIndex >= 0) {
        runtimeState.eventSaves.splice(existingIndex, 1);
        await persist();
      }
      return;
    }

    if (existingIndex >= 0) {
      runtimeState.eventSaves[existingIndex] = {
        ...runtimeState.eventSaves[existingIndex],
        reminder1: input.reminder1 ?? runtimeState.eventSaves[existingIndex].reminder1 ?? null,
        reminder2: input.reminder2 ?? runtimeState.eventSaves[existingIndex].reminder2 ?? null,
        personalNote: input.personalNote ?? runtimeState.eventSaves[existingIndex].personalNote
      };
    } else {
      runtimeState.eventSaves.unshift({
        id: `save-${input.eventId}`,
        userId: user.id,
        eventId: input.eventId,
        savedAt: new Date().toISOString(),
        reminder1: input.reminder1 ?? null,
        reminder2: input.reminder2 ?? null,
        personalNote: input.personalNote
      });
    }

    await persist();
  }

  async getResources() {
    await requireUser();
    return runtimeState.resources;
  }

  async getResourceState() {
    const user = await requireUser();
    return runtimeState.resourceState.filter((item) => item.userId === user.id);
  }

  async toggleResourceSave(resourceId: string) {
    const user = await requireUser();
    const existing = runtimeState.resourceState.find(
      (item) => item.resourceId === resourceId && item.userId === user.id
    );
    if (existing) {
      existing.isSaved = !existing.isSaved;
      existing.lastOpenedAt = new Date().toISOString();
    } else {
      runtimeState.resourceState.push({
        id: `resource-state-${resourceId}`,
        userId: user.id,
        resourceId,
        isSaved: true,
        isOfflineAvailable: false,
        readingProgressPercent: 0,
        highlightCount: 0
      });
    }
    await persist();
  }

  async getNews() {
    await requireUser();
    return runtimeState.newsPosts;
  }

  async getNewsState() {
    const user = await requireUser();
    return runtimeState.newsState.filter((item) => item.userId === user.id);
  }

  async markNewsRead(newsPostId: string) {
    const user = await requireUser();
    const existing = runtimeState.newsState.find(
      (item) => item.newsPostId === newsPostId && item.userId === user.id
    );
    if (existing) {
      existing.isRead = true;
      existing.readAt = new Date().toISOString();
    } else {
      runtimeState.newsState.push({
        id: `news-state-${newsPostId}`,
        userId: user.id,
        newsPostId,
        isRead: true,
        isSaved: false,
        readAt: new Date().toISOString()
      });
    }
    await persist();
  }

  async updateNewsState(input: { newsPostId: string; isRead?: boolean; isSaved?: boolean }) {
    const user = await requireUser();
    const existing = runtimeState.newsState.find(
      (item) => item.newsPostId === input.newsPostId && item.userId === user.id
    );

    if (existing) {
      if (typeof input.isRead === "boolean") {
        existing.isRead = input.isRead;
        existing.readAt = input.isRead ? new Date().toISOString() : null;
      }
      if (typeof input.isSaved === "boolean") {
        existing.isSaved = input.isSaved;
        existing.savedAt = input.isSaved ? new Date().toISOString() : null;
      }
    } else {
      runtimeState.newsState.push({
        id: `news-state-${input.newsPostId}`,
        userId: user.id,
        newsPostId: input.newsPostId,
        isRead: input.isRead ?? false,
        isSaved: input.isSaved ?? false,
        readAt: input.isRead ? new Date().toISOString() : null,
        savedAt: input.isSaved ? new Date().toISOString() : null
      });
    }

    await persist();
  }

  async getSocialHub(): Promise<SocialHubPayload> {
    await requireUser();
    return {
      channels: runtimeState.socialChannels,
      highlights: runtimeState.socialHighlights
    };
  }

  async getStudyTracks() {
    await requireUser();
    return runtimeState.studyTracks;
  }

  async getStudyUnits() {
    await requireUser();
    return runtimeState.studyUnits;
  }

  async getStudyProgress() {
    const user = await requireUser();
    return runtimeState.studyProgress.filter((item) => item.userId === user.id);
  }

  async getQuizAttempts() {
    const user = await requireUser();
    return runtimeState.quizAttempts.filter((item) => item.userId === user.id);
  }

  async submitQuizAttempt(input: {
    studyUnitId: string;
    scorePercent: number;
    questionCount: number;
    correctCount: number;
    missedTopicTags: string[];
  }): Promise<QuizAttempt> {
    const user = await requireUser();
    const now = new Date().toISOString();
    const attempt: QuizAttempt = {
      id: `quiz-attempt-${Date.now()}`,
      userId: user.id,
      studyUnitId: input.studyUnitId,
      scorePercent: input.scorePercent,
      questionCount: input.questionCount,
      correctCount: input.correctCount,
      attemptedAt: now,
      missedTopicTags: input.missedTopicTags
    };

    runtimeState.quizAttempts.unshift(attempt);

    const unit = runtimeState.studyUnits.find((item) => item.id === input.studyUnitId);
    const trackId = unit?.studyTrackId;

    if (trackId) {
      const trackUnits = runtimeState.studyUnits
        .filter((item) => item.studyTrackId === trackId)
        .sort((left, right) => left.sequenceOrder - right.sequenceOrder);
      const completedIndex = trackUnits.findIndex((item) => item.id === input.studyUnitId);
      const nextUnit = completedIndex >= 0 ? trackUnits[completedIndex + 1] : undefined;
      const targetProgress = Math.max(
        Math.round(((completedIndex + 1) / Math.max(trackUnits.length, 1)) * 100),
        Math.min(100, Math.round(input.scorePercent * 0.8))
      );
      const existing = runtimeState.studyProgress.find(
        (item) => item.userId === user.id && item.studyTrackId === trackId
      );

      if (existing) {
        existing.progressPercent = Math.max(existing.progressPercent, targetProgress);
        existing.lastOpenedAt = now;
        existing.nextRecommendedUnitId = nextUnit?.id ?? null;
        existing.weakTopics = Array.from(new Set([...input.missedTopicTags, ...existing.weakTopics])).slice(0, 4);
        if (existing.progressPercent >= 100) {
          existing.completedAt = existing.completedAt ?? now;
        }
      } else {
        runtimeState.studyProgress.unshift({
          id: `study-progress-${trackId}-${user.id}`,
          userId: user.id,
          studyTrackId: trackId,
          progressPercent: targetProgress,
          lastOpenedAt: now,
          completedAt: targetProgress >= 100 ? now : null,
          weakTopics: input.missedTopicTags.slice(0, 4),
          nextRecommendedUnitId: nextUnit?.id ?? null
        });
      }
    }

    await persist();
    return attempt;
  }

  async getForumCategories() {
    await requireUser();
    return runtimeState.forumCategories;
  }

  async getForumThreads(): Promise<ForumThread[]> {
    await requireUser();
    return runtimeState.forumThreads;
  }

  async getForumReplies(threadId: string): Promise<ForumReply[]> {
    await requireUser();
    return runtimeState.forumReplies.filter((reply) => reply.threadId === threadId);
  }

  async createForumThread(input: {
    categoryId: string;
    title: string;
    body: string;
    threadType: import("@/domain/models/types").ForumThreadType;
    relatedEventId?: string | null;
    relatedResourceId?: string | null;
    relatedStudyTrackId?: string | null;
    tags?: string[];
  }) {
    const user = await requireUser();
    const now = new Date().toISOString();
    const createdThread: ForumThread = {
      id: `thread-${Date.now()}`,
      categoryId: input.categoryId,
      authorUserId: user.id,
      title: input.title,
      body: input.body,
      threadType: input.threadType,
      status: "active",
      relatedEventId: input.relatedEventId ?? null,
      relatedResourceId: input.relatedResourceId ?? null,
      relatedStudyTrackId: input.relatedStudyTrackId ?? null,
      tags: input.tags ?? [],
      replyCount: 0,
      helpfulCount: 0,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
      lastActivityAt: now
    };
    runtimeState.forumThreads.unshift(createdThread);
    await persist();
    return createdThread;
  }

  async postForumReply(threadId: string, body: string) {
    const user = await requireUser();
    runtimeState.forumReplies.push({
      id: `reply-${Date.now()}`,
      threadId,
      authorUserId: user.id,
      body,
      status: "active",
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const thread = runtimeState.forumThreads.find((item) => item.id === threadId);
    if (thread) {
      thread.replyCount += 1;
      thread.lastActivityAt = new Date().toISOString();
      thread.updatedAt = thread.lastActivityAt;
    }

    await persist();
  }

  async askAI(input: AskAIInput): Promise<AskAIResult> {
    await requireUser();
    return generateDemoAIAnswer(runtimeState, input.prompt, input.contextId);
  }

  async search(query: string) {
    await requireUser();
    return runUnifiedSearch(runtimeState, query);
  }
}
