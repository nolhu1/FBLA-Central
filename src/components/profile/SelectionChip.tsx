import { Pressable, StyleSheet, Text } from "react-native";

import { palette, theme } from "@/theme";

export const SelectionChip = ({
  label,
  active,
  onPress
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) => (
  <Pressable style={({ pressed }) => [styles.chip, active ? styles.active : null, pressed ? styles.pressed : null]} onPress={onPress}>
    <Text style={[styles.label, active ? styles.activeLabel : null]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  chip: {
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center"
  },
  active: {
    backgroundColor: palette.gold,
    borderColor: palette.gold
  },
  label: {
    ...theme.typography.label,
    color: palette.cream
  },
  activeLabel: {
    color: palette.ink
  },
  pressed: {
    opacity: 0.94
  }
});
