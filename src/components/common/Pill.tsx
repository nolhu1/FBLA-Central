import { useCallback, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";

import { motionTokens } from "@/motion/tokens";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { palette, theme } from "@/theme";

interface PillProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export const Pill = ({ label, active = false, onPress }: PillProps) => {
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

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={() => animateScale(motionTokens.scale.press)}
        onPressOut={() => animateScale(1)}
        style={[styles.pill, active && styles.active]}
      >
        <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center"
  },
  active: {
    backgroundColor: palette.gold,
    borderColor: palette.gold
  },
  label: {
    ...theme.typography.label,
    color: palette.cream
  },
  activeLabel: {
    color: palette.ink
  }
});
