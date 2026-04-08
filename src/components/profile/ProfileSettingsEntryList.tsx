import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { palette, theme } from "@/theme";

export const ProfileSettingsEntryList = ({
  entries,
  onPress
}: {
  entries: { key: string; title: string; subtitle: string }[];
  onPress: (key: string) => void;
}) => (
  <View style={styles.section}>
    {entries.map((entry) => (
      <Pressable key={entry.key} style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]} onPress={() => onPress(entry.key)}>
        <View style={styles.copy}>
          <Text style={styles.title}>{entry.title}</Text>
          <Text style={styles.subtitle}>{entry.subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={palette.sky} />
      </Pressable>
    ))}
  </View>
);

const styles = StyleSheet.create({
  section: {
    gap: 8
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: palette.border
  },
  copy: {
    flex: 1,
    gap: 2
  },
  title: {
    ...theme.typography.label,
    fontSize: 13,
    color: palette.cream
  },
  subtitle: {
    ...theme.typography.label,
    color: palette.mist,
    lineHeight: 15
  },
  pressed: {
    opacity: 0.94
  }
});
