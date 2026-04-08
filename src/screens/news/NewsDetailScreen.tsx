import { useEffect, useMemo, useState } from "react";
import { Share, StyleSheet, Text, View } from "react-native";

import { DEMO_MODE } from "@/constants/config";
import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { ListItemCard } from "@/components/cards/ListItemCard";
import { NewsDetailHeader } from "@/components/news/NewsDetailHeader";
import { NewsRelatedContentSection } from "@/components/news/NewsRelatedContentSection";
import { buildNewsFeedRecords } from "@/domain/services/news";
import { useAppSelector } from "@/store/hooks";
import {
  useGetEventSavesQuery,
  useGetEventsQuery,
  useGetForumThreadsQuery,
  useGetNewsQuery,
  useGetNewsStateQuery,
  useGetOrganizationsQuery,
  useGetResourcesQuery,
  useUpdateNewsStateMutation
} from "@/store/services/fblaApi";
import { formatDateTime } from "@/utils/time";
import { palette, theme } from "@/theme";

export const NewsDetailScreen = ({ route, navigation }: any) => {
  const { newsPostId } = route.params;
  const user = useAppSelector((state) => state.session.user);
  const { data: posts = [] } = useGetNewsQuery();
  const { data: newsState = [] } = useGetNewsStateQuery();
  const { data: organizations = [] } = useGetOrganizationsQuery();
  const { data: eventSaves = [] } = useGetEventSavesQuery();
  const { data: events = [] } = useGetEventsQuery();
  const { data: resources = [] } = useGetResourcesQuery();
  const { data: threads = [] } = useGetForumThreadsQuery();
  const [updateNewsState] = useUpdateNewsStateMutation();
  const [savedOverride, setSavedOverride] = useState<boolean | null>(null);

  const records = useMemo(
    () =>
      buildNewsFeedRecords({
        posts,
        newsState,
        organizations,
        user,
        eventSaves
      }),
    [eventSaves, newsState, organizations, posts, user]
  );

  const record = records.find((item) => item.post.id === newsPostId);

  useEffect(() => {
    setSavedOverride(null);
  }, [newsPostId]);

  useEffect(() => {
    if (!record || !record.isUnread) return;
    void updateNewsState({ newsPostId: record.post.id, isRead: true });
  }, [record?.isUnread, record?.post.id, updateNewsState]);

  if (!record) return null;
  const isSavedState = savedOverride ?? record.isSaved;

  const relatedEvent = events.find((item) => item.id === record.post.relatedEventId);
  const relatedResource = resources.find((item) => item.id === record.post.relatedResourceId);
  const relatedThread = threads.find((item) => item.id === record.post.relatedThreadId);

  const toggleSave = async () => {
    const nextIsSaved = !isSavedState;
    setSavedOverride(nextIsSaved);

    try {
      await updateNewsState({ newsPostId: record.post.id, isSaved: nextIsSaved }).unwrap();
    } catch {
      if (!DEMO_MODE) {
        setSavedOverride(record.isSaved);
      }
    }
  };

  const shareAnnouncement = async () => {
    await Share.share({
      title: record.post.title,
      message: `${record.post.title}\n\n${record.post.summary}`
    });
  };

  return (
    <AppScreen title="Announcement" eyebrow="News detail" subtitle={record.scopeContext}>
      <GlassCard>
        <NewsDetailHeader
          record={{ ...record, isSaved: isSavedState }}
          onToggleSave={() => void toggleSave()}
          onShare={() => void shareAnnouncement()}
          onAskAI={() => navigation.navigate("AI", { contextId: record.post.id })}
        />
      </GlassCard>

      <GlassCard title="Full update" subtitle={`Issued ${formatDateTime(record.post.publishedAt)}`}>
        <Text style={styles.body}>{record.post.body}</Text>
        <Text style={styles.source}>Source: {record.sourceLabel}</Text>
        {record.post.topicTags.length ? (
          <Text style={styles.tags}>{record.post.topicTags.join(" • ")}</Text>
        ) : null}
      </GlassCard>

      <NewsRelatedContentSection
        eventCard={
          relatedEvent ? (
            <ListItemCard
              eyebrow="Event"
              title={relatedEvent.title}
              summary={relatedEvent.locationName}
              meta={formatDateTime(relatedEvent.startTime)}
              onPress={() => navigation.navigate("EventDetail", { eventId: relatedEvent.id })}
            />
          ) : undefined
        }
        resourceCard={
          relatedResource ? (
            <ListItemCard
              eyebrow="Resource"
              title={relatedResource.title}
              summary={relatedResource.summary}
              meta={`${relatedResource.category} • ${relatedResource.estimatedReadMinutes} min`}
              onPress={() => navigation.navigate("ResourceDetail", { resourceId: relatedResource.id })}
            />
          ) : undefined
        }
        threadCard={
          relatedThread ? (
            <ListItemCard
              eyebrow="Discussion"
              title={relatedThread.title}
              summary={relatedThread.body}
              meta={`${relatedThread.replyCount} replies`}
              onPress={() => navigation.navigate("ThreadDetail", { threadId: relatedThread.id })}
            />
          ) : undefined
        }
      />

      <View style={styles.footerNote}>
        <Text style={styles.footerText}>
          Saved announcements stay easy to find later, and opening an item marks it as read automatically.
        </Text>
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  body: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 23
  },
  source: {
    ...theme.typography.label,
    color: palette.gold
  },
  tags: {
    ...theme.typography.label,
    color: palette.sky
  },
  footerNote: {
    paddingBottom: 6
  },
  footerText: {
    ...theme.typography.label,
    color: palette.slate
  }
});
