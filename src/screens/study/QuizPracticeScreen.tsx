import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { StudyPracticeLoadingState } from "@/components/study/StudyPracticeLoadingState";
import { getStudyPracticeContent } from "@/domain/services/studyPractice";
import {
  useGetStudyTracksQuery,
  useGetStudyUnitsQuery,
  useSubmitQuizAttemptMutation
} from "@/store/services/fblaApi";
import { palette, theme } from "@/theme";

interface QuizAnswerState {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  topicTags: string[];
}

export const QuizPracticeScreen = ({ route, navigation }: any) => {
  const studyUnitId = route.params?.studyUnitId as string;
  const { data: tracks = [] } = useGetStudyTracksQuery();
  const { data: units = [] } = useGetStudyUnitsQuery();
  const [submitQuizAttempt] = useSubmitQuizAttemptMutation();
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswerState[]>([]);
  const [completedScore, setCompletedScore] = useState<number | null>(null);
  const feedbackOpacity = useRef(new Animated.Value(0)).current;
  const feedbackTranslateY = useRef(new Animated.Value(10)).current;
  const feedbackScale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 950);
    return () => clearTimeout(timeout);
  }, [studyUnitId]);

  const unit = units.find((item) => item.id === studyUnitId);
  const track = tracks.find((item) => item.id === unit?.studyTrackId);
  const content = useMemo(
    () => (unit ? getStudyPracticeContent(studyUnitId, { unit, track }) : null),
    [studyUnitId, track, unit]
  );

  if (!unit || !track || !content || content.mode !== "quiz") {
    return (
      <AppScreen title="Quiz" eyebrow="Study" subtitle="That quiz set is not available right now.">
        <GlassCard title="Quiz unavailable" subtitle="Open another practice set from the browser." />
      </AppScreen>
    );
  }

  const question = content.questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / content.questions.length) * 100);
  const currentCorrectCount = answers.filter((item) => item.isCorrect).length;
  const selectedIsCorrect = selectedIndex === question.correctIndex;

  const finishQuiz = async (nextAnswers: QuizAnswerState[]) => {
    const finalCorrectCount = nextAnswers.filter((item) => item.isCorrect).length;
    const missedTopicTags = Array.from(
      new Set(nextAnswers.filter((item) => !item.isCorrect).flatMap((item) => item.topicTags))
    );
    const scorePercent = Math.round((finalCorrectCount / content.questions.length) * 100);

    setScoring(true);

    try {
      await Promise.all([
        submitQuizAttempt({
          studyUnitId,
          scorePercent,
          questionCount: content.questions.length,
          correctCount: finalCorrectCount,
          missedTopicTags
        }).unwrap(),
        new Promise((resolve) => setTimeout(resolve, 1100))
      ]);
      setCompletedScore(scorePercent);
    } finally {
      setScoring(false);
      setSubmitted(false);
      setSelectedIndex(null);
    }
  };

  const submitCurrentAnswer = async () => {
    if (selectedIndex === null) return;

    const nextAnswer: QuizAnswerState = {
      questionId: question.id,
      selectedIndex,
      isCorrect: selectedIndex === question.correctIndex,
      topicTags: question.topicTags
    };

    const nextAnswers = [...answers.filter((item) => item.questionId !== question.id), nextAnswer];
    setAnswers(nextAnswers);
    setSubmitted(true);
    feedbackOpacity.setValue(0);
    feedbackTranslateY.setValue(10);
    feedbackScale.setValue(0.96);
    Animated.parallel([
      Animated.timing(feedbackOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }),
      Animated.timing(feedbackTranslateY, {
        toValue: 0,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }),
      Animated.spring(feedbackScale, {
        toValue: 1,
        speed: 22,
        bounciness: 7,
        useNativeDriver: true
      })
    ]).start();

    if (currentIndex === content.questions.length - 1) {
      await finishQuiz(nextAnswers);
    }
  };

  const moveToNext = () => {
    setCurrentIndex((current) => current + 1);
    setSelectedIndex(null);
    setSubmitted(false);
    feedbackOpacity.setValue(0);
    feedbackTranslateY.setValue(10);
    feedbackScale.setValue(0.96);
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setSubmitted(false);
    setAnswers([]);
    setCompletedScore(null);
    feedbackOpacity.setValue(0);
    feedbackTranslateY.setValue(10);
    feedbackScale.setValue(0.96);
  };

  const handleAskAI = () => {
    const prompt = submitted
      ? `I am reviewing the quiz question "${question.prompt}". The correct answer is "${question.options[question.correctIndex]}". Explain why that answer is best, why the others are weaker, and how this helps for Mobile Application Development.`
      : `Help me answer this Mobile Application Development quiz question: "${question.prompt}". Walk me through how to think about each option without just giving a one-line answer.`;

    navigation.navigate("AI", {
      contextId: track.id,
      initialPrompt: prompt,
      autoPromptKey: `${studyUnitId}-${question.id}-${submitted ? "after-check" : "before-check"}`
    });
  };

  return (
    <AppScreen
      title={unit.title}
      eyebrow={`${track.title} • Quiz`}
      subtitle="Answer each question, review the explanation, and finish with a saved scored attempt."
      scroll={false}
    >
      {loading ? (
        <StudyPracticeLoadingState
          title="Preparing quiz"
          body="Scoring logic, answer states, and readiness feedback are loading for this practice run."
        />
      ) : scoring ? (
        <StudyPracticeLoadingState
          title="Scoring your quiz"
          body="Saving this attempt, tagging weak areas, and building the result summary you would expect in a polished study tool."
        />
      ) : completedScore !== null ? (
        <View style={styles.screen}>
          <GlassCard
            title={completedScore >= 80 ? "Strong finish" : completedScore >= 65 ? "Solid checkpoint" : "Useful reset"}
            subtitle="Your attempt has been saved to the study history for this track."
          >
            <View style={styles.resultHero}>
              <Text style={styles.resultScore}>{completedScore}%</Text>
              <Text style={styles.resultMeta}>
                {answers.filter((item) => item.isCorrect).length} of {content.questions.length} correct
              </Text>
            </View>
            <Text style={styles.resultBody}>
              {completedScore >= 80
                ? "You are in a strong place. One more runthrough and a short Q&A reset should be enough before presentation."
                : completedScore >= 65
                  ? "You have good momentum. Review the missed explanations once, then retake the set for a cleaner finish."
                  : "The weak spots are visible now. Use the missed explanations and flashcards, then come back for a steadier retake."}
            </Text>
          </GlassCard>

          <View style={styles.controlsRow}>
            <Pressable style={({ pressed }) => [styles.secondaryButton, pressed ? styles.pressed : null]} onPress={resetQuiz}>
              <Ionicons name="refresh-outline" size={16} color={palette.cream} />
              <Text style={styles.secondaryButtonLabel}>Retake quiz</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.primaryButton, pressed ? styles.pressed : null]}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="checkmark-circle-outline" size={16} color={palette.ink} />
              <Text style={styles.primaryButtonLabel}>Done</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.screen}>
          <GlassCard title={`Question ${currentIndex + 1} of ${content.questions.length}`} subtitle={content.warmupLabel}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.max(progressPercent, 8)}%` }]} />
            </View>
            <View style={styles.progressMetaRow}>
              <Text style={styles.progressMeta}>{progressPercent}% through the quiz</Text>
              <Text style={styles.progressMeta}>{currentCorrectCount} correct so far</Text>
            </View>
          </GlassCard>

          <View style={styles.questionCard}>
            <View style={styles.questionHeaderRow}>
              <View style={styles.questionHeader}>
                <Text style={styles.questionTitle}>{question.prompt}</Text>
                <Text style={styles.questionSubtitle}>Choose the best answer before checking your response.</Text>
              </View>
              <Pressable style={({ pressed }) => [styles.aiChip, pressed ? styles.pressed : null]} onPress={handleAskAI}>
                <Ionicons name="sparkles-outline" size={14} color={palette.cream} />
                <Text style={styles.aiChipLabel}>Ask AI</Text>
              </Pressable>
            </View>

            {submitted ? (
              <Animated.View
                style={[
                  styles.answerStatusBanner,
                  selectedIsCorrect ? styles.answerStatusBannerCorrect : styles.answerStatusBannerIncorrect,
                  {
                    opacity: feedbackOpacity,
                    transform: [{ translateY: feedbackTranslateY }, { scale: feedbackScale }]
                  }
                ]}
              >
                <Ionicons
                  name={selectedIsCorrect ? "checkmark-circle" : "flash-outline"}
                  size={18}
                  color={selectedIsCorrect ? palette.success : palette.warning}
                />
                <Text style={styles.answerStatusLabel}>
                  {selectedIsCorrect ? "Nice work. That answer is locked in." : "Answer checked. Review the explanation below."}
                </Text>
              </Animated.View>
            ) : null}

            <ScrollView
              style={styles.questionScroll}
              contentContainerStyle={styles.questionScrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.optionList}>
                {question.options.map((option, optionIndex) => {
                  const isSelected = selectedIndex === optionIndex;
                  const showCorrect = submitted && optionIndex === question.correctIndex;
                  const showIncorrect = submitted && isSelected && optionIndex !== question.correctIndex;

                  return (
                    <Pressable
                      key={option}
                      style={({ pressed }) => [
                        styles.optionButton,
                        isSelected ? styles.optionButtonSelected : null,
                        showCorrect ? styles.optionButtonCorrect : null,
                        showIncorrect ? styles.optionButtonIncorrect : null,
                        pressed ? styles.pressed : null
                      ]}
                      disabled={submitted}
                      onPress={() => setSelectedIndex(optionIndex)}
                    >
                      <View style={styles.optionBadge}>
                        <Text style={styles.optionBadgeLabel}>{String.fromCharCode(65 + optionIndex)}</Text>
                      </View>
                      <Text style={styles.optionText}>{option}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {submitted ? (
                <Animated.View
                  style={[
                    styles.feedbackWrap,
                    {
                      opacity: feedbackOpacity,
                      transform: [{ translateY: feedbackTranslateY }, { scale: feedbackScale }]
                    }
                  ]}
                >
                  <View
                    style={[
                      styles.feedbackCard,
                      selectedIsCorrect ? styles.feedbackCardCorrect : styles.feedbackCardIncorrect
                    ]}
                  >
                    <View style={styles.feedbackTopRow}>
                      <View style={styles.feedbackBadge}>
                        <Ionicons
                          name={selectedIsCorrect ? "checkmark-circle" : "alert-circle"}
                          size={18}
                          color={selectedIsCorrect ? palette.success : palette.warning}
                        />
                      <Text style={styles.feedbackTitle}>
                          {selectedIsCorrect ? "Correct answer locked in" : "Close, but not the best choice"}
                        </Text>
                      </View>
                      <Text style={styles.feedbackScore}>
                        Score {currentCorrectCount}/{content.questions.length}
                      </Text>
                    </View>
                    <Text style={styles.feedbackBody}>{question.explanation}</Text>
                    <View style={styles.feedbackMetaRow}>
                      {question.topicTags.map((tag) => (
                        <View key={tag} style={styles.feedbackTag}>
                          <Text style={styles.feedbackTagLabel}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </Animated.View>
              ) : null}
            </ScrollView>
          </View>

          <View style={styles.controlsRow}>
            {!submitted ? (
              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  selectedIndex === null ? styles.primaryButtonDisabled : null,
                  pressed ? styles.pressed : null
                ]}
                disabled={selectedIndex === null}
                onPress={submitCurrentAnswer}
              >
                <Ionicons name="checkmark-done-outline" size={16} color={palette.ink} />
                <Text style={styles.primaryButtonLabel}>
                  {currentIndex === content.questions.length - 1 ? "Finish quiz" : "Check answer"}
                </Text>
              </Pressable>
            ) : (
              <Pressable style={({ pressed }) => [styles.primaryButton, pressed ? styles.pressed : null]} onPress={moveToNext}>
                <Ionicons name="arrow-forward-circle-outline" size={16} color={palette.ink} />
                <Text style={styles.primaryButtonLabel}>
                  {currentIndex === content.questions.length - 1 ? "View results" : "Next question"}
                </Text>
              </Pressable>
            )}
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
  questionCard: {
    flex: 1,
    minHeight: 0,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    gap: theme.spacing.sm,
    shadowColor: "#02060c",
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6
  },
  questionHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.sm
  },
  questionHeader: {
    gap: 4,
    flexShrink: 1,
    flex: 1
  },
  questionTitle: {
    ...theme.typography.title,
    color: palette.cream
  },
  questionSubtitle: {
    ...theme.typography.body,
    color: palette.mist
  },
  aiChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: palette.border
  },
  aiChipLabel: {
    ...theme.typography.label,
    color: palette.cream
  },
  answerStatusBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    borderWidth: 1
  },
  answerStatusBannerCorrect: {
    backgroundColor: "rgba(108,229,168,0.12)",
    borderColor: "rgba(108,229,168,0.28)"
  },
  answerStatusBannerIncorrect: {
    backgroundColor: "rgba(255,210,122,0.12)",
    borderColor: "rgba(255,210,122,0.28)"
  },
  answerStatusLabel: {
    ...theme.typography.label,
    color: palette.cream,
    flex: 1
  },
  questionScroll: {
    flex: 1,
    minHeight: 0
  },
  questionScrollContent: {
    gap: theme.spacing.sm,
    paddingBottom: 4
  },
  resultHero: {
    alignItems: "center",
    gap: 4
  },
  resultScore: {
    ...theme.typography.display,
    fontSize: 42,
    lineHeight: 46,
    color: palette.gold
  },
  resultMeta: {
    ...theme.typography.label,
    color: palette.sky
  },
  resultBody: {
    ...theme.typography.body,
    color: palette.mist
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
  progressMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.sm
  },
  optionList: {
    gap: theme.spacing.sm
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm,
    padding: 14,
    borderRadius: theme.radius.md,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border
  },
  optionButtonSelected: {
    borderColor: palette.sky,
    backgroundColor: "rgba(117,184,255,0.14)"
  },
  optionButtonCorrect: {
    borderColor: palette.success,
    backgroundColor: "rgba(108,229,168,0.14)"
  },
  optionButtonIncorrect: {
    borderColor: palette.danger,
    backgroundColor: "rgba(255,138,122,0.14)"
  },
  optionBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)"
  },
  optionBadgeLabel: {
    ...theme.typography.label,
    color: palette.cream
  },
  optionText: {
    ...theme.typography.body,
    color: palette.cream,
    flex: 1
  },
  feedbackCard: {
    padding: 14,
    borderRadius: theme.radius.md,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 10
  },
  feedbackWrap: {
    marginTop: 2
  },
  feedbackCardCorrect: {
    backgroundColor: "rgba(108,229,168,0.11)",
    borderColor: "rgba(108,229,168,0.34)"
  },
  feedbackCardIncorrect: {
    backgroundColor: "rgba(255,210,122,0.11)",
    borderColor: "rgba(255,210,122,0.34)"
  },
  feedbackTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10
  },
  feedbackBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1
  },
  feedbackTitle: {
    ...theme.typography.title,
    fontSize: 16,
    color: palette.cream
  },
  feedbackScore: {
    ...theme.typography.label,
    color: palette.sky
  },
  feedbackBody: {
    ...theme.typography.body,
    color: palette.mist
  },
  feedbackMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  feedbackTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: palette.border
  },
  feedbackTagLabel: {
    ...theme.typography.label,
    color: palette.cream
  },
  controlsRow: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  primaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: theme.radius.md,
    backgroundColor: palette.gold,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 14
  },
  primaryButtonDisabled: {
    opacity: 0.5
  },
  primaryButtonLabel: {
    ...theme.typography.label,
    color: palette.ink
  },
  secondaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 14
  },
  secondaryButtonLabel: {
    ...theme.typography.label,
    color: palette.cream
  },
  pressed: {
    opacity: 0.94
  }
});
