import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { palette, theme } from "@/theme";

interface ContinueStudyHeroProps {
  title: string;
  summary: string;
  progressPercent: number;
  readinessLabel: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  onPressPrimary: () => void;
  onPressSecondary: () => void;
}

export const ContinueStudyHero = ({
  title,
  summary,
  progressPercent,
  readinessLabel,
  primaryActionLabel,
  secondaryActionLabel,
  onPressPrimary,
  onPressSecondary
}: ContinueStudyHeroProps) => (
  <LinearGradient colors={["#163B63", "#102A48", "#0A1627"]} style={styles.card}>
    <View style={styles.topRow}>
      <View style={styles.kicker}>
        <Ionicons name="school-outline" size={14} color={palette.gold} />
        <Text style={styles.kickerText}>Continue study</Text>
      </View>
      <Text style={styles.readiness}>{readinessLabel}</Text>
    </View>

    <Text style={styles.title} numberOfLines={2}>
      {title}
    </Text>
    <Text style={styles.summary} numberOfLines={3}>
      {summary}
    </Text>

    <View style={styles.progressDeck}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.max(6, progressPercent)}%` }]} />
      </View>
      <View style={styles.progressMeta}>
        <Text style={styles.progressValue}>{progressPercent}% complete</Text>
        <Text style={styles.progressCaption}>Focused prep path</Text>
      </View>
    </View>

    <View style={styles.actions}>
      <Pressable style={styles.primaryButton} onPress={onPressPrimary}>
        <Text style={styles.primaryLabel}>{primaryActionLabel}</Text>
      </Pressable>
      <Pressable style={styles.secondaryButton} onPress={onPressSecondary}>
        <Text style={styles.secondaryLabel}>{secondaryActionLabel}</Text>
      </Pressable>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 26,
    padding: theme.spacing.lg,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: "#000",
    shadowOpacity: 0.24,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 }
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10
  },
  kicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.08)"
  },
  kickerText: {
    ...theme.typography.label,
    color: palette.cream
  },
  readiness: {
    ...theme.typography.label,
    color: palette.gold
  },
  title: {
    ...theme.typography.display,
    fontSize: 25,
    color: palette.cream
  },
  summary: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 21
  },
  progressDeck: {
    gap: 8
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: palette.gold
  },
  progressMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10
  },
  progressValue: {
    ...theme.typography.label,
    color: palette.cream
  },
  progressCaption: {
    ...theme.typography.label,
    color: palette.sky
  },
  actions: {
    flexDirection: "row",
    gap: 10
  },
  primaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: palette.gold
  },
  primaryLabel: {
    ...theme.typography.label,
    color: palette.ink
  },
  secondaryButton: {
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.04)"
  },
  secondaryLabel: {
    ...theme.typography.label,
    color: palette.cream
  }
});
