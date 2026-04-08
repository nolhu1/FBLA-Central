import { Fragment } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AIResolvedSource } from "@/domain/services/ai";
import { palette, theme } from "@/theme";

import { AiSourceReferenceCard } from "./AiSourceReferenceCard";
import { AiTypingIndicator } from "./AiTypingIndicator";

const renderParagraphs = (content: string) =>
  content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => (
      <Text key={`${line}-${index}`} style={styles.body}>
        {line}
      </Text>
    ));

export const AssistantMessageBubble = ({
  content,
  isStreaming,
  isError,
  sources,
  onPressSource
}: {
  content: string;
  isStreaming?: boolean;
  isError?: boolean;
  sources?: AIResolvedSource[];
  onPressSource?: (source: AIResolvedSource) => void;
}) => (
  <View style={styles.wrap}>
    <View style={[styles.bubble, isError ? styles.errorBubble : null]}>
      <Text style={[styles.label, isError ? styles.errorLabel : null]}>FBLA AI</Text>
      {!content && isStreaming ? <AiTypingIndicator /> : null}
      {content ? (
        <View style={styles.copy}>
          {renderParagraphs(content)}
          {isStreaming ? <Text style={styles.cursor}>|</Text> : null}
        </View>
      ) : null}
    </View>
    {sources?.length && !isStreaming ? (
      <View style={styles.sourceList}>
        {sources.map((source) => (
          <Fragment key={`${source.type}-${source.id}`}>
            <AiSourceReferenceCard source={source} onPress={onPressSource ? () => onPressSource(source) : undefined} />
          </Fragment>
        ))}
      </View>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    alignItems: "flex-start",
    gap: 8
  },
  bubble: {
    maxWidth: "90%",
    borderRadius: 20,
    borderTopLeftRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: palette.border
  },
  errorBubble: {
    backgroundColor: "rgba(255,138,122,0.09)",
    borderColor: "rgba(255,138,122,0.18)"
  },
  label: {
    ...theme.typography.label,
    color: palette.sky,
    marginBottom: 5
  },
  errorLabel: {
    color: palette.danger
  },
  copy: {
    gap: 6
  },
  body: {
    ...theme.typography.body,
    color: palette.cream
  },
  cursor: {
    ...theme.typography.body,
    color: palette.sky
  },
  sourceList: {
    width: "100%",
    gap: 8,
    paddingLeft: 4
  }
});
