import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { palette, theme } from "@/theme";

interface ContinueStudyCompactHeroProps {
  title: string;
  summary: string;
  progressPercent: number;
  readinessLabel: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  onPressPrimary: () => void;
  onPressSecondary: () => void;
}

export const ContinueStudyCompactHero = ({
  title,
  summary,
  progressPercent,
  readinessLabel,
  primaryActionLabel,
  secondaryActionLabel,
  onPressPrimary,
  onPressSecondary
}: ContinueStudyCompactHeroProps) => (
  <LinearGradient colors={["#163B63", "#112B49", "#0B182A"]} style={styles.card}>
    <View style={styles.header}>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>Next best action</Text>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.summary} numberOfLines={2}>
          {summary}
        </Text>
      </View>
      <View style={styles.readinessChip}>
        <Text style={styles.readinessText}>{readinessLabel}</Text>
      </View>
    </View>

    <View style={styles.progressRow}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.max(6, progressPercent)}%` }]} />
      </View>
      <Text style={styles.progressText}>{progressPercent}%</Text>
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
    borderRadius: 24,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)"
  },
  header: {
    flexDirection: "row",
    gap: 10
  },
  copy: {
    flex: 1,
    gap: 4
  },
  eyebrow: {
    ...theme.typography.label,
    color: palette.sky,
    textTransform: "uppercase"
  },
  title: {
    ...theme.typography.title,
    fontSize: 18,
    color: palette.cream
  },
  summary: {
    ...theme.typography.body,
    fontSize: 14,
    lineHeight: 18,
    color: palette.mist
  },
  readinessChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.08)"
  },
  readinessText: {
    ...theme.typography.label,
    color: palette.gold
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: palette.gold
  },
  progressText: {
    ...theme.typography.label,
    color: palette.cream
  },
  actions: {
    flexDirection: "row",
    gap: 8
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: palette.gold
  },
  primaryLabel: {
    ...theme.typography.label,
    color: palette.ink
  },
  secondaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.04)"
  },
  secondaryLabel: {
    ...theme.typography.label,
    color: palette.cream
  }
});
