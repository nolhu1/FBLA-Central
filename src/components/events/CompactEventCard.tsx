import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { EventRecord, getUrgencyLabel } from "@/domain/services/events";
import { palette, theme } from "@/theme";

import { EventScopeBadge } from "./EventScopeBadge";
import { EventTypeChip } from "./EventTypeChip";
import { SaveEventButton } from "./SaveEventButton";

interface CompactEventCardProps {
  record: EventRecord;
  onPress: () => void;
  onToggleSave?: () => void;
  compact?: boolean;
}

export const CompactEventCard = ({
  record,
  onPress,
  onToggleSave,
  compact = false
}: CompactEventCardProps) => (
  <Pressable
    style={({ pressed }) => [styles.card, compact ? styles.cardCompact : null, pressed ? styles.pressed : null]}
    onPress={onPress}
  >
    <View style={styles.topRow}>
      <View style={styles.chips}>
        <EventTypeChip label={record.typeLabel} urgency={record.urgency} />
        <EventScopeBadge label={record.scopeLabel} />
      </View>
      {onToggleSave ? (
        <SaveEventButton isSaved={record.isSaved} onPress={onToggleSave} compact />
      ) : null}
    </View>

    <Text style={[styles.title, compact ? styles.titleCompact : null]} numberOfLines={2}>
      {record.event.title}
    </Text>

    <View style={[styles.metaRow, compact ? styles.metaRowCompact : null]}>
      <Ionicons name="time-outline" size={14} color={palette.sky} />
      <Text style={[styles.metaText, compact ? styles.metaTextCompact : null]} numberOfLines={1}>
        {record.timeRangeLabel}
      </Text>
      <Text style={styles.metaDivider}>•</Text>
      <Text style={styles.metaText} numberOfLines={1}>
        {record.scopeContext}
      </Text>
    </View>

    <View style={[styles.footerRow, compact ? styles.footerRowCompact : null]}>
      <View style={styles.priorityPill}>
        <Text style={styles.priorityText}>{getUrgencyLabel(record.urgency)}</Text>
      </View>
      <View style={[styles.locationRow, compact ? styles.locationRowCompact : null]}>
        <Ionicons name="location-outline" size={14} color={palette.slate} />
        <Text style={styles.locationText} numberOfLines={1}>
          {record.event.locationName}
        </Text>
      </View>
    </View>

    {!compact && record.reminderSummary ? <Text style={styles.reminder}>{record.reminderSummary}</Text> : null}
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(7,17,29,0.58)",
    gap: 10
  },
  cardCompact: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 8
  },
  pressed: {
    opacity: 0.94
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    flex: 1,
    minWidth: 0
  },
  title: {
    ...theme.typography.title,
    fontSize: 18,
    color: palette.cream
  },
  titleCompact: {
    fontSize: 16
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6
  },
  metaRowCompact: {
    gap: 4
  },
  metaText: {
    ...theme.typography.body,
    color: palette.mist,
    flexShrink: 1
  },
  metaTextCompact: {
    fontSize: 13
  },
  metaDivider: {
    color: palette.slate
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10
  },
  footerRowCompact: {
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 6
  },
  priorityPill: {
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  priorityText: {
    ...theme.typography.label,
    color: palette.cream
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
    justifyContent: "flex-end"
  },
  locationRowCompact: {
    minWidth: 0,
    justifyContent: "flex-start"
  },
  locationText: {
    ...theme.typography.label,
    color: palette.slate,
    flexShrink: 1
  },
  reminder: {
    ...theme.typography.label,
    color: palette.teal
  }
});
