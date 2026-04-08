import { useCallback, useRef } from "react";
import { Animated, GestureResponderEvent, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { motionTokens } from "@/motion/tokens";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { palette } from "@/theme";

interface NewsSaveButtonProps {
  isSaved: boolean;
  onPress: () => void;
}

export const NewsSaveButton = ({ isSaved, onPress }: NewsSaveButtonProps) => {
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
    iconScale.setValue(0.84);
    Animated.spring(iconScale, { toValue: 1, speed: 22, bounciness: 8, useNativeDriver: true }).start();
  }, [iconScale, reducedMotion]);

  const handlePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    animateToggle();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isSaved ? "Remove announcement from saved" : "Save announcement"}
        hitSlop={8}
        style={({ pressed }) => [styles.button, isSaved ? styles.buttonActive : null, pressed ? styles.pressed : null]}
        onPress={handlePress}
        onPressIn={(event) => {
          event.stopPropagation();
          animateScale(motionTokens.scale.press);
        }}
        onPressOut={() => animateScale(1)}
      >
        <Animated.View style={{ transform: [{ scale: iconScale }] }}>
          <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={16} color={isSaved ? palette.ink : palette.cream} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255,255,255,0.04)"
  },
  buttonActive: {
    backgroundColor: palette.gold,
    borderColor: palette.gold
  },
  pressed: {
    opacity: 0.9
  }
});
