import { StyleSheet, Text, View, Pressable } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import {
  useGetEventsQuery,
  useGetForumThreadsQuery,
  useGetNewsQuery,
  useGetResourcesQuery,
  useGetStudyTracksQuery,
  useSaveEventMutation
} from "@/store/services/fblaApi";
import { formatDateTime } from "@/utils/time";
import { palette, theme } from "@/theme";

export const EventDetailScreen = ({ route, navigation }: any) => {
  const { eventId } = route.params;
  const [saveEvent, { isLoading }] = useSaveEventMutation();
  const { data: events = [] } = useGetEventsQuery();
  const { data: resources = [] } = useGetResourcesQuery();
  const { data: news = [] } = useGetNewsQuery();
  const { data: studyTracks = [] } = useGetStudyTracksQuery();
  const { data: threads = [] } = useGetForumThreadsQuery();

  const event = events.find((item) => item.id === eventId);
  if (!event) return null;

  const linkedResources = resources.filter((item) =>
    item.tags.some((tag) => event.title.toLowerCase().includes(tag.split(" ")[0]))
  );
  const linkedNews = news.filter((item) => item.relatedEventId === eventId);
  const linkedStudy = studyTracks.filter((item) => item.relatedEventId === eventId);
  const linkedThreads = threads.filter((item) => item.relatedEventId === eventId);

  return (
    <AppScreen title={event.title} eyebrow="Event detail" subtitle={event.description}>
      <GlassCard
        title="Timing and logistics"
        subtitle={`${formatDateTime(event.startTime)} to ${formatDateTime(event.endTime)}`}
      >
        <Text style={styles.meta}>{event.locationName}</Text>
        {event.locationAddress ? <Text style={styles.body}>{event.locationAddress}</Text> : null}
      </GlassCard>

      <Pressable style={styles.primaryButton} onPress={() => saveEvent({ eventId })} disabled={isLoading}>
        <Text style={styles.primaryButtonText}>{isLoading ? "Saving..." : "Save to my schedule"}</Text>
      </Pressable>

      {linkedStudy.length ? (
        <GlassCard title="Related study" subtitle="Saved events should trigger recommended prep content.">
          {linkedStudy.map((track) => (
            <Text key={track.id} style={styles.linkText}>{track.title}</Text>
          ))}
        </GlassCard>
      ) : null}

      {linkedResources.length ? (
        <GlassCard title="Related resources" subtitle="Official guides, checklists, and prep material tied to this milestone.">
          {linkedResources.map((item) => (
            <Text key={item.id} style={styles.linkText}>{item.title}</Text>
          ))}
        </GlassCard>
      ) : null}

      {linkedNews.length ? (
        <GlassCard title="Related announcements" subtitle="Urgent or contextual updates linked directly into the affected event.">
          {linkedNews.map((item) => (
            <Text key={item.id} style={styles.linkText}>{item.title}</Text>
          ))}
        </GlassCard>
      ) : null}

      {linkedThreads.length ? (
        <GlassCard title="Related discussion" subtitle="Contextual forum threads make event discussion concrete and actionable.">
          {linkedThreads.map((thread) => (
            <Pressable key={thread.id} onPress={() => navigation.navigate("ThreadDetail", { threadId: thread.id })}>
              <Text style={styles.linkText}>{thread.title}</Text>
            </Pressable>
          ))}
        </GlassCard>
      ) : null}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  meta: {
    ...theme.typography.label,
    color: palette.sky
  },
  body: {
    ...theme.typography.body,
    color: palette.mist
  },
  primaryButton: {
    backgroundColor: palette.gold,
    paddingVertical: 15,
    borderRadius: theme.radius.md,
    alignItems: "center"
  },
  primaryButtonText: {
    ...theme.typography.label,
    color: palette.ink,
    fontSize: 14
  },
  linkText: {
    ...theme.typography.body,
    color: palette.cream,
    lineHeight: 22
  }
});
