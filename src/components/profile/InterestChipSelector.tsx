import { StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

import { SelectionChip } from "./SelectionChip";

export const InterestChipSelector = ({
  title,
  subtitle,
  options,
  values,
  onToggle
}: {
  title: string;
  subtitle: string;
  options: string[];
  values: string[];
  onToggle: (value: string) => void;
}) => (
  <View style={styles.section}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
    <View style={styles.row}>
      {options.map((option) => (
        <SelectionChip key={option} label={option} active={values.includes(option)} onPress={() => onToggle(option)} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  section: {
    gap: 8
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
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  }
});
