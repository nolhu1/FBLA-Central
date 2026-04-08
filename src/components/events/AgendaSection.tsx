import { StyleSheet, Text, View } from "react-native";

import { AgendaGroup } from "@/domain/services/events";
import { palette, theme } from "@/theme";

import { CompactEventCard } from "./CompactEventCard";

interface AgendaSectionProps {
  group: AgendaGroup;
  onOpenEvent: (eventId: string) => void;
  onToggleSave: (eventId: string, isSaved: boolean) => void;
}

export const AgendaSection = ({
  group,
  onOpenEvent,
  onToggleSave
}: AgendaSectionProps) => (
  <View style={styles.section}>
    <View style={styles.header}>
      <Text style={styles.title}>{group.label}</Text>
      <Text style={styles.caption}>{group.caption}</Text>
    </View>
    <View style={styles.list}>
      {group.records.map((record) => (
        <CompactEventCard
          key={record.event.id}
          record={record}
          onPress={() => onOpenEvent(record.event.id)}
          onToggleSave={() => onToggleSave(record.event.id, record.isSaved)}
        />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  section: {
    gap: theme.spacing.sm
  },
  header: {
    gap: 2
  },
  title: {
    ...theme.typography.title,
    color: palette.cream
  },
  caption: {
    ...theme.typography.label,
    color: palette.slate
  },
  list: {
    gap: theme.spacing.sm
  }
});
