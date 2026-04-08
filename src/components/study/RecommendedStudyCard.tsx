import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { palette, theme } from "@/theme";

interface RecommendedStudyCardProps {
  eyebrow: string;
  title: string;
  caption: string;
  meta: string;
  onPress: () => void;
}

export const RecommendedStudyCard = ({
  eyebrow,
  title,
  caption,
  meta,
  onPress
}: RecommendedStudyCardProps) => (
  <Pressable style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]} onPress={onPress}>
    <Text style={styles.eyebrow}>{eyebrow}</Text>
    <Text style={styles.title} numberOfLines={2}>
      {title}
    </Text>
    <Text style={styles.caption} numberOfLines={2}>
      {caption}
    </Text>
    <View style={styles.metaRow}>
      <Text style={styles.meta}>{meta}</Text>
      <Ionicons name="arrow-forward" size={14} color={palette.sky} />
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    width: 220,
    borderRadius: 22,
    padding: theme.spacing.md,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 8
  },
  eyebrow: {
    ...theme.typography.label,
    color: palette.sky,
    textTransform: "uppercase"
  },
  title: {
    ...theme.typography.title,
    fontSize: 17,
    color: palette.cream
  },
  caption: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 19
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10
  },
  meta: {
    ...theme.typography.label,
    color: palette.gold,
    flex: 1
  },
  pressed: {
    opacity: 0.94
  }
});
