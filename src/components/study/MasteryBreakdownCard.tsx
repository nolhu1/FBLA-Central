import { StyleSheet, Text, View } from "react-native";

import { StudyMasteryItem } from "@/domain/services/study";
import { palette, theme } from "@/theme";

interface MasteryBreakdownCardProps {
  title: string;
  items: StudyMasteryItem[];
}

const toneMap = {
  strong: palette.teal,
  steady: palette.sky,
  weak: palette.warning
};

export const MasteryBreakdownCard = ({ title, items }: MasteryBreakdownCardProps) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.rows}>
      {items.map((item) => (
        <View key={item.topic} style={styles.row}>
          <View style={styles.rowHeader}>
            <Text style={styles.topic} numberOfLines={1}>
              {item.topic}
            </Text>
            <Text style={styles.score}>{item.score}%</Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${item.score}%`, backgroundColor: toneMap[item.state] }]} />
          </View>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: theme.spacing.md,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 12
  },
  title: {
    ...theme.typography.title,
    color: palette.cream
  },
  rows: {
    gap: 10
  },
  row: {
    gap: 6
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10
  },
  topic: {
    ...theme.typography.body,
    color: palette.cream,
    flex: 1
  },
  score: {
    ...theme.typography.label,
    color: palette.mist
  },
  track: {
    height: 9,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden"
  },
  fill: {
    height: "100%",
    borderRadius: 999
  }
});
