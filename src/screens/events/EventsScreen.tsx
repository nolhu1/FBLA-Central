import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { Pill } from "@/components/common/Pill";
import { useGetEventsQuery } from "@/store/services/fblaApi";
import { formatDateTime } from "@/utils/time";
import { theme, palette } from "@/theme";

export const EventsScreen = ({ navigation }: any) => {
  const [filter, setFilter] = useState<"all" | "deadline" | "saved">("all");
  const { data = [] } = useGetEventsQuery();

  const filtered = data.filter((event) => {
    if (filter === "deadline") return event.eventType === "competitive_deadline";
    return true;
  });

  return (
    <AppScreen
      title="Events"
      eyebrow="Agenda, month, deadlines, and saved planning"
      subtitle="Members should be able to discover, save, organize, and prepare around chapter, state, and national milestones."
    >
      <View style={styles.filters}>
        <Pill label="All" active={filter === "all"} onPress={() => setFilter("all")} />
        <Pill label="Deadlines" active={filter === "deadline"} onPress={() => setFilter("deadline")} />
        <Pill label="Saved flow" active={filter === "saved"} onPress={() => setFilter("saved")} />
      </View>

      <View style={styles.column}>
        {filtered.map((event) => (
          <GlassCard
            key={event.id}
            title={event.title}
            subtitle={event.description}
            footer={<Text style={styles.meta}>{formatDateTime(event.startTime)}</Text>}
            onPress={() => navigation.navigate("EventDetail", { eventId: event.id })}
          >
            <Text style={styles.scope}>{event.scopeType.toUpperCase()} • {event.locationName}</Text>
          </GlassCard>
        ))}
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  column: {
    gap: theme.spacing.md
  },
  meta: {
    ...theme.typography.label,
    color: palette.gold
  },
  scope: {
    ...theme.typography.label,
    color: palette.sky
  }
});
