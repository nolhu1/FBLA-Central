import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { NewsTypeFilter } from "@/domain/services/news";
import { palette, theme } from "@/theme";

interface NewsFilterChipsProps {
  value: NewsTypeFilter;
  onChange: (value: NewsTypeFilter) => void;
}

const labels: Record<NewsTypeFilter, string> = {
  all: "All",
  urgent: "Urgent",
  pinned: "Pinned",
  event_updates: "Event updates",
  opportunities: "Opportunities",
  reminders: "Reminders",
  general: "General",
  saved: "Saved"
};

export const NewsFilterChips = ({ value, onChange }: NewsFilterChipsProps) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.scroll}
    contentContainerStyle={styles.row}
  >
    {(Object.keys(labels) as NewsTypeFilter[]).map((filter) => {
      const active = filter === value;
      return (
        <Pressable
          key={filter}
          accessibilityRole="button"
          accessibilityState={{ selected: active }}
          style={({ pressed }) => [styles.chip, active ? styles.chipActive : null, pressed ? styles.pressed : null]}
          onPress={() => onChange(filter)}
        >
          <Text style={[styles.label, active ? styles.labelActive : null]}>{labels[filter]}</Text>
        </Pressable>
      );
    })}
  </ScrollView>
);

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    maxHeight: 40,
    alignSelf: "stretch"
  },
  row: {
    alignItems: "center",
    gap: 8,
    minHeight: 34,
    paddingRight: theme.spacing.lg
  },
  chip: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    minHeight: 34,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start"
  },
  chipActive: {
    backgroundColor: "rgba(117,184,255,0.16)",
    borderColor: "rgba(117,184,255,0.36)"
  },
  label: {
    ...theme.typography.label,
    color: palette.mist
  },
  labelActive: {
    color: palette.cream
  },
  pressed: {
    opacity: 0.92
  }
});
