import { OnboardingInput } from "@/data/schemas/onboarding";
import { demoOptionCatalog } from "@/features/demo/demoData";
import {
  EventSave,
  HomeBundle,
  NewsState,
  Organization,
  ResourceState,
  StudyProgress,
  User
} from "@/domain/models/types";

export type OnboardingStepKey =
  | "welcome"
  | "organization"
  | "basics"
  | "interests"
  | "notifications"
  | "complete";

export const onboardingSteps: { key: OnboardingStepKey; label: string }[] = [
  { key: "welcome", label: "Welcome" },
  { key: "organization", label: "Chapter" },
  { key: "basics", label: "Profile" },
  { key: "interests", label: "Interests" },
  { key: "notifications", label: "Alerts" },
  { key: "complete", label: "Ready" }
];

export const graduationYearOptions = Array.from({ length: 7 }, (_, index) => new Date().getFullYear() + index);

export const memberGoalOptions = demoOptionCatalog.goals;
export const memberInterestOptions = demoOptionCatalog.generalInterests;
export const memberCompetitionOptions = demoOptionCatalog.competitionInterests;

export const buildOnboardingDefaults = (
  user: User | null,
  _organizations: Organization[]
): OnboardingInput => {
  return {
    firstName: "",
    lastName: "",
    email: user?.email ?? "",
    schoolName: "",
    graduationYear: null,
    localChapterId: "",
    stateChapterId: "",
    stateSubdivisionId: null,
    goals: [],
    generalInterests: [],
    competitionInterests: [],
    notificationPreferences: {
      enabled: false,
      categories: {
        upcomingSavedEvents: false,
        urgentAnnouncements: false,
        studyReminders: false,
        followedThreadReplies: false,
        recommendedOpportunities: false,
        resourceUpdates: false
      },
      quietHours: {
        start: "22:00",
        end: "07:00"
      },
      digestFrequency: null
    }
  };
};

export const getOrganizationOptions = (organizations: Organization[], stateChapterId?: string) => {
  const stateChapters = organizations.filter((item) => item.type === "state_chapter");
  const localChapters = organizations.filter(
    (item) =>
      item.type === "local_chapter" &&
      (!stateChapterId || item.parentOrganizationId === stateChapterId || item.stateCode === stateChapters.find((state) => state.id === stateChapterId)?.stateCode)
  );
  const subdivisions = organizations.filter(
    (item) => item.type === "state_subdivision" && (!stateChapterId || item.parentOrganizationId === stateChapterId)
  );

  return { stateChapters, localChapters, subdivisions };
};

export const canAdvanceOnboardingStep = (step: OnboardingStepKey, values: OnboardingInput) => {
  switch (step) {
    case "welcome":
      return true;
    case "organization":
      return Boolean(values.stateChapterId && values.localChapterId);
    case "basics":
      return Boolean(values.firstName.trim() && values.lastName.trim() && values.schoolName.trim() && values.graduationYear);
    case "interests":
      return Boolean(values.goals.length && values.generalInterests.length && values.competitionInterests.length);
    case "notifications":
      return true;
    case "complete":
      return true;
  }
};

export const buildProfileIdentity = (user: User, organizations: Organization[]) => {
  const localChapter = organizations.find((item) => item.id === user.localChapterId);
  const stateChapter = organizations.find((item) => item.id === user.stateChapterId);
  const subdivision = organizations.find((item) => item.id === user.stateSubdivisionId);

  return {
    displayName: user.displayName || `${user.firstName} ${user.lastName}`,
    roleLabel: "High School Member",
    schoolName: user.schoolName,
    localChapterLabel: localChapter?.name ?? "Local chapter",
    stateChapterLabel: stateChapter?.shortName ?? stateChapter?.name ?? "State chapter",
    subdivisionLabel: subdivision?.name ?? null,
    graduationLabel: `Class of ${user.graduationYear}`
  };
};

export const buildProfileMetrics = ({
  home,
  eventSaves,
  resourceState,
  newsState,
  studyProgress
}: {
  home?: HomeBundle;
  eventSaves: EventSave[];
  resourceState: ResourceState[];
  newsState: NewsState[];
  studyProgress: StudyProgress[];
}) => {
  const activeTracks = studyProgress.filter((item) => item.progressPercent > 0 && !item.completedAt).length;

  return [
    { label: "Events", value: String(eventSaves.length) },
    { label: "Resources", value: String(resourceState.filter((item) => item.isSaved).length) },
    { label: "News", value: String(newsState.filter((item) => item.isSaved).length) },
    { label: "Study", value: activeTracks ? String(activeTracks) : `${home?.momentumSnapshot.studyProgress ?? 0}%` }
  ];
};

export const buildSavedQuickLinks = ({
  eventSaves,
  resourceState,
  newsState
}: {
  eventSaves: EventSave[];
  resourceState: ResourceState[];
  newsState: NewsState[];
}) => [
  {
    key: "events",
    title: "Saved events",
    subtitle: `${eventSaves.length} planning items`,
    routeName: "Events"
  },
  {
    key: "resources",
    title: "Saved resources",
    subtitle: `${resourceState.filter((item) => item.isSaved).length} guides and templates`,
    routeName: "Resources"
  },
  {
    key: "news",
    title: "Saved news",
    subtitle: `${newsState.filter((item) => item.isSaved).length} updates`,
    routeName: "News"
  }
];
