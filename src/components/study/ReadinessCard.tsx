import { StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

interface ReadinessCardProps {
  score: number;
  summary: string;
  trend: number[];
}

export const ReadinessCard = ({ score, summary, trend }: ReadinessCardProps) => {
  const max = Math.max(...trend, 100);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.label}>Momentum</Text>
          <Text style={styles.score}>{score}% ready</Text>
        </View>
        <View style={styles.sparkline}>
          {trend.length ? (
            trend.map((value, index) => (
              <View key={`${value}-${index}`} style={styles.sparkColumn}>
                <View style={[styles.sparkBar, { height: `${Math.max(18, (value / max) * 100)}%` }]} />
              </View>
            ))
          ) : (
            <Text style={styles.fallback}>No quiz trend yet</Text>
          )}
        </View>
      </View>
      <Text style={styles.summary}>{summary}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: theme.spacing.md,
    backgroundColor: "rgba(78,216,199,0.10)",
    borderWidth: 1,
    borderColor: "rgba(78,216,199,0.22)",
    gap: 10
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14
  },
  label: {
    ...theme.typography.label,
    color: palette.teal
  },
  score: {
    ...theme.typography.display,
    fontSize: 24,
    color: palette.cream
  },
  sparkline: {
    flex: 1,
    minHeight: 54,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    gap: 5
  },
  sparkColumn: {
    width: 12,
    height: 54,
    justifyContent: "flex-end"
  },
  sparkBar: {
    width: "100%",
    borderRadius: 999,
    backgroundColor: palette.teal
  },
  fallback: {
    ...theme.typography.label,
    color: palette.mist
  },
  summary: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 19
  }
});
