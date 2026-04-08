import { StyleSheet, View } from "react-native";

import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { palette, theme } from "@/theme";

export const NewsSkeletonLoader = () => (
  <View style={styles.wrapper}>
    <ShimmerBlock style={[styles.block, styles.header]} />
    <ShimmerBlock style={[styles.block, styles.switcher]} />
    <ShimmerBlock style={[styles.block, styles.hero]} />
    <ShimmerBlock style={[styles.block, styles.card]} />
    <ShimmerBlock style={[styles.block, styles.card]} />
    <ShimmerBlock style={[styles.block, styles.cardSmall]} />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.spacing.md
  },
  block: {
    borderRadius: theme.radius.md,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: palette.border
  },
  header: {
    height: 72
  },
  switcher: {
    height: 44
  },
  hero: {
    height: 204
  },
  card: {
    height: 138
  },
  cardSmall: {
    height: 112
  }
});
