import { useEffect, useMemo } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { motionTokens } from "@/motion/tokens";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { palette, theme } from "@/theme";

export const AiTypingIndicator = () => {
  const reducedMotion = useReducedMotion();
  const animations = useMemo(
    () => [new Animated.Value(0.5), new Animated.Value(0.5), new Animated.Value(0.5)],
    []
  );

  useEffect(() => {
    if (reducedMotion) return;
    const loops = animations.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 120),
          Animated.timing(value, {
            toValue: 1,
            duration: motionTokens.duration.fast,
            useNativeDriver: true
          }),
          Animated.timing(value, {
            toValue: 0.5,
            duration: motionTokens.duration.fast,
            useNativeDriver: true
          })
        ])
      )
    );
    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, [animations, reducedMotion]);

  return (
    <View style={styles.row}>
      {animations.map((animation, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              opacity: animation,
              transform: [
                {
                  scale: animation.interpolate({
                    inputRange: [0.5, 1],
                    outputRange: [0.9, 1.1]
                  })
                }
              ]
            }
          ]}
        />
      ))}
      <Text style={styles.label}>FBLA AI is responding</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.sky
  },
  label: {
    ...theme.typography.label,
    color: palette.sky
  }
});
