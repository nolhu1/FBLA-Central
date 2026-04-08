import { StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

interface EventTypeChipProps {
  label: string;
  urgency?: "urgent" | "soon" | "planned" | "normal";
}

export const EventTypeChip = ({ label, urgency = "normal" }: EventTypeChipProps) => (
  <View
    style={[
      styles.chip,
      urgency === "urgent"
        ? styles.urgent
        : urgency === "soon"
          ? styles.soon
          : urgency === "planned"
            ? styles.planned
            : null
    ]}
  >
    <Text style={[styles.label, urgency === "urgent" ? styles.urgentLabel : null]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(117,184,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(117,184,255,0.22)"
  },
  urgent: {
    backgroundColor: "rgba(255,138,122,0.12)",
    borderColor: "rgba(255,138,122,0.24)"
  },
  soon: {
    backgroundColor: "rgba(244,182,61,0.12)",
    borderColor: "rgba(244,182,61,0.26)"
  },
  planned: {
    backgroundColor: "rgba(78,216,199,0.12)",
    borderColor: "rgba(78,216,199,0.24)"
  },
  label: {
    ...theme.typography.label,
    color: palette.sky
  },
  urgentLabel: {
    color: palette.danger
  }
});
