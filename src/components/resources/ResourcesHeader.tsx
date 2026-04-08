import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { palette, theme } from "@/theme";

interface ResourcesHeaderProps {
  savedCount: number;
  onPressSaved: () => void;
}

export const ResourcesHeader = ({ savedCount, onPressSaved }: ResourcesHeaderProps) => (
  <View style={styles.header}>
    <View style={styles.copy}>
      <Text style={styles.eyebrow}>Curated library</Text>
      <Text style={styles.title}>Resources</Text>
      <Text style={styles.subtitle}>Search quickly, browse by category, and keep the right materials close.</Text>
    </View>
    <Pressable style={styles.action} onPress={onPressSaved}>
      <Ionicons name="bookmark-outline" size={18} color={palette.cream} />
      <Text style={styles.actionLabel}>{savedCount}</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.md
  },
  copy: {
    flex: 1,
    gap: 4
  },
  eyebrow: {
    ...theme.typography.label,
    textTransform: "uppercase",
    color: palette.sky
  },
  title: {
    ...theme.typography.display,
    color: palette.cream
  },
  subtitle: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 20
  },
  action: {
    marginTop: 4,
    minWidth: 42,
    height: 42,
    paddingHorizontal: 10,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border
  },
  actionLabel: {
    ...theme.typography.label,
    color: palette.cream
  }
});
