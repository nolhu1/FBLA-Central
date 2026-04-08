import { Pressable, StyleSheet, Text } from "react-native";

import { palette, theme } from "@/theme";

export const LinkedThreadContentCard = ({
  eyebrow,
  title,
  summary,
  meta,
  onPress
}: {
  eyebrow: string;
  title: string;
  summary: string;
  meta: string;
  onPress: () => void;
}) => (
  <Pressable style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]} onPress={onPress}>
    <Text style={styles.eyebrow}>{eyebrow}</Text>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.summary}>{summary}</Text>
    <Text style={styles.meta}>{meta}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 5
  },
  eyebrow: {
    ...theme.typography.label,
    color: palette.sky
  },
  title: {
    ...theme.typography.title,
    fontSize: 16,
    color: palette.cream
  },
  summary: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 17
  },
  meta: {
    ...theme.typography.label,
    color: palette.gold
  },
  pressed: {
    opacity: 0.94
  }
});
