import { StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

export const ThreadStatusBadge = ({
  label,
  tone
}: {
  label: string;
  tone: "active" | "locked" | "moderated";
}) => {
  const color = tone === "locked" ? palette.warning : tone === "moderated" ? palette.danger : palette.sky;
  const bg = tone === "locked" ? "rgba(255,210,122,0.14)" : tone === "moderated" ? "rgba(255,138,122,0.14)" : "rgba(117,184,255,0.14)";

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    minHeight: 28,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center"
  },
  label: {
    ...theme.typography.label
  }
});
