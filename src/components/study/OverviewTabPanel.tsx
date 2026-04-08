import { ScrollView, StyleSheet, View } from "react-native";

import { ActiveTrackCard } from "@/components/study/ActiveTrackCard";
import { RecommendedStudyCard } from "@/components/study/RecommendedStudyCard";
import { StudyMetricStrip } from "@/components/study/StudyMetricStrip";
import { StudyDashboard } from "@/domain/services/study";
import { theme } from "@/theme";

import { WeakAreaPanel } from "./WeakAreaPanel";

interface OverviewTabPanelProps {
  dashboard: StudyDashboard;
  onNavigate: (name: string, params?: Record<string, string | undefined>) => void;
}

export const OverviewTabPanel = ({ dashboard, onNavigate }: OverviewTabPanelProps) => (
  <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <StudyMetricStrip readinessScore={dashboard.readinessScore} metrics={dashboard.metrics} />

    {dashboard.recommendations[0] ? (
      <RecommendedStudyCard
        eyebrow={dashboard.recommendations[0].kind}
        title={dashboard.recommendations[0].title}
        caption={dashboard.recommendations[0].caption}
        meta={dashboard.recommendations[0].meta}
        onPress={() => onNavigate(dashboard.recommendations[0].route.name, dashboard.recommendations[0].route.params)}
      />
    ) : null}

    <WeakAreaPanel
      title="Needs review"
      topic={dashboard.suggestedTopic?.topic}
      summary={
        dashboard.suggestedTopic
          ? `Review ${dashboard.suggestedTopic.topic} next for the fastest lift in confidence.`
          : "Weak topics will appear here after more study activity."
      }
    />

    {dashboard.activeTracks[0] ? (
      <ActiveTrackCard
        eyebrow={dashboard.activeTracks[0].eyebrow}
        title={dashboard.activeTracks[0].title}
        summary={dashboard.activeTracks[0].summary}
        meta={dashboard.activeTracks[0].meta}
        onPress={() => onNavigate(dashboard.activeTracks[0].route.name, dashboard.activeTracks[0].route.params)}
      />
    ) : null}

    {dashboard.recentSessions[0] ? (
      <View style={styles.bottomCard}>
        <ActiveTrackCard
          eyebrow={dashboard.recentSessions[0].eyebrow}
          title={dashboard.recentSessions[0].title}
          summary={dashboard.recentSessions[0].summary}
          meta={dashboard.recentSessions[0].meta}
          onPress={() => onNavigate(dashboard.recentSessions[0].route.name, dashboard.recentSessions[0].route.params)}
        />
      </View>
    ) : null}
  </ScrollView>
);

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    paddingTop: 2
  },
  bottomCard: {
    paddingBottom: 2
  }
});
