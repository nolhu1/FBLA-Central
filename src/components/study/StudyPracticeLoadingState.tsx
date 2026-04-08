import { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, StyleSheet, Text, View } from "react-native";

import { GlassCard } from "@/components/cards/GlassCard";
import { palette, theme } from "@/theme";

interface StudyPracticeLoadingStateProps {
  title: string;
  body: string;
}

export const StudyPracticeLoadingState = ({ title, body }: StudyPracticeLoadingStateProps) => {
  const opacity = useRef(new Animated.Value(0.42)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.86, duration: 650, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.42, duration: 650, useNativeDriver: true })
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity]);

  return (
    <GlassCard title={title} subtitle={body}>
      <View style={styles.headerRow}>
        <ActivityIndicator color={palette.gold} />
        <Text style={styles.label}>Loading practice session</Text>
      </View>
      <Animated.View style={[styles.lineLarge, { opacity }]} />
      <Animated.View style={[styles.lineMedium, { opacity }]} />
      <Animated.View style={[styles.lineSmall, { opacity }]} />
      <Animated.View style={[styles.tileRow, { opacity }]}>
        <View style={styles.tile} />
        <View style={styles.tile} />
      </Animated.View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm
  },
  label: {
    ...theme.typography.label,
    color: palette.sky,
    textTransform: "uppercase"
  },
  lineLarge: {
    height: 14,
    width: "100%",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)"
  },
  lineMedium: {
    height: 12,
    width: "82%",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)"
  },
  lineSmall: {
    height: 12,
    width: "58%",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)"
  },
  tileRow: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  tile: {
    flex: 1,
    height: 58,
    borderRadius: theme.radius.md,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: palette.border
  }
});
