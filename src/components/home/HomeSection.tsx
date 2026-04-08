import { PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

interface HomeSectionProps extends PropsWithChildren {
  title: string;
  caption?: string;
  actionLabel?: string;
  onPressAction?: () => void;
}

export const HomeSection = ({
  title,
  caption,
  actionLabel,
  onPressAction,
  children
}: HomeSectionProps) => (
  <View style={styles.section}>
    <View style={styles.header}>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {caption ? <Text style={styles.caption}>{caption}</Text> : null}
      </View>
      {actionLabel && onPressAction ? (
        <Pressable onPress={onPressAction}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  section: {
    gap: theme.spacing.sm
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md
  },
  copy: {
    flex: 1,
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
  action: {
    ...theme.typography.label,
    color: palette.gold
  }
});
