import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { TextField } from "@/components/forms/TextField";
import {
  useGetForumRepliesQuery,
  useGetForumThreadsQuery,
  usePostForumReplyMutation
} from "@/store/services/fblaApi";
import { formatDateTime } from "@/utils/time";
import { palette, theme } from "@/theme";

export const ThreadDetailScreen = ({ route }: any) => {
  const [body, setBody] = useState("");
  const { threadId } = route.params;
  const { data: threads = [] } = useGetForumThreadsQuery();
  const { data: replies = [] } = useGetForumRepliesQuery(threadId);
  const [postReply, { isLoading }] = usePostForumReplyMutation();

  const thread = threads.find((item) => item.id === threadId);
  if (!thread) return null;

  return (
    <AppScreen title={thread.title} eyebrow="Forum thread" subtitle={thread.body}>
      <GlassCard title="Join the discussion" subtitle="Moderated, contextual discussion should help members ask better questions and find relevant answers faster.">
        <TextField
          label="Your reply"
          value={body}
          onChangeText={setBody}
          multiline
          placeholder="Add your insight, tip, or clarification."
        />
        <Pressable
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={async () => {
            if (!body.trim()) return;
            await postReply({ threadId, body }).unwrap();
            setBody("");
          }}
        >
          <Text style={styles.buttonText}>{isLoading ? "Posting..." : "Reply"}</Text>
        </Pressable>
      </GlassCard>

      <View style={styles.column}>
        {replies.map((reply) => (
          <GlassCard
            key={reply.id}
            title={formatDateTime(reply.createdAt)}
            subtitle={reply.body}
            footer={<Text style={styles.meta}>{reply.helpfulCount} helpful</Text>}
          />
        ))}
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  column: {
    gap: theme.spacing.md
  },
  button: {
    backgroundColor: palette.gold,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    alignItems: "center"
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    ...theme.typography.label,
    color: palette.ink,
    fontSize: 14
  },
  meta: {
    ...theme.typography.label,
    color: palette.gold
  }
});
