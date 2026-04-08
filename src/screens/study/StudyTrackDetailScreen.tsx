import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { ListItemCard } from "@/components/cards/ListItemCard";
import { hasStudyPracticeContent } from "@/domain/services/studyPractice";
import { useAppSelector } from "@/store/hooks";
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

const UnitBadge = ({ label }: { label: string }) => (
  <View style={styles.unitBadge}>
    <Text style={styles.unitBadgeLabel}>{label}</Text>
  </View>
);

export const StudyTrackDetailScreen = ({ route, navigation }: any) => {
  const { studyTrackId, focusUnitId, focusUnitType, focusTopic } = route.params ?? {};
  const user = useAppSelector((state) => state.session.user);
  const { data: tracks = [] } = useGetStudyTracksQuery();
  const { data: units = [] } = useGetStudyUnitsQuery();
  const { data: progress = [] } = useGetStudyProgressQuery();
  const { data: quizAttempts = [] } = useGetQuizAttemptsQuery();
  const { data: resources = [] } = useGetResourcesQuery();
  const { data: events = [] } = useGetEventsQuery();

  const track = tracks.find((item) => item.id === studyTrackId);
  const trackProgress = progress.find((item) => item.studyTrackId === studyTrackId && item.userId === user?.id);
  const trackUnits = units
    .filter((item) => item.studyTrackId === studyTrackId)
    .sort((left, right) => left.sequenceOrder - right.sequenceOrder);
  const filteredUnits = focusUnitType ? trackUnits.filter((item) => item.unitType === focusUnitType) : trackUnits;
  const orderedUnits = useMemo(() => {
    if (!focusUnitId) return filteredUnits;
    const target = filteredUnits.find((item) => item.id === focusUnitId);
    if (!target) return filteredUnits;
    return [target, ...filteredUnits.filter((item) => item.id !== focusUnitId)];
  }, [filteredUnits, focusUnitId]);
  const relatedResources = resources.filter((item) => track?.relatedResourceIds.includes(item.id));
  const relatedEvent = events.find((item) => item.id === track?.relatedEventId);
  const trackAttempts = quizAttempts.filter((item) =>
    trackUnits.some((unit) => unit.id === item.studyUnitId)
  );
  const averageAccuracy = trackAttempts.length
    ? Math.round(trackAttempts.reduce((sum, item) => sum + item.scorePercent, 0) / trackAttempts.length)
    : 0;
  const openUnit = (unit: (typeof trackUnits)[number]) => {
    if (
      (unit.unitType === "flashcards" || unit.unitType === "quiz") &&
      hasStudyPracticeContent(unit.id, { unit, track })
    ) {
      navigation.navigate("StudyPracticeDetail", { studyUnitId: unit.id });
    }
  };

  if (!track) return null;

  return (
    <AppScreen
      title={track.title}
      eyebrow={track.trackType.replace("_", " ")}
      subtitle={`${track.difficultyLevel} • ${track.estimatedTotalMinutes} min`}
    >
      <GlassCard title="Track status" subtitle={track.description}>
        <View style={styles.progressRow}>
          <Text style={styles.progressValue}>{trackProgress?.progressPercent ?? 0}% complete</Text>
          <Text style={styles.progressMeta}>{averageAccuracy ? `${averageAccuracy}% quiz accuracy` : "No quiz attempts yet"}</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.max(6, trackProgress?.progressPercent ?? 0)}%` }]} />
        </View>
        <View style={styles.tagRow}>
          {track.tags.slice(0, 4).map((tag) => (
            <UnitBadge key={tag} label={tag} />
          ))}
        </View>
      </GlassCard>

      {focusTopic ? (
        <GlassCard title="Current review focus" subtitle={`You opened this track to target ${focusTopic}.`}>
          <Text style={styles.body}>Use the next unit list below to attack that weak area while the context is fresh.</Text>
        </GlassCard>
      ) : null}

      {relatedEvent ? (
        <GlassCard title="Built around" subtitle={relatedEvent.title}>
          <Text style={styles.meta}>{formatDateTime(relatedEvent.startTime)}</Text>
          <Text style={styles.body}>{relatedEvent.locationName}</Text>
        </GlassCard>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{focusUnitType ? `${focusUnitType} units` : "Track units"}</Text>
        {orderedUnits.length ? (
          orderedUnits.map((unit, index) => {
            const launchable =
              (unit.unitType === "flashcards" || unit.unitType === "quiz") &&
              hasStudyPracticeContent(unit.id, { unit, track });

            return (
              <Pressable
                key={unit.id}
                style={({ pressed }) => [styles.unitCard, pressed && launchable ? styles.pressed : null]}
                disabled={!launchable}
                onPress={() => openUnit(unit)}
              >
                <View style={styles.unitHeader}>
                  <View style={styles.unitHeaderCopy}>
                    <Text style={styles.unitIndex}>{String(index + 1).padStart(2, "0")}</Text>
                    <Text style={styles.unitTitle}>{unit.title}</Text>
                  </View>
                  <View style={styles.unitHeaderSide}>
                    <UnitBadge label={unit.unitType} />
                    {launchable ? <Ionicons name="chevron-forward" size={14} color={palette.sky} /> : null}
                  </View>
                </View>
                <Text style={styles.unitSummary}>{unit.contentRef}</Text>
                <Text style={styles.unitMeta}>
                  {unit.estimatedMinutes} min{launchable ? " • Tap to open practice" : ""}
                </Text>
              </Pressable>
            );
          })
        ) : (
          <GlassCard title="No matching units" subtitle="Try opening the full track to see every study step." />
        )}
      </View>

      {relatedResources.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Related resources</Text>
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

      <Pressable style={styles.aiButton} onPress={() => navigation.navigate("AI", { contextId: track.id })}>
        <Ionicons name="sparkles-outline" size={16} color={palette.ink} />
        <Text style={styles.aiLabel}>Ask AI to turn this track into a study plan</Text>
      </Pressable>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: theme.spacing.sm
  },
  sectionTitle: {
    ...theme.typography.title,
    color: palette.cream
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10
  },
  progressValue: {
    ...theme.typography.title,
    fontSize: 18,
    color: palette.cream
  },
  progressMeta: {
    ...theme.typography.label,
    color: palette.gold
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: palette.teal
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  unitBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: palette.border
  },
  unitBadgeLabel: {
    ...theme.typography.label,
    color: palette.cream
  },
  meta: {
    ...theme.typography.label,
    color: palette.gold
  },
  body: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 21
  },
  unitCard: {
    borderRadius: 20,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 8
  },
  unitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10
  },
  unitHeaderSide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  unitHeaderCopy: {
    flexDirection: "row",
    gap: 10,
    flex: 1
  },
  unitIndex: {
    ...theme.typography.label,
    color: palette.sky,
    width: 22,
    paddingTop: 3
  },
  unitTitle: {
    ...theme.typography.title,
    fontSize: 17,
    color: palette.cream,
    flex: 1
  },
  unitSummary: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 19
  },
  unitMeta: {
    ...theme.typography.label,
    color: palette.teal
  },
  aiButton: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 18,
    paddingVertical: 14,
    backgroundColor: palette.gold
  },
  aiLabel: {
    ...theme.typography.label,
    color: palette.ink
  },
  pressed: {
    opacity: 0.94
  }
});
