import { Pressable, StyleSheet, Text } from "react-native";

import { palette, theme } from "@/theme";

interface PillProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export const Pill = ({ label, active = false, onPress }: PillProps) => (
  <Pressable onPress={onPress} style={[styles.pill, active && styles.active]}>
    <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255,255,255,0.04)"
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
  }
});
