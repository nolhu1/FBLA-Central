import { useEffect } from "react";
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from "react-native";

import { palette, theme } from "@/theme";

interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  options: SegmentedControlOption<T>[];
  onChange: (value: T) => void;
  compact?: boolean;
}

export const SegmentedControl = <T extends string>({
  value,
  options,
  onChange,
  compact = false
}: SegmentedControlProps<T>) => {
  useEffect(() => {
    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  return (
    <View style={[styles.container, compact ? styles.containerCompact : null]}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            style={[styles.segment, compact ? styles.segmentCompact : null, active ? styles.segmentActive : null]}
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              onChange(option.value);
            }}
          >
            <Text style={[styles.label, active ? styles.labelActive : null]} numberOfLines={1}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: theme.spacing.xs
  },
  containerCompact: {
    gap: 6
  },
  segment: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    minHeight: 36
  },
  segmentCompact: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    minHeight: 30
  },
  segmentActive: {
    backgroundColor: palette.gold,
    borderColor: palette.gold
  },
  label: {
    ...theme.typography.label,
    color: palette.sky
  },
  labelActive: {
    color: palette.ink
  }
});
