import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { HomeHero } from "@/domain/services/home";
import { palette, theme } from "@/theme";

interface HeroPriorityCardProps {
  hero: HomeHero;
  onPressPrimary: () => void;
  onPressSecondary?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const HeroPriorityCard = ({
  hero,
  onPressPrimary,
  onPressSecondary,
  style
}: HeroPriorityCardProps) => (
  <LinearGradient
    colors={hero.type === "announcement" ? ["#14375D", "#0C2440"] : hero.type === "event" ? ["#1A466E", "#0E223C"] : ["#12453F", "#0E223C"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.card, style]}
  >
    <View style={styles.topRow}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{hero.badge}</Text>
      </View>
      <Ionicons name="flash" size={14} color={palette.gold} />
    </View>

    <View style={styles.copy}>
      <Text style={styles.title} numberOfLines={2}>
        {hero.title}
      </Text>
      <Text style={styles.summary} numberOfLines={2}>
        {hero.summary}
      </Text>
      <Text style={styles.meta}>{hero.meta}</Text>
    </View>

    <View style={styles.actions}>
      <Pressable style={styles.primaryButton} onPress={onPressPrimary}>
        <Text style={styles.primaryLabel}>{hero.primaryLabel}</Text>
      </Pressable>
      {hero.secondaryLabel && onPressSecondary ? (
        <Pressable style={styles.secondaryButton} onPress={onPressSecondary}>
          <Text style={styles.secondaryLabel}>{hero.secondaryLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: theme.spacing.md,
    gap: 10,
    minHeight: 170,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 }
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.12)"
  },
  badgeText: {
    ...theme.typography.label,
    color: palette.cream
  },
  copy: {
    gap: 6
  },
  title: {
    ...theme.typography.display,
    fontSize: 20,
    color: palette.cream
  },
  summary: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 18
  },
  meta: {
    ...theme.typography.label,
    color: palette.gold
  },
  actions: {
    flexDirection: "row",
    gap: 8
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: theme.radius.md,
    alignItems: "center",
    backgroundColor: palette.gold
  },
  primaryLabel: {
    ...theme.typography.label,
    color: palette.ink
  },
  secondaryButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center"
  },
  secondaryLabel: {
    ...theme.typography.label,
    color: palette.cream
  }
});
