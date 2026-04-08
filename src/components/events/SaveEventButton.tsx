import { Ionicons } from "@expo/vector-icons";
import { useCallback, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";

import { motionTokens } from "@/motion/tokens";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { palette, theme } from "@/theme";

interface SaveEventButtonProps {
  isSaved: boolean;
  onPress: () => void;
  disabled?: boolean;
  compact?: boolean;
  forceFullLabel?: boolean;
}

export const SaveEventButton = ({
  isSaved,
  onPress,
  disabled = false,
  compact = false,
  forceFullLabel = false
}: SaveEventButtonProps) => {
  const reducedMotion = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;
  const iconScale = useRef(new Animated.Value(1)).current;
  const animateScale = useCallback(
    (toValue: number) => {
      if (reducedMotion) return;
      Animated.spring(scale, { toValue, speed: 28, bounciness: 0, useNativeDriver: true }).start();
    },
    [reducedMotion, scale]
  );

  const animateToggle = useCallback(() => {
    if (reducedMotion) return;
    iconScale.setValue(0.86);
    Animated.spring(iconScale, { toValue: 1, speed: 24, bounciness: 6, useNativeDriver: true }).start();
  }, [iconScale, reducedMotion]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isSaved ? "Remove event from saved schedule" : "Save event to personal schedule"}
        disabled={disabled}
        onPress={() => {
          animateToggle();
          onPress();
        }}
        onPressIn={() => animateScale(motionTokens.scale.press)}
        onPressOut={() => animateScale(1)}
        style={({ pressed }) => [
          styles.button,
          isSaved ? styles.active : null,
          compact ? styles.compact : null,
          pressed ? styles.pressed : null,
          disabled ? styles.disabled : null
        ]}
      >
        <Animated.View style={{ transform: [{ scale: iconScale }] }}>
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={compact ? 16 : 18}
            color={isSaved ? palette.ink : palette.cream}
          />
        </Animated.View>
        <Text style={[styles.label, isSaved ? styles.activeLabel : null]}>
          {isSaved
            ? compact && !forceFullLabel
              ? "Saved"
              : "Saved to schedule"
            : compact && !forceFullLabel
              ? "Save"
              : "Save to schedule"}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 46,
    paddingHorizontal: 14,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: palette.border
  },
  compact: {
    minHeight: 38,
    paddingHorizontal: 12
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
  },
  pressed: {
    opacity: 0.92
  },
  disabled: {
    opacity: 0.6
  }
});
