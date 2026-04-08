import { StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

export const OnboardingProgressHeader = ({
  currentStep,
  totalSteps,
  label
}: {
  currentStep: number;
  totalSteps: number;
  label: string;
}) => (
  <View style={styles.wrapper}>
    <View style={styles.topRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.count}>{currentStep} of {totalSteps}</Text>
    </View>
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${(currentStep / totalSteps) * 100}%` }]} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    gap: 8
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  label: {
    ...theme.typography.label,
    color: palette.sky,
    textTransform: "uppercase"
  },
  count: {
    ...theme.typography.label,
    color: palette.slate
  },
  track: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden"
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: palette.gold
  }
});
