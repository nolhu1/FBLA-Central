import { StyleSheet, Text, View } from "react-native";

import { EventRecord } from "@/domain/services/events";
import { palette, theme } from "@/theme";

import { EventScopeBadge } from "./EventScopeBadge";
import { EventTypeChip } from "./EventTypeChip";

interface EventDetailHeaderProps {
  record: EventRecord;
}

export const EventDetailHeader = ({ record }: EventDetailHeaderProps) => (
  <View style={styles.wrap}>
    <View style={styles.chips}>
      <EventTypeChip label={record.typeLabel} urgency={record.urgency} />
      <EventScopeBadge label={record.scopeLabel} />
    </View>
    <Text style={styles.title}>{record.event.title}</Text>
    <Text style={styles.subtitle}>{record.event.description}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    gap: theme.spacing.sm
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  title: {
    ...theme.typography.display,
    fontSize: 26,
    color: palette.cream
  },
  subtitle: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 22
  }
});
