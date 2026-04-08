import { ScrollView, StyleSheet } from "react-native";

import { StudyDashboard } from "@/domain/services/study";
import { theme } from "@/theme";

import { MasteryBreakdownCard } from "./MasteryBreakdownCard";
import { MetricTileRow } from "./MetricTileRow";
import { ReadinessCard } from "./ReadinessCard";
import { WeeklyStudyChartCard } from "./WeeklyStudyChartCard";

interface ProgressTabPanelProps {
  dashboard: StudyDashboard;
}

export const ProgressTabPanel = ({ dashboard }: ProgressTabPanelProps) => (
  <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <WeeklyStudyChartCard title="Weekly activity" subtitle="Contained view of recent study pulses" data={dashboard.weeklyActivity} />
    <MetricTileRow metrics={dashboard.metrics} />
    <MasteryBreakdownCard title="Topic mastery" items={dashboard.mastery.slice(0, 5)} />
    <ReadinessCard score={dashboard.readinessScore} summary={dashboard.readinessSummary} trend={dashboard.accuracyTrend} />
  </ScrollView>
);

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.md
  }
});
