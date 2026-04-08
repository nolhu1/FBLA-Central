import { Pressable, StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

interface StudyFocusCardProps {
  title: string;
  description: string;
  meta: string;
  progressLabel?: string;
  onPress: () => void;
}

export const StudyFocusCard = ({
  title,
  description,
  meta,
  progressLabel,
  onPress
}: StudyFocusCardProps) => (
  <Pressable style={styles.card} onPress={onPress}>
    <View style={styles.topRow}>
      <Text style={styles.kicker}>Study focus</Text>
      {progressLabel ? <Text style={styles.progress}>{progressLabel}</Text> : null}
    </View>
    <Text style={styles.title} numberOfLines={2}>
      {title}
    </Text>
    <Text style={styles.summary} numberOfLines={2}>
      {description}
    </Text>
    <Text style={styles.meta}>{meta}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: "rgba(78,216,199,0.08)",
    borderWidth: 1,
    borderColor: "rgba(78,216,199,0.18)",
    gap: 6
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.sm
  },
  kicker: {
    ...theme.typography.label,
    color: palette.teal
  },
  progress: {
    ...theme.typography.label,
    color: palette.gold
  },
  title: {
    ...theme.typography.title,
    fontSize: 18,
    color: palette.cream
  },
  summary: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 17
  },
  meta: {
    ...theme.typography.label,
    color: palette.sky
  }
});
