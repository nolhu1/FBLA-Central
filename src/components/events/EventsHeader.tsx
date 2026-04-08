import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

interface EventsHeaderProps {
  title: string;
  subtitle: string;
  onPressSearch?: () => void;
  onPressSaved?: () => void;
}

export const EventsHeader = ({
  title,
  subtitle,
  onPressSearch,
  onPressSaved
}: EventsHeaderProps) => (
  <View style={styles.row}>
    <View style={styles.copy}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
    <View style={styles.actions}>
      <Pressable style={styles.iconButton} onPress={onPressSearch} accessibilityLabel="Search events">
        <Ionicons name="search-outline" size={18} color={palette.cream} />
      </Pressable>
      <Pressable style={styles.iconButton} onPress={onPressSaved} accessibilityLabel="Open saved events">
        <Ionicons name="bookmark-outline" size={18} color={palette.cream} />
      </Pressable>
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md
  },
  copy: {
    flex: 1,
    gap: 4
  },
  title: {
    ...theme.typography.title,
    fontSize: 28,
    color: palette.cream
  },
  subtitle: {
    ...theme.typography.body,
    color: palette.mist
  },
  actions: {
    flexDirection: "row",
    gap: 8
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: palette.border
  }
});
