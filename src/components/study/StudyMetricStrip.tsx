import { StyleSheet, Text, View } from "react-native";

import { StudyMetric } from "@/domain/services/study";
import { palette, theme } from "@/theme";

interface StudyMetricStripProps {
  readinessScore: number;
  metrics: StudyMetric[];
}

const toneMap = {
  gold: palette.gold,
  sky: palette.sky,
  teal: palette.teal
};

export const StudyMetricStrip = ({ readinessScore, metrics }: StudyMetricStripProps) => (
  <View style={styles.row}>
    <View style={styles.readinessCard}>
      <View style={styles.ring}>
        <Text style={styles.ringValue}>{readinessScore}%</Text>
      </View>
      <Text style={styles.readinessLabel}>Readiness</Text>
    </View>
    <View style={styles.metricColumn}>
      {metrics.slice(0, 3).map((metric) => (
        <View key={metric.label} style={styles.metricTile}>
          <Text style={[styles.metricValue, { color: toneMap[metric.tone] }]}>{metric.value}</Text>
          <Text style={styles.metricLabel}>{metric.label}</Text>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10
  },
  readinessCard: {
    width: 112,
    borderRadius: 22,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border
  },
  ring: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 6,
    borderColor: palette.gold,
    backgroundColor: "rgba(8,17,30,0.76)"
  },
  ringValue: {
    ...theme.typography.title,
    fontSize: 18,
    color: palette.cream
  },
  readinessLabel: {
    ...theme.typography.label,
    color: palette.mist
  },
  metricColumn: {
    flex: 1,
    gap: 8
  },
  metricTile: {
    flex: 1,
    minHeight: 40,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8
  },
  metricValue: {
    ...theme.typography.title,
    fontSize: 16
  },
  metricLabel: {
    ...theme.typography.label,
    color: palette.mist
  }
});
