import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { NewsFeedRecord } from "@/domain/services/news";
import { palette, theme } from "@/theme";

import { NewsPriorityBadge } from "./NewsPriorityBadge";
import { NewsScopeBadge } from "./NewsScopeBadge";
import { NewsSaveButton } from "./NewsSaveButton";

interface CompactNewsCardProps {
  record: NewsFeedRecord;
  onPress: () => void;
  onToggleSave: () => void;
}

export const CompactNewsCard = ({ record, onPress, onToggleSave }: CompactNewsCardProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={`${record.isUnread ? "Unread" : "Read"} ${record.scopeLabel} announcement ${record.post.title}`}
    style={({ pressed }) => [styles.card, record.isUnread ? styles.cardUnread : null, pressed ? styles.pressed : null]}
    onPress={onPress}
  >
    <View style={styles.topRow}>
      <View style={styles.badges}>
        {record.isUnread ? (
          <View style={styles.unreadPill}>
            <View style={styles.unreadDot} />
            <Text style={styles.unreadText}>Unread</Text>
          </View>
        ) : null}
        {(record.isUrgent || record.isPinned) ? (
          <NewsPriorityBadge priority={record.post.priorityLevel} pinned={record.isPinned} />
        ) : null}
        <NewsScopeBadge label={record.scopeLabel} />
      </View>
      <NewsSaveButton isSaved={record.isSaved} onPress={onToggleSave} />
    </View>

    <Text style={styles.title} numberOfLines={2}>
      {record.post.title}
    </Text>
    <Text style={styles.summary} numberOfLines={2}>
      {record.post.summary}
    </Text>

    <View style={styles.bottomRow}>
      <Text style={styles.meta} numberOfLines={1}>
        {record.scopeContext} • {record.publishedLabel}
      </Text>
      {record.hasRelatedContent ? (
        <View style={styles.linkCue}>
          <Ionicons name="link-outline" size={13} color={palette.sky} />
          <Text style={styles.linkLabel}>Linked</Text>
        </View>
      ) : null}
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(7,17,29,0.52)",
    gap: 8
  },
  cardUnread: {
    borderColor: "rgba(117,184,255,0.28)",
    backgroundColor: "rgba(12,27,46,0.8)"
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
  unreadPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(117,184,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(117,184,255,0.24)"
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: palette.sky
  },
  unreadText: {
    ...theme.typography.label,
    color: palette.cream
  },
  title: {
    ...theme.typography.title,
    fontSize: 17,
    color: palette.cream
  },
  summary: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 20
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10
  },
  meta: {
    ...theme.typography.label,
    color: palette.slate,
    flex: 1
  },
  linkCue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  linkLabel: {
    ...theme.typography.label,
    color: palette.sky
  },
  pressed: {
    opacity: 0.94
  }
});
