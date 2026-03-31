import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { OnboardingInput } from "@/data/schemas/onboarding";
import { getRepository } from "@/data/repositories";
import {
  EventItem,
  ForumReply,
  ForumThread,
  HomeBundle,
  NewsPost,
  Organization,
  ResourceItem,
  SearchResult,
  StudyTrack,
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
    saveEvent: builder.mutation<void, { eventId: string; personalNote?: string }>({
      queryFn: async ({ eventId, personalNote }) => {
        try {
          await getRepository().saveEvent(eventId, personalNote);
          return { data: undefined };
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
    toggleResourceSave: builder.mutation<void, string>({
      queryFn: async (resourceId) => {
        try {
          await getRepository().toggleResourceSave(resourceId);
          return { data: undefined };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: ["Resources", "Home"]
    }),
    getNews: builder.query<NewsPost[], void>({
      queryFn: async () => ({ data: await getRepository().getNews() }),
      providesTags: ["News"]
    }),
    markNewsRead: builder.mutation<void, string>({
      queryFn: async (newsPostId) => {
        try {
          await getRepository().markNewsRead(newsPostId);
          return { data: undefined };
        } catch (error) {
          return { error: { message: (error as Error).message } };
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
    getForumThreads: builder.query<ForumThread[], void>({
      queryFn: async () => ({ data: await getRepository().getForumThreads() }),
      providesTags: ["Forums"]
    }),
    getForumReplies: builder.query<ForumReply[], string>({
      queryFn: async (threadId) => ({ data: await getRepository().getForumReplies(threadId) }),
      providesTags: ["Forums"]
    }),
    postForumReply: builder.mutation<void, { threadId: string; body: string }>({
      queryFn: async ({ threadId, body }) => {
        try {
          await getRepository().postForumReply(threadId, body);
          return { data: undefined };
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
  useSaveEventMutation,
  useGetResourcesQuery,
  useToggleResourceSaveMutation,
  useGetNewsQuery,
  useMarkNewsReadMutation,
  useGetSocialHubQuery,
  useGetStudyTracksQuery,
  useGetForumThreadsQuery,
  useGetForumRepliesQuery,
  usePostForumReplyMutation,
  useAskAIMutation,
  useSearchQuery
} = fblaApi;
