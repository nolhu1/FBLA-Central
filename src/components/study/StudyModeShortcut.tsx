import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { palette, theme } from "@/theme";

interface StudyModeShortcutProps {
  label: string;
  caption: string;
  icon: string;
  onPress: () => void;
}

export const StudyModeShortcut = ({ label, caption, icon, onPress }: StudyModeShortcutProps) => (
  <Pressable style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]} onPress={onPress}>
    <View style={styles.iconWrap}>
      <Ionicons name={icon as never} size={18} color={palette.ink} />
    </View>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.caption}>{caption}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 110,
    borderRadius: 20,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 8
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.gold
  },
  label: {
    ...theme.typography.title,
    fontSize: 16,
    color: palette.cream
  },
  caption: {
    ...theme.typography.label,
    color: palette.mist
  },
  pressed: {
    opacity: 0.94
  }
});
