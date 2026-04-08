import { StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

interface SocialHubHeaderProps {
  title: string;
  subtitle: string;
  context: string;
}

export const SocialHubHeader = ({ title, subtitle, context }: SocialHubHeaderProps) => (
  <View style={styles.wrap}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
    <Text style={styles.context}>{context}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    gap: 4
  },
  title: {
    ...theme.typography.display,
    color: palette.cream
  },
  subtitle: {
    ...theme.typography.body,
    color: palette.mist
  },
  context: {
    ...theme.typography.label,
    color: palette.sky
  }
});
