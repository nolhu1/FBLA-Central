import { StyleSheet, View } from "react-native";

import { ShimmerBlock } from "@/components/common/ShimmerBlock";
import { palette, theme } from "@/theme";

export const ResourceSkeletonLoader = () => (
  <View style={styles.wrapper}>
    <ShimmerBlock style={[styles.block, styles.header]} />
    <ShimmerBlock style={[styles.block, styles.search]} />
    <ShimmerBlock style={[styles.block, styles.featured]} />
    <ShimmerBlock style={[styles.block, styles.card]} />
    <ShimmerBlock style={[styles.block, styles.card]} />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.spacing.md
  },
  block: {
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: palette.border
  },
  header: { height: 72 },
  search: { height: 48 },
  featured: { height: 180 },
  card: { height: 128 }
});
