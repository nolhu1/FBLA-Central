import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { ResourceCategoryFilter } from "@/domain/services/resources";
import { palette, theme } from "@/theme";

interface CategoryScrollerProps {
  categories: ResourceCategoryFilter[];
  value: ResourceCategoryFilter;
  onChange: (value: ResourceCategoryFilter) => void;
}

const labelize = (value: string) =>
  value === "all"
    ? "All"
    : value
        .split(" ")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

export const CategoryScroller = ({ categories, value, onChange }: CategoryScrollerProps) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
    {categories.map((category) => {
      const active = category === value;
      return (
        <Pressable
          key={category}
          style={[styles.chip, active ? styles.chipActive : null]}
          onPress={() => onChange(category)}
        >
          <Text style={[styles.label, active ? styles.labelActive : null]}>{labelize(category)}</Text>
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: palette.border
  },
  chipActive: {
    backgroundColor: palette.gold,
    borderColor: palette.gold
  },
  label: {
    ...theme.typography.label,
    color: palette.mist
  },
  labelActive: {
    color: palette.ink
  }
});
