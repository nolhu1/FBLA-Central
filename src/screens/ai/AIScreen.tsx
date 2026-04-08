import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View
} from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { AiChatHeader } from "@/components/ai/AiChatHeader";
import { AiComposer } from "@/components/ai/AiComposer";
import { AiContextCard } from "@/components/ai/AiContextCard";
import { AiEmptyState } from "@/components/ai/AiEmptyState";
import { AiErrorState } from "@/components/ai/AiErrorState";
import { AiQuickActionChipRow } from "@/components/ai/AiQuickActionChipRow";
import { AssistantMessageBubble } from "@/components/ai/AssistantMessageBubble";
import { UserMessageBubble } from "@/components/ai/UserMessageBubble";
import {
  AIContextRecord,
  AIResolvedSource,
  getAIQuickActions,
  inferAIContext,
  resolveAISourceLinks
} from "@/domain/services/ai";
import {
  useAskAIMutation,
  useGetEventsQuery,
  useGetForumThreadsQuery,
  useGetNewsQuery,
  useGetResourcesQuery,
  useGetStudyTracksQuery
} from "@/store/services/fblaApi";
import { palette, theme } from "@/theme";

type LocalChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  isError?: boolean;
  sourceLinks?: { label: string; type: string; id: string }[];
};

const buildEmptyCopy = (context: AIContextRecord | null) =>
  context
    ? {
        title: `Ask about ${context.title}`,
        body: "Get a summary, next steps, study help, or a clearer explanation grounded in this item."
      }
    : {
        title: "Ask for focused FBLA help",
        body: "Use FBLA AI to explain events, summarize resources, build study plans, or point you to the right next screen."
      };

export const AIScreen = ({ route, navigation }: any) => {
  const contextId = route.params?.contextId ?? null;
  const initialPrompt = route.params?.initialPrompt ?? "";
  const autoPromptKey = route.params?.autoPromptKey ?? null;
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<LocalChatMessage[]>([]);
  const [lastErrorPrompt, setLastErrorPrompt] = useState<string | null>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const listRef = useRef<FlatList<LocalChatMessage> | null>(null);
  const streamTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamStartTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const consumedAutoPromptKey = useRef<string | null>(null);

  const { data: events = [] } = useGetEventsQuery();
  const { data: resources = [] } = useGetResourcesQuery();
  const { data: newsPosts = [] } = useGetNewsQuery();
  const { data: studyTracks = [] } = useGetStudyTracksQuery();
  const { data: forumThreads = [] } = useGetForumThreadsQuery();
  const [askAI, { isLoading }] = useAskAIMutation();

  const context = useMemo(
    () =>
      inferAIContext({
        contextId,
        events,
        resources,
        studyTracks,
        forumThreads,
        newsPosts
      }),
    [contextId, events, resources, studyTracks, forumThreads, newsPosts]
  );
  const quickActions = useMemo(() => getAIQuickActions(context), [context]);
  const emptyCopy = buildEmptyCopy(context);

  const clearStreamTimer = useCallback(() => {
    if (streamStartTimeout.current) {
      clearTimeout(streamStartTimeout.current);
      streamStartTimeout.current = null;
    }
    if (streamTimer.current) {
      clearInterval(streamTimer.current);
      streamTimer.current = null;
    }
  }, []);

  useEffect(() => clearStreamTimer, [clearStreamTimer]);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }, []);

  useEffect(() => {
    if (messages.length) scrollToEnd();
  }, [messages, scrollToEnd]);

  const resolveSources = useCallback(
    (sourceLinks?: { label: string; type: string; id: string }[]): AIResolvedSource[] =>
      resolveAISourceLinks({
        sourceLinks: sourceLinks ?? [],
        events,
        resources,
        newsPosts,
        studyTracks,
        forumThreads
      }),
    [events, resources, newsPosts, studyTracks, forumThreads]
  );

  const startStreaming = useCallback(
    (messageId: string, fullText: string, sourceLinks: { label: string; type: string; id: string }[]) => {
      clearStreamTimer();
      setStreamingMessageId(messageId);

      const tokens = fullText.match(/\S+\s*/g) ?? [fullText];
      let cursor = 0;

      const begin = () => {
        streamTimer.current = setInterval(() => {
          const chunkSize = Math.min(
            tokens.length - cursor,
            cursor < 8 ? 1 : cursor < 20 ? 2 : 3
          );
          cursor = Math.min(tokens.length, cursor + chunkSize);
          const nextContent = tokens.slice(0, cursor).join("").trimEnd();

          setMessages((current) =>
            current.map((message) =>
              message.id === messageId
                ? {
                    ...message,
                    content: nextContent,
                    isStreaming: cursor < tokens.length,
                    sourceLinks: cursor >= tokens.length ? sourceLinks : []
                  }
                : message
            )
          );

          if (cursor >= tokens.length) {
            clearStreamTimer();
            setStreamingMessageId(null);
          }
        }, 48);
      };

      streamStartTimeout.current = setTimeout(() => {
        streamStartTimeout.current = null;
        begin();
      }, 240);
    },
    [clearStreamTimer]
  );

  const handleSend = useCallback(
    async (promptOverride?: string) => {
      const prompt = (promptOverride ?? draft).trim();
      if (!prompt || isLoading || streamingMessageId) return;

      setDraft("");
      setLastErrorPrompt(null);

      const userMessageId = `user-${Date.now()}`;
      const assistantMessageId = `assistant-${Date.now() + 1}`;

      setMessages((current) => [
        ...current,
        { id: userMessageId, role: "user", content: prompt },
        { id: assistantMessageId, role: "assistant", content: "", isStreaming: true, sourceLinks: [] }
      ]);

      try {
        const result = await askAI({ prompt, contextId }).unwrap();
        startStreaming(assistantMessageId, result.answer, result.sourceLinks);
      } catch {
        setLastErrorPrompt(prompt);
        clearStreamTimer();
        setStreamingMessageId(null);
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantMessageId
              ? {
                  ...message,
                  content: "I couldn’t generate a response right now. Try again in a moment.",
                  isStreaming: false,
                  isError: true,
                  sourceLinks: []
                }
              : message
          )
        );
      }
    },
    [askAI, clearStreamTimer, contextId, draft, isLoading, startStreaming, streamingMessageId]
  );

  const handleNewChat = useCallback(() => {
    clearStreamTimer();
    setDraft("");
    setMessages([]);
    setLastErrorPrompt(null);
    setStreamingMessageId(null);
    consumedAutoPromptKey.current = null;
  }, [clearStreamTimer]);

  useEffect(() => {
    if (!initialPrompt || !autoPromptKey || consumedAutoPromptKey.current === autoPromptKey) return;

    consumedAutoPromptKey.current = autoPromptKey;
    setDraft(initialPrompt);
  }, [autoPromptKey, initialPrompt]);

  return (
    <AppScreen title="FBLA AI" scroll={false} hideDefaultHeader>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 6 : 0}
      >
        <AiChatHeader
          subtitle={context ? "Context-aware guidance grounded in the rest of FBLA Central." : "Ask focused questions about events, study, resources, and next steps."}
          contextBadge={context?.badgeLabel}
          onNewChat={handleNewChat}
        />

        {context ? <AiContextCard context={context} /> : null}

        <View style={styles.transcriptShell}>
          {messages.length ? (
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.transcriptContent}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) =>
                item.role === "user" ? (
                  <UserMessageBubble content={item.content} />
                ) : (
                  <AssistantMessageBubble
                    content={item.content}
                    isStreaming={item.isStreaming}
                    isError={item.isError}
                    sources={resolveSources(item.sourceLinks)}
                    onPressSource={(source) => {
                      if (source.routeName) {
                        navigation.navigate(source.routeName, source.routeParams);
                      }
                    }}
                  />
                )
              }
            />
          ) : (
            <View style={styles.emptyWrap}>
              <AiEmptyState title={emptyCopy.title} body={emptyCopy.body} actions={quickActions} onPressAction={(action) => void handleSend(action.prompt)} />
              {lastErrorPrompt ? (
                <AiErrorState
                  title="Response failed"
                  body="The assistant could not complete the last response. Retry when you’re ready."
                  onRetry={() => void handleSend(lastErrorPrompt)}
                />
              ) : null}
            </View>
          )}
        </View>

        {messages.length ? (
          <View style={styles.footerTools}>
            <Text style={styles.footerLabel}>Quick prompts</Text>
            <AiQuickActionChipRow actions={quickActions} onPress={(action) => void handleSend(action.prompt)} />
          </View>
        ) : null}

        <AiComposer
          value={draft}
          onChangeText={setDraft}
          onSend={() => void handleSend()}
          disabled={!draft.trim() || isLoading || Boolean(streamingMessageId)}
        />
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: theme.spacing.sm,
    minHeight: 0
  },
  transcriptShell: {
    flex: 1,
    minHeight: 0,
    borderRadius: 22,
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: "rgba(3,10,18,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)"
  },
  transcriptContent: {
    gap: 10,
    paddingTop: 8,
    paddingBottom: 12
  },
  emptyWrap: {
    gap: 8,
    paddingTop: 6
  },
  footerTools: {
    gap: 8
  },
  footerLabel: {
    ...theme.typography.label,
    color: palette.sky
  }
});
