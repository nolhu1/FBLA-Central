import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { OnboardingInput } from "@/data/schemas/onboarding";
import { getRepository } from "@/data/repositories";
import {
  EventItem,
  EventSave,
  ForumCategory,
  ForumReply,
  ForumThread,
  HomeBundle,
  NewsPost,
  NewsState,
  Organization,
  QuizAttempt,
  ResourceItem,
  ResourceState,
  SearchResult,
  StudyProgress,
  StudyTrack,
  StudyUnit,
  User
} from "@/domain/models/types";

import { AskAIResult, SignInInput, SocialHubPayload } from "@/data/repositories/types";

export const fblaApi = createApi({
  reducerPath: "fblaApi",
  baseQuery: fakeBaseQuery<{ message: string }>(),
  tagTypes: ["Home", "Events", "Resources", "News", "Study", "Forums", "Profile"],
  endpoints: (builder) => ({
    restoreSession: builder.query<User | null, void>({
      queryFn: async () => {
        try {
          const data = await getRepository().restoreSession();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      }
    }),
    signIn: builder.mutation<User, SignInInput>({
      queryFn: async (input) => {
        try {
          const data = await getRepository().signIn(input);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: ["Profile", "Home", "Events", "Resources", "News", "Study", "Forums"]
    }),
    completeOnboarding: builder.mutation<User, OnboardingInput>({
      queryFn: async (input) => {
        try {
          const data = await getRepository().completeOnboarding(input);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: ["Profile", "Home"]
    }),
    getOrganizations: builder.query<Organization[], void>({
      queryFn: async () => ({ data: await getRepository().getOrganizations() })
    }),
    getHomeBundle: builder.query<HomeBundle, void>({
      queryFn: async () => {
        try {
          return { data: await getRepository().getHomeBundle() };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: ["Home"]
    }),
    getEvents: builder.query<EventItem[], void>({
      queryFn: async () => ({ data: await getRepository().getEvents() }),
      providesTags: ["Events"]
    }),
    getEventSaves: builder.query<EventSave[], void>({
      queryFn: async () => ({ data: await getRepository().getEventSaves() }),
      providesTags: ["Events"]
    }),
    saveEvent: builder.mutation<{ ok: true }, { eventId: string; personalNote?: string }>({
      queryFn: async ({ eventId, personalNote }) => {
        try {
          await getRepository().saveEvent(eventId, personalNote);
          return { data: { ok: true } };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: ["Events", "Home", "Study"]
    }),
    updateEventSave: builder.mutation<
      { ok: true },
      {
        eventId: string;
        isSaved: boolean;
        reminder1?: string | null;
        reminder2?: string | null;
        personalNote?: string;
      }
    >({
      queryFn: async (input) => {
        try {
          await getRepository().updateEventSave(input);
          return { data: { ok: true } };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: ["Events", "Home", "Study"]
    }),
    getResources: builder.query<ResourceItem[], void>({
      queryFn: async () => ({ data: await getRepository().getResources() }),
      providesTags: ["Resources"]
    }),
    getResourceState: builder.query<ResourceState[], void>({
      queryFn: async () => ({ data: await getRepository().getResourceState() }),
      providesTags: ["Resources"]
    }),
    toggleResourceSave: builder.mutation<{ ok: true }, string>({
      queryFn: async (resourceId) => {
        try {
          await getRepository().toggleResourceSave(resourceId);
          return { data: { ok: true } };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      async onQueryStarted(resourceId, { dispatch, getState, queryFulfilled }) {
        const userId = (getState() as any).session?.user?.id as string | undefined;
        const patch = dispatch(
          fblaApi.util.updateQueryData("getResourceState", undefined, (draft) => {
            const existing = draft.find((item) => item.resourceId === resourceId);

            if (existing) {
              existing.isSaved = !existing.isSaved;
              existing.lastOpenedAt = new Date().toISOString();
            } else if (userId) {
              draft.push({
                id: `resource-state-${resourceId}`,
                userId,
                resourceId,
                isSaved: true,
                isOfflineAvailable: false,
                lastOpenedAt: new Date().toISOString(),
                readingProgressPercent: 0,
                highlightCount: 0
              });
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["Resources", "Home"]
    }),
    getNews: builder.query<NewsPost[], void>({
      queryFn: async () => ({ data: await getRepository().getNews() }),
      providesTags: ["News"]
    }),
    getNewsState: builder.query<NewsState[], void>({
      queryFn: async () => ({ data: await getRepository().getNewsState() }),
      providesTags: ["News"]
    }),
    markNewsRead: builder.mutation<{ ok: true }, string>({
      queryFn: async (newsPostId) => {
        try {
          await getRepository().markNewsRead(newsPostId);
          return { data: { ok: true } };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: ["News", "Home"]
    }),
    updateNewsState: builder.mutation<{ ok: true }, { newsPostId: string; isRead?: boolean; isSaved?: boolean }>({
      queryFn: async (input) => {
        try {
          await getRepository().updateNewsState(input);
          return { data: { ok: true } };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      async onQueryStarted(input, { dispatch, getState, queryFulfilled }) {
        const userId = (getState() as any).session?.user?.id as string | undefined;
        const now = new Date().toISOString();
        const patch = dispatch(
          fblaApi.util.updateQueryData("getNewsState", undefined, (draft) => {
            const existing = draft.find((item) => item.newsPostId === input.newsPostId);

            if (existing) {
              if (typeof input.isRead === "boolean") {
                existing.isRead = input.isRead;
                existing.readAt = input.isRead ? now : null;
              }
              if (typeof input.isSaved === "boolean") {
                existing.isSaved = input.isSaved;
                existing.savedAt = input.isSaved ? now : null;
              }
            } else if (userId) {
              draft.push({
                id: `news-state-${input.newsPostId}`,
                userId,
                newsPostId: input.newsPostId,
                isRead: input.isRead ?? false,
                isSaved: input.isSaved ?? false,
                readAt: input.isRead ? now : null,
                savedAt: input.isSaved ? now : null
              });
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["News", "Home"]
    }),
    getSocialHub: builder.query<SocialHubPayload, void>({
      queryFn: async () => ({ data: await getRepository().getSocialHub() })
    }),
    getStudyTracks: builder.query<StudyTrack[], void>({
      queryFn: async () => ({ data: await getRepository().getStudyTracks() }),
      providesTags: ["Study"]
    }),
    getStudyUnits: builder.query<StudyUnit[], void>({
      queryFn: async () => ({ data: await getRepository().getStudyUnits() }),
      providesTags: ["Study"]
    }),
    getStudyProgress: builder.query<StudyProgress[], void>({
      queryFn: async () => ({ data: await getRepository().getStudyProgress() }),
      providesTags: ["Study"]
    }),
    getQuizAttempts: builder.query<QuizAttempt[], void>({
      queryFn: async () => ({ data: await getRepository().getQuizAttempts() }),
      providesTags: ["Study"]
    }),
    submitQuizAttempt: builder.mutation<
      QuizAttempt,
      {
        studyUnitId: string;
        scorePercent: number;
        questionCount: number;
        correctCount: number;
        missedTopicTags: string[];
      }
    >({
      queryFn: async (input) => {
        try {
          return { data: await getRepository().submitQuizAttempt(input) };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            fblaApi.util.updateQueryData("getQuizAttempts", undefined, (draft) => {
              if (!draft.some((item) => item.id === data.id)) {
                draft.unshift(data);
              }
            })
          );
        } catch {
          // Ignore cache update failures and fall back to invalidation.
        }
      },
      invalidatesTags: ["Study", "Home"]
    }),
    getForumCategories: builder.query<ForumCategory[], void>({
      queryFn: async () => ({ data: await getRepository().getForumCategories() }),
      providesTags: ["Forums"]
    }),
    getForumThreads: builder.query<ForumThread[], void>({
      queryFn: async () => ({ data: await getRepository().getForumThreads() }),
      providesTags: ["Forums"]
    }),
    getForumReplies: builder.query<ForumReply[], string>({
      queryFn: async (threadId) => ({ data: await getRepository().getForumReplies(threadId) }),
      providesTags: ["Forums"]
    }),
    createForumThread: builder.mutation<
      ForumThread,
      {
        categoryId: string;
        title: string;
        body: string;
        threadType: ForumThread["threadType"];
        relatedEventId?: string | null;
        relatedResourceId?: string | null;
        relatedStudyTrackId?: string | null;
        tags?: string[];
      }
    >({
      queryFn: async (input) => {
        try {
          return { data: await getRepository().createForumThread(input) };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            fblaApi.util.updateQueryData("getForumThreads", undefined, (draft) => {
              if (!draft.some((item) => item.id === data.id)) {
                draft.unshift(data);
              }
            })
          );
        } catch {
          // Ignore optimistic cache update failures and let invalidation refetch.
        }
      },
      invalidatesTags: ["Forums", "Home"]
    }),
    postForumReply: builder.mutation<{ ok: true }, { threadId: string; body: string }>({
      queryFn: async ({ threadId, body }) => {
        try {
          await getRepository().postForumReply(threadId, body);
          return { data: { ok: true } };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: ["Forums", "Home"]
    }),
    askAI: builder.mutation<AskAIResult, { prompt: string; contextId?: string | null }>({
      queryFn: async (input) => {
        try {
          return { data: await getRepository().askAI(input) };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      }
    }),
    search: builder.query<SearchResult[], string>({
      queryFn: async (query) => ({ data: await getRepository().search(query) })
    })
  })
});

export const {
  useRestoreSessionQuery,
  useSignInMutation,
  useCompleteOnboardingMutation,
  useGetOrganizationsQuery,
  useGetHomeBundleQuery,
  useGetEventsQuery,
  useGetEventSavesQuery,
  useSaveEventMutation,
  useUpdateEventSaveMutation,
  useGetResourcesQuery,
  useGetResourceStateQuery,
  useToggleResourceSaveMutation,
  useGetNewsQuery,
  useGetNewsStateQuery,
  useMarkNewsReadMutation,
  useUpdateNewsStateMutation,
  useGetSocialHubQuery,
  useGetStudyTracksQuery,
  useGetStudyUnitsQuery,
  useGetStudyProgressQuery,
  useGetQuizAttemptsQuery,
  useSubmitQuizAttemptMutation,
  useGetForumCategoriesQuery,
  useGetForumThreadsQuery,
  useGetForumRepliesQuery,
  useCreateForumThreadMutation,
  usePostForumReplyMutation,
  useAskAIMutation,
  useSearchQuery
} = fblaApi;
