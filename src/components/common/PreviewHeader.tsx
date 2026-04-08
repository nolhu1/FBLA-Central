import { Pressable, StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

interface PreviewHeaderProps {
  title: string;
  caption?: string;
  actionLabel?: string;
  onPressAction?: () => void;
}

export const PreviewHeader = ({
  title,
  caption,
  actionLabel,
  onPressAction
}: PreviewHeaderProps) => (
  <View style={styles.row}>
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
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
