import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ListItemCard } from "@/components/cards/ListItemCard";
import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { StudyPracticeLoadingState } from "@/components/study/StudyPracticeLoadingState";
import {
  buildStudyPracticeCatalog,
  formatPracticeModeLabel,
  PracticeMode
} from "@/domain/services/studyPractice";
import {
  useGetQuizAttemptsQuery,
  useGetStudyProgressQuery,
  useGetStudyTracksQuery,
  useGetStudyUnitsQuery
} from "@/store/services/fblaApi";
import { palette, theme } from "@/theme";

const isPracticeMode = (value: string): value is PracticeMode =>
  value === "flashcards" || value === "quiz";

export const StudyPracticeBrowserScreen = ({ route, navigation }: any) => {
  const requestedMode = route.params?.mode;
  const mode: PracticeMode = isPracticeMode(requestedMode) ? requestedMode : "flashcards";
  const studyTrackId = route.params?.studyTrackId as string | undefined;
  const { data: tracks = [] } = useGetStudyTracksQuery();
  const { data: units = [] } = useGetStudyUnitsQuery();
  const { data: progress = [] } = useGetStudyProgressQuery();
  const { data: quizAttempts = [] } = useGetQuizAttemptsQuery();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timeout);
  }, [mode, studyTrackId]);

  const track = tracks.find((item) => item.id === studyTrackId);
  const items = useMemo(
    () => buildStudyPracticeCatalog({ mode, studyTrackId, tracks, units, progress, quizAttempts }),
    [mode, progress, quizAttempts, studyTrackId, tracks, units]
  );

  return (
    <AppScreen
      title={`${formatPracticeModeLabel(mode)} Browser`}
      eyebrow="Practice"
      subtitle={
        track
          ? `${track.title} practice sets gathered into one focused browser.`
          : "Browse ready-to-run practice sets with real study content and launch flows."
      }
    >
      {loading ? (
        <StudyPracticeLoadingState
          title={`Preparing ${formatPracticeModeLabel(mode).toLowerCase()}`}
          body="Pulling together your ready-to-run practice sets, recent performance, and launch details."
        />
      ) : (
        <>
          <GlassCard
            title={track ? track.title : `${formatPracticeModeLabel(mode)} practice`}
            subtitle={
              mode === "flashcards"
                ? "Use these short sets for confident recall before a runthrough or travel block."
                : "Open a scored set when you want a clearer read on readiness and weak spots."
            }
          >
            <View style={styles.summaryRow}>
              <View style={styles.summaryChip}>
                <Ionicons
                  name={mode === "flashcards" ? "albums-outline" : "help-circle-outline"}
                  size={16}
                  color={palette.gold}
                />
                <Text style={styles.summaryLabel}>{items.length} ready now</Text>
              </View>
              <View style={styles.summaryChip}>
                <Ionicons name="sparkles-outline" size={16} color={palette.teal} />
                <Text style={styles.summaryLabel}>Integrated study library</Text>
              </View>
            </View>
          </GlassCard>

          <View style={styles.list}>
            {items.length ? (
              items.map((item) => (
                <ListItemCard
                  key={item.studyUnitId}
                  eyebrow={item.trackTitle}
                  title={item.title}
                  summary={item.summary}
                  meta={`${item.countLabel} • ${item.performanceLabel}`}
                  onPress={() => navigation.navigate(item.route.name, item.route.params)}
                />
              ))
            ) : (
              <GlassCard
                title="Nothing ready yet"
                subtitle="This practice mode does not have an available set in the current library."
              />
            )}
          </View>
        </>
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm
  },
  summaryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: palette.border
  },
  summaryLabel: {
    ...theme.typography.label,
    color: palette.cream
  },
  list: {
    gap: theme.spacing.sm
  }
});
