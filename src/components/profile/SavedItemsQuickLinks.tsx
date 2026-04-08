import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { palette, theme } from "@/theme";

export const SavedItemsQuickLinks = ({
  links,
  onPress
}: {
  links: { key: string; title: string; subtitle: string; routeName: string }[];
  onPress: (routeName: string) => void;
}) => (
  <View style={styles.section}>
    {links.map((link) => (
      <Pressable key={link.key} style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]} onPress={() => onPress(link.routeName)}>
        <View style={styles.copy}>
          <Text style={styles.title}>{link.title}</Text>
          <Text style={styles.subtitle}>{link.subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={palette.sky} />
      </Pressable>
    ))}
  </View>
);

const styles = StyleSheet.create({
  section: {
    flexDirection: "row",
    gap: 8
  },
  card: {
    flex: 1,
    minHeight: 74,
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: palette.border
  },
  copy: {
    width: "100%",
    gap: 2
  },
  title: {
    ...theme.typography.label,
    fontSize: 13,
    color: palette.cream
  },
  subtitle: {
    ...theme.typography.label,
    color: palette.mist
  },
  pressed: {
    opacity: 0.94
  }
});
