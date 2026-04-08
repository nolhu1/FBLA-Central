import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { CategoryPillScroller } from "@/components/community/CategoryPillScroller";
import { DEMO_MODE } from "@/constants/config";
import { buildCommunityCategories } from "@/domain/services/community";
import {
  useCreateForumThreadMutation,
  useGetForumCategoriesQuery,
  useGetForumThreadsQuery
} from "@/store/services/fblaApi";
import { palette, theme } from "@/theme";

const threadTypeOptions = [
  { value: "question" as const, label: "Question" },
  { value: "discussion" as const, label: "Discussion" },
  { value: "study_help" as const, label: "Study help" },
  { value: "logistics" as const, label: "Logistics" }
];

const normalizeThreadTitle = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

export const CreateThreadScreen = ({ navigation }: any) => {
  const { data: categories = [] } = useGetForumCategoriesQuery();
  const { data: threads = [] } = useGetForumThreadsQuery();
  const categoryRecords = useMemo(() => buildCommunityCategories(categories, threads), [categories, threads]);
  const [categoryId, setCategoryId] = useState<string | null>(categoryRecords[0]?.category.id ?? null);
  const [threadType, setThreadType] = useState<(typeof threadTypeOptions)[number]["value"]>("question");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [postPhase, setPostPhase] = useState<"idle" | "posting" | "success">("idle");
  const [createThread, { isLoading }] = useCreateForumThreadMutation();
  const successOpacity = useRef(new Animated.Value(0)).current;
  const normalizedTitle = normalizeThreadTitle(title);
  const duplicateThread = useMemo(
    () =>
      threads.find(
        (thread) => normalizedTitle && normalizeThreadTitle(thread.title) === normalizedTitle
      ) ?? null,
    [normalizedTitle, threads]
  );
  const duplicateTitleError = duplicateThread
    ? `A similar thread already exists: "${duplicateThread.title}".`
    : null;

  useEffect(() => {
    if (!categoryId && categoryRecords.length) {
      setCategoryId(categoryRecords[0].category.id);
    }
  }, [categoryId, categoryRecords]);

  useEffect(() => {
    if (postPhase !== "success") {
      successOpacity.setValue(0);
      return;
    }

    Animated.timing(successOpacity, {
      toValue: 1,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();
  }, [postPhase, successOpacity]);

  const canSubmit = Boolean(categoryId && normalizedTitle && body.trim()) && !duplicateThread && postPhase === "idle";

  const redirectToCommunity = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "MainTabs",
          state: {
            index: 3,
            routes: [
              { name: "Home" },
              { name: "Events" },
              { name: "Study" },
              { name: "Community" },
              { name: "Profile" }
            ]
          }
        }
      ]
    });
  };

  return (
    <AppScreen
      title="New Thread"
      eyebrow="Community"
      subtitle="Start a focused conversation that other members can quickly respond to."
      scroll={false}
    >
      <KeyboardAvoidingView
        style={styles.keyboardFrame}
        behavior="position"
        contentContainerStyle={styles.screen}
        keyboardVerticalOffset={Platform.OS === "ios" ? 18 : 28}
      >
        <View style={styles.formStack}>
          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <CategoryPillScroller
              categories={categoryRecords}
              activeCategoryId={categoryId}
              onChange={(nextCategoryId) => setCategoryId(nextCategoryId ?? null)}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Thread type</Text>
            <SegmentedControl value={threadType} options={threadTypeOptions} onChange={setThreadType} compact />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Title</Text>
            <View style={styles.fieldShell}>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="What do you need help with?"
                placeholderTextColor={palette.slate}
                underlineColorAndroid="transparent"
                style={[styles.fieldInput, duplicateThread ? styles.fieldInputError : null]}
              />
            </View>
            {duplicateTitleError ? <Text style={styles.fieldError}>{duplicateTitleError}</Text> : null}
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Body</Text>
            <View style={[styles.fieldShell, styles.bodyShell]}>
              <TextInput
                value={body}
                onChangeText={setBody}
                placeholder="Share context, what you tried, and the clearest question for members to answer."
                placeholderTextColor={palette.slate}
                underlineColorAndroid="transparent"
                multiline
                style={[styles.fieldInput, styles.bodyInput]}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Tags</Text>
            <View style={styles.fieldShell}>
              <TextInput
                value={tags}
                onChangeText={setTags}
                placeholder="validation, travel, presentation"
                placeholderTextColor={palette.slate}
                underlineColorAndroid="transparent"
                style={styles.fieldInput}
              />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={[styles.button, (!canSubmit || isLoading || postPhase !== "idle") && styles.disabled]}
            disabled={!canSubmit || isLoading || postPhase !== "idle"}
            onPress={async () => {
              const payload = {
                categoryId: categoryId!,
                title: title.trim(),
                body: body.trim(),
                threadType,
                tags: tags.split(",").map((item) => item.trim()).filter(Boolean)
              };

              try {
                setPostPhase("posting");

                if (DEMO_MODE) {
                  void createThread(payload).unwrap().catch(() => undefined);
                  setTimeout(() => {
                    setPostPhase("success");
                    setTimeout(() => {
                      redirectToCommunity();
                    }, 520);
                  }, 720);
                  return;
                }

                await createThread(payload).unwrap();
                setTimeout(() => {
                  setPostPhase("success");
                  setTimeout(() => {
                    redirectToCommunity();
                  }, 520);
                }, 220);
              } catch {
                setPostPhase("idle");
              }
            }}
          >
            <View style={styles.buttonContent}>
              {postPhase === "posting" ? <ActivityIndicator size="small" color={palette.ink} /> : null}
              <Text style={styles.buttonText}>
                {postPhase === "posting" ? "Posting thread..." : postPhase === "success" ? "Posted" : "Post thread"}
              </Text>
            </View>
          </Pressable>

          <View style={styles.statusArea}>
            {postPhase === "posting" ? (
              <Text style={styles.statusText}>Publishing your thread and updating Community...</Text>
            ) : null}
            {postPhase === "success" ? (
              <Animated.View style={[styles.successMessage, { opacity: successOpacity }]}>
                <Text style={styles.successTitle}>Thread posted</Text>
                <Text style={styles.successText}>Opening Community now...</Text>
              </Animated.View>
            ) : null}
          </View>
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  keyboardFrame: {
    flex: 1
  },
  screen: {
    minHeight: 0,
    gap: theme.spacing.md
  },
  formStack: {
    gap: theme.spacing.md
  },
  section: {
    gap: theme.spacing.sm
  },
  fieldBlock: {
    gap: 8
  },
  label: {
    ...theme.typography.label,
    color: palette.mist
  },
  fieldShell: {
    borderRadius: theme.radius.md
  },
  bodyShell: {
    minHeight: 120
  },
  fieldInput: {
    minHeight: 44,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255,255,255,0.05)",
    color: palette.cream,
    paddingHorizontal: 14,
    paddingVertical: 11,
    margin: 0,
    includeFontPadding: false,
    fontSize: 15,
    lineHeight: 20
  },
  fieldInputError: {
    borderColor: palette.danger
  },
  bodyInput: {
    minHeight: 120
  },
  fieldError: {
    ...theme.typography.label,
    color: palette.danger
  },
  footer: {
    gap: 6,
    marginTop: "auto"
  },
  button: {
    backgroundColor: palette.gold,
    minHeight: 44,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  disabled: {
    opacity: 0.6
  },
  buttonText: {
    ...theme.typography.label,
    color: palette.ink
  },
  statusArea: {
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -2
  },
  statusText: {
    ...theme.typography.label,
    color: palette.mist
  },
  successMessage: {
    alignItems: "center",
    gap: 2
  },
  successTitle: {
    ...theme.typography.label,
    color: palette.gold
  },
  successText: {
    ...theme.typography.label,
    color: palette.mist
  }
});
