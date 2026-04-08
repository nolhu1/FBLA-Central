import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { StudyPracticeLoadingState } from "@/components/study/StudyPracticeLoadingState";
import { getStudyPracticeContent } from "@/domain/services/studyPractice";
import { useGetStudyTracksQuery, useGetStudyUnitsQuery } from "@/store/services/fblaApi";
import { palette, theme } from "@/theme";

export const FlashcardPracticeScreen = ({ route }: any) => {
  const studyUnitId = route.params?.studyUnitId as string;
  const { data: tracks = [] } = useGetStudyTracksQuery();
  const { data: units = [] } = useGetStudyUnitsQuery();
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timeout);
  }, [studyUnitId]);

  const unit = units.find((item) => item.id === studyUnitId);
  const track = tracks.find((item) => item.id === unit?.studyTrackId);
  const content = useMemo(
    () => (unit ? getStudyPracticeContent(studyUnitId, { unit, track }) : null),
    [studyUnitId, track, unit]
  );

  if (!unit || !track || !content || content.mode !== "flashcards") {
    return (
      <AppScreen title="Flashcards" eyebrow="Study" subtitle="That flashcard set is not available right now.">
        <GlassCard title="Flashcards unavailable" subtitle="Open another set from the Practice browser." />
      </AppScreen>
    );
  }

  const activeCard = content.cards[activeIndex];
  const progressPercent = Math.round(((activeIndex + 1) / content.cards.length) * 100);

  return (
    <AppScreen
      title={unit.title}
      eyebrow={`${track.title} • Flashcards`}
      subtitle="Tap the card to flip it. Use the controls below to work through the full set."
      scroll={false}
    >
      {loading ? (
        <StudyPracticeLoadingState
          title="Preparing flashcards"
          body="Lining up your Mobile Application Development prompts, model answers, and progression controls."
        />
      ) : (
        <View style={styles.screen}>
          <GlassCard title={`Card ${activeIndex + 1} of ${content.cards.length}`} subtitle={content.warmupLabel}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.max(progressPercent, 8)}%` }]} />
            </View>
            <Text style={styles.progressMeta}>{progressPercent}% through the set</Text>
          </GlassCard>

          <Pressable
            style={({ pressed }) => [styles.cardSurface, pressed ? styles.cardSurfacePressed : null]}
            onPress={() => setShowBack((current) => !current)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.sidePill}>
                <Text style={styles.sidePillLabel}>{showBack ? "Answer" : "Prompt"}</Text>
              </View>
              <Text style={styles.tapHint}>Tap to flip</Text>
            </View>
            <Text style={styles.cardText}>{showBack ? activeCard.back : activeCard.front}</Text>
            {activeCard.hint && !showBack ? <Text style={styles.cardHint}>{activeCard.hint}</Text> : null}
          </Pressable>

          <View style={styles.controlsRow}>
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                activeIndex === 0 ? styles.secondaryButtonDisabled : null,
                pressed ? styles.secondaryButtonPressed : null
              ]}
              disabled={activeIndex === 0}
              onPress={() => {
                setActiveIndex((current) => Math.max(0, current - 1));
                setShowBack(false);
              }}
            >
              <Ionicons name="chevron-back" size={16} color={palette.cream} />
              <Text style={styles.secondaryButtonLabel}>Previous</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.flipButton, pressed ? styles.flipButtonPressed : null]}
              onPress={() => setShowBack((current) => !current)}
            >
              <Ionicons name="sync-outline" size={16} color={palette.ink} />
              <Text style={styles.flipButtonLabel}>{showBack ? "Show prompt" : "Reveal answer"}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.secondaryButton, pressed ? styles.secondaryButtonPressed : null]}
              onPress={() => {
                setActiveIndex((current) => (current + 1 < content.cards.length ? current + 1 : 0));
                setShowBack(false);
              }}
            >
              <Text style={styles.secondaryButtonLabel}>
                {activeIndex + 1 < content.cards.length ? "Next" : "Restart"}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={palette.cream} />
            </Pressable>
          </View>
        </View>
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: theme.spacing.md,
    minHeight: 0
  },
  progressTrack: {
    height: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: theme.radius.pill,
    backgroundColor: palette.teal
  },
  progressMeta: {
    ...theme.typography.label,
    color: palette.sky
  },
  cardSurface: {
    flex: 1,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: palette.border,
    justifyContent: "space-between",
    gap: theme.spacing.md
  },
  cardSurfacePressed: {
    opacity: 0.96
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.sm
  },
  sidePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: palette.border
  },
  sidePillLabel: {
    ...theme.typography.label,
    color: palette.gold
  },
  tapHint: {
    ...theme.typography.label,
    color: palette.slate
  },
  cardText: {
    ...theme.typography.title,
    color: palette.cream,
    fontSize: 24,
    lineHeight: 31
  },
  cardHint: {
    ...theme.typography.body,
    color: palette.mist
  },
  controlsRow: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  secondaryButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255,255,255,0.05)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 10
  },
  secondaryButtonPressed: {
    opacity: 0.94
  },
  secondaryButtonDisabled: {
    opacity: 0.45
  },
  secondaryButtonLabel: {
    ...theme.typography.label,
    color: palette.cream
  },
  flipButton: {
    flex: 1.2,
    minHeight: 50,
    borderRadius: theme.radius.md,
    backgroundColor: palette.gold,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 12
  },
  flipButtonPressed: {
    opacity: 0.94
  },
  flipButtonLabel: {
    ...theme.typography.label,
    color: palette.ink
  }
});
