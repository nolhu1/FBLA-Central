import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { SocialHighlightRecord } from "@/domain/services/social";
import { palette, theme } from "@/theme";

interface SocialHighlightCardProps {
  record: SocialHighlightRecord;
  onPress: () => void;
}

export const SocialHighlightCard = ({ record, onPress }: SocialHighlightCardProps) => (
  <Pressable style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]} onPress={onPress}>
    <View style={styles.row}>
      <Ionicons name={record.platformIcon} size={18} color={record.accentColor} />
      <Text style={styles.platform}>{record.platformLabel}</Text>
    </View>
    <Text style={styles.title} numberOfLines={2}>
      {record.highlight.title}
    </Text>
    <Text style={styles.summary} numberOfLines={3}>
      {record.highlight.summary}
    </Text>
    <Text style={styles.scope}>{record.scopeLabel}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    width: 220,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255,255,255,0.05)",
    gap: 8
  },
  pressed: {
    opacity: 0.94
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  platform: {
    ...theme.typography.label,
    color: palette.cream
  },
  title: {
    ...theme.typography.label,
    color: palette.cream,
    fontSize: 14
  },
  summary: {
    ...theme.typography.body,
    color: palette.mist,
    fontSize: 14
  },
  scope: {
    ...theme.typography.label,
    color: palette.slate
  }
});
