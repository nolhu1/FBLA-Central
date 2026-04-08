import { StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

interface WeeklyStudyChartCardProps {
  title: string;
  subtitle: string;
  data: { day: string; value: number }[];
}

export const WeeklyStudyChartCard = ({ title, subtitle, data }: WeeklyStudyChartCardProps) => {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.chart}>
        {data.map((item, index) => (
          <View key={`${item.day}-${index}`} style={styles.column}>
            <View style={styles.barTrack}>
              <View style={[styles.bar, { height: `${Math.max(12, (item.value / maxValue) * 100)}%` }]} />
            </View>
            <Text style={styles.day}>{item.day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1.2,
    minHeight: 190,
    borderRadius: 24,
    padding: theme.spacing.md,
    backgroundColor: "rgba(13,34,60,0.68)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 6
  },
  title: {
    ...theme.typography.title,
    fontSize: 18,
    color: palette.cream
  },
  subtitle: {
    ...theme.typography.label,
    color: palette.slate
  },
  chart: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8,
    paddingTop: 8
  },
  column: {
    flex: 1,
    alignItems: "center",
    gap: 8
  },
  barTrack: {
    width: "100%",
    flex: 1,
    minHeight: 94,
    alignItems: "center",
    justifyContent: "flex-end",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    overflow: "hidden"
  },
  bar: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: palette.teal
  },
  day: {
    ...theme.typography.label,
    color: palette.mist
  }
});
