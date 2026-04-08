import { ReactNode, useCallback, useRef } from "react";
import { Animated, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AnimatedEntrance } from "@/components/common/AnimatedEntrance";
import { motionTokens } from "@/motion/tokens";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { palette, theme } from "@/theme";

interface HomePreviewCardProps {
  eyebrow?: string;
  title: string;
  summary?: string;
  meta?: string;
  compact?: boolean;
  trailing?: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

export const HomePreviewCard = ({
  eyebrow,
  title,
  summary,
  meta,
  compact = false,
  trailing,
  style,
  onPress
}: HomePreviewCardProps) => {
  const reducedMotion = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;
  const animateScale = useCallback(
    (toValue: number) => {
      if (reducedMotion) return;
      Animated.spring(scale, { toValue, speed: 28, bounciness: 0, useNativeDriver: true }).start();
    },
    [reducedMotion, scale]
  );

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      <Pressable
        style={[styles.card, compact ? styles.cardCompact : null]}
        onPress={onPress}
        onPressIn={() => animateScale(motionTokens.scale.press)}
        onPressOut={() => animateScale(1)}
      >
        <AnimatedEntrance style={[styles.inner, compact ? styles.innerCompact : null]}>
          <View style={[styles.copy, compact ? styles.copyCompact : null]}>
            {eyebrow ? <Text style={styles.eyebrow} numberOfLines={1}>{eyebrow}</Text> : null}
            <Text style={[styles.title, compact ? styles.titleCompact : null]} numberOfLines={compact ? 1 : 2}>
              {title}
            </Text>
            {summary ? (
              <Text style={[styles.summary, compact ? styles.summaryCompact : null]} numberOfLines={compact ? 1 : 2}>
                {summary}
              </Text>
            ) : null}
            {meta ? (
              <Text style={styles.meta} numberOfLines={1}>
                {meta}
              </Text>
            ) : null}
          </View>
          <View style={styles.trailing}>
            {trailing ?? <Ionicons name="arrow-forward" size={15} color={palette.sky} />}
          </View>
        </AnimatedEntrance>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    minHeight: 92,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255,255,255,0.045)"
  },
  cardCompact: {
    minHeight: 74,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  inner: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: theme.spacing.md,
    minWidth: 0
  },
  innerCompact: {
    gap: theme.spacing.sm
  },
  copy: {
    flex: 1,
    minWidth: 0,
    justifyContent: "space-between",
    gap: 6
  },
  copyCompact: {
    gap: 4
  },
  eyebrow: {
    ...theme.typography.label,
    color: palette.sky,
    textTransform: "uppercase"
  },
  title: {
    ...theme.typography.title,
    fontSize: 16,
    color: palette.cream
  },
  titleCompact: {
    fontSize: 15
  },
  summary: {
    ...theme.typography.body,
    fontSize: 14,
    color: palette.mist,
    lineHeight: 17
  },
  summaryCompact: {
    fontSize: 13,
    lineHeight: 16
  },
  meta: {
    ...theme.typography.label,
    color: palette.gold
  },
  trailing: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 18
  }
});
