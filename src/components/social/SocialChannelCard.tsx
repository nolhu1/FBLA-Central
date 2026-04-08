import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { SocialChannelRecord } from "@/domain/services/social";
import { palette, theme } from "@/theme";

import { ShareChannelButton } from "./ShareChannelButton";
import { SocialPlatformBadge } from "./SocialPlatformBadge";

interface SocialChannelCardProps {
  record: SocialChannelRecord;
  onOpen: () => void;
  onShare: () => void;
  onMore: () => void;
}

export const SocialChannelCard = ({
  record,
  onOpen,
  onShare,
  onMore
}: SocialChannelCardProps) => (
  <Pressable style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]} onPress={onOpen}>
    <View style={styles.topRow}>
      <SocialPlatformBadge
        icon={record.platformIcon}
        label={record.platformLabel}
        accentColor={record.accentColor}
      />
      <Pressable style={styles.moreButton} onPress={onMore}>
        <Ionicons name="ellipsis-horizontal" size={16} color={palette.cream} />
      </Pressable>
    </View>
    <Text style={styles.title} numberOfLines={2}>
      {record.channel.displayName}
    </Text>
    <Text style={styles.handle} numberOfLines={1}>
      {record.channel.handle}
    </Text>
    <Text style={styles.description} numberOfLines={2}>
      {record.description}
    </Text>
    <View style={styles.footerRow}>
      <View style={styles.openPill}>
        <Text style={styles.openText}>Open official</Text>
        <Ionicons name="arrow-up-outline" size={14} color={palette.ink} />
      </View>
      <ShareChannelButton onPress={onShare} />
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "48%",
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255,255,255,0.05)",
    gap: 10
  },
  pressed: {
    opacity: 0.94
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)"
  },
  title: {
    ...theme.typography.label,
    fontSize: 15,
    color: palette.cream
  },
  handle: {
    ...theme.typography.body,
    color: palette.sky
  },
  description: {
    ...theme.typography.body,
    color: palette.mist,
    fontSize: 14
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10
  },
  openPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: palette.gold
  },
  openText: {
    ...theme.typography.label,
    color: palette.ink
  }
});
