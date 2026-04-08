import { useCallback, useRef } from "react";
import { Animated, GestureResponderEvent, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { motionTokens } from "@/motion/tokens";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { palette } from "@/theme";

export const SavedResourceButton = ({
  isSaved,
  onPress
}: {
  isSaved: boolean;
  onPress: () => void;
}) => {
  const reducedMotion = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;
  const animateScale = useCallback(
    (toValue: number) => {
      if (reducedMotion) return;
      Animated.spring(scale, { toValue, speed: 28, bounciness: 0, useNativeDriver: true }).start();
    },
    [reducedMotion, scale]
  );

  const handlePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        style={[styles.button, isSaved ? styles.active : null]}
        hitSlop={8}
        onPress={handlePress}
        onPressIn={(event) => {
          event.stopPropagation();
          animateScale(motionTokens.scale.press);
        }}
        onPressOut={() => animateScale(1)}
      >
        <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={16} color={isSaved ? palette.ink : palette.cream} />
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
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border
  },
  active: {
    backgroundColor: palette.gold,
    borderColor: palette.gold
  }
});
