import { StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { useGetForumThreadsQuery } from "@/store/services/fblaApi";
import { formatDateTime } from "@/utils/time";
import { palette, theme } from "@/theme";

export const CommunityScreen = ({ navigation }: any) => {
  const { data = [] } = useGetForumThreadsQuery();

  return (
    <AppScreen
      title="Community"
      eyebrow="Purpose-driven member forums"
      subtitle="Forums are designed for contextual discussion around events, resources, study support, and chapter life rather than an unstructured social feed."
    >
      <View style={styles.column}>
        {data.map((thread) => (
          <GlassCard
            key={thread.id}
            title={thread.title}
            subtitle={thread.body}
            footer={<Text style={styles.meta}>{thread.replyCount} replies • {formatDateTime(thread.lastActivityAt)}</Text>}
            onPress={() => navigation.navigate("ThreadDetail", { threadId: thread.id })}
          >
            <Text style={styles.tags}>{thread.tags.join(" • ")}</Text>
          </GlassCard>
        ))}
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  column: {
    gap: theme.spacing.md
  },
  meta: {
    ...theme.typography.label,
    color: palette.gold
  },
  tags: {
    ...theme.typography.label,
    color: palette.sky
  }
});
