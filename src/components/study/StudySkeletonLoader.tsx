import { StyleSheet, View } from "react-native";

import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { palette, theme } from "@/theme";

export const StudySkeletonLoader = () => (
  <View style={styles.wrapper}>
    <ShimmerBlock style={[styles.block, styles.header]} />
    <ShimmerBlock style={[styles.block, styles.hero]} />
    <View style={styles.row}>
      <ShimmerBlock style={[styles.block, styles.metricLarge]} />
      <ShimmerBlock style={[styles.block, styles.metricLarge]} />
    </View>
    <ShimmerBlock style={[styles.block, styles.section]} />
    <ShimmerBlock style={[styles.block, styles.sectionSmall]} />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.spacing.md
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  block: {
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: palette.border
  },
  header: {
    height: 70
  },
  hero: {
    height: 248
  },
  metricLarge: {
    flex: 1,
    height: 190
  },
  section: {
    height: 210
  },
  sectionSmall: {
    height: 150
  }
});
