import { StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

interface EmptySocialStateProps {
  title: string;
  body: string;
}

export const EmptySocialState = ({ title, body }: EmptySocialStateProps) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.body}>{body}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 4
  },
  title: {
    ...theme.typography.label,
    color: palette.cream
  },
  body: {
    ...theme.typography.body,
    color: palette.slate
  }
});
