import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { NewsFeedRecord } from "@/domain/services/news";
import { palette, theme } from "@/theme";

import { NewsPriorityBadge } from "./NewsPriorityBadge";
import { NewsScopeBadge } from "./NewsScopeBadge";
import { NewsSaveButton } from "./NewsSaveButton";

interface NewsDetailHeaderProps {
  record: NewsFeedRecord;
  onToggleSave: () => void;
  onShare: () => void;
  onAskAI?: () => void;
}

export const NewsDetailHeader = ({ record, onToggleSave, onShare, onAskAI }: NewsDetailHeaderProps) => (
  <View style={styles.wrapper}>
    <View style={styles.topRow}>
      <View style={styles.badges}>
        {(record.isUrgent || record.isPinned) ? (
          <NewsPriorityBadge priority={record.post.priorityLevel} pinned={record.isPinned} />
        ) : null}
        <NewsScopeBadge label={record.scopeLabel} />
      </View>
      <View style={styles.actions}>
        <NewsSaveButton isSaved={record.isSaved} onPress={onToggleSave} />
        <Pressable style={styles.iconButton} onPress={onShare}>
          <Ionicons name="share-social-outline" size={17} color={palette.cream} />
        </Pressable>
      </View>
    </View>

    <Text style={styles.title}>{record.post.title}</Text>
    <Text style={styles.meta}>{record.sourceLabel} • {new Date(record.post.publishedAt).toLocaleString()}</Text>
    <Text style={styles.summary}>{record.post.summary}</Text>

    {onAskAI ? (
      <Pressable style={styles.aiButton} onPress={onAskAI}>
        <Ionicons name="sparkles-outline" size={15} color={palette.ink} />
        <Text style={styles.aiLabel}>Ask AI about this update</Text>
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.spacing.sm
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.md
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    flex: 1
  },
  actions: {
    flexDirection: "row",
    gap: 8
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255,255,255,0.04)"
  },
  title: {
    ...theme.typography.display,
    fontSize: 26,
    color: palette.cream
  },
  meta: {
    ...theme.typography.label,
    color: palette.gold
  },
  summary: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 21
  },
  aiButton: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    backgroundColor: palette.gold
  },
  aiLabel: {
    ...theme.typography.label,
    color: palette.ink
  }
});
