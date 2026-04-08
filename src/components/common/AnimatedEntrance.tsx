import { PropsWithChildren, useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, ViewStyle } from "react-native";

import { motionTokens } from "@/motion/tokens";
import { useReducedMotion } from "@/motion/useReducedMotion";

export const AnimatedEntrance = ({
  children,
  delay = 0,
  y = 10,
  style
}: PropsWithChildren<{ delay?: number; y?: number; style?: StyleProp<ViewStyle> }>) => {
  const reducedMotion = useReducedMotion();
  const opacity = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(reducedMotion ? 0 : y)).current;

  useEffect(() => {
    if (reducedMotion) return;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: motionTokens.duration.medium,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: motionTokens.duration.medium,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      })
    ]).start();
  }, [delay, opacity, reducedMotion, translateY]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
};
