import { ScrollView, StyleSheet, View } from "react-native";

import { StudyDashboard } from "@/domain/services/study";
import { theme } from "@/theme";

import { ActiveTrackCard } from "./ActiveTrackCard";
import { MasteryBreakdownCard } from "./MasteryBreakdownCard";
import { WeakAreaPanel } from "./WeakAreaPanel";

interface ReviewTabPanelProps {
  dashboard: StudyDashboard;
  onNavigate: (name: string, params?: Record<string, string | undefined>) => void;
}

export const ReviewTabPanel = ({ dashboard, onNavigate }: ReviewTabPanelProps) => (
  <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <WeakAreaPanel
      title="Primary review target"
      topic={dashboard.suggestedTopic?.topic}
      summary={
        dashboard.suggestedTopic
          ? `This topic is holding back readiness more than the others right now.`
          : "Once you miss questions or pause a track, review targets will appear here."
      }
    />
    <MasteryBreakdownCard title="Weakest topics" items={dashboard.weakest} />
    <View style={styles.list}>
      {dashboard.recentSessions.map((item) => (
        <ActiveTrackCard
          key={item.id}
          eyebrow={item.eyebrow}
          title={item.title}
          summary={item.summary}
          meta={item.meta}
          onPress={() => onNavigate(item.route.name, item.route.params)}
        />
      ))}
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.md
  },
  list: {
    gap: theme.spacing.sm
  }
});
