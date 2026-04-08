import { StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

interface SocialSectionHeaderProps {
  title: string;
  caption?: string;
}

export const SocialSectionHeader = ({ title, caption }: SocialSectionHeaderProps) => (
  <View style={styles.wrap}>
    <Text style={styles.title}>{title}</Text>
    {caption ? <Text style={styles.caption}>{caption}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    gap: 2
  },
  title: {
    ...theme.typography.title,
    color: palette.cream
  },
  caption: {
    ...theme.typography.label,
    color: palette.slate
  }
});
