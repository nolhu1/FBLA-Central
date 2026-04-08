import { PropsWithChildren, useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, ViewStyle } from "react-native";

import { motionTokens } from "@/motion/tokens";
import { useReducedMotion } from "@/motion/useReducedMotion";

export const AnimatedSwitcher = ({
  children,
  switchKey,
  style
}: PropsWithChildren<{ switchKey: string; style?: StyleProp<ViewStyle> }>) => {
  const reducedMotion = useReducedMotion();
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reducedMotion) return;
    opacity.setValue(0.82);
    translateY.setValue(6);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: motionTokens.duration.fast,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: motionTokens.duration.fast,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      })
    ]).start();
  }, [opacity, reducedMotion, switchKey, translateY]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
};
