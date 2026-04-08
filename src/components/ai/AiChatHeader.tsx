import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { palette, theme } from "@/theme";

export const AiChatHeader = ({
  subtitle,
  contextBadge,
  onNewChat
}: {
  subtitle: string;
  contextBadge?: string;
  onNewChat: () => void;
}) => (
  <View style={styles.header}>
    <View style={styles.copy}>
      <Text style={styles.eyebrow}>Assistant</Text>
      <Text style={styles.title}>FBLA AI</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {contextBadge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>{contextBadge}</Text>
        </View>
      ) : null}
    </View>
    <Pressable style={styles.action} onPress={onNewChat}>
      <Ionicons name="refresh-outline" size={16} color={palette.cream} />
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
    lineHeight: 18
  },
  badge: {
    alignSelf: "flex-start",
    marginTop: 4,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "rgba(117,184,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(117,184,255,0.18)"
  },
  badgeLabel: {
    ...theme.typography.label,
    color: palette.sky
  },
  action: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border
  }
});
