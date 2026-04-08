import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions/dist/esm/index.esm.js";

import { buildHomeBundle } from "@/domain/services/recommendations";
import { runUnifiedSearch } from "@/domain/services/search";
import { OnboardingInput } from "@/data/schemas/onboarding";
import {
  DemoDataset,
  ForumCategory,
  ForumReply,
  ForumThread,
  HomeBundle,
  EventSave,
  NewsPost,
  NewsState,
  Organization,
  QuizAttempt,
  ResourceItem,
  ResourceState,
  SocialChannel,
  SocialHighlight,
  StudyProgress,
  StudyTrack,
  StudyUnit,
  User
} from "@/domain/models/types";
import { getFirebaseServices } from "@/data/api/firebase";

import {
  AskAIInput,
  AskAIResult,
  FBLACentralRepository,
  SignInInput,
  SocialHubPayload
} from "./types";

const toDate = () => new Date().toISOString();

const mapUser = (id: string, value: any): User => ({
  id,
  division: "high_school",
  email: value.email,
  firstName: value.first_name ?? value.firstName ?? "",
  lastName: value.last_name ?? value.lastName ?? "",
  displayName: value.display_name ?? value.displayName ?? "",
  photoUrl: value.photo_url ?? value.photoUrl,
  graduationYear: value.graduation_year ?? value.graduationYear ?? new Date().getFullYear(),
  schoolName: value.school_name ?? value.schoolName ?? "",
  localChapterId: value.local_chapter_id ?? value.localChapterId ?? "",
  stateChapterId: value.state_chapter_id ?? value.stateChapterId ?? "",
  stateSubdivisionId: value.state_subdivision_id ?? value.stateSubdivisionId ?? null,
  goals: value.goals ?? [],
  generalInterests: value.general_interests ?? value.generalInterests ?? [],
  competitionInterests: value.competition_interests ?? value.competitionInterests ?? [],
  notificationPreferences: value.notification_preferences ?? value.notificationPreferences,
  privacyPreferences: value.privacy_preferences ?? value.privacyPreferences,
  accessibilityPreferences: value.accessibility_preferences ?? value.accessibilityPreferences,
  onboardingComplete: value.onboarding_complete ?? value.onboardingComplete ?? false,
  createdAt: value.created_at ?? value.createdAt ?? toDate(),
  updatedAt: value.updated_at ?? value.updatedAt ?? toDate(),
  lastActiveAt: value.last_active_at ?? value.lastActiveAt ?? toDate()
});

const mapOrganization = (id: string, value: any): Organization => ({
  id,
  type: value.type,
  name: value.name,
  shortName: value.short_name ?? value.shortName ?? value.name,
  parentOrganizationId: value.parent_organization_id ?? value.parentOrganizationId ?? null,
  stateCode: value.state_code ?? value.stateCode ?? null,
  subdivisionTypeLabel: value.subdivision_type_label ?? value.subdivisionTypeLabel ?? null,
  schoolName: value.school_name ?? value.schoolName ?? null,
  status: value.status ?? "active",
  logoUrl: value.logo_url ?? value.logoUrl,
  websiteUrl: value.website_url ?? value.websiteUrl
});

const mapResource = (id: string, value: any): ResourceItem => ({
  id,
  title: value.title,
  summary: value.summary,
  resourceType: value.resource_type ?? value.resourceType,
  category: value.category,
  contentFormat: value.content_format ?? value.contentFormat ?? "url",
  scopeType: value.scope_type ?? value.scopeType,
  organizationId: value.organization_id ?? value.organizationId ?? null,
  url: value.url,
  storagePath: value.storage_path ?? value.storagePath,
  thumbnailUrl: value.thumbnail_url ?? value.thumbnailUrl,
  estimatedReadMinutes: value.estimated_read_minutes ?? value.estimatedReadMinutes ?? 0,
  tags: value.tags ?? [],
  sourceName: value.source_name ?? value.sourceName ?? "",
  sourceUrl: value.source_url ?? value.sourceUrl,
  publishedAt: value.published_at ?? value.publishedAt ?? toDate(),
  updatedAt: value.updated_at ?? value.updatedAt ?? toDate(),
  isOfficial: value.is_official ?? value.isOfficial ?? false,
  isDownloadable: value.is_downloadable ?? value.isDownloadable ?? false
});

const mapResourceState = (id: string, value: any): ResourceState => ({
  id,
  userId: value.user_id ?? value.userId ?? "",
  resourceId: value.resource_id ?? value.resourceId ?? "",
  isSaved: value.is_saved ?? value.isSaved ?? false,
  isOfflineAvailable: value.is_offline_available ?? value.isOfflineAvailable ?? false,
  lastOpenedAt: value.last_opened_at ?? value.lastOpenedAt ?? null,
  readingProgressPercent: value.reading_progress_percent ?? value.readingProgressPercent ?? 0,
  userNote: value.user_note ?? value.userNote ?? undefined,
  highlightCount: value.highlight_count ?? value.highlightCount ?? 0
});

const mapNewsPost = (id: string, value: any): NewsPost => ({
  id,
  title: value.title,
  body: value.body,
  summary: value.summary,
  scopeType: value.scope_type ?? value.scopeType,
  organizationId: value.organization_id ?? value.organizationId,
  priorityLevel: value.priority_level ?? value.priorityLevel ?? "medium",
  topicTags: value.topic_tags ?? value.topicTags ?? [],
  coverImageUrl: value.cover_image_url ?? value.coverImageUrl,
  relatedEventId: value.related_event_id ?? value.relatedEventId ?? null,
  relatedResourceId: value.related_resource_id ?? value.relatedResourceId ?? null,
  relatedThreadId: value.related_thread_id ?? value.relatedThreadId ?? null,
  publishedAt: value.published_at ?? value.publishedAt ?? toDate(),
  expiresAt: value.expires_at ?? value.expiresAt ?? null,
  createdByType: value.created_by_type ?? value.createdByType ?? "national",
  isPinned: value.is_pinned ?? value.isPinned ?? false,
  isOfficial: value.is_official ?? value.isOfficial ?? false
});

const mapNewsState = (id: string, value: any): NewsState => ({
  id,
  userId: value.user_id ?? value.userId ?? "",
  newsPostId: value.news_post_id ?? value.newsPostId ?? "",
  isRead: value.is_read ?? value.isRead ?? false,
  isSaved: value.is_saved ?? value.isSaved ?? false,
  readAt: value.read_at ?? value.readAt ?? null,
  savedAt: value.saved_at ?? value.savedAt ?? null
});

const mapSocialChannel = (id: string, value: any): SocialChannel => ({
  id,
  organizationId: value.organization_id ?? value.organizationId,
  platform: value.platform,
  handle: value.handle,
  profileUrl: value.profile_url ?? value.profileUrl,
  displayName: value.display_name ?? value.displayName,
  isPrimary: value.is_primary ?? value.isPrimary ?? false,
  isActive: value.is_active ?? value.isActive ?? true,
  lastVerifiedAt: value.last_verified_at ?? value.lastVerifiedAt ?? null
});

const mapSocialHighlight = (id: string, value: any): SocialHighlight => ({
  id,
  socialChannelId: value.social_channel_id ?? value.socialChannelId,
  title: value.title,
  summary: value.summary,
  previewImageUrl: value.preview_image_url ?? value.previewImageUrl,
  externalPostUrl: value.external_post_url ?? value.externalPostUrl,
  publishedAt: value.published_at ?? value.publishedAt ?? toDate(),
  relatedEventId: value.related_event_id ?? value.relatedEventId ?? null,
  relatedNewsPostId: value.related_news_post_id ?? value.relatedNewsPostId ?? null
});

const mapStudyTrack = (id: string, value: any): StudyTrack => ({
  id,
  title: value.title,
  description: value.description,
  trackType: value.track_type ?? value.trackType,
  relatedEventId: value.related_event_id ?? value.relatedEventId ?? null,
  relatedResourceIds: value.related_resource_ids ?? value.relatedResourceIds ?? [],
  difficultyLevel: value.difficulty_level ?? value.difficultyLevel ?? "foundation",
  estimatedTotalMinutes: value.estimated_total_minutes ?? value.estimatedTotalMinutes ?? 0,
  tags: value.tags ?? [],
  isOfficial: value.is_official ?? value.isOfficial ?? false,
  createdAt: value.created_at ?? value.createdAt ?? toDate(),
  updatedAt: value.updated_at ?? value.updatedAt ?? toDate()
});

const mapStudyUnit = (id: string, value: any): StudyUnit => ({
  id,
  studyTrackId: value.study_track_id ?? value.studyTrackId,
  title: value.title,
  unitType: value.unit_type ?? value.unitType,
  contentRef: value.content_ref ?? value.contentRef ?? "",
  sequenceOrder: value.sequence_order ?? value.sequenceOrder ?? 0,
  estimatedMinutes: value.estimated_minutes ?? value.estimatedMinutes ?? 0
});

const mapStudyProgress = (id: string, value: any): StudyProgress => ({
  id,
  userId: value.user_id ?? value.userId ?? "",
  studyTrackId: value.study_track_id ?? value.studyTrackId ?? "",
  progressPercent: value.progress_percent ?? value.progressPercent ?? 0,
  lastOpenedAt: value.last_opened_at ?? value.lastOpenedAt ?? null,
  completedAt: value.completed_at ?? value.completedAt ?? null,
  weakTopics: value.weak_topics ?? value.weakTopics ?? [],
  nextRecommendedUnitId: value.next_recommended_unit_id ?? value.nextRecommendedUnitId ?? null
});

const mapQuizAttempt = (id: string, value: any): QuizAttempt => ({
  id,
  userId: value.user_id ?? value.userId ?? "",
  studyUnitId: value.study_unit_id ?? value.studyUnitId ?? "",
  scorePercent: value.score_percent ?? value.scorePercent ?? 0,
  questionCount: value.question_count ?? value.questionCount ?? 0,
  correctCount: value.correct_count ?? value.correctCount ?? 0,
  attemptedAt: value.attempted_at ?? value.attemptedAt ?? toDate(),
  missedTopicTags: value.missed_topic_tags ?? value.missedTopicTags ?? []
});

const mapForumThread = (id: string, value: any): ForumThread => ({
  id,
  categoryId: value.category_id ?? value.categoryId,
  authorUserId: value.author_user_id ?? value.authorUserId,
  title: value.title,
  body: value.body,
  threadType: value.thread_type ?? value.threadType ?? "discussion",
  status: value.status ?? "active",
  relatedEventId: value.related_event_id ?? value.relatedEventId ?? null,
  relatedResourceId: value.related_resource_id ?? value.relatedResourceId ?? null,
  relatedStudyTrackId: value.related_study_track_id ?? value.relatedStudyTrackId ?? null,
  tags: value.tags ?? [],
  replyCount: value.reply_count ?? value.replyCount ?? 0,
  helpfulCount: value.helpful_count ?? value.helpfulCount ?? 0,
  viewCount: value.view_count ?? value.viewCount ?? 0,
  createdAt: value.created_at ?? value.createdAt ?? toDate(),
  updatedAt: value.updated_at ?? value.updatedAt ?? toDate(),
  lastActivityAt: value.last_activity_at ?? value.lastActivityAt ?? toDate()
});

const mapForumReply = (id: string, value: any): ForumReply => ({
  id,
  threadId: value.thread_id ?? value.threadId,
  authorUserId: value.author_user_id ?? value.authorUserId,
  body: value.body,
  status: value.status ?? "active",
  helpfulCount: value.helpful_count ?? value.helpfulCount ?? 0,
  createdAt: value.created_at ?? value.createdAt ?? toDate(),
  updatedAt: value.updated_at ?? value.updatedAt ?? toDate()
});

const mapForumCategory = (id: string, value: any): ForumCategory => ({
  id,
  name: value.name,
  description: value.description,
  scopeType: value.scope_type ?? value.scopeType,
  organizationId: value.organization_id ?? value.organizationId ?? null,
  visibilityType: value.visibility_type ?? value.visibilityType ?? "public",
  sortOrder: value.sort_order ?? value.sortOrder ?? 0
});

export class FirebaseRepository implements FBLACentralRepository {
  async restoreSession() {
    const { auth, db } = getFirebaseServices();
    if (!auth.currentUser) return null;
    const snapshot = await getDoc(doc(db, "users", auth.currentUser.uid));
    return snapshot.exists() ? mapUser(snapshot.id, snapshot.data()) : null;
  }

  async signIn(input: SignInInput) {
    const { auth, db } = getFirebaseServices();

    try {
      const credential = await signInWithEmailAndPassword(auth, input.email, input.password);
      const snapshot = await getDoc(doc(db, "users", credential.user.uid));
      if (snapshot.exists()) return mapUser(snapshot.id, snapshot.data());
      throw new Error("Account exists in authentication but no user profile was found.");
    } catch (error) {
      if (!input.createIfNeeded) throw error;
      const credential = await createUserWithEmailAndPassword(auth, input.email, input.password);
      const baseUser: User = {
        id: credential.user.uid,
        division: "high_school",
        email: input.email,
        firstName: "",
        lastName: "",
        displayName: "",
        graduationYear: new Date().getFullYear(),
        schoolName: "",
        localChapterId: "",
        stateChapterId: "",
        stateSubdivisionId: null,
        goals: [],
        generalInterests: [],
        competitionInterests: [],
        notificationPreferences: {
          enabled: true,
          categories: {
            upcomingSavedEvents: true,
            urgentAnnouncements: true,
            studyReminders: true,
            followedThreadReplies: true,
            recommendedOpportunities: true,
            resourceUpdates: true
          },
          quietHours: {
            start: "22:00",
            end: "07:00"
          },
          digestFrequency: "daily"
        },
        privacyPreferences: {
          showSchoolName: false,
          showGraduationYear: false,
          showChapter: true
        },
        accessibilityPreferences: {
          largeText: false,
          highContrast: false,
          reducedMotion: false,
          screenReaderOptimized: false
        },
        onboardingComplete: false,
        createdAt: toDate(),
        updatedAt: toDate(),
        lastActiveAt: toDate()
      };
      await setDoc(doc(db, "users", credential.user.uid), {
        email: baseUser.email,
        division: baseUser.division,
        onboarding_complete: false,
        created_at: baseUser.createdAt,
        updated_at: baseUser.updatedAt,
        last_active_at: baseUser.lastActiveAt,
        notification_preferences: baseUser.notificationPreferences,
        privacy_preferences: baseUser.privacyPreferences,
        accessibility_preferences: baseUser.accessibilityPreferences,
        goals: [],
        general_interests: [],
        competition_interests: []
      });
      return baseUser;
    }
  }

  async signOut() {
    const { auth } = getFirebaseServices();
    await firebaseSignOut(auth);
  }

  async completeOnboarding(input: OnboardingInput) {
    const { auth, db } = getFirebaseServices();
    if (!auth.currentUser) throw new Error("You must be signed in to complete onboarding.");

    await setDoc(
      doc(db, "users", auth.currentUser.uid),
      {
        email: input.email || auth.currentUser.email,
        first_name: input.firstName,
        last_name: input.lastName,
        display_name: `${input.firstName} ${input.lastName}`,
        school_name: input.schoolName,
        graduation_year: input.graduationYear,
        local_chapter_id: input.localChapterId,
        state_chapter_id: input.stateChapterId,
        state_subdivision_id: input.stateSubdivisionId ?? null,
        goals: input.goals,
        general_interests: input.generalInterests,
        competition_interests: input.competitionInterests,
        notification_preferences: input.notificationPreferences,
        onboarding_complete: true,
        updated_at: toDate(),
        last_active_at: toDate()
      },
      { merge: true }
    );

    const snapshot = await getDoc(doc(db, "users", auth.currentUser.uid));
    return mapUser(snapshot.id, snapshot.data());
  }

  async getOrganizations() {
    const { db } = getFirebaseServices();
    const snapshot = await getDocs(collection(db, "organizations"));
    return snapshot.docs.map((item) => mapOrganization(item.id, item.data()));
  }

  async getEvents() {
    const { db } = getFirebaseServices();
    const snapshot = await getDocs(query(collection(db, "events"), orderBy("start_time", "asc")));
    return snapshot.docs.map((doc) => {
      const item = doc.data();
      return {
        id: doc.id,
        title: item.title,
        description: item.description,
        eventType: item.event_type ?? item.eventType,
        scopeType: item.scope_type ?? item.scopeType,
        organizationId: item.organization_id ?? item.organizationId,
        stateChapterId: item.state_chapter_id ?? item.stateChapterId ?? null,
        stateSubdivisionId: item.state_subdivision_id ?? item.stateSubdivisionId ?? null,
        localChapterId: item.local_chapter_id ?? item.localChapterId ?? null,
        startTime: item.start_time ?? item.startTime,
        endTime: item.end_time ?? item.endTime,
        timezone: item.timezone,
        locationName: item.location_name ?? item.locationName,
        locationAddress: item.location_address ?? item.locationAddress,
        virtualUrl: item.virtual_url ?? item.virtualUrl,
        status: item.status,
        coverImageUrl: item.cover_image_url ?? item.coverImageUrl,
        sourceType: item.source_type ?? item.sourceType,
        sourceReference: item.source_reference ?? item.sourceReference
      };
    });
  }

  async getEventSaves(): Promise<EventSave[]> {
    const { auth, db } = getFirebaseServices();
    if (!auth.currentUser) throw new Error("You must be signed in to load saved events.");

    const snapshot = await getDocs(collection(db, "users", auth.currentUser.uid, "event_saves"));
    return snapshot.docs.map((item) => {
      const value = item.data();
      return {
        id: item.id,
        userId: value.user_id ?? value.userId ?? auth.currentUser?.uid ?? "",
        eventId: value.event_id ?? value.eventId,
        savedAt: value.saved_at ?? value.savedAt ?? toDate(),
        reminder1: value.reminder1 ?? null,
        reminder2: value.reminder2 ?? null,
        personalNote: value.personal_note ?? value.personalNote ?? undefined,
        studyPlanId: value.study_plan_id ?? value.studyPlanId ?? null
      };
    });
  }

  async saveEvent(eventId: string, personalNote?: string) {
    const { auth, db, functions } = getFirebaseServices();
    if (!auth.currentUser) throw new Error("You must be signed in to save events.");

    try {
      const callable = httpsCallable(functions, "saveEventAndGeneratePrep");
      await callable({ eventId, personalNote });
    } catch {
      await setDoc(
        doc(db, "users", auth.currentUser.uid, "event_saves", eventId),
        {
          event_id: eventId,
          user_id: auth.currentUser.uid,
          personal_note: personalNote ?? "",
          saved_at: toDate()
        },
        { merge: true }
      );
    }
  }

  async updateEventSave(input: {
    eventId: string;
    isSaved: boolean;
    reminder1?: string | null;
    reminder2?: string | null;
    personalNote?: string;
  }) {
    const { auth, db } = getFirebaseServices();
    if (!auth.currentUser) throw new Error("You must be signed in to update saved events.");

    const saveRef = doc(db, "users", auth.currentUser.uid, "event_saves", input.eventId);

    if (!input.isSaved) {
      await deleteDoc(saveRef);
      return;
    }

    await setDoc(
      saveRef,
      {
        event_id: input.eventId,
        user_id: auth.currentUser.uid,
        personal_note: input.personalNote ?? "",
        reminder1: input.reminder1 ?? null,
        reminder2: input.reminder2 ?? null,
        saved_at: toDate()
      },
      { merge: true }
    );
  }

  async getResources() {
    const { db } = getFirebaseServices();
    const snapshot = await getDocs(collection(db, "resources"));
    return snapshot.docs.map((item) => mapResource(item.id, item.data()));
  }

  async getResourceState() {
    const { auth, db } = getFirebaseServices();
    if (!auth.currentUser) throw new Error("You must be signed in to load saved resources.");
    const snapshot = await getDocs(collection(db, "users", auth.currentUser.uid, "resource_state"));
    return snapshot.docs.map((item) => mapResourceState(item.id, item.data()));
  }

  async toggleResourceSave(resourceId: string) {
    const { auth, db } = getFirebaseServices();
    if (!auth.currentUser) throw new Error("You must be signed in to save resources.");
    const resourceStateRef = doc(db, "users", auth.currentUser.uid, "resource_state", resourceId);
    const existing = await getDoc(resourceStateRef);
    const existingValue = existing.exists() ? existing.data() : null;
    const nextIsSaved = !(existingValue?.is_saved ?? existingValue?.isSaved ?? false);

    await setDoc(
      resourceStateRef,
      {
        user_id: auth.currentUser.uid,
        resource_id: resourceId,
        is_saved: nextIsSaved,
        last_opened_at: toDate()
      },
      { merge: true }
    );
  }

  async getNews() {
    const { db } = getFirebaseServices();
    const snapshot = await getDocs(query(collection(db, "news_posts"), orderBy("published_at", "desc")));
    return snapshot.docs.map((item) => mapNewsPost(item.id, item.data()));
  }

  async getNewsState() {
    const { auth, db } = getFirebaseServices();
    if (!auth.currentUser) throw new Error("You must be signed in to load news state.");
    const snapshot = await getDocs(collection(db, "users", auth.currentUser.uid, "news_state"));
    return snapshot.docs.map((item) => mapNewsState(item.id, item.data()));
  }

  async markNewsRead(newsPostId: string) {
    const { auth, db } = getFirebaseServices();
    if (!auth.currentUser) throw new Error("You must be signed in to update news state.");
    await setDoc(
      doc(db, "users", auth.currentUser.uid, "news_state", newsPostId),
      {
        user_id: auth.currentUser.uid,
        news_post_id: newsPostId,
        is_read: true,
        read_at: toDate()
      },
      { merge: true }
    );
  }

  async updateNewsState(input: { newsPostId: string; isRead?: boolean; isSaved?: boolean }) {
    const { auth, db } = getFirebaseServices();
    if (!auth.currentUser) throw new Error("You must be signed in to update news state.");

    await setDoc(
      doc(db, "users", auth.currentUser.uid, "news_state", input.newsPostId),
      {
        user_id: auth.currentUser.uid,
        news_post_id: input.newsPostId,
        ...(typeof input.isRead === "boolean"
          ? {
              is_read: input.isRead,
              read_at: input.isRead ? toDate() : null
            }
          : {}),
        ...(typeof input.isSaved === "boolean"
          ? {
              is_saved: input.isSaved,
              saved_at: input.isSaved ? toDate() : null
            }
          : {})
      },
      { merge: true }
    );
  }

  async getSocialHub(): Promise<SocialHubPayload> {
    const { db } = getFirebaseServices();
    const [channelsSnapshot, highlightsSnapshot] = await Promise.all([
      getDocs(collection(db, "social_channels")),
      getDocs(collection(db, "social_highlights"))
    ]);

    return {
      channels: channelsSnapshot.docs.map((item) => mapSocialChannel(item.id, item.data())),
      highlights: highlightsSnapshot.docs.map((item) => mapSocialHighlight(item.id, item.data()))
    };
  }

  async getStudyTracks() {
    const { db } = getFirebaseServices();
    const snapshot = await getDocs(collection(db, "study_tracks"));
    return snapshot.docs.map((item) => mapStudyTrack(item.id, item.data()));
  }

  async getStudyUnits() {
    const { db } = getFirebaseServices();
    const snapshot = await getDocs(query(collection(db, "study_units"), orderBy("sequence_order", "asc")));
    return snapshot.docs.map((item) => mapStudyUnit(item.id, item.data()));
  }

  async getStudyProgress() {
    const { auth, db } = getFirebaseServices();
    if (!auth.currentUser) throw new Error("You must be signed in to load study progress.");
    const snapshot = await getDocs(collection(db, "users", auth.currentUser.uid, "study_progress"));
    return snapshot.docs.map((item) => mapStudyProgress(item.id, item.data()));
  }

  async getQuizAttempts() {
    const { auth, db } = getFirebaseServices();
    if (!auth.currentUser) throw new Error("You must be signed in to load quiz attempts.");
    const snapshot = await getDocs(query(collection(db, "quiz_attempts"), orderBy("attempted_at", "desc")));
    return snapshot.docs
      .map((item) => mapQuizAttempt(item.id, item.data()))
      .filter((item) => item.userId === auth.currentUser?.uid);
  }

  async submitQuizAttempt(input: {
    studyUnitId: string;
    scorePercent: number;
    questionCount: number;
    correctCount: number;
    missedTopicTags: string[];
  }): Promise<QuizAttempt> {
    const { auth, db } = getFirebaseServices();
    if (!auth.currentUser) throw new Error("You must be signed in to save quiz results.");
    const now = new Date().toISOString();

    const created = await addDoc(collection(db, "quiz_attempts"), {
      user_id: auth.currentUser.uid,
      study_unit_id: input.studyUnitId,
      score_percent: input.scorePercent,
      question_count: input.questionCount,
      correct_count: input.correctCount,
      attempted_at: toDate(),
      missed_topic_tags: input.missedTopicTags
    });

    return {
      id: created.id,
      userId: auth.currentUser.uid,
      studyUnitId: input.studyUnitId,
      scorePercent: input.scorePercent,
      questionCount: input.questionCount,
      correctCount: input.correctCount,
      attemptedAt: now,
      missedTopicTags: input.missedTopicTags
    };
  }

  async getForumCategories(): Promise<ForumCategory[]> {
    const { db } = getFirebaseServices();
    const snapshot = await getDocs(query(collection(db, "forum_categories"), orderBy("sort_order", "asc")));
    return snapshot.docs.map((item) => mapForumCategory(item.id, item.data()));
  }

  async getForumThreads(): Promise<ForumThread[]> {
    const { db } = getFirebaseServices();
    const snapshot = await getDocs(query(collection(db, "forum_threads"), orderBy("last_activity_at", "desc")));
    return snapshot.docs.map((item) => mapForumThread(item.id, item.data()));
  }

  async getForumReplies(threadId: string): Promise<ForumReply[]> {
    const { db } = getFirebaseServices();
    const snapshot = await getDocs(query(collection(db, "forum_replies"), orderBy("created_at", "asc")));
    return snapshot.docs.map((item) => mapForumReply(item.id, item.data())).filter((item) => item.threadId === threadId);
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
    const { auth, db } = getFirebaseServices();
    if (!auth.currentUser) throw new Error("You must be signed in to create a thread.");
    const now = new Date().toISOString();

    const created = await addDoc(collection(db, "forum_threads"), {
      category_id: input.categoryId,
      author_user_id: auth.currentUser.uid,
      title: input.title,
      body: input.body,
      thread_type: input.threadType,
      status: "active",
      related_event_id: input.relatedEventId ?? null,
      related_resource_id: input.relatedResourceId ?? null,
      related_study_track_id: input.relatedStudyTrackId ?? null,
      tags: input.tags ?? [],
      reply_count: 0,
      helpful_count: 0,
      view_count: 0,
      created_at: toDate(),
      updated_at: toDate(),
      last_activity_at: toDate()
    });
    return {
      id: created.id,
      categoryId: input.categoryId,
      authorUserId: auth.currentUser.uid,
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
  }

  async postForumReply(threadId: string, body: string) {
    const { auth, db, functions } = getFirebaseServices();
    if (!auth.currentUser) throw new Error("You must be signed in to reply.");

    try {
      const callable = httpsCallable(functions, "createForumReply");
      await callable({ threadId, body });
    } catch {
      await addDoc(collection(db, "forum_replies"), {
        thread_id: threadId,
        author_user_id: auth.currentUser.uid,
        body,
        status: "active",
        helpful_count: 0,
        created_at: toDate(),
        updated_at: toDate()
      });

      await updateDoc(doc(db, "forum_threads", threadId), {
        last_activity_at: toDate()
      });
    }
  }

  async askAI(input: AskAIInput): Promise<AskAIResult> {
    const { functions } = getFirebaseServices();
    const callable = httpsCallable(functions, "askAIAssistant");
    const result = await callable(input);
    return result.data as AskAIResult;
  }

  async search(query: string) {
    const { auth } = getFirebaseServices();
    const [organizations, events, resources, resourceState, newsPosts, newsState, social, studyTracks, studyUnits, studyProgress, quizAttempts, categories, threads, user] =
      await Promise.all([
        this.getOrganizations(),
        this.getEvents(),
        this.getResources(),
        this.getResourceState().catch(() => []),
        this.getNews(),
        this.getNewsState().catch(() => []),
        this.getSocialHub(),
        this.getStudyTracks(),
        this.getStudyUnits().catch(() => []),
        this.getStudyProgress().catch(() => []),
        this.getQuizAttempts().catch(() => []),
        this.getForumCategories().catch(() => []),
        this.getForumThreads(),
        this.restoreSession()
      ]);

    const dataset: DemoDataset = {
      organizations,
      user:
        user ??
        ({
          id: auth.currentUser?.uid ?? "anonymous",
          division: "high_school",
          email: auth.currentUser?.email ?? "",
          firstName: "",
          lastName: "",
          displayName: "",
          graduationYear: new Date().getFullYear(),
          schoolName: "",
          localChapterId: "",
          stateChapterId: "",
          stateSubdivisionId: null,
          goals: [],
          generalInterests: [],
          competitionInterests: [],
          notificationPreferences: {
            enabled: true,
            categories: {
              upcomingSavedEvents: true,
              urgentAnnouncements: true,
              studyReminders: true,
              followedThreadReplies: true,
              recommendedOpportunities: true,
              resourceUpdates: true
            },
            quietHours: { start: "22:00", end: "07:00" },
            digestFrequency: "daily"
          },
          privacyPreferences: {
            showSchoolName: false,
            showGraduationYear: false,
            showChapter: true
          },
          accessibilityPreferences: {
            largeText: false,
            highContrast: false,
            reducedMotion: false,
            screenReaderOptimized: false
          },
          onboardingComplete: false,
          createdAt: toDate(),
          updatedAt: toDate(),
          lastActiveAt: toDate()
        } as User),
      events,
      eventSaves: [],
      resources,
      resourceState,
      newsPosts,
      newsState,
      socialChannels: social.channels,
      socialHighlights: social.highlights,
      studyTracks,
      studyUnits,
      studyProgress,
      quizAttempts,
      forumCategories: categories,
      forumThreads: threads,
      forumReplies: [],
      forumFollows: [],
      aiConversations: [],
      aiGeneratedAssets: []
    };

    return runUnifiedSearch(dataset, query);
  }

  async getHomeBundle(): Promise<HomeBundle> {
    const { auth, functions } = getFirebaseServices();
    if (!auth.currentUser) throw new Error("You must be signed in to load the home screen.");

    try {
      const callable = httpsCallable(functions, "getRecommendations");
      const result = await callable({ userId: auth.currentUser.uid });
      const payload = result.data as HomeBundle | undefined;
      if (payload) return payload;
    } catch {
      // Fall back to local assembly below if functions are not yet deployed.
    }

    const [organizations, events, resources, resourceState, newsPosts, newsState, social, studyTracks, studyUnits, studyProgress, quizAttempts, categories, threads, user] =
      await Promise.all([
        this.getOrganizations(),
        this.getEvents(),
        this.getResources(),
        this.getResourceState().catch(() => []),
        this.getNews(),
        this.getNewsState().catch(() => []),
        this.getSocialHub(),
        this.getStudyTracks(),
        this.getStudyUnits().catch(() => []),
        this.getStudyProgress().catch(() => []),
        this.getQuizAttempts().catch(() => []),
        this.getForumCategories().catch(() => []),
        this.getForumThreads(),
        this.restoreSession()
      ]);

    if (!user) {
      throw new Error("Signed-in user profile not found.");
    }

    return buildHomeBundle({
      organizations,
      user,
      events,
      eventSaves: [],
      resources,
      resourceState,
      newsPosts,
      newsState,
      socialChannels: social.channels,
      socialHighlights: social.highlights,
      studyTracks,
      studyUnits,
      studyProgress,
      quizAttempts,
      forumCategories: categories,
      forumThreads: threads,
      forumReplies: [],
      forumFollows: [],
      aiConversations: [],
      aiGeneratedAssets: []
    });
  }
}
