import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

interface SocialPlatformBadgeProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  accentColor: string;
}

export const SocialPlatformBadge = ({ icon, label, accentColor }: SocialPlatformBadgeProps) => (
  <View style={[styles.badge, { borderColor: `${accentColor}33`, backgroundColor: `${accentColor}18` }]}>
    <Ionicons name={icon} size={14} color={accentColor} />
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    borderWidth: 1
  },
  label: {
    ...theme.typography.label,
    color: palette.cream
  }
});
