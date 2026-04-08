import { StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

interface SectionHeaderProps {
  title: string;
  caption?: string;
}

export const SectionHeader = ({ title, caption }: SectionHeaderProps) => (
  <View style={styles.wrapper}>
    <Text style={styles.title}>{title}</Text>
    {caption ? <Text style={styles.caption}>{caption}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    gap: 3
  },
  title: {
    ...theme.typography.title,
    fontSize: 18,
    color: palette.cream
  },
  caption: {
    ...theme.typography.body,
    color: palette.mist
  }
});
