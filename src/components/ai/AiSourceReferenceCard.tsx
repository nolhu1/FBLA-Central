import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AIResolvedSource } from "@/domain/services/ai";
import { palette, theme } from "@/theme";

export const AiSourceReferenceCard = ({
  source,
  onPress
}: {
  source: AIResolvedSource;
  onPress?: () => void;
}) => {
  const content = (
    <View style={styles.inner}>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>{source.eyebrow}</Text>
        <Text style={styles.title} numberOfLines={1}>{source.title}</Text>
        <Text style={styles.summary} numberOfLines={1}>{source.summary}</Text>
      </View>
      <View style={styles.metaWrap}>
        <Text style={styles.meta}>{source.meta}</Text>
        {onPress ? <Ionicons name="chevron-forward" size={14} color={palette.sky} /> : null}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]} onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.card}>{content}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: palette.border
  },
  pressed: {
    opacity: 0.94
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  copy: {
    flex: 1,
    gap: 2
  },
  eyebrow: {
    ...theme.typography.label,
    color: palette.sky
  },
  title: {
    ...theme.typography.label,
    fontSize: 13,
    color: palette.cream
  },
  summary: {
    ...theme.typography.label,
    color: palette.slate
  },
  metaWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  meta: {
    ...theme.typography.label,
    color: palette.gold
  }
});
