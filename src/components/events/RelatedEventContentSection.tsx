import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

interface RelatedEventContentSectionProps {
  title: string;
  caption?: string;
  children: ReactNode;
}

export const RelatedEventContentSection = ({
  title,
  caption,
  children
}: RelatedEventContentSectionProps) => (
  <View style={styles.section}>
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
    <View style={styles.content}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  section: {
    gap: theme.spacing.sm
  },
  header: {
    gap: 2
  },
  title: {
    ...theme.typography.title,
    color: palette.cream
  },
  caption: {
    ...theme.typography.label,
    color: palette.slate
  },
  content: {
    gap: theme.spacing.sm
  }
});
