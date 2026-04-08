import { StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

export const InterestSummaryChips = ({
  title,
  values
}: {
  title: string;
  values: string[];
}) => (
  <View style={styles.section}>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.row}>
      {values.length ? values.map((value) => (
        <View key={value} style={styles.chip}>
          <Text style={styles.label}>{value}</Text>
        </View>
      )) : <Text style={styles.empty}>No selections yet</Text>}
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
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  chip: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border
  },
  label: {
    ...theme.typography.label,
    color: palette.mist
  },
  empty: {
    ...theme.typography.body,
    color: palette.slate
  }
});
