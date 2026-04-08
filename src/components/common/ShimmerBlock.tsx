import { useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { motionTokens } from "@/motion/tokens";
import { useReducedMotion } from "@/motion/useReducedMotion";

export const ShimmerBlock = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const reducedMotion = useReducedMotion();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reducedMotion) return;
    const loop = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: motionTokens.duration.slow * 3,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      })
    );
    loop.start();
    return () => loop.stop();
  }, [reducedMotion, shimmer]);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-160, 220]
  });

  return (
    <View style={[styles.block, style]}>
      {!reducedMotion ? (
        <Animated.View style={[styles.shimmerWrap, { transform: [{ translateX }] }]}>
          <LinearGradient
            colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.12)", "rgba(255,255,255,0)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shimmer}
          />
        </Animated.View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.06)"
  },
  shimmerWrap: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 160
  },
  shimmer: {
    flex: 1
  }
});
