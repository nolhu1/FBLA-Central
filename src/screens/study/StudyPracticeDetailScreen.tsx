import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { ListItemCard } from "@/components/cards/ListItemCard";
import { StudyPracticeLoadingState } from "@/components/study/StudyPracticeLoadingState";
import {
  formatPracticeModeLabel,
  getStudyPracticeContent
} from "@/domain/services/studyPractice";
import {
  useGetEventsQuery,
  useGetQuizAttemptsQuery,
  useGetResourcesQuery,
  useGetStudyProgressQuery,
  useGetStudyTracksQuery,
  useGetStudyUnitsQuery
} from "@/store/services/fblaApi";
import { formatDateTime } from "@/utils/time";
import { palette, theme } from "@/theme";

export const StudyPracticeDetailScreen = ({ route, navigation }: any) => {
  const studyUnitId = route.params?.studyUnitId as string;
  const { data: tracks = [] } = useGetStudyTracksQuery();
  const { data: units = [] } = useGetStudyUnitsQuery();
  const { data: progress = [] } = useGetStudyProgressQuery();
  const { data: quizAttempts = [] } = useGetQuizAttemptsQuery();
  const { data: resources = [] } = useGetResourcesQuery();
  const { data: events = [] } = useGetEventsQuery();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(timeout);
  }, [studyUnitId]);

  const unit = units.find((item) => item.id === studyUnitId);
  const track = tracks.find((item) => item.id === unit?.studyTrackId);
  const trackProgress = progress.find((item) => item.studyTrackId === track?.id);
  const relatedEvent = events.find((item) => item.id === track?.relatedEventId);
  const relatedResources = resources.filter((item) => track?.relatedResourceIds.includes(item.id)).slice(0, 2);
  const content = useMemo(
    () => (studyUnitId && unit ? getStudyPracticeContent(studyUnitId, { unit, track }) : null),
    [studyUnitId, track, unit]
  );
  const latestAttempt = [...quizAttempts]
    .filter((item) => item.studyUnitId === studyUnitId)
    .sort((left, right) => new Date(right.attemptedAt).getTime() - new Date(left.attemptedAt).getTime())[0];

  if (!unit || !track || !content) {
    return (
      <AppScreen title="Practice" eyebrow="Study" subtitle="That practice set is not available right now.">
        <GlassCard
          title="Practice set unavailable"
          subtitle="Try opening another set from the Practice browser."
        />
      </AppScreen>
    );
  }

  const countLabel =
    content.mode === "flashcards" ? `${content.cards.length} cards` : `${content.questions.length} questions`;

  return (
    <AppScreen
      title={unit.title}
      eyebrow={`${track.title} • ${formatPracticeModeLabel(content.mode)}`}
      subtitle={content.summary}
    >
      {loading ? (
        <StudyPracticeLoadingState
          title={`Preparing ${formatPracticeModeLabel(content.mode).toLowerCase()} details`}
          body="Loading the set overview, supporting context, and the best launch path for this practice run."
        />
      ) : (
        <>
          <GlassCard title="Launch snapshot" subtitle={content.warmupLabel}>
            <View style={styles.metricRow}>
              <View style={styles.metricTile}>
                <Text style={styles.metricValue}>{countLabel}</Text>
                <Text style={styles.metricLabel}>Set size</Text>
              </View>
              <View style={styles.metricTile}>
                <Text style={styles.metricValue}>{unit.estimatedMinutes} min</Text>
                <Text style={styles.metricLabel}>Estimated time</Text>
              </View>
              <View style={styles.metricTile}>
                <Text style={styles.metricValue}>
                  {content.mode === "quiz" ? `${latestAttempt?.scorePercent ?? "--"}%` : `${trackProgress?.progressPercent ?? 0}%`}
                </Text>
                <Text style={styles.metricLabel}>
                  {content.mode === "quiz" ? "Latest score" : "Track progress"}
                </Text>
              </View>
            </View>
            <View style={styles.tagRow}>
              {content.focusTags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagLabel}>{tag}</Text>
                </View>
              ))}
            </View>
          </GlassCard>

          {relatedEvent ? (
            <GlassCard title="Built around" subtitle={relatedEvent.title}>
              <Text style={styles.meta}>{formatDateTime(relatedEvent.startTime)}</Text>
              <Text style={styles.body}>{relatedEvent.locationName}</Text>
            </GlassCard>
          ) : null}

          <Pressable
            style={({ pressed }) => [styles.startButton, pressed ? styles.startButtonPressed : null]}
            onPress={() =>
              navigation.navigate(content.mode === "flashcards" ? "FlashcardPractice" : "QuizPractice", {
                studyUnitId: unit.id
              })
            }
          >
            <Ionicons
              name={content.mode === "flashcards" ? "albums-outline" : "play-circle-outline"}
              size={18}
              color={palette.ink}
            />
            <Text style={styles.startButtonLabel}>
              {content.mode === "flashcards" ? "Open flashcard tool" : "Start quiz taker"}
            </Text>
          </Pressable>

          {relatedResources.length ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Linked resources</Text>
              {relatedResources.map((resource) => (
                <ListItemCard
                  key={resource.id}
                  eyebrow={resource.category}
                  title={resource.title}
                  summary={resource.summary}
                  meta={`${resource.estimatedReadMinutes} min`}
                  onPress={() => navigation.navigate("ResourceDetail", { resourceId: resource.id })}
                />
              ))}
            </View>
          ) : null}
        </>
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  metricRow: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  metricTile: {
    flex: 1,
    minWidth: 0,
    padding: 12,
    borderRadius: theme.radius.md,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 4
  },
  metricValue: {
    ...theme.typography.title,
    fontSize: 18,
    color: palette.cream
  },
  metricLabel: {
    ...theme.typography.label,
    color: palette.sky
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: palette.border
  },
  tagLabel: {
    ...theme.typography.label,
    color: palette.mist
  },
  meta: {
    ...theme.typography.label,
    color: palette.gold
  },
  body: {
    ...theme.typography.body,
    color: palette.mist
  },
  startButton: {
    minHeight: 52,
    borderRadius: theme.radius.md,
    backgroundColor: palette.gold,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8
  },
  startButtonPressed: {
    opacity: 0.94
  },
  startButtonLabel: {
    ...theme.typography.label,
    fontSize: 13,
    color: palette.ink
  },
  section: {
    gap: theme.spacing.sm
  },
  sectionTitle: {
    ...theme.typography.title,
    color: palette.cream
  }
});
