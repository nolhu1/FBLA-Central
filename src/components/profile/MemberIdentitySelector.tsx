import { StyleSheet, Text, View } from "react-native";

import { Organization } from "@/domain/models/types";
import { palette, theme } from "@/theme";

import { SelectionChip } from "./SelectionChip";

export const MemberIdentitySelector = ({
  label,
  helper,
  options,
  value,
  onChange
}: {
  label: string;
  helper?: string;
  options: Organization[];
  value?: string | null;
  onChange: (value: string) => void;
}) => (
  <View style={styles.section}>
    <Text style={styles.label}>{label}</Text>
    {helper ? <Text style={styles.helper}>{helper}</Text> : null}
    <View style={styles.row}>
      {options.map((option) => (
        <SelectionChip
          key={option.id}
          label={option.shortName}
          active={value === option.id}
          onPress={() => onChange(option.id)}
        />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  section: {
    gap: 8
  },
  label: {
    ...theme.typography.label,
    color: palette.sky
  },
  helper: {
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
