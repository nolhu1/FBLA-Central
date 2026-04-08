import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AIContextRecord } from "@/domain/services/ai";
import { palette, theme } from "@/theme";

export const AiContextCard = ({ context }: { context: AIContextRecord }) => (
  <View style={styles.card}>
    <View style={styles.iconWrap}>
      <Ionicons name={context.icon as never} size={18} color={palette.ink} />
    </View>
    <View style={styles.copy}>
      <Text style={styles.eyebrow}>{context.badgeLabel}</Text>
      <Text style={styles.title} numberOfLines={2}>{context.title}</Text>
      <Text style={styles.subtitle}>{context.subtitle}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.gold
  },
  copy: {
    flex: 1,
    gap: 3
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
  subtitle: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 17
  }
});
