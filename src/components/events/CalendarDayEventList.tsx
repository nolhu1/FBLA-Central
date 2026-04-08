import { ScrollView, StyleSheet, Text, View } from "react-native";

import { EventRecord } from "@/domain/services/events";
import { palette, theme } from "@/theme";

import { CompactEventCard } from "./CompactEventCard";

interface CalendarDayEventListProps {
  title: string;
  records: EventRecord[];
  onOpenEvent: (eventId: string) => void;
  onToggleSave: (eventId: string, isSaved: boolean) => void;
  compact?: boolean;
}

export const CalendarDayEventList = ({
  title,
  records,
  onOpenEvent,
  onToggleSave,
  compact = false
}: CalendarDayEventListProps) => (
  <View style={[styles.section, compact ? styles.sectionCompact : null]}>
      <Text style={[styles.title, compact ? styles.titleCompact : null]}>{title}</Text>
      {records.length ? (
        compact ? (
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={[styles.list, styles.listCompact, styles.scrollContent]}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {records.map((record) => (
              <CompactEventCard
                key={record.event.id}
                record={record}
                compact
                onPress={() => onOpenEvent(record.event.id)}
                onToggleSave={() => onToggleSave(record.event.id, record.isSaved)}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.list}>
            {records.map((record) => (
              <CompactEventCard
                key={record.event.id}
                record={record}
                onPress={() => onOpenEvent(record.event.id)}
                onToggleSave={() => onToggleSave(record.event.id, record.isSaved)}
              />
            ))}
          </View>
        )
      ) : (
        <View style={[styles.emptyCard, compact ? styles.emptyCardCompact : null]}>
          <Text style={styles.emptyTitle}>No events on this date</Text>
          <Text style={styles.emptyBody}>Try another day or switch to Agenda for a broader view.</Text>
        </View>
      )}
  </View>
);

const styles = StyleSheet.create({
  section: {
    gap: theme.spacing.sm
  },
  sectionCompact: {
    flex: 1,
    minHeight: 0,
    gap: 10,
    paddingTop: 4
  },
  title: {
    ...theme.typography.title,
    color: palette.cream
  },
  titleCompact: {
    fontSize: 18
  },
  list: {
    gap: theme.spacing.sm
  },
  listCompact: {
    gap: 8
  },
  scrollArea: {
    flex: 1,
    minHeight: 0
  },
  scrollContent: {
    paddingBottom: 8
  },
  emptyCard: {
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255,255,255,0.05)",
    gap: 4
  },
  emptyCardCompact: {
    paddingVertical: 12
  },
  emptyTitle: {
    ...theme.typography.label,
    color: palette.cream
  },
  emptyBody: {
    ...theme.typography.body,
    color: palette.slate
  }
});
