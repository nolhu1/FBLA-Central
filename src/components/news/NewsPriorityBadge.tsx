import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { palette, theme } from "@/theme";

interface NewsPriorityBadgeProps {
  priority: "low" | "medium" | "high" | "urgent";
  pinned?: boolean;
}

const toneMap = {
  urgent: { backgroundColor: "rgba(255,138,122,0.16)", borderColor: "rgba(255,138,122,0.32)", color: palette.danger, icon: "alert-circle" as const, label: "Urgent" },
  high: { backgroundColor: "rgba(255,210,122,0.14)", borderColor: "rgba(255,210,122,0.28)", color: palette.warning, icon: "flash" as const, label: "Important" },
  medium: { backgroundColor: "rgba(117,184,255,0.12)", borderColor: "rgba(117,184,255,0.24)", color: palette.sky, icon: "information-circle" as const, label: "Update" },
  low: { backgroundColor: "rgba(255,255,255,0.06)", borderColor: palette.border, color: palette.mist, icon: "ellipse" as const, label: "General" }
};

export const NewsPriorityBadge = ({ priority, pinned = false }: NewsPriorityBadgeProps) => {
  const tone = toneMap[priority];

  return (
    <View style={[styles.badge, { backgroundColor: tone.backgroundColor, borderColor: tone.borderColor }]}>
      <Ionicons name={pinned ? "pin" : tone.icon} size={12} color={tone.color} />
      <Text style={[styles.label, { color: tone.color }]}>{pinned ? "Pinned" : tone.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    borderWidth: 1
  },
  label: {
    ...theme.typography.label
  }
});
