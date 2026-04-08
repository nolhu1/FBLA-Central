import { StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

export const ProfileMetricTileRow = ({
  metrics
}: {
  metrics: { label: string; value: string }[];
}) => (
  <View style={styles.card}>
    {metrics.map((metric) => (
      <View key={metric.label} style={styles.metric}>
        <Text style={styles.value} numberOfLines={1}>
          {metric.value}
        </Text>
        <Text style={styles.label} numberOfLines={1}>
          {metric.label}
        </Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "stretch",
    borderRadius: 18,
    paddingHorizontal: 4,
    paddingVertical: 4,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: palette.border,
    overflow: "hidden"
  },
  metric: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    paddingVertical: 7,
    gap: 1
  },
  value: {
    ...theme.typography.title,
    fontSize: 16,
    color: palette.cream
  },
  label: {
    ...theme.typography.label,
    fontSize: 11,
    color: palette.sky
  }
});
