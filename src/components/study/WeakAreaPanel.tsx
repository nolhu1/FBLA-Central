import { StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

interface WeakAreaPanelProps {
  title: string;
  topic?: string | null;
  summary: string;
}

export const WeakAreaPanel = ({ title, topic, summary }: WeakAreaPanelProps) => (
  <View style={styles.card}>
    <Text style={styles.label}>{title}</Text>
    <Text style={styles.topic}>{topic ?? "No weak topic detected yet"}</Text>
    <Text style={styles.summary}>{summary}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: theme.spacing.md,
    backgroundColor: "rgba(255,138,122,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,138,122,0.22)",
    gap: 6
  },
  label: {
    ...theme.typography.label,
    color: palette.warning
  },
  topic: {
    ...theme.typography.title,
    color: palette.cream
  },
  summary: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 19
  }
});
