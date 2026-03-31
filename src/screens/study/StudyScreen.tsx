import { StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { useGetStudyTracksQuery } from "@/store/services/fblaApi";
import { theme, palette } from "@/theme";

export const StudyScreen = () => {
  const { data = [] } = useGetStudyTracksQuery();

  return (
    <AppScreen
      title="Study"
      eyebrow="Flashcards, quizzes, checklists, and guided prep"
      subtitle="The strongest workflow is event-driven study: save a competition milestone, then move directly into a prep track, resource bundle, and AI support."
    >
      <View style={styles.column}>
        {data.map((track) => (
          <GlassCard
            key={track.id}
            title={track.title}
            subtitle={track.description}
            footer={<Text style={styles.meta}>{track.estimatedTotalMinutes} min • {track.difficultyLevel}</Text>}
          >
            <Text style={styles.tags}>{track.tags.join(" • ")}</Text>
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
