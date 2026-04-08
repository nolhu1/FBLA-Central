import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

export const RelatedResourcesSection = ({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.content}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  section: {
    gap: theme.spacing.sm
  },
  title: {
    ...theme.typography.title,
    color: palette.cream
  },
  content: {
    gap: theme.spacing.sm
  }
});
