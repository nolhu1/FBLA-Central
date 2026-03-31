import { StyleSheet, Text, View } from "react-native";

import { GlassCard } from "@/components/cards/GlassCard";
import { palette, theme } from "@/theme";

interface EmptyStateProps {
  title: string;
  body: string;
}

export const EmptyState = ({ title, body }: EmptyStateProps) => (
  <GlassCard>
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  </GlassCard>
);

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.spacing.sm
  },
  title: {
    ...theme.typography.title,
    color: palette.cream
  },
  body: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 21
  }
});
