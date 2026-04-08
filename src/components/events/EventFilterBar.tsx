import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Pill } from "@/components/common/Pill";
import {
  EventCategoryFilter,
  EventScopeFilter,
  formatMonthLabel,
  getCategoryLabel,
  getScopeFilterLabel
} from "@/domain/services/events";
import { palette, theme } from "@/theme";

interface EventFilterBarProps {
  month: Date;
  onMonthChange: (offset: number) => void;
  category: EventCategoryFilter;
  onCategoryChange: (value: EventCategoryFilter) => void;
  scope: EventScopeFilter;
  onScopeChange: (value: EventScopeFilter) => void;
  savedOnly?: boolean;
  onToggleSavedOnly?: () => void;
}

export const EventFilterBar = ({
  month,
  onMonthChange,
  category,
  onCategoryChange,
  scope,
  onScopeChange,
  savedOnly = false,
  onToggleSavedOnly
}: EventFilterBarProps) => (
  <View style={styles.wrap}>
    <View style={styles.row}>
      <Text style={styles.monthLabel}>{formatMonthLabel(month)}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroller}
        style={styles.filterRail}
      >
        <Pill label="Prev" onPress={() => onMonthChange(-1)} />
        <Pill label="Next" onPress={() => onMonthChange(1)} />
        {(["all", "deadlines", "meetings", "conferences", "workshops", "milestones"] as EventCategoryFilter[]).map(
          (value) => (
            <Pill
              key={value}
              label={getCategoryLabel(value)}
              active={category === value}
              onPress={() => onCategoryChange(value)}
            />
          )
        )}
        {(["all", "chapter", "subdivision", "state", "national"] as EventScopeFilter[]).map((value) => (
          <Pill
            key={value}
            label={getScopeFilterLabel(value)}
            active={scope === value}
            onPress={() => onScopeChange(value)}
          />
        ))}
        {onToggleSavedOnly ? (
          <Pill label="Saved only" active={savedOnly} onPress={onToggleSavedOnly} />
        ) : null}
      </ScrollView>
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    borderRadius: theme.radius.md,
    paddingVertical: 2
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md
  },
  monthLabel: {
    ...theme.typography.title,
    color: palette.cream,
    flexShrink: 0
  },
  filterRail: {
    flex: 1
  },
  scroller: {
    gap: 8,
    paddingRight: theme.spacing.lg
  }
});
