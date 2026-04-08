import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { CompactThreadCard } from "@/components/community/CompactThreadCard";
import { LinkedThreadContentCard } from "@/components/community/LinkedThreadContentCard";
import { ReplyComposer } from "@/components/community/ReplyComposer";
import { ThreadDetailHeader } from "@/components/community/ThreadDetailHeader";
import {
  buildCommunityThreadRecords,
  getLinkedThreadItems,
  getReplyComposerPlaceholder
} from "@/domain/services/community";
import {
  useGetEventsQuery,
  useGetForumCategoriesQuery,
  useGetForumRepliesQuery,
  useGetForumThreadsQuery,
  useGetResourcesQuery,
  useGetStudyTracksQuery,
  usePostForumReplyMutation
} from "@/store/services/fblaApi";
import { formatDateTime } from "@/utils/time";
import { palette, theme } from "@/theme";

export const ThreadDetailScreen = ({ route, navigation }: any) => {
  const { threadId } = route.params;
  const [body, setBody] = useState("");
  const [replyPostPhase, setReplyPostPhase] = useState<"idle" | "posting" | "success">("idle");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHelpful, setIsHelpful] = useState(false);
  const [reported, setReported] = useState(false);
  const { data: categories = [] } = useGetForumCategoriesQuery();
  const { data: threads = [] } = useGetForumThreadsQuery();
  const { data: replies = [] } = useGetForumRepliesQuery(threadId);
  const { data: events = [] } = useGetEventsQuery();
  const { data: resources = [] } = useGetResourcesQuery();
  const { data: studyTracks = [] } = useGetStudyTracksQuery();
  const [postReply, { isLoading }] = usePostForumReplyMutation();
  const successOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (replyPostPhase !== "success") {
      successOpacity.setValue(0);
      return;
    }

    Animated.timing(successOpacity, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();
  }, [replyPostPhase, successOpacity]);

  const records = useMemo(() => buildCommunityThreadRecords(threads, categories), [threads, categories]);
  const record = records.find((item) => item.thread.id === threadId);
  if (!record) return null;

  const thread = record.thread;
  const relatedEvent = events.find((item) => item.id === thread.relatedEventId);
  const { relatedResource, relatedStudyTrack } = getLinkedThreadItems(thread, resources, studyTracks);
  const siblingThreads = records.filter((item) => item.thread.id !== thread.id && item.thread.categoryId === thread.categoryId).slice(0, 2);

  return (
    <AppScreen title="Thread" eyebrow="Community" subtitle={record.categoryLabel}>
      <GlassCard>
        <ThreadDetailHeader record={record} />
      </GlassCard>

      <View style={styles.actionRow}>
        <Pressable style={[styles.actionButton, isHelpful ? styles.actionButtonActive : null]} onPress={() => setIsHelpful((value) => !value)}>
          <Text style={[styles.actionLabel, isHelpful ? styles.actionLabelActive : null]}>{isHelpful ? "Marked helpful" : "Mark helpful"}</Text>
        </Pressable>
        <Pressable style={[styles.actionButton, isFollowing ? styles.actionButtonActive : null]} onPress={() => setIsFollowing((value) => !value)}>
          <Text style={[styles.actionLabel, isFollowing ? styles.actionLabelActive : null]}>{isFollowing ? "Following" : "Follow"}</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={() => setReported(true)}>
          <Text style={styles.actionLabel}>{reported ? "Reported" : "Report"}</Text>
        </Pressable>
      </View>

      {thread.status === "locked" ? (
        <GlassCard title="Thread locked" subtitle="New replies are disabled for this conversation." />
      ) : (
        <ReplyComposer
          value={body}
          onChangeText={setBody}
          placeholder={getReplyComposerPlaceholder(thread)}
          isLoading={isLoading || replyPostPhase === "posting"}
          disabled={replyPostPhase !== "idle"}
          buttonLabel={
            replyPostPhase === "posting"
              ? "Posting reply..."
              : replyPostPhase === "success"
                ? "Reply posted"
                : "Post reply"
          }
          statusContent={
            replyPostPhase === "posting" ? (
              <View style={styles.replyStatusRow}>
                <ActivityIndicator size="small" color={palette.mist} />
                <Text style={styles.replyStatusText}>Publishing your reply...</Text>
              </View>
            ) : replyPostPhase === "success" ? (
              <Animated.View style={[styles.replySuccess, { opacity: successOpacity }]}>
                <Text style={styles.replySuccessTitle}>Reply posted</Text>
                <Text style={styles.replySuccessText}>Your response is now live in the thread.</Text>
              </Animated.View>
            ) : null
          }
          onSubmit={() => {
            if (!body.trim() || replyPostPhase !== "idle") return;
            const replyBody = body.trim();
            setReplyPostPhase("posting");
            void postReply({ threadId, body: replyBody })
              .unwrap()
              .then(() => {
                setBody("");
                setReplyPostPhase("success");
                setTimeout(() => {
                  setReplyPostPhase("idle");
                }, 900);
              })
              .catch(() => {
                setReplyPostPhase("idle");
              });
          }}
        />
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Replies</Text>
        <ScrollView style={styles.replyList} contentContainerStyle={styles.replyContent} nestedScrollEnabled>
          {replies.map((reply) => (
            <GlassCard
              key={reply.id}
              title={formatDateTime(reply.createdAt)}
              subtitle={reply.body}
              footer={<Text style={styles.meta}>{reply.helpfulCount} helpful</Text>}
            />
          ))}
          {!replies.length ? <GlassCard title="No replies yet" subtitle="Be the first helpful reply in this thread." /> : null}
        </ScrollView>
      </View>

      {(relatedEvent || relatedResource || relatedStudyTrack) ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Linked context</Text>
          {relatedEvent ? (
            <LinkedThreadContentCard
              eyebrow="Event"
              title={relatedEvent.title}
              summary={relatedEvent.locationName}
              meta={formatDateTime(relatedEvent.startTime)}
              onPress={() => navigation.navigate("EventDetail", { eventId: relatedEvent.id })}
            />
          ) : null}
          {relatedResource ? (
            <LinkedThreadContentCard
              eyebrow="Resource"
              title={relatedResource.title}
              summary={relatedResource.summary}
              meta={relatedResource.category}
              onPress={() => navigation.navigate("ResourceDetail", { resourceId: relatedResource.id })}
            />
          ) : null}
          {relatedStudyTrack ? (
            <LinkedThreadContentCard
              eyebrow="Study"
              title={relatedStudyTrack.title}
              summary={relatedStudyTrack.description}
              meta={`${relatedStudyTrack.estimatedTotalMinutes} min`}
              onPress={() => navigation.navigate("StudyTrackDetail", { studyTrackId: relatedStudyTrack.id })}
            />
          ) : null}
        </View>
      ) : null}

      {siblingThreads.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More in this category</Text>
          {siblingThreads.map((item) => (
            <CompactThreadCard
              key={item.thread.id}
              record={item}
              onPress={() => navigation.push("ThreadDetail", { threadId: item.thread.id })}
            />
          ))}
        </View>
      ) : null}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  actionButton: {
    minWidth: 96,
    flexGrow: 1,
    borderRadius: 12,
    minHeight: 38,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border
  },
  actionButtonActive: {
    backgroundColor: palette.gold,
    borderColor: palette.gold
  },
  actionLabel: {
    ...theme.typography.label,
    color: palette.cream
  },
  actionLabelActive: {
    color: palette.ink
  },
  section: {
    gap: theme.spacing.sm
  },
  sectionTitle: {
    ...theme.typography.title,
    fontSize: 18,
    color: palette.cream
  },
  replyList: {
    maxHeight: 248
  },
  replyContent: {
    gap: theme.spacing.sm,
    paddingBottom: 6
  },
  meta: {
    ...theme.typography.label,
    color: palette.gold
  },
  replyStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  replyStatusText: {
    ...theme.typography.label,
    color: palette.mist
  },
  replySuccess: {
    alignItems: "center",
    gap: 2
  },
  replySuccessTitle: {
    ...theme.typography.label,
    color: palette.gold
  },
  replySuccessText: {
    ...theme.typography.label,
    color: palette.mist
  }
});
