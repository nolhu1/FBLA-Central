import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { palette, theme } from "@/theme";

interface NewsHeaderProps {
  title: string;
  subtitle: string;
  savedOnly: boolean;
  unreadCount: number;
  onToggleSaved: () => void;
}

export const NewsHeader = ({ title, subtitle, savedOnly, unreadCount, onToggleSaved }: NewsHeaderProps) => (
  <View style={styles.header}>
    <View style={styles.copy}>
      <Text style={styles.eyebrow}>Official updates</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.meta}>{unreadCount} unread across your feed</Text>
    </View>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={savedOnly ? "Show all news" : "Show saved news"}
      style={({ pressed }) => [styles.action, savedOnly ? styles.actionActive : null, pressed ? styles.pressed : null]}
      onPress={onToggleSaved}
    >
      <Ionicons name={savedOnly ? "bookmark" : "bookmark-outline"} size={18} color={savedOnly ? palette.ink : palette.cream} />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.md
  },
  copy: {
    flex: 1,
    gap: 4
  },
  eyebrow: {
    ...theme.typography.label,
    color: palette.sky,
    textTransform: "uppercase"
  },
  title: {
    ...theme.typography.display,
    color: palette.cream
  },
  subtitle: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 20
  },
  meta: {
    ...theme.typography.label,
    color: palette.gold
  },
  action: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: palette.border,
    marginTop: 4
  },
  actionActive: {
    backgroundColor: palette.gold,
    borderColor: palette.gold
  },
  pressed: {
    opacity: 0.9
  }
});
