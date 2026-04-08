import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { AnimatedSwitcher } from "@/components/common/AnimatedSwitcher";
import { ContinueStudyCompactHero } from "@/components/study/ContinueStudyCompactHero";
import { EmptyStudyState } from "@/components/study/EmptyStudyState";
import { OverviewTabPanel } from "@/components/study/OverviewTabPanel";
import { PracticeTabPanel } from "@/components/study/PracticeTabPanel";
import { ProgressTabPanel } from "@/components/study/ProgressTabPanel";
import { ReviewTabPanel } from "@/components/study/ReviewTabPanel";
import { StudyHeader } from "@/components/study/StudyHeader";
import { StudySkeletonLoader } from "@/components/study/StudySkeletonLoader";
import { StudyTabKey, StudyTabSwitcher } from "@/components/study/StudyTabSwitcher";
import { buildStudyDashboard } from "@/domain/services/study";
import { useAppSelector } from "@/store/hooks";
import {
  useGetEventsQuery,
  useGetForumThreadsQuery,
  useGetHomeBundleQuery,
  useGetQuizAttemptsQuery,
  useGetResourcesQuery,
  useGetStudyProgressQuery,
  useGetStudyTracksQuery,
  useGetStudyUnitsQuery
} from "@/store/services/fblaApi";
import { palette, theme } from "@/theme";

export const StudyScreen = ({ navigation }: any) => {
  const user = useAppSelector((state) => state.session.user);
  const { data: home } = useGetHomeBundleQuery();
  const { data: tracks = [], isLoading } = useGetStudyTracksQuery();
  const { data: units = [] } = useGetStudyUnitsQuery();
  const { data: progress = [] } = useGetStudyProgressQuery();
  const { data: quizAttempts = [] } = useGetQuizAttemptsQuery();
  const { data: resources = [] } = useGetResourcesQuery();
  const { data: events = [] } = useGetEventsQuery();
  const { data: threads = [] } = useGetForumThreadsQuery();
  const [activeTab, setActiveTab] = useState<StudyTabKey>("overview");

  const dashboard = useMemo(
    () =>
      buildStudyDashboard({
        user,
        home,
        tracks,
        units,
        progress,
        quizAttempts,
        resources,
        events,
        threads
      }),
    [user, home, tracks, units, progress, quizAttempts, resources, events, threads]
  );

  const navigateTo = (name: string, params?: Record<string, string | undefined>) => {
    navigation.navigate(name, params);
  };

  const renderTab = () => {
    if (activeTab === "practice") {
      return <PracticeTabPanel dashboard={dashboard} onNavigate={navigateTo} />;
    }
    if (activeTab === "progress") {
      return <ProgressTabPanel dashboard={dashboard} />;
    }
    if (activeTab === "review") {
      return <ReviewTabPanel dashboard={dashboard} onNavigate={navigateTo} />;
    }
    return <OverviewTabPanel dashboard={dashboard} onNavigate={navigateTo} />;
  };

  return (
    <AppScreen
      title="Study"
      scroll={false}
      includeTopSafeArea={false}
      showBackButton={false}
      hideDefaultHeader
    >
      {isLoading ? (
        <StudySkeletonLoader />
      ) : (
        <View style={styles.screen}>
          <View style={styles.topSection}>
            <StudyHeader title={dashboard.title} subtitle={dashboard.subtitle} />

            {dashboard.hero ? (
              <ContinueStudyCompactHero
                title={dashboard.hero.title}
                summary={dashboard.hero.summary}
                progressPercent={dashboard.hero.progressPercent}
                readinessLabel={dashboard.hero.readinessLabel}
                primaryActionLabel={dashboard.hero.primaryActionLabel}
                secondaryActionLabel={dashboard.hero.secondaryActionLabel}
                onPressPrimary={() => navigateTo(dashboard.hero!.primaryRoute.name, dashboard.hero!.primaryRoute.params)}
                onPressSecondary={() => navigateTo(dashboard.hero!.secondaryRoute.name, dashboard.hero!.secondaryRoute.params)}
              />
            ) : (
              <EmptyStudyState
                title="No active study flow yet"
                body="Open a recommended track to build momentum and make this screen more personalized."
              />
            )}

            <StudyTabSwitcher value={activeTab} onChange={setActiveTab} />
          </View>

          <AnimatedSwitcher switchKey={activeTab} style={styles.tabPane}>{renderTab()}</AnimatedSwitcher>
        </View>
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: theme.spacing.md,
    minHeight: 0,
    paddingBottom: 4
  },
  topSection: {
    flexShrink: 0,
    gap: 8
  },
  tabPane: {
    flex: 1,
    minHeight: 0,
    borderRadius: 24,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.035)",
    borderWidth: 1,
    borderColor: palette.border
  }
});
