import { PropsWithChildren, ReactNode, useCallback, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

import { AnimatedEntrance } from "@/components/common/AnimatedEntrance";
import { motionTokens } from "@/motion/tokens";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { palette, theme } from "@/theme";

interface GlassCardProps extends PropsWithChildren {
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  onPress?: () => void;
}

export const GlassCard = ({ title, subtitle, footer, onPress, children }: GlassCardProps) => {
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
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
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
    backgroundColor: palette.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
    gap: theme.spacing.sm,
    shadowColor: "#02060c",
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6
  },
  pressed: {
    opacity: 0.96
  },
  title: {
    ...theme.typography.title,
    color: palette.cream
  },
  subtitle: {
    ...theme.typography.body,
    color: palette.mist
  },
  footer: {
    marginTop: 4
  }
});
