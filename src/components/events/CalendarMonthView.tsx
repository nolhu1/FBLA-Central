import { Pressable, StyleSheet, Text, View } from "react-native";

import { CalendarDayCell } from "@/domain/services/events";
import { palette, theme } from "@/theme";

interface CalendarMonthViewProps {
  days: CalendarDayCell[];
  onSelectDate: (value: Date) => void;
  compact?: boolean;
}

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const CalendarMonthView = ({ days, onSelectDate, compact = false }: CalendarMonthViewProps) => (
  <View style={[styles.card, compact ? styles.cardCompact : null]}>
    <View style={styles.weekdays}>
      {weekdayLabels.map((label) => (
        <Text key={label} style={[styles.weekday, compact ? styles.weekdayCompact : null]}>
          {label}
        </Text>
      ))}
    </View>

    <View style={styles.grid}>
      {(compact ? days.slice(0, 35) : days).map((day) => (
        <Pressable
          key={day.key}
          onPress={() => onSelectDate(day.date)}
          style={[
            styles.cell,
            compact ? styles.cellCompact : null,
            day.isSelected ? styles.cellSelected : null,
            !day.isCurrentMonth ? styles.cellMuted : null
          ]}
          accessibilityRole="button"
          accessibilityLabel={`${day.dayNumber}, ${day.records.length} events`}
        >
          <Text
            style={[
              styles.dayNumber,
              compact ? styles.dayNumberCompact : null,
              day.isToday ? styles.dayNumberToday : null,
              !day.isCurrentMonth ? styles.dayNumberMuted : null,
              day.isSelected ? styles.dayNumberSelected : null
            ]}
          >
            {day.dayNumber}
          </Text>

          <View style={styles.dots}>
            {day.records.slice(0, 3).map((record) => (
              <View
                key={`${day.key}-${record.event.id}`}
                style={[
                  styles.dot,
                  record.urgency === "urgent"
                    ? styles.dotUrgent
                    : record.isSaved
                      ? styles.dotSaved
                      : styles.dotDefault
                ]}
              />
            ))}
          </View>
        </Pressable>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 8
  },
  cardCompact: {
    paddingTop: 10,
    paddingBottom: 8,
    gap: 6
  },
  weekdays: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  weekday: {
    width: `${100 / 7}%`,
    textAlign: "center",
    ...theme.typography.label,
    color: palette.slate
  },
  weekdayCompact: {
    fontSize: 11
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 0.76,
    borderRadius: theme.radius.sm,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "space-between"
  },
  cellCompact: {
    aspectRatio: 0.98,
    paddingVertical: 3
  },
  cellSelected: {
    backgroundColor: "rgba(117,184,255,0.18)"
  },
  cellMuted: {
    opacity: 0.45
  },
  dayNumber: {
    ...theme.typography.body,
    color: palette.cream
  },
  dayNumberCompact: {
    fontSize: 13
  },
  dayNumberToday: {
    color: palette.gold
  },
  dayNumberMuted: {
    color: palette.slate
  },
  dayNumberSelected: {
    fontWeight: "700"
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 6,
    gap: 3
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5
  },
  dotDefault: {
    backgroundColor: palette.sky
  },
  dotSaved: {
    backgroundColor: palette.teal
  },
  dotUrgent: {
    backgroundColor: palette.danger
  }
});
