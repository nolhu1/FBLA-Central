import { Ionicons } from "@expo/vector-icons";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";

import { SocialHighlightRecord } from "@/domain/services/social";
import { palette, theme } from "@/theme";

import { SocialPlatformBadge } from "./SocialPlatformBadge";

interface FeaturedSocialCardProps {
  highlight: SocialHighlightRecord;
  onPressPrimary: () => void;
  onPressSecondary?: () => void;
  expanded?: boolean;
  expandedContent?: ReactNode;
  onPressOpenExternal?: () => void;
  onPressCollapse?: () => void;
  previewUrl?: string;
}

export const FeaturedSocialCard = ({
  highlight,
  onPressPrimary,
  onPressSecondary,
  expanded = false,
  expandedContent,
  onPressOpenExternal,
  onPressCollapse,
  previewUrl
}: FeaturedSocialCardProps) => {
  const progress = useRef(new Animated.Value(expanded ? 1 : 0)).current;
  const [showExpandedContent, setShowExpandedContent] = useState(expanded);

  useEffect(() => {
    if (expanded) setShowExpandedContent(true);

    Animated.timing(progress, {
      toValue: expanded ? 1 : 0,
      duration: expanded ? 340 : 240,
      easing: expanded ? Easing.out(Easing.cubic) : Easing.inOut(Easing.cubic),
      useNativeDriver: false
    }).start(({ finished }) => {
      if (finished && !expanded) setShowExpandedContent(false);
    });
  }, [expanded, progress]);

  const collapsedOpacity = progress.interpolate({
    inputRange: [0, 0.65, 1],
    outputRange: [1, 0.15, 0]
  });
  const collapsedHeight = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [42, 0]
  });
  const collapsedMarginTop = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 0]
  });
  const expandedOpacity = progress.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 0.25, 1]
  });
  const expandedTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0]
  });

  return (
    <View style={[styles.card, expanded ? styles.cardExpanded : null]}>
      <View style={styles.topRow}>
        <SocialPlatformBadge
          icon={highlight.platformIcon}
          label={highlight.platformLabel}
          accentColor={highlight.accentColor}
        />
        <Text style={styles.scope}>{highlight.scopeLabel}</Text>
      </View>
      <Text style={[styles.eyebrow, expanded ? styles.eyebrowExpanded : null]}>Featured highlight</Text>
      <Text style={[styles.title, expanded ? styles.titleExpanded : null]} numberOfLines={expanded ? 1 : 2}>
        {highlight.highlight.title}
      </Text>
      <Text style={[styles.summary, expanded ? styles.summaryExpanded : null]} numberOfLines={expanded ? 1 : 3}>
        {highlight.highlight.summary}
      </Text>

      <Animated.View
        pointerEvents={expanded ? "none" : "auto"}
        style={[
          styles.actions,
          styles.collapsedActions,
          {
            opacity: collapsedOpacity,
            height: collapsedHeight,
            marginTop: collapsedMarginTop
          }
        ]}
      >
        <Pressable style={styles.primaryButton} onPress={onPressPrimary}>
          <Text style={styles.primaryText}>Open highlight</Text>
        </Pressable>
        {onPressSecondary ? (
          <Pressable style={styles.secondaryButton} onPress={onPressSecondary}>
            <Ionicons name="arrow-forward-outline" size={16} color={palette.cream} />
          </Pressable>
        ) : null}
      </Animated.View>

      {showExpandedContent ? (
        <Animated.View
          style={[
            styles.expandedSection,
            {
              opacity: expandedOpacity,
              transform: [{ translateY: expandedTranslateY }]
            }
          ]}
        >
          <View style={styles.expandedToolbar}>
            <View style={styles.expandedCopy}>
              <Text style={styles.expandedTitle}>In-app preview</Text>
              {previewUrl ? (
                <Text style={styles.expandedUrl} numberOfLines={1}>
                  {previewUrl}
                </Text>
              ) : null}
            </View>
            <View style={styles.expandedActions}>
              {onPressOpenExternal ? (
                <Pressable style={styles.secondaryButton} onPress={onPressOpenExternal}>
                  <Ionicons name="open-outline" size={16} color={palette.cream} />
                </Pressable>
              ) : null}
              {onPressCollapse ? (
                <Pressable style={styles.secondaryButton} onPress={onPressCollapse}>
                  <Ionicons name="close-outline" size={16} color={palette.cream} />
                </Pressable>
              ) : null}
            </View>
          </View>
          <View style={styles.browserFrame}>{expandedContent}</View>
        </Animated.View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: "rgba(244,182,61,0.22)",
    backgroundColor: "rgba(244,182,61,0.08)",
    gap: 10
  },
  cardExpanded: {
    gap: 8
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10
  },
  scope: {
    ...theme.typography.label,
    color: palette.gold
  },
  eyebrow: {
    ...theme.typography.label,
    color: palette.sky
  },
  eyebrowExpanded: {
    fontSize: 11
  },
  title: {
    ...theme.typography.title,
    color: palette.cream
  },
  titleExpanded: {
    fontSize: 18
  },
  summary: {
    ...theme.typography.body,
    color: palette.mist
  },
  summaryExpanded: {
    fontSize: 13,
    lineHeight: 18,
    color: palette.slate
  },
  actions: {
    flexDirection: "row",
    gap: 10
  },
  collapsedActions: {
    overflow: "hidden"
  },
  primaryButton: {
    flex: 1,
    minHeight: 38,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.gold
  },
  primaryText: {
    ...theme.typography.label,
    color: palette.ink
  },
  secondaryButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)"
  },
  expandedToolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md
  },
  expandedSection: {
    gap: 8
  },
  expandedCopy: {
    flex: 1,
    gap: 2
  },
  expandedTitle: {
    ...theme.typography.label,
    color: palette.cream
  },
  expandedUrl: {
    ...theme.typography.label,
    color: palette.slate
  },
  expandedActions: {
    flexDirection: "row",
    gap: 8
  },
  browserFrame: {
    minHeight: 420,
    borderRadius: theme.radius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: palette.cream
  }
});
