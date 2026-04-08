import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { CommunityThreadRecord } from "@/domain/services/community";
import { formatDateTime } from "@/utils/time";
import { palette, theme } from "@/theme";

import { ThreadStatsRow } from "./ThreadStatsRow";
import { ThreadStatusBadge } from "./ThreadStatusBadge";

export const FeaturedThreadCard = ({
  record,
  onPress
}: {
  record: CommunityThreadRecord;
  onPress: () => void;
}) => (
  <Pressable style={({ pressed }) => [styles.pressable, pressed ? styles.pressed : null]} onPress={onPress}>
    <LinearGradient colors={["#173B63", "#102845", "#0A1627"]} style={styles.card}>
      <View style={styles.topRow}>
        <ThreadStatusBadge label={record.statusLabel} tone={record.statusTone} />
        <Text style={styles.category}>{record.categoryLabel}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>{record.thread.title}</Text>
      <Text style={styles.preview} numberOfLines={3}>{record.preview}</Text>
      <ThreadStatsRow
        replies={record.thread.replyCount}
        helpful={record.thread.helpfulCount}
        recency={formatDateTime(record.thread.lastActivityAt)}
        linkedLabel={record.linkedLabel}
      />
    </LinearGradient>
  </Pressable>
);

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
    alignSelf: "stretch"
  },
  card: {
    width: "100%",
    alignSelf: "stretch",
    minHeight: 164,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)"
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8
  },
  category: {
    ...theme.typography.label,
    color: palette.gold
  },
  title: {
    ...theme.typography.title,
    fontSize: 18,
    color: palette.cream
  },
  preview: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 18
  },
  pressed: {
    opacity: 0.96
  }
});
