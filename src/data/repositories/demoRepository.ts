import { STORAGE_KEYS } from "@/constants/config";
import { demoDataset } from "@/features/demo/demoData";
import { generateDemoAIAnswer } from "@/domain/services/ai";
import { buildHomeBundle } from "@/domain/services/recommendations";
import { runUnifiedSearch } from "@/domain/services/search";
import { OnboardingInput } from "@/data/schemas/onboarding";
import {
  DemoDataset,
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

let runtimeState: DemoDataset = clone(demoDataset);
let sessionUser: User | null = null;
let hydrated = false;

const hydrateDemoState = async () => {
  if (hydrated) return;
  const [storedState, storedSession] = await Promise.all([
    storage.getObject<DemoDataset>(STORAGE_KEYS.demoState),
    storage.getObject<User>(STORAGE_KEYS.session)
  ]);

  if (storedState) runtimeState = storedState;
  if (storedSession) sessionUser = storedSession;
  hydrated = true;
};

const persist = async () => {
  await Promise.all([
    storage.setObject(STORAGE_KEYS.demoState, runtimeState),
    sessionUser ? storage.setObject(STORAGE_KEYS.session, sessionUser) : storage.remove(STORAGE_KEYS.session)
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
    sessionUser = null;
    await persist();
  }

  async completeOnboarding(input: OnboardingInput) {
    await hydrateDemoState();
    runtimeState.user = {
      ...runtimeState.user,
      ...input,
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

  async getResources() {
    await requireUser();
    return runtimeState.resources;
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

  async getForumThreads(): Promise<ForumThread[]> {
    await requireUser();
    return runtimeState.forumThreads;
  }

  async getForumReplies(threadId: string): Promise<ForumReply[]> {
    await requireUser();
    return runtimeState.forumReplies.filter((reply) => reply.threadId === threadId);
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
