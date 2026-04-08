import { StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

interface StudyHeaderProps {
  title: string;
  subtitle: string;
}

export const StudyHeader = ({ title, subtitle }: StudyHeaderProps) => (
  <View style={styles.wrapper}>
    <Text style={styles.eyebrow}>Prep command center</Text>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
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
    lineHeight: 20
  }
});
