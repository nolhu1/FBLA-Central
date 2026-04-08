import { useCallback, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AnimatedEntrance } from "@/components/common/AnimatedEntrance";
import { motionTokens } from "@/motion/tokens";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { palette, theme } from "@/theme";

interface QuickActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  hint?: string;
  onPress: () => void;
}

export const QuickActionButton = ({
  icon,
  label,
  hint,
  onPress
}: QuickActionButtonProps) => {
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
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        style={styles.card}
        onPress={onPress}
        onPressIn={() => animateScale(motionTokens.scale.press)}
        onPressOut={() => animateScale(1)}
      >
        <AnimatedEntrance style={styles.content}>
          <View style={styles.iconWrap}>
            <Ionicons name={icon} size={18} color={palette.gold} />
          </View>
          <Text style={styles.label}>{label}</Text>
          {hint ? (
            <Text style={styles.hint} numberOfLines={1}>
              {hint}
            </Text>
          ) : null}
        </AnimatedEntrance>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    minHeight: 58,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255,255,255,0.05)",
    gap: 4,
    alignItems: "center",
    justifyContent: "center"
  },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(244,182,61,0.12)",
    alignItems: "center",
    justifyContent: "center"
  },
  content: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  label: {
    ...theme.typography.label,
    fontSize: 10,
    color: palette.cream
  },
  hint: {
    ...theme.typography.label,
    color: palette.slate
  }
});
