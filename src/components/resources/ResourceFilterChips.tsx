import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { ResourceTypeFilter } from "@/domain/services/resources";
import { palette, theme } from "@/theme";

interface ResourceFilterChipsProps {
  value: ResourceTypeFilter;
  onChange: (value: ResourceTypeFilter) => void;
}

const labels: Record<ResourceTypeFilter, string> = {
  all: "All",
  pdf: "PDF",
  guide: "Guides",
  template: "Templates",
  saved: "Saved",
  official: "Official"
};

export const ResourceFilterChips = ({ value, onChange }: ResourceFilterChipsProps) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
    {(Object.keys(labels) as ResourceTypeFilter[]).map((filter) => {
      const active = filter === value;
      return (
        <Pressable key={filter} style={[styles.chip, active ? styles.active : null]} onPress={() => onChange(filter)}>
          <Text style={[styles.label, active ? styles.activeLabel : null]}>{labels[filter]}</Text>
        </Pressable>
      );
    })}
  </ScrollView>
);

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingRight: theme.spacing.lg
  },
  chip: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: palette.border
  },
  active: {
    backgroundColor: "rgba(117,184,255,0.16)",
    borderColor: "rgba(117,184,255,0.36)"
  },
  label: {
    ...theme.typography.label,
    color: palette.mist
  },
  activeLabel: {
    color: palette.cream
  }
});
