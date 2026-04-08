import { StyleSheet, Text, View } from "react-native";

import { StudyMetric } from "@/domain/services/study";
import { palette, theme } from "@/theme";

interface MetricTileRowProps {
  metrics: StudyMetric[];
}

const toneMap = {
  gold: palette.gold,
  sky: palette.sky,
  teal: palette.teal
};

export const MetricTileRow = ({ metrics }: MetricTileRowProps) => (
  <View style={styles.row}>
    {metrics.map((metric) => (
      <View key={metric.label} style={styles.tile}>
        <Text style={[styles.value, { color: toneMap[metric.tone] }]}>{metric.value}</Text>
        <Text style={styles.label}>{metric.label}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  tile: {
    flexBasis: "48%",
    flexGrow: 1,
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 4
  },
  value: {
    ...theme.typography.display,
    fontSize: 23
  },
  label: {
    ...theme.typography.label,
    color: palette.mist
  }
});
