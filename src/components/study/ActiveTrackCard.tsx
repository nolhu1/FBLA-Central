import { Pressable, StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

interface ActiveTrackCardProps {
  eyebrow: string;
  title: string;
  summary: string;
  meta: string;
  onPress: () => void;
}

export const ActiveTrackCard = ({ eyebrow, title, summary, meta, onPress }: ActiveTrackCardProps) => (
  <Pressable style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]} onPress={onPress}>
    <View style={styles.copy}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.summary} numberOfLines={2}>
        {summary}
      </Text>
      <Text style={styles.meta}>{meta}</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border
  },
  copy: {
    gap: 6
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
  summary: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 19
  },
  meta: {
    ...theme.typography.label,
    color: palette.gold
  },
  pressed: {
    opacity: 0.94
  }
});
