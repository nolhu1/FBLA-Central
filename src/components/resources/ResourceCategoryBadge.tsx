import { StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

export const ResourceCategoryBadge = ({ label }: { label: string }) => (
  <View style={styles.badge}>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: palette.border
  },
  label: {
    ...theme.typography.label,
    color: palette.mist
  }
});
