import { ReactNode, useCallback, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AnimatedEntrance } from "@/components/common/AnimatedEntrance";
import { motionTokens } from "@/motion/tokens";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { palette, theme } from "@/theme";

interface ListItemCardProps {
  eyebrow?: string;
  title: string;
  summary?: string;
  meta?: string;
  trailing?: ReactNode;
  onPress?: () => void;
}

export const ListItemCard = ({
  eyebrow,
  title,
  summary,
  meta,
  trailing,
  onPress
}: ListItemCardProps) => {
  const reducedMotion = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;
  const animateScale = useCallback(
    (toValue: number) => {
      if (reducedMotion) return;
      Animated.spring(scale, {
        toValue,
        speed: 28,
        bounciness: 0,
        useNativeDriver: true
      }).start();
    },
    [reducedMotion, scale]
  );

  const content = (
    <AnimatedEntrance>
      <View style={styles.inner}>
        <View style={styles.copy}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {summary ? (
            <Text style={styles.summary} numberOfLines={2}>
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
          {trailing ?? <Ionicons name="chevron-forward" size={16} color={palette.sky} />}
        </View>
      </View>
    </AnimatedEntrance>
  );

  if (onPress) {
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
          onPress={onPress}
          onPressIn={() => animateScale(motionTokens.scale.press)}
          onPressOut={() => animateScale(1)}
        >
          {content}
        </Pressable>
      </Animated.View>
    );
  }

  return <View style={styles.card}>{content}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    padding: theme.spacing.md
  },
  pressed: {
    opacity: 0.92
  },
  inner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm
  },
  copy: {
    flex: 1,
    gap: 4
  },
  eyebrow: {
    ...theme.typography.label,
    color: palette.sky,
    textTransform: "uppercase"
  },
  title: {
    ...theme.typography.title,
    fontSize: 17,
    color: palette.cream
  },
  summary: {
    ...theme.typography.body,
    color: palette.mist
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
