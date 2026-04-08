import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { palette, theme } from "@/theme";

export const CommunityHeader = ({
  onPressCreate
}: {
  onPressCreate: () => void;
}) => (
  <View style={styles.header}>
    <View style={styles.copy}>
      <Text style={styles.eyebrow}>Member discussion</Text>
      <Text style={styles.title}>Community</Text>
      <Text style={styles.subtitle}>Ask for help, compare prep strategies, and find the threads that matter this week.</Text>
    </View>
    <Pressable style={styles.action} onPress={onPressCreate}>
      <Ionicons name="create-outline" size={18} color={palette.cream} />
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
    color: palette.sky,
    textTransform: "uppercase"
  },
  title: {
    ...theme.typography.display,
    color: palette.cream
  },
  subtitle: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 18
  },
  action: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border,
    marginTop: 2
  }
});
