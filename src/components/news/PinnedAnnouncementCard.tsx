import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { NewsFeedRecord } from "@/domain/services/news";
import { palette, theme } from "@/theme";

import { NewsPriorityBadge } from "./NewsPriorityBadge";
import { NewsScopeBadge } from "./NewsScopeBadge";
import { NewsSaveButton } from "./NewsSaveButton";

interface PinnedAnnouncementCardProps {
  record: NewsFeedRecord;
  onPress: () => void;
  onToggleSave: () => void;
}

export const PinnedAnnouncementCard = ({ record, onPress, onToggleSave }: PinnedAnnouncementCardProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={`${record.isUrgent ? "Urgent" : "Priority"} update: ${record.post.title}`}
    style={({ pressed }) => [styles.shadow, pressed ? styles.pressed : null]}
    onPress={onPress}
  >
    <LinearGradient colors={["#16385D", "#102845", "#0A1627"]} style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.badges}>
          <NewsPriorityBadge priority={record.post.priorityLevel} pinned={record.isPinned} />
          <NewsScopeBadge label={record.scopeLabel} />
        </View>
        <NewsSaveButton isSaved={record.isSaved} onPress={onToggleSave} />
      </View>

      <Text style={styles.kicker}>{record.scopeContext}</Text>
      <Text style={styles.title} numberOfLines={2}>
        {record.post.title}
      </Text>
      <Text style={styles.summary} numberOfLines={3}>
        {record.post.summary}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.meta}>{record.publishedLabel}</Text>
        <View style={styles.action}>
          <Text style={styles.actionLabel}>Open detail</Text>
          <Ionicons name="arrow-forward" size={14} color={palette.gold} />
        </View>
      </View>
    </LinearGradient>
  </Pressable>
);

const styles = StyleSheet.create({
  shadow: {
    borderRadius: theme.radius.lg,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 }
  },
  card: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    gap: theme.spacing.sm
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    flex: 1
  },
  kicker: {
    ...theme.typography.label,
    color: palette.sky
  },
  title: {
    ...theme.typography.display,
    fontSize: 24,
    color: palette.cream
  },
  summary: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 20
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 4
  },
  meta: {
    ...theme.typography.label,
    color: palette.gold
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  actionLabel: {
    ...theme.typography.label,
    color: palette.cream
  },
  pressed: {
    opacity: 0.96
  }
});
