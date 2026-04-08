import { Switch, StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

export const NotificationPreferenceCard = ({
  title,
  subtitle,
  value,
  onValueChange
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) => (
  <View style={styles.card}>
    <View style={styles.copy}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "rgba(255,255,255,0.16)", true: "rgba(244,182,61,0.42)" }}
      thumbColor={value ? palette.gold : palette.cream}
    />
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: palette.border
  },
  copy: {
    flex: 1,
    gap: 2
  },
  title: {
    ...theme.typography.title,
    fontSize: 16,
    color: palette.cream
  },
  subtitle: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 17
  }
});
