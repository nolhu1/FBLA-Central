import { StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

export const ResourceTypeBadge = ({ label }: { label: string }) => (
  <View style={styles.badge}>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(117,184,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(117,184,255,0.24)"
  },
  label: {
    ...theme.typography.label,
    color: palette.cream
  }
});
