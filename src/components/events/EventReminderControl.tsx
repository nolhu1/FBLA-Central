import { Pressable, StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

export type ReminderPreset = "none" | "dayBefore" | "hourBefore" | "both";

interface EventReminderControlProps {
  value: ReminderPreset;
  onChange: (value: ReminderPreset) => void;
  compact?: boolean;
}

const options: { value: ReminderPreset; label: string }[] = [
  { value: "none", label: "Off" },
  { value: "dayBefore", label: "1 day" },
  { value: "hourBefore", label: "1 hr" },
  { value: "both", label: "Both" }
];

export const EventReminderControl = ({
  value,
  onChange,
  compact = false
}: EventReminderControlProps) => (
  <View style={[styles.container, compact ? styles.compactContainer : null]}>
    {options.map((option) => {
      const active = option.value === value;
      return (
        <Pressable
          key={option.value}
          accessibilityRole="button"
          accessibilityLabel={`Set reminders ${option.label}`}
          onPress={() => onChange(option.value)}
          style={[styles.option, active ? styles.optionActive : null, compact ? styles.compactOption : null]}
        >
          <Text style={[styles.label, active ? styles.labelActive : null]}>{option.label}</Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 4,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 4
  },
  compactContainer: {
    width: "100%"
  },
  option: {
    flex: 1,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.pill,
    paddingHorizontal: 10
  },
  compactOption: {
    minHeight: 32
  },
  optionActive: {
    backgroundColor: "rgba(117,184,255,0.16)"
  },
  label: {
    ...theme.typography.label,
    color: palette.slate
  },
  labelActive: {
    color: palette.cream
  }
});
