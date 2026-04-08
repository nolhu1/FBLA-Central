import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { CommunityCategoryRecord } from "@/domain/services/community";
import { palette, theme } from "@/theme";

export const CategoryPillScroller = ({
  categories,
  activeCategoryId,
  onChange
}: {
  categories: CommunityCategoryRecord[];
  activeCategoryId?: string | null;
  onChange: (categoryId?: string | null) => void;
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.scroller}
    contentContainerStyle={styles.row}
  >
    <Pressable style={[styles.chip, !activeCategoryId ? styles.active : null]} onPress={() => onChange(null)}>
      <Text style={[styles.label, !activeCategoryId ? styles.activeLabel : null]}>All</Text>
    </Pressable>
    {categories.map((item) => {
      const active = item.category.id === activeCategoryId;
      return (
        <Pressable key={item.category.id} style={[styles.chip, active ? styles.active : null]} onPress={() => onChange(item.category.id)}>
          <Text style={[styles.label, active ? styles.activeLabel : null]}>{item.label}</Text>
        </Pressable>
      );
    })}
  </ScrollView>
);

const styles = StyleSheet.create({
  scroller: {
    flexGrow: 0,
    minHeight: 38,
    maxHeight: 40
  },
  row: {
    gap: 8,
    paddingRight: 2,
    alignItems: "center"
  },
  chip: {
    minHeight: 34,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: "center",
    justifyContent: "center"
  },
  active: {
    backgroundColor: palette.gold,
    borderColor: palette.gold
  },
  label: {
    ...theme.typography.label,
    color: palette.mist
  },
  activeLabel: {
    color: palette.ink
  }
});
