import { Pressable, StyleSheet, Text, View } from "react-native";

import { CommunityThreadRecord } from "@/domain/services/community";
import { formatDateTime } from "@/utils/time";
import { palette, theme } from "@/theme";

import { ThreadStatsRow } from "./ThreadStatsRow";
import { ThreadStatusBadge } from "./ThreadStatusBadge";

export const CompactThreadCard = ({
  record,
  onPress
}: {
  record: CommunityThreadRecord;
  onPress: () => void;
}) => (
  <Pressable style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]} onPress={onPress}>
    <View style={styles.topRow}>
      <View style={styles.tags}>
        <ThreadStatusBadge label={record.statusLabel} tone={record.statusTone} />
        <Text style={styles.category}>{record.categoryLabel}</Text>
      </View>
      {record.isFollowed ? <Text style={styles.followed}>Following</Text> : null}
    </View>
    <Text style={styles.title} numberOfLines={2}>{record.thread.title}</Text>
    <Text style={styles.preview} numberOfLines={2}>{record.preview}</Text>
    <ThreadStatsRow
      replies={record.thread.replyCount}
      helpful={record.thread.helpfulCount}
      recency={formatDateTime(record.thread.lastActivityAt)}
      linkedLabel={record.linkedLabel}
    />
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 6
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    flex: 1
  },
  category: {
    ...theme.typography.label,
    color: palette.sky
  },
  followed: {
    ...theme.typography.label,
    color: palette.gold
  },
  title: {
    ...theme.typography.title,
    fontSize: 16,
    color: palette.cream
  },
  preview: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 18
  },
  pressed: {
    opacity: 0.94
  }
});
