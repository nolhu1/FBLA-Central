import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { palette, theme } from "@/theme";

interface HomeHeaderProps {
  greeting: string;
  contextLine: string;
  onPressProfile: () => void;
  onPressNotifications: () => void;
  onPressAI: () => void;
}

export const HomeHeader = ({
  greeting,
  contextLine,
  onPressProfile,
  onPressNotifications,
  onPressAI
}: HomeHeaderProps) => (
  <View style={styles.row}>
    <View style={styles.copy}>
      <Text style={styles.greeting}>{greeting}</Text>
      <Text style={styles.context} numberOfLines={1}>
        {contextLine}
      </Text>
    </View>
    <View style={styles.actions}>
      <HeaderIcon icon="sparkles-outline" label="Ask AI" onPress={onPressAI} />
      <HeaderIcon icon="notifications-outline" label="Notifications" onPress={onPressNotifications} />
      <HeaderIcon icon="person-outline" label="Profile" onPress={onPressProfile} />
    </View>
  </View>
);

const HeaderIcon = ({
  icon,
  label,
  onPress
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) => (
  <Pressable accessibilityRole="button" accessibilityLabel={label} style={styles.iconButton} onPress={onPress}>
    <Ionicons name={icon} size={18} color={palette.cream} />
  </Pressable>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.md
  },
  copy: {
    flex: 1,
    gap: 4
  },
  greeting: {
    ...theme.typography.display,
    fontSize: 24,
    color: palette.cream
  },
  context: {
    ...theme.typography.label,
    color: palette.sky
  },
  actions: {
    flexDirection: "row",
    gap: 8
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: palette.border
  }
});
