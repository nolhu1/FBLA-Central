import { StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { useGetNewsQuery, useMarkNewsReadMutation } from "@/store/services/fblaApi";
import { formatDateTime } from "@/utils/time";
import { palette, theme } from "@/theme";

export const NewsScreen = () => {
  const { data = [] } = useGetNewsQuery();
  const [markNewsRead] = useMarkNewsReadMutation();

  return (
    <AppScreen
      title="News feed"
      eyebrow="Chapter, state, and national updates"
      subtitle="Pinned urgency, topic relevance, and deep links into affected events or documents make this feed more useful than a static bulletin board."
    >
      <View style={styles.column}>
        {data.map((post) => (
          <GlassCard
            key={post.id}
            title={post.title}
            subtitle={post.summary}
            footer={<Text style={styles.meta}>{post.priorityLevel.toUpperCase()} • {formatDateTime(post.publishedAt)}</Text>}
            onPress={() => markNewsRead(post.id)}
          >
            <Text style={styles.body}>{post.body}</Text>
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
  body: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 22
  }
});
