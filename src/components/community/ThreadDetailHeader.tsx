import { StyleSheet, Text, View } from "react-native";

import { CommunityThreadRecord } from "@/domain/services/community";
import { formatDateTime } from "@/utils/time";
import { palette, theme } from "@/theme";

import { ThreadStatusBadge } from "./ThreadStatusBadge";

export const ThreadDetailHeader = ({ record }: { record: CommunityThreadRecord }) => (
  <View style={styles.wrapper}>
    <View style={styles.topRow}>
      <ThreadStatusBadge label={record.statusLabel} tone={record.statusTone} />
      <Text style={styles.meta}>{record.categoryLabel} • {formatDateTime(record.thread.createdAt)}</Text>
    </View>
    <Text style={styles.title}>{record.thread.title}</Text>
    <Text style={styles.body}>{record.thread.body}</Text>
    <Text style={styles.tags}>{record.thread.tags.join(" • ")}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    gap: 8
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 10
  },
  meta: {
    ...theme.typography.label,
    color: palette.gold,
    flexShrink: 1
  },
  title: {
    ...theme.typography.display,
    fontSize: 22,
    color: palette.cream
  },
  body: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 20
  },
  tags: {
    ...theme.typography.label,
    color: palette.sky
  }
});
